import db from "../config/db.js";

export const findByUsernameOrEmail = async (username, email) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
    [username, email],
  );
  return rows[0] || null;
};

export const findByLogin = async (login) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
    [login, login.toLowerCase()],
  );
  return rows[0] || null;
};

export const createUser = async ({ username, email, password }) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, password, "user"],
    );
    await connection.execute(
      "INSERT INTO wallets (user_id,currency_code,balance) VALUES (?,'CREDIT',1000)",
      [result.insertId],
    );
    await connection.commit();
    return { id: result.insertId, username, email, role: "user" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
