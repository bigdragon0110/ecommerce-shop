import crypto from "node:crypto";
import db from "../config/db.js";
import { hashSeed, newSeed } from "./fairness.js";
import {
  baccaratPayout,
  dealBaccaratHand,
  shuffledShoe,
} from "./baccarat-engine.js";
import {
  creditWallet,
  debitWallet,
  lockWallet,
  parseBetAmount,
  parseIdempotencyKey,
} from "./wallet.js";

const SELECTIONS = new Set(["player", "banker", "tie"]);
const TIE_ODDS = 8;

function parseSelection(value) {
  const selection = String(value || "").trim().toLowerCase();
  if (!SELECTIONS.has(selection)) {
    throw Object.assign(new Error("Selection must be player, banker, or tie."), { status: 400 });
  }
  return selection;
}

function cleanClientSeed(value, userId) {
  const seed = String(value || `player-${userId}`).trim();
  if (!seed || seed.length > 128) {
    throw Object.assign(new Error("Client seed must contain 1 to 128 characters."), { status: 400 });
  }
  return seed;
}

function shapeHand(row) {
  const parseCards = (value) => typeof value === "string" ? JSON.parse(value) : value;
  return {
    betId: row.bet_public_id,
    handId: row.hand_public_id,
    amount: row.amount,
    selection: row.selection,
    playerCards: parseCards(row.player_cards),
    bankerCards: parseCards(row.banker_cards),
    playerTotal: row.player_total,
    bankerTotal: row.banker_total,
    winner: row.winner,
    status: row.bet_status,
    payout: row.payout,
    commission: row.commission,
    createdAt: row.created_at,
    fairness: {
      serverSeed: row.server_seed,
      serverSeedHash: row.server_seed_hash,
      clientSeed: row.client_seed,
      nonce: row.nonce,
      decks: row.shoe_decks,
    },
  };
}

const handQuery = `
  SELECT b.public_id bet_public_id,b.amount,b.status bet_status,b.payout,
         h.public_id hand_public_id,h.player_cards,h.banker_cards,
         h.player_total,h.banker_total,h.winner,h.shoe_decks,h.created_at,
         bb.selection,bb.commission,
         r.server_seed,r.server_seed_hash,r.client_seed,r.nonce
  FROM baccarat_bets bb
  JOIN bets b ON b.id=bb.bet_id
  JOIN baccarat_hands h ON h.id=bb.hand_id
  JOIN game_rounds r ON r.id=h.round_id
`;

export function baccaratConfig() {
  return {
    currency: "CREDIT",
    minimumBet: "0.10000000",
    maximumBet: "1000.00000000",
    decks: 8,
    payouts: { player: "1:1", banker: "0.95:1", tie: `${TIE_ODDS}:1` },
    bankerCommissionPercent: 5,
  };
}

async function insertFairnessSeed(connection, userId) {
  const serverSeed = newSeed();
  const serverSeedHash = hashSeed(serverSeed);
  const publicId = crypto.randomUUID();
  await connection.execute(
    `INSERT INTO baccarat_fairness_seeds
     (public_id,user_id,server_seed,server_seed_hash,status)
     VALUES (?,?,?,?,'active')`,
    [publicId, userId, serverSeed, serverSeedHash],
  );
  return { publicId, serverSeed, serverSeedHash };
}

