const origin = (key, fallback) => process.env[key] || fallback;

export const products = Object.freeze([
  { slug: "originals", name: "Originals", status: "active", games: ["crash", "limbo", "dice", "mines", "keno"] },
  { slug: "table-games", name: "Table Games", status: "active", games: ["baccarat", "roulette", "blackjack", "sic-bo"] },
  { slug: "slots", name: "Slots", status: "planned", games: [] },
  { slug: "live-casino", name: "Live Casino", status: "planned", games: [] },
  { slug: "poker", name: "Poker", status: "planned", games: [] },
  { slug: "sportsbook", name: "Sportsbook", status: "planned", games: [] },
  { slug: "virtual-sports", name: "Virtual Sports", status: "planned", games: [] },
  { slug: "lottery", name: "Lottery", status: "planned", games: [] },
  { slug: "bingo", name: "Bingo", status: "planned", games: [] },
]);

export const games = Object.freeze([
  { slug: "crash", name: "Crash", product: "originals", port: 6101, status: "active", origin: origin("CRASH_ORIGIN", "http://localhost:6101") },
  { slug: "limbo", name: "Limbo", product: "originals", port: 6102, status: "active", origin: origin("LIMBO_ORIGIN", "http://localhost:6102") },
  { slug: "baccarat", name: "Baccarat", product: "table-games", port: 6201, status: "active", origin: origin("BACCARAT_ORIGIN", "http://localhost:6201") },
]);
