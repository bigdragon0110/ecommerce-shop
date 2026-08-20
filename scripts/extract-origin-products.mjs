import { readFileSync } from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Pass the saved origin HTML path.");

const html = readFileSync(sourcePath, "utf8");
const cardPattern = /<div class="item-main-(\d+)[\s\S]{0,2500}?it_id=(\d+)[\s\S]{0,1000}?<img src="(https:\/\/houshoshop\.jp\/data\/item\/[^"]+\.jpg)"[^>]*alt="([^"]*)"[\s\S]{0,2500}?<span class="title-price">[^\d]*([\d,]+)[^<]*<\/span>[\s\S]{0,1000}?<div class="product-info">([^<]*)<\/div>/g;

const products = new Map();
for (const match of html.matchAll(cardPattern)) {
  const [, group, id, imageUrl, alt, price, info] = match;
  if (products.has(id)) continue;
  products.set(id, {
    group: Number(group),
    id: Number(id),
    title: alt.replace(/\s*要約情報及び購入\s*$/, ""),
    price: Number(price.replaceAll(",", "")),
    imageUrl,
    description: info.trim(),
  });
}

console.log(JSON.stringify([...products.values()], null, 2));
