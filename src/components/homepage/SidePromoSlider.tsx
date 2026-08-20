"use client";

import type { SectionPromoSlide } from "@/data/section-promos";
import Link from "next/link";
import { useEffect, useState } from "react";

type SidePromoSliderProps = {
  slides: readonly SectionPromoSlide[];
  position?: string;
  height?: number;
  dark?: boolean;
};

const fallbackImage = "/images/atelier/jewelry-collection.png";

export default function SidePromoSlider({ slides, position = "center", height = 460, dark = false }: SidePromoSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const sliding = slides.length > 1;
  const slide = slides[active] ?? slides[0];

  useEffect(() => {
    if (paused || !sliding) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length, sliding]);

  return <div className="relative w-[220px] max-w-full overflow-hidden bg-[#222]" style={{height}} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <Link href="/shop" className="absolute inset-0 block">
      <img key={`${active}-${failedImage}`} src={failedImage === slide.image ? fallbackImage : slide.image} onError={() => setFailedImage(slide.image)} alt={slide.label} className={`h-full w-full object-cover animate-in fade-in duration-500 ${dark ? "opacity-70" : ""}`} style={{objectPosition:position}}/>
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent"/>
      <span className="absolute bottom-14 inset-x-4 text-center text-white"><b className="block text-base">{slide.label}</b><span className="mt-2 block text-xs">{slide.copy}</span></span>
    </Link>
    {sliding && <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      {slides.map((item, index) => <button key={item.image} type="button" onClick={() => { setActive(index); setFailedImage(null); }} aria-label={`Show ${item.label} slide ${index + 1}`} aria-current={active === index ? "true" : undefined} className={`h-[2px] w-7 transition-colors ${active === index ? "bg-white" : "bg-white/35"}`}/>) }
    </div>}
  </div>;
}
