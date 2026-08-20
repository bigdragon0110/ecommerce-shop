import crypto from "node:crypto";
import db from "../config/db.js";
import { hashSeed, multiplierFromSeeds, newSeed } from "./fairness.js";
import {
  creditWallet,
  debitWallet,
  getUserWallet,
  lockWallet,
  parseBetAmount,
  parseIdempotencyKey,
} from "./wallet.js";

async function settleAutomaticCashouts(round, multiplier) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [bets] = await connection.execute(
      `SELECT * FROM bets
       WHERE round_id=? AND status='accepted'
         AND auto_cashout_multiplier IS NOT NULL
         AND auto_cashout_multiplier<=?
       FOR UPDATE`,
      [round.id, multiplier],
    );
    for (const bet of bets) {
      const cashout = Number(bet.auto_cashout_multiplier);
      if (cashout >= Number(round.result_multiplier)) continue;
      const payout = (Number(bet.amount) * cashout).toFixed(8);
      const [result] = await connection.execute(
        `UPDATE bets SET status='cashed_out',cashout_multiplier=?,payout=?,settled_at=NOW(3)
         WHERE id=? AND status='accepted'`,
        [cashout, payout, bet.id],
      );
      if (result.affectedRows === 1) {
        await creditWallet(connection, bet.wallet_id, bet.user_id, bet.id, payout);
      }
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getWallet(userId) {
  return getUserWallet(userId);
}

export async function playLimbo(userId, input) {
  const amount = parseBetAmount(input.amount);
  const target = Number(input.targetMultiplier);
  if (!Number.isFinite(target) || target < 1.01 || target > 1_000_000) {
    throw Object.assign(new Error("Target multiplier must be between 1.01 and 1000000."), { status: 400 });
  }
  const key = parseIdempotencyKey(input.idempotencyKey);
  const clientSeed = String(input.clientSeed || userId).slice(0, 128);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [existing] = await connection.execute(
      "SELECT * FROM bets WHERE user_id=? AND idempotency_key=?",
      [userId, key],
    );
    if (existing[0]) {
      await connection.commit();
      return existing[0];
    }
    const wallet = await lockWallet(connection, userId);
    const serverSeed = newSeed();
    const nonce = crypto.randomInt(0, 2 ** 31);
    const result = multiplierFromSeeds(serverSeed, clientSeed, nonce);
    const won = result >= target;
    const payout = won ? (Number(amount) * target).toFixed(8) : "0.00000000";
    const roundPublicId = crypto.randomUUID();
    const [round] = await connection.execute(
      `INSERT INTO game_rounds
       (public_id,game_type,status,server_seed,server_seed_hash,client_seed,nonce,result_multiplier,ended_at)
       VALUES (?,'limbo','completed',?,?,?,?,?,NOW(3))`,
      [roundPublicId, serverSeed, hashSeed(serverSeed), clientSeed, nonce, result],
    );
    const betPublicId = crypto.randomUUID();
    const [bet] = await connection.execute(
      `INSERT INTO bets
       (public_id,idempotency_key,user_id,wallet_id,round_id,game_type,amount,target_multiplier,result_multiplier,payout,status,settled_at)
       VALUES (?,?,?,?,?,'limbo',?,?,?,?,?,NOW(3))`,
      [betPublicId, key, userId, wallet.id, round.insertId, amount, target, result, payout, won ? "won" : "lost"],
    );
    let balance = await debitWallet(connection, wallet, userId, amount, bet.insertId);
    if (won) balance = await creditWallet(connection, wallet.id, userId, bet.insertId, payout);
    await connection.commit();
    return { id: betPublicId, amount, targetMultiplier: target, resultMultiplier: result, payout, status: won ? "won" : "lost", balance, fairness: { serverSeed, serverSeedHash: hashSeed(serverSeed), clientSeed, nonce } };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function currentCrashRound() {
  const [rows] = await db.execute(
    `SELECT public_id,status,server_seed_hash,betting_closes_at,started_at,ended_at,
      CASE WHEN status='completed' THEN result_multiplier ELSE NULL END AS result_multiplier
     FROM game_rounds WHERE game_type='crash' ORDER BY id DESC LIMIT 1`,
  );
  if (!rows[0] || rows[0].status === "completed") return createCrashRound();
  return rows[0];
}

export async function createCrashRound() {
  const serverSeed = newSeed();
  const clientSeed = "public-crash";
  const nonce = Date.now();
  const result = multiplierFromSeeds(serverSeed, clientSeed, nonce);
  const publicId = crypto.randomUUID();
  await db.execute(
    `INSERT INTO game_rounds
     (public_id,game_type,status,server_seed,server_seed_hash,client_seed,nonce,result_multiplier,betting_closes_at)
     VALUES (?,'crash','betting',?,?,?,?,?,DATE_ADD(NOW(3),INTERVAL 10 SECOND))`,
    [publicId, serverSeed, hashSeed(serverSeed), clientSeed, nonce, result],
  );
  return currentCrashRound();
}

export async function placeCrashBet(userId, input) {
  const amount = parseBetAmount(input.amount);
  const key = parseIdempotencyKey(input.idempotencyKey);
  const autoCashout = input.autoCashoutMultiplier == null ? null : Number(input.autoCashoutMultiplier);
  if (autoCashout !== null && (!Number.isFinite(autoCashout) || autoCashout < 1.01)) {
    throw Object.assign(new Error("Auto cash-out must be at least 1.01."), { status: 400 });
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [rounds] = await connection.execute(
      "SELECT * FROM game_rounds WHERE game_type='crash' AND status='betting' AND betting_closes_at>NOW(3) ORDER BY id DESC LIMIT 1 FOR UPDATE",
    );
    if (!rounds[0]) throw Object.assign(new Error("Crash betting is closed."), { status: 409 });
    const [existing] = await connection.execute("SELECT * FROM bets WHERE user_id=? AND idempotency_key=?", [userId, key]);
    if (existing[0]) { await connection.commit(); return existing[0]; }
    const wallet = await lockWallet(connection, userId);
    const publicId = crypto.randomUUID();
    const [bet] = await connection.execute(
      `INSERT INTO bets
       (public_id,idempotency_key,user_id,wallet_id,round_id,game_type,amount,auto_cashout_multiplier,status)
       VALUES (?,?,?,?,?,'crash',?,?,'accepted')`,
      [publicId, key, userId, wallet.id, rounds[0].id, amount, autoCashout],
    );
    const balance = await debitWallet(connection, wallet, userId, amount, bet.insertId);
    await connection.commit();
    return { id: publicId, roundId: rounds[0].public_id, amount, autoCashoutMultiplier: autoCashout, status: "accepted", balance };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

export async function cashoutCrashBet(userId, publicId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      `SELECT b.*,r.status round_status,r.result_multiplier,r.started_at
       FROM bets b JOIN game_rounds r ON r.id=b.round_id
       WHERE b.public_id=? AND b.user_id=? FOR UPDATE`,
      [publicId, userId],
    );
    const bet = rows[0];
    if (!bet) throw Object.assign(new Error("Bet not found."), { status: 404 });
    if (bet.status !== "accepted" || bet.round_status !== "running") throw Object.assign(new Error("Bet cannot be cashed out."), { status: 409 });
    const elapsed = (Date.now() - new Date(bet.started_at).getTime()) / 1000;
    const multiplier = Math.floor(Math.exp(0.08 * Math.max(0, elapsed)) * 100) / 100;
    if (multiplier >= Number(bet.result_multiplier)) throw Object.assign(new Error("Round already crashed."), { status: 409 });
    const payout = (Number(bet.amount) * multiplier).toFixed(8);
    await connection.execute("UPDATE bets SET status='cashed_out',cashout_multiplier=?,payout=?,settled_at=NOW(3) WHERE id=?", [multiplier, payout, bet.id]);
    const balance = await creditWallet(connection, bet.wallet_id, userId, bet.id, payout);
    await connection.commit();
    return { id: publicId, status: "cashed_out", cashoutMultiplier: multiplier, payout, balance };
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function advanceCrashRound() {
  const [rows] = await db.execute("SELECT * FROM game_rounds WHERE game_type='crash' ORDER BY id DESC LIMIT 1");
  const round = rows[0];
  if (!round) return createCrashRound();
  if (round.status === "betting" && new Date(round.betting_closes_at) <= new Date()) {
    await db.execute("UPDATE game_rounds SET status='running',started_at=NOW(3) WHERE id=? AND status='betting'", [round.id]);
  } else if (round.status === "running") {
    const crashSeconds = Math.log(Number(round.result_multiplier)) / 0.08;
    const elapsed = (Date.now() - new Date(round.started_at).getTime()) / 1000;
    const currentMultiplier = Math.floor(Math.exp(0.08 * Math.max(0, elapsed)) * 100) / 100;
    if (currentMultiplier < Number(round.result_multiplier)) {
      await settleAutomaticCashouts(round, currentMultiplier);
    } else if (elapsed >= crashSeconds) {
      await db.execute("UPDATE game_rounds SET status='completed',ended_at=NOW(3) WHERE id=? AND status='running'", [round.id]);
      await db.execute("UPDATE bets SET status='lost',result_multiplier=?,settled_at=NOW(3) WHERE round_id=? AND status='accepted'", [round.result_multiplier, round.id]);
      setTimeout(() => createCrashRound().catch(console.error), 3000);
    }
  }
}
