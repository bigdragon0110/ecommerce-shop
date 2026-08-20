import crypto from "node:crypto";

export const newSeed = () => crypto.randomBytes(32).toString("hex");
export const hashSeed = (seed) => crypto.createHash("sha256").update(seed).digest("hex");

export function multiplierFromSeeds(serverSeed, clientSeed, nonce, houseEdge = 0.01) {
  const digest = crypto
    .createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest("hex");
  const value = Number.parseInt(digest.slice(0, 13), 16);
  const unit = value / 0x10000000000000;
  const multiplier = Math.floor(((1 - houseEdge) / (1 - unit)) * 100) / 100;
  return Math.max(1, Math.min(multiplier, 1_000_000));
}
