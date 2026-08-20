import assert from "node:assert/strict";
import test from "node:test";
import {
  baccaratPayout,
  cardPoints,
  createShoe,
  dealBaccaratHand,
  handTotal,
  shouldBankerDraw,
  shouldPlayerDraw,
  shuffledShoe,
} from "../src/services/baccarat-engine.js";

const card = (rank) => ({ rank, suit: "clubs", deck: 0, points: cardPoints(rank) });

test("card and hand points follow baccarat values", () => {
  assert.equal(cardPoints("A"), 1);
  assert.equal(cardPoints("9"), 9);
  assert.equal(cardPoints("10"), 0);
  assert.equal(cardPoints("K"), 0);
  assert.equal(handTotal([card("8"), card("7")]), 5);
});

test("Player draws on 0-5 and stands on 6-7", () => {
  for (let total = 0; total <= 5; total += 1) assert.equal(shouldPlayerDraw(total), true);
  for (let total = 6; total <= 7; total += 1) assert.equal(shouldPlayerDraw(total), false);
});

test("Banker third-card table is enforced", () => {
  assert.equal(shouldBankerDraw(3, card("8")), false);
  assert.equal(shouldBankerDraw(3, card("7")), true);
  assert.equal(shouldBankerDraw(4, card("2")), true);
  assert.equal(shouldBankerDraw(4, card("8")), false);
  assert.equal(shouldBankerDraw(5, card("4")), true);
  assert.equal(shouldBankerDraw(5, card("3")), false);
  assert.equal(shouldBankerDraw(6, card("6")), true);
  assert.equal(shouldBankerDraw(6, card("5")), false);
});

test("natural 8 or 9 stops both hands", () => {
  const result = dealBaccaratHand([
    card("4"), card("3"), card("4"), card("2"), card("9"), card("9"),
  ]);
  assert.equal(result.natural, true);
  assert.equal(result.cardsUsed, 4);
  assert.equal(result.winner, "player");
});

test("Player third card controls Banker draw", () => {
  const result = dealBaccaratHand([
    card("2"), card("2"), card("3"), card("A"), card("8"), card("9"),
  ]);
  assert.equal(result.playerCards.length, 3);
  assert.equal(result.bankerCards.length, 2);
  assert.equal(result.cardsUsed, 5);
});

test("Banker draws on five when Player stands", () => {
  const result = dealBaccaratHand([
    card("3"), card("2"), card("3"), card("3"), card("4"), card("9"),
  ]);
  assert.equal(result.playerCards.length, 2);
  assert.equal(result.bankerCards.length, 3);
  assert.equal(result.bankerTotal, 9);
});

test("eight-deck shuffle is deterministic and preserves all cards", () => {
  const first = shuffledShoe("server", "client", 7);
  const second = shuffledShoe("server", "client", 7);
  assert.equal(first.length, 416);
  assert.deepEqual(first, second);
  assert.equal(createShoe().length, 416);
});

test("payouts include stake, commission, and tie pushes", () => {
  assert.deepEqual(baccaratPayout("10", "player", "player"), {
    status: "won", payout: "20.00000000", commission: "0.00000000",
  });
  assert.deepEqual(baccaratPayout("10", "banker", "banker"), {
    status: "won", payout: "19.50000000", commission: "0.50000000",
  });
  assert.deepEqual(baccaratPayout("10", "tie", "tie"), {
    status: "won", payout: "90.00000000", commission: "0.00000000",
  });
  assert.deepEqual(baccaratPayout("10", "player", "tie"), {
    status: "refunded", payout: "10.00000000", commission: "0.00000000",
  });
});
