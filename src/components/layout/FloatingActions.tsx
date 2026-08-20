"use client";

import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function FloatingActions() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <>
      <div className="fixed right-[6px] top-[43%] -translate-y-1/2 z-40 hidden sm:flex w-[42px] flex-col overflow-hidden rounded-[22px] shadow-sm">
        <Link href="/cart" aria-label="Go to checkout" className="flex h-[49px] items-center justify-center bg-[#686a6d] text-white hover:bg-[#56585b] transition-colors">
          <FaShoppingCart size={23} />
        </Link>
        <Link href="/shop" aria-label="Open shopping list" className="relative flex h-[49px] items-center justify-center border-t border-white/20 bg-[#1b2229] text-white hover:bg-[#10161c] transition-colors">
          <span className="relative block h-[18px] w-[22px]">
            <i className="absolute right-0 top-0 block h-[2px] w-[15px] bg-white" />
            <i className="absolute right-0 top-[7px] block h-[2px] w-[15px] bg-white" />
            <i className="absolute right-0 top-[14px] block h-[2px] w-[15px] bg-white" />
            <FaArrowLeft size={10} className="absolute -left-[2px] top-[4px] text-white" />
          </span>
        </Link>
      </div>

      <button
        type="button"
        aria-label={`Scroll to top, page progress ${progress}%`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-5 right-4 z-40 h-[48px] w-[48px] place-items-center rounded-full shadow-sm transition-all duration-200 ${progress > 0 ? "hidden sm:grid opacity-100 scale-100" : "hidden opacity-0 scale-90 pointer-events-none"}`}
        style={{ background: `conic-gradient(#d7190f ${progress * 3.6}deg, #777 ${progress * 3.6}deg)` }}
      >
        <span className="flex h-[43px] w-[43px] flex-col items-center justify-center rounded-full bg-white text-[#222] leading-none">
          <ChevronUp size={16} strokeWidth={3} />
          <span className="mt-[1px] text-[10px]">{progress}%</span>
        </span>
      </button>
    </>
  );
}
