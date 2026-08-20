"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { MenuListData } from "../navbar.types";
import { ChevronRight, Menu } from "lucide-react";

export type MenuListProps = { data: MenuListData; label: string };

const categories = [
  { label: "テーマジュエリー", links: ["メンズネックレス", "メンズブレスレット", "メンズリング", "ペンダント"] },
  { label: "GOLD BAR", links: ["自社ゴールドバー", "LS-NIKKO ゴールドバー", "十二支の純ゴールドバー", "手紙ゴールドバー"] },
  { label: "SILVER BAR", links: ["投資用シルバーバー", "記念シルバーバー", "純銀コレクション"] },
  { label: "初誕生", links: ["ゴールドスプーン", "ファーストジュエリー", "記念ギフト"] },
  { label: "女性 純金", links: ["女性ネックレス", "女性ブレスレット", "女性リング", "ペンダント"] },
  { label: "男性 純金", links: ["メンズネックレス", "メンズブレスレット", "メンズリング", "ペンダント"] },
  { label: "カップル", links: ["カップルリング", "記念ペンダント", "ペアブレスレット"] },
  { label: "企業&GIFT プレゼント", links: ["企業ギフト", "記念品", "オーダーメイド"] },
  { label: "ウェディング", links: ["ウェディングリング", "ブライダルギフト", "記念ジュエリー"] },
];

export function MenuList({ data: _data, label: _label }: MenuListProps) {
  const [active, setActive] = React.useState(1);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="category-trigger h-[50px] rounded-none font-bold px-5 min-w-[220px] flex items-center justify-center bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-white">
        <span className="inline-flex items-center justify-center gap-3 leading-none"><Menu size={18} strokeWidth={2.5} className="shrink-0" /><span className="leading-none">CATEGORY</span></span>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="category-mega-menu">
        <div className="flex h-[450px] w-[438px] bg-white text-[#111] dark:bg-[#151b22] dark:text-[#d0d3d6] border border-[#bfc2c5] dark:border-[#343b43]">
          <ul className="w-[220px] shrink-0 border-r border-[#c9cbcd] dark:border-[#343b43] px-5 py-3">
            {categories.map((category, index) => (
              <li key={category.label}>
                <button type="button" onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} className={`flex h-[37px] w-full items-center justify-between text-left text-[15px] transition-colors hover:text-[#244fc1] ${active === index ? "text-[#244fc1]" : ""}`}>
                  <span>{category.label}</span>
                  {index > 0 && <ChevronRight size={16} strokeWidth={2.5} className={active === index ? "text-[#244fc1]" : "text-[#aeb4b9] dark:text-[#d2d5d8]"} />}
                </button>
              </li>
            ))}
          </ul>
          <ul className="flex-1 px-5 py-3">
            {categories[active].links.map((item) => (
              <li key={item}><Link href="/shop" className="flex h-[37px] items-center text-[15px] hover:text-[#244fc1] transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
