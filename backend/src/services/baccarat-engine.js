import crypto from "node:crypto";

const SUITS = ["clubs", "diamonds", "hearts", "spades"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const cardPoints = (rank) => {
  if (rank === "A") return 1;
  const value = Number(rank);
  return Number.isInteger(value) && value >= 2 && value <= 9 ? value : 0;
};

export const handTotal = (cards) =>
  cards.reduce((sum, card) => sum + card.points, 0) % 10;

export const shouldPlayerDraw = (total) => total <= 5;

export function shouldBankerDraw(bankerTotal, playerThirdCard = null) {
  if (playerThirdCard === null) return bankerTotal <= 5;
  const third = playerThirdCard.points;
  if (bankerTotal <= 2) return true;
  if (bankerTotal === 3) return third !== 8;
  if (bankerTotal === 4) return third >= 2 && third <= 7;
  if (bankerTotal === 5) return third >= 4 && third <= 7;
  if (bankerTotal === 6) return third === 6 || third === 7;
  return false;
}

function byteStream(serverSeed, clientSeed, nonce) {
  let counter = 0;
  let buffer = Buffer.alloc(0);
  return () => {
    if (buffer.length < 4) {
      buffer = Buffer.concat([
        buffer,
        crypto
          .createHmac("sha256", serverSeed)
          .update(`${clientSeed}:${nonce}:${counter++}`)
          .digest(),
      ]);
    }
    const value = buffer.readUInt32BE(0);
    buffer = buffer.subarray(4);
    return value;
  };
}

function unbiasedIndex(nextUint32, upperExclusive) {
  const range = 0x100000000;
  const limit = Math.floor(range / upperExclusive) * upperExclusive;
  let value;
  do value = nextUint32(); while (value >= limit);
  return value % upperExclusive;
}

export function createShoe(decks = 8) {
  return Array.from({ length: decks }, (_, deck) =>
    SUITS.flatMap((suit) =>
      RANKS.map((rank) => ({ deck, suit, rank, points: cardPoints(rank) })),
    ),
  ).flat();
}

export function shuffledShoe(serverSeed, clientSeed, nonce, decks = 8) {
  const shoe = createShoe(decks);
  const nextUint32 = byteStream(serverSeed, clientSeed, nonce);
  for (let index = shoe.length - 1; index > 0; index -= 1) {
    const swapIndex = unbiasedIndex(nextUint32, index + 1);
    [shoe[index], shoe[swapIndex]] = [shoe[swapIndex], shoe[index]];
  }
  return shoe;
}

export function dealBaccaratHand(shoe) {
  if (!Array.isArray(shoe) || shoe.length < 6) throw new Error("A shoe with at least six cards is required.");
  let index = 0;
  const playerCards = [shoe[index++]];
  const bankerCards = [shoe[index++]];
  playerCards.push(shoe[index++]);
  bankerCards.push(shoe[index++]);

  let playerTotal = handTotal(playerCards);
  let bankerTotal = handTotal(bankerCards);
  const natural = playerTotal >= 8 || bankerTotal >= 8;
  let playerThirdCard = null;

  if (!natural) {
    if (shouldPlayerDraw(playerTotal)) {
      playerThirdCard = shoe[index++];
      playerCards.push(playerThirdCard);
      playerTotal = handTotal(playerCards);
    }
    if (shouldBankerDraw(bankerTotal, playerThirdCard)) {
      bankerCards.push(shoe[index++]);
      bankerTotal = handTotal(bankerCards);
    }
  }

  const winner = playerTotal === bankerTotal ? "tie" : playerTotal > bankerTotal ? "player" : "banker";
  return { playerCards, bankerCards, playerTotal, bankerTotal, winner, natural, cardsUsed: index };
}

export function baccaratPayout(amount, selection, winner, tieOdds = 8) {
  const wager = Number(amount);
  if (winner === "tie" && selection !== "tie") {
    return { status: "refunded", payout: wager.toFixed(8), commission: "0.00000000" };
  }
  if (selection !== winner) {
    return { status: "lost", payout: "0.00000000", commission: "0.00000000" };
  }
  if (selection === "banker") {
    const winnings = wager * 0.95;
    return {
      status: "won",
      payout: (wager + winnings).toFixed(8),
      commission: (wager * 0.05).toFixed(8),
    };
  }
  const odds = selection === "tie" ? tieOdds : 1;
  return {
    status: "won",
    payout: (wager * (1 + odds)).toFixed(8),
    commission: "0.00000000",
  };
}
