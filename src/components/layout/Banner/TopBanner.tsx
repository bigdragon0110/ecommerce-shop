import React from "react";
import Link from "next/link";
import { uiLabels } from "@/data/ui-labels";

const TopBanner = () => {
  return (
    <div className="top-utility-bar relative z-50 bg-[#173b52] text-white h-[38px] px-4 text-xs">
      <div className="max-w-frame mx-auto h-full flex items-center justify-end gap-5">
        <a href="#register">{uiLabels.memberRegistration}</a>
        <div className="group relative flex h-full items-center">
          <button type="button" className="flex h-full items-center gap-1 text-inherit hover:text-white focus:outline-none" aria-haspopup="menu">
            {uiLabels.additionalMenu} <span className="text-[9px]">▼</span>
          </button>
          <div role="menu" className="top-additional-menu invisible absolute right-0 top-full w-[160px] border border-[#d0d0d0] bg-white py-1 text-[15px] text-[#111] opacity-0 shadow-sm transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-[#38414a] dark:bg-[#151b22] dark:text-[#d4d4d4]">
            <Link role="menuitem" href="/cart" className="block px-3 py-2 leading-none hover:bg-black/5 dark:hover:bg-white/5">注文/配送確認</Link>
            <Link role="menuitem" href="/checkout" className="block px-3 py-2 leading-none hover:bg-black/5 dark:hover:bg-white/5">個人決済</Link>
            <Link role="menuitem" href="/shop" className="block px-3 py-2 leading-none hover:bg-black/5 dark:hover:bg-white/5">レビュー</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
