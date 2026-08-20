import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const value = req.get("authorization") || "";
  const token = value.startsWith("Bearer ") ? value.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
