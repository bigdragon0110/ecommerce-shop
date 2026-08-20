import { Router } from "express";
import {
  baccaratBet,
  baccaratFairness,
  crashBet,
  crashCashout,
  crashCurrent,
  getBaccaratConfig,
  getBaccaratHistory,
  limboBet,
  verifyBaccarat,
  wallet,
} from "../controllers/games.js";

const router = Router();

router.get("/wallet", wallet);
router.post("/limbo/bets", limboBet);
router.get("/crash/current", crashCurrent);
router.post("/crash/bets", crashBet);
router.post("/crash/bets/:betId/cashout", crashCashout);

router.get("/baccarat/config", getBaccaratConfig);
router.get("/baccarat/fairness/current", baccaratFairness);
router.post("/baccarat/bets", baccaratBet);
router.get("/baccarat/history", getBaccaratHistory);
router.get("/baccarat/hands/:handId/verify", verifyBaccarat);

export default router;
