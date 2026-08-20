import {
  cashoutCrashBet,
  currentCrashRound,
  getWallet,
  placeCrashBet,
  playLimbo,
} from "../services/game.js";
import {
  baccaratConfig,
  baccaratHistory,
  getBaccaratFairness,
  playBaccarat,
  verifyBaccaratHand,
} from "../services/baccarat.js";

const handle = (action) => async (req, res, next) => {
  try {
    return res.json(await action(req));
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    return next(error);
  }
};

export const wallet = handle((req) => getWallet(req.user.id));
export const limboBet = handle((req) => playLimbo(req.user.id, req.body));
export const crashCurrent = handle(() => currentCrashRound());
export const crashBet = handle((req) => placeCrashBet(req.user.id, req.body));
export const crashCashout = handle((req) => cashoutCrashBet(req.user.id, req.params.betId));
export const getBaccaratConfig = handle(() => baccaratConfig());
export const baccaratFairness = handle((req) => getBaccaratFairness(req.user.id));
export const baccaratBet = handle((req) => playBaccarat(req.user.id, req.body));
export const getBaccaratHistory = handle((req) => baccaratHistory(req.user.id, req.query.limit));
export const verifyBaccarat = handle((req) => verifyBaccaratHand(req.user.id, req.params.handId));
