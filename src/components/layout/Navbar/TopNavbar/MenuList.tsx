"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ChevronRight, Menu } from "lucide-react";
import type { MenuListData } from "../navbar.types";
import type { CategoryNode } from "@/lib/products/product-repository";

export type MenuListProps = { data: MenuListData; label: string };

const fallback: CategoryNode[] = [
  { id: 10, name: "テーマジュエリー", slug: "theme-jewelry", children: [] },
  { id: 20, name: "GOLD BAR", slug: "gold-bar", children: [
    [2010, "自社ゴールドバー", "company-gold-bar"], [2020, "LS-NIKKO ゴールドバー", "ls-nikko-gold-bar"],
    [2030, "十二支の神ゴールドバー", "zodiac-gold-bar"], [2040, "手紙ゴールドバー", "letter-gold-bar"],
  ].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
  { id: 30, name: "SILVER BAR", slug: "silver-bar", children: [[3010, "高級型シルバーバー", "premium-silver-bar"], [3020, "投資型シルバーバー", "investment-silver-bar"]].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
  { id: 40, name: "初誕生", slug: "first-birthday", children: [[4010, "ベビーリング", "baby-ring"], [4020, "アンクレット", "anklet"], [4030, "ベビーネックレス", "baby-necklace"], [4040, "ゴールドスプーン", "gold-spoon"]].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
  { id: 50, name: "女性 純金", slug: "women-pure-gold", children: [[5010, "ネックレス", "women-necklaces"], [5020, "ブレスレット", "women-bracelets"], [5030, "イヤリング", "women-earrings"], [5040, "リング", "women-rings"], [5050, "カップリング", "women-couple-rings"], [5060, "2連風レディース指輪", "women-double-rings"], [5070, "ペンダント", "women-pendants"]].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
  { id: 60, name: "男性 純金", slug: "men-pure-gold", children: [[6010, "男性ネックレス", "men-necklaces"], [6020, "男性ブレスレット", "men-bracelets"], [6030, "男性リング", "men-rings"], [6040, "男性ペンダント", "men-pendants"]].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
  { id: 70, name: "カップル", slug: "couples", children: [[7010, "シルバージュエリー", "couple-silver-jewelry"], [7020, "ビスポーク·リング", "bespoke-rings"], [7030, "カップリング", "couple-rings"]].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
  { id: 80, name: "企業&GIFT プレゼント", slug: "corporate-gifts", children: [[8010, "所蔵品(動物)", "corporate-animal-collection"], [8020, "GOLF", "corporate-golf"], [8030, "所蔵品(模型)", "corporate-model-collection"]].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
  { id: 90, name: "ウエディング", slug: "wedding", children: [[9010, "コニャックダイヤモンド", "cognac-diamond"], [9020, "ラップダイヤモンド", "lab-diamond"], [9030, "モアッサナイト", "moissanite"], [9040, "ジルコニア", "zirconia"]].map(([id, name, slug]) => ({ id: Number(id), name: String(name), slug: String(slug), children: [] })) },
];

export function MenuList({ data: _data, label: _label }: MenuListProps) {
  const categories = fallback;
  const [active, setActive] = React.useState(1);

  const current = categories[Math.min(active, categories.length - 1)] || categories[0];
  return <NavigationMenuItem>
    <NavigationMenuTrigger className="category-trigger h-[50px] min-w-[220px] rounded-none bg-transparent px-5 font-bold text-white hover:bg-white/10 hover:text-white focus:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-white">
      <span className="inline-flex items-center justify-center gap-3 leading-none"><Menu size={18} strokeWidth={2.5} /><span>CATEGORY</span></span>
    </NavigationMenuTrigger>
    <NavigationMenuContent className="category-mega-menu">
      <div className="flex h-[450px] w-[438px] border border-[#bfc2c5] bg-white text-[#111] dark:border-[#343b43] dark:bg-[#151b22] dark:text-[#d0d3d6]">
        <ul className="w-[220px] shrink-0 border-r border-[#c9cbcd] px-5 py-3 dark:border-[#343b43]">
          {categories.map((category, index) => <li key={category.slug}>
            <div className="flex h-[37px] items-center justify-between">
              <Link href={`/shop/category/${category.slug}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} className={`flex h-full flex-1 items-center text-[15px] hover:text-[#244fc1] ${active === index ? "text-[#244fc1]" : ""}`}>{category.name}</Link>
              {!!category.children.length && <ChevronRight size={16} className={active === index ? "text-[#244fc1]" : "text-[#aeb4b9]"} />}
            </div>
          </li>)}
        </ul>
        <ul className="flex-1 px-5 py-3">
          {(current.children.length ? current.children : [current]).map((item) => <li key={item.slug}><Link href={`/shop/category/${item.slug}`} className="flex h-[37px] items-center text-[15px] transition-colors hover:text-[#244fc1]">{item.name}</Link></li>)}
        </ul>
      </div>
    </NavigationMenuContent>
  </NavigationMenuItem>;
}
