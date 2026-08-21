"use client";

import type { SectionPromoSlide } from "@/data/section-promos";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const move = (direction: -1 | 1) => {
    setActive((value) => (value + direction + slides.length) % slides.length);
    setFailedImage(null);
  };

  useEffect(() => {
    if (paused || !sliding) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length, sliding]);

  return <div
    className="group relative isolate z-0 w-[220px] max-w-full cursor-default overflow-hidden bg-[#222]"
    style={{height}}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onClickCapture={(event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("button")) return;
      event.preventDefault();
      event.stopPropagation();
    }}
  >
    <div className="absolute inset-0">
      <img key={`${active}-${failedImage}`} src={failedImage === slide.image ? fallbackImage : slide.image} onError={() => setFailedImage(slide.image)} alt={slide.label} className={`h-full w-full object-cover animate-in fade-in duration-500 ${dark ? "opacity-70" : ""}`} style={{objectPosition:position}}/>
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent"/>
      <span className="absolute bottom-14 inset-x-4 text-center text-white"><b className="block text-base">{slide.label}</b><span className="mt-2 block text-xs">{slide.copy}</span></span>
    </div>
    {sliding && <div className="absolute right-3 top-3 z-10 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      <button type="button" onClick={() => move(-1)} aria-label="Previous promotional slide" className="grid h-8 w-8 place-items-center rounded-[3px] border border-white/25 bg-[#555]/80 text-white hover:bg-[#444] focus-visible:opacity-100"><ChevronLeft size={20} /></button>
      <button type="button" onClick={() => move(1)} aria-label="Next promotional slide" className="grid h-8 w-8 place-items-center rounded-[3px] border border-white/25 bg-[#555]/80 text-white hover:bg-[#444] focus-visible:opacity-100"><ChevronRight size={20} /></button>
    </div>}
    {sliding && <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      {slides.map((item, index) => <button key={item.image} type="button" onClick={() => { setActive(index); setFailedImage(null); }} aria-label={`Show ${item.label} slide ${index + 1}`} aria-current={active === index ? "true" : undefined} className={`h-[2px] w-7 transition-colors ${active === index ? "bg-white" : "bg-white/35"}`}/>) }
    </div>}
  </div>;
}
