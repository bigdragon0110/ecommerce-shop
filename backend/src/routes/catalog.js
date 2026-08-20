import { Router } from "express";
import { games, products } from "../config/products.js";

const router = Router();

router.get("/products", (_req, res) => res.json({ products }));
router.get("/games", (req, res) => {
  const items = req.query.product ? games.filter((game) => game.product === req.query.product) : games;
  res.json({ games: items });
});
router.get("/games/:slug", (req, res) => {
  const game = games.find((item) => item.slug === req.params.slug);
  if (!game) return res.status(404).json({ message: "Game not found." });
  return res.json({ game });
});

export default router;
