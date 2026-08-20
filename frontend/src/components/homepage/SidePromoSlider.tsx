"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SidePromoSliderProps = {
  label: string;
  copy: string;
  position?: string;
  height?: number;
  dark?: boolean;
  sliding?: boolean;
};

export default function SidePromoSlider({ label, copy, position = "12% center", height = 460, dark = false, sliding = false }: SidePromoSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const positions = sliding ? [position, "48% 22%", "86% 78%"] : [position];

  useEffect(() => {
    if (paused || !sliding) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % positions.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused, positions.length, sliding]);

  return <div className="relative w-[220px] max-w-full overflow-hidden bg-[#222]" style={{height}} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <Link href="/shop" className="absolute inset-0 block">
      <img key={active} src="/images/atelier/jewelry-collection.png" alt={label} className={`h-full w-full object-cover animate-in fade-in duration-500 ${dark ? "opacity-70" : ""}`} style={{objectPosition:positions[active]}}/>
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent"/>
      <span className="absolute bottom-14 inset-x-4 text-center text-white"><b className="block text-base">{label}</b><span className="mt-2 block text-xs">{copy}</span></span>
    </Link>
    {sliding && <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      {positions.map((_, index) => <button key={index} type="button" onClick={() => setActive(index)} aria-label={`Show ${label} slide ${index + 1}`} aria-current={active === index ? "true" : undefined} className={`h-[2px] w-7 transition-colors ${active === index ? "bg-white" : "bg-white/35"}`}/>)}
    </div>}
  </div>;
}
