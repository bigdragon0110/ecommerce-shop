import crypto from "node:crypto";
import db from "../config/db.js";

export function parseBetAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0.1 || amount > 1000) {
    throw Object.assign(new Error("Bet amount must be between 0.10 and 1000."), { status: 400 });
  }
  return amount.toFixed(8);
}

export function parseIdempotencyKey(value) {
  const key = String(value || "").trim();
  if (!key || key.length > 128) {
    throw Object.assign(new Error("A valid idempotencyKey is required."), { status: 400 });
  }
  return key;
}

export async function lockWallet(connection, userId) {
  const [rows] = await connection.execute(
    "SELECT * FROM wallets WHERE user_id=? AND currency_code='CREDIT' FOR UPDATE",
    [userId],
  );
  if (!rows[0]) throw Object.assign(new Error("Wallet not found."), { status: 404 });
  return rows[0];
}

export async function debitWallet(connection, wallet, userId, amount, betId) {
  const before = Number(wallet.balance);
  const debitAmount = Number(amount);
  if (before < debitAmount) {
    throw Object.assign(new Error("Insufficient balance."), { status: 409 });
  }

  const after = (before - debitAmount).toFixed(8);
  await connection.execute("UPDATE wallets SET balance=? WHERE id=?", [after, wallet.id]);
  await connection.execute(
    `INSERT INTO wallet_transactions
      (public_id,wallet_id,user_id,bet_id,transaction_type,amount,balance_before,balance_after)
     VALUES (?,?,?,?,?,?,?,?)`,
    [crypto.randomUUID(), wallet.id, userId, betId, "bet_debit", amount, before.toFixed(8), after],
  );
  return after;
}

export async function creditWallet(connection, walletId, userId, betId, amount, type = "win_credit") {
  const [rows] = await connection.execute(
    "SELECT balance FROM wallets WHERE id=? FOR UPDATE",
    [walletId],
  );
  const before = Number(rows[0].balance);
  const after = (before + Number(amount)).toFixed(8);
  await connection.execute("UPDATE wallets SET balance=? WHERE id=?", [after, walletId]);
  await connection.execute(
    `INSERT INTO wallet_transactions
      (public_id,wallet_id,user_id,bet_id,transaction_type,amount,balance_before,balance_after)
     VALUES (?,?,?,?,?,?,?,?)`,
    [crypto.randomUUID(), walletId, userId, betId, type, amount, before.toFixed(8), after],
  );
  return after;
}

export async function getUserWallet(userId) {
  const [rows] = await db.execute(
    "SELECT id,currency_code,balance,created_at,updated_at FROM wallets WHERE user_id=?",
    [userId],
  );
  return rows[0] || null;
}
