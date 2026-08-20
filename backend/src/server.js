import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/games.js";
import catalogRoutes from "./routes/catalog.js";
import auth from "./middleware/auth.js";
import { advanceCrashRound } from "./services/game.js";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});

const app = express();
// Port 6000 belongs to the public website. The API stays private behind the
// website/gateway proxy so game services never receive database credentials.
const port = Number(process.env.CP_BACKEND_PORT || process.env.PLATFORM_API_PORT || 6050);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:6000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/games", auth, gameRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

const crashTimer = setInterval(() => {
  advanceCrashRound().catch((error) => console.error("Crash engine error:", error));
}, 250);
crashTimer.unref();