export async function getBaccaratFairness(userId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      `SELECT public_id,server_seed_hash,created_at
       FROM baccarat_fairness_seeds
       WHERE user_id=? AND status='active'
       ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [userId],
    );
    let commitment = rows[0];
    if (!commitment) {
      const created = await insertFairnessSeed(connection, userId);
      commitment = {
        public_id: created.publicId,
        server_seed_hash: created.serverSeedHash,
        created_at: new Date(),
      };
    }
    await connection.commit();
    return {
      commitmentId: commitment.public_id,
      serverSeedHash: commitment.server_seed_hash,
      createdAt: commitment.created_at,
    };
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      const [rows] = await db.execute(
        `SELECT public_id,server_seed_hash,created_at
         FROM baccarat_fairness_seeds
         WHERE user_id=? AND status='active'
         ORDER BY id DESC LIMIT 1`,
        [userId],
      );
      if (rows[0]) {
        return {
          commitmentId: rows[0].public_id,
          serverSeedHash: rows[0].server_seed_hash,
          createdAt: rows[0].created_at,
        };
      }
    }
    throw error;
  } finally {
    connection.release();
  }
}

export async function playBaccarat(userId, input) {
  const amount = parseBetAmount(input.amount);
  const selection = parseSelection(input.selection);
  const key = parseIdempotencyKey(input.idempotencyKey);
  const clientSeed = cleanClientSeed(input.clientSeed, userId);
  const expectedServerSeedHash = String(input.serverSeedHash || "").trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(expectedServerSeedHash)) {
    throw Object.assign(new Error("A valid committed serverSeedHash is required."), { status: 400 });
  }
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [existing] = await connection.execute(
      `${handQuery} WHERE b.user_id=? AND b.idempotency_key=? LIMIT 1`,
      [userId, key],
    );
    if (existing[0]) {
      await connection.commit();
      return { ...shapeHand(existing[0]), idempotentReplay: true };
    }

    const [commitments] = await connection.execute(
      `SELECT * FROM baccarat_fairness_seeds
       WHERE user_id=? AND status='active'
       ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [userId],
    );
    const commitment = commitments[0];
    if (!commitment || commitment.server_seed_hash !== expectedServerSeedHash) {
      throw Object.assign(
        new Error("Fairness commitment is missing or changed. Request the current commitment again."),
        { status: 409 },
      );
    }

    const wallet = await lockWallet(connection, userId);
    const serverSeed = commitment.server_seed;
    const serverSeedHash = commitment.server_seed_hash;
    const nonce = crypto.randomInt(0, 2 ** 31);
    const result = dealBaccaratHand(shuffledShoe(serverSeed, clientSeed, nonce, 8));
    const settlement = baccaratPayout(amount, selection, result.winner, TIE_ODDS);

    const roundPublicId = crypto.randomUUID();
    const [round] = await connection.execute(
      `INSERT INTO game_rounds
       (public_id,game_type,status,server_seed,server_seed_hash,client_seed,nonce,result_multiplier,ended_at)
       VALUES (?,'baccarat','completed',?,?,?,?,1.00,NOW(3))`,
      [roundPublicId, serverSeed, serverSeedHash, clientSeed, nonce],
    );

    const betPublicId = crypto.randomUUID();
    const [bet] = await connection.execute(
      `INSERT INTO bets
       (public_id,idempotency_key,user_id,wallet_id,round_id,game_type,amount,payout,status,settled_at)
       VALUES (?,?,?,?,?,'baccarat',?,?,?,NOW(3))`,
      [betPublicId, key, userId, wallet.id, round.insertId, amount, settlement.payout, settlement.status],
    );

    const handPublicId = crypto.randomUUID();
    const [hand] = await connection.execute(
      `INSERT INTO baccarat_hands
       (public_id,round_id,shoe_decks,cards_used,player_cards,banker_cards,player_total,banker_total,winner,natural)
       VALUES (?,?,8,?,?,?,?,?,?,?)`,
      [
        handPublicId,
        round.insertId,
        result.cardsUsed,
        JSON.stringify(result.playerCards),
        JSON.stringify(result.bankerCards),
        result.playerTotal,
        result.bankerTotal,
        result.winner,
        result.natural,
      ],
    );
    await connection.execute(
      `INSERT INTO baccarat_bets (bet_id,hand_id,selection,odds,commission)
       VALUES (?,?,?,?,?)`,
      [
        bet.insertId,
        hand.insertId,
        selection,
        selection === "banker" ? "0.9500" : selection === "tie" ? TIE_ODDS.toFixed(4) : "1.0000",
        settlement.commission,
      ],
    );

    let balance = await debitWallet(connection, wallet, userId, amount, bet.insertId);
    if (Number(settlement.payout) > 0) {
      const transactionType = settlement.status === "refunded" ? "refund" : "win_credit";
      balance = await creditWallet(
        connection,
        wallet.id,
        userId,
        bet.insertId,
        settlement.payout,
        transactionType,
      );
    }

    await connection.execute(
      `UPDATE baccarat_fairness_seeds
       SET status='revealed',revealed_at=NOW(3)
       WHERE id=? AND status='active'`,
      [commitment.id],
    );
    const nextCommitment = await insertFairnessSeed(connection, userId);

    await connection.commit();
    return {
      betId: betPublicId,
      handId: handPublicId,
      amount,
      selection,
      playerCards: result.playerCards,
      bankerCards: result.bankerCards,
      playerTotal: result.playerTotal,
      bankerTotal: result.bankerTotal,
      winner: result.winner,
      status: settlement.status,
      payout: settlement.payout,
      commission: settlement.commission,
      balance,
      fairness: { serverSeed, serverSeedHash, clientSeed, nonce, decks: 8 },
      nextServerSeedHash: nextCommitment.serverSeedHash,
    };
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      throw Object.assign(new Error("This idempotency key has already been used."), { status: 409 });
    }
    throw error;
  } finally {
    connection.release();
  }
}

export async function baccaratHistory(userId, limitValue = 20) {
  const limit = Math.min(Math.max(Number(limitValue) || 20, 1), 100);
  const [rows] = await db.execute(
    `${handQuery} WHERE b.user_id=? ORDER BY h.id DESC LIMIT ${limit}`,
    [userId],
  );
  return rows.map(shapeHand);
}

export async function verifyBaccaratHand(userId, handPublicId) {
  const [rows] = await db.execute(
    `${handQuery} WHERE b.user_id=? AND h.public_id=? LIMIT 1`,
    [userId, handPublicId],
  );
  if (!rows[0]) throw Object.assign(new Error("Baccarat hand not found."), { status: 404 });

  const stored = shapeHand(rows[0]);
  const reproduced = dealBaccaratHand(
    shuffledShoe(
      stored.fairness.serverSeed,
      stored.fairness.clientSeed,
      Number(stored.fairness.nonce),
      Number(stored.fairness.decks),
    ),
  );
  const verified =
    hashSeed(stored.fairness.serverSeed) === stored.fairness.serverSeedHash &&
    JSON.stringify(reproduced.playerCards) === JSON.stringify(stored.playerCards) &&
    JSON.stringify(reproduced.bankerCards) === JSON.stringify(stored.bankerCards) &&
    reproduced.winner === stored.winner;

  return { verified, hand: stored, reproduced };
}
