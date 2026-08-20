import assert from "node:assert/strict";
import test from "node:test";
import { hashSeed, multiplierFromSeeds } from "../src/services/fairness.js";

test("seed hashing is deterministic", () => {
  assert.equal(hashSeed("server-seed"), hashSeed("server-seed"));
  assert.equal(hashSeed("server-seed").length, 64);
});

test("the same fairness inputs reproduce the same multiplier", () => {
  const first = multiplierFromSeeds("server-seed", "client-seed", 42);
  const second = multiplierFromSeeds("server-seed", "client-seed", 42);
  assert.equal(first, second);
  assert.ok(first >= 1);
});

test("changing the nonce changes the deterministic input", () => {
  const results = new Set(
    Array.from({ length: 10 }, (_, nonce) => multiplierFromSeeds("server-seed", "client-seed", nonce)),
  );
  assert.ok(results.size > 1);
});
