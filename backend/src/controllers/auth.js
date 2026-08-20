import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findByLogin, findByUsernameOrEmail } from "../models/users.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const safeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role || "user",
});

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    { id: user.id, username: user.username, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

export const register = async (req, res, next) => {
  const username = String(req.body?.username || "").trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required." });
  }
  if (username.length > 30) {
    return res.status(400).json({ message: "Username must be 30 characters or fewer." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  try {
    if (await findByUsernameOrEmail(username, email)) {
      return res.status(409).json({ message: "Username or email is already registered." });
    }

    const user = await createUser({
      username,
      email,
      password: await bcrypt.hash(password, 12),
    });

    return res.status(201).json({ token: createToken(user), user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  const login = String(req.body?.login || req.body?.username || req.body?.email || "").trim();
  const password = String(req.body?.password || "");

  if (!login || !password) {
    return res.status(400).json({ message: "Login and password are required." });
  }

  try {
    const user = await findByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid login or password." });
    }

    return res.json({ token: createToken(user), user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
};
