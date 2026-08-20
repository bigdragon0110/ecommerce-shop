"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import SidePromoSlider from "../SidePromoSlider";
import { sectionPromos } from "@/data/section-promos";

const collectionSlides = [
  { position: "50% 50%", eyebrow: "NEW COLLECTION", title: <>PRECIOUS<br/>EVERY DAY</> },
  { position: "10% 80%", eyebrow: "GOLD COLLECTION", title: <>MODERN<br/>HEIRLOOMS</> },
  { position: "88% 20%", eyebrow: "SIGNATURE SERIES", title: <>OBJECTS OF<br/>LASTING BEAUTY</> },
];

export default function Header() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const changeSlide = (direction: number) => setSlide((current) => (current + direction + collectionSlides.length) % collectionSlides.length);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => changeSlide(1), 6000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const activeSlide = collectionSlides[slide];

  return <div className="relative grid lg:grid-cols-[240px_1fr_240px] gap-0 pt-20 pb-10">
    <span aria-hidden className="hero-divider hidden lg:block absolute left-[240px] top-[50px] bottom-0 w-px bg-[#e3e3e3]" />
    <span aria-hidden className="hero-divider hidden lg:block absolute right-[240px] top-[50px] bottom-0 w-px bg-[#e3e3e3]" />
    <div className="hidden lg:block"><SidePromoSlider slides={sectionPromos.goldCollection.slides} height={345}/></div>
    <div className="group relative h-[260px] mx-5 overflow-hidden bg-[#111]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Image key={slide} src="/images/atelier/jewelry-collection.png" fill priority alt="New jewelry collection" className="object-cover opacity-90 animate-in fade-in duration-500" style={{objectPosition:activeSlide.position}} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 text-white"><span className="text-xs tracking-[.25em]">{activeSlide.eyebrow}</span><h1 className="text-3xl md:text-5xl font-bold mt-3">{activeSlide.title}</h1><Link href="/shop" className="inline-block mt-5 bg-[#08a9c7] rounded-full px-6 py-2 text-xs font-bold">SHOP NOW ›</Link></div>
      <div className="absolute right-2.5 top-2.5 z-10 flex gap-[2px] opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous collection slide" className="grid h-8 w-8 place-items-center rounded-[3px] bg-[#6f7072] text-white hover:bg-[#555658]"><ChevronLeft size={20}/></button>
        <button type="button" onClick={() => changeSlide(1)} aria-label="Next collection slide" className="grid h-8 w-8 place-items-center rounded-[3px] bg-[#6f7072] text-white hover:bg-[#555658]"><ChevronRight size={20}/></button>
      </div>
    </div>
    <aside className="hidden lg:block ml-5 w-[220px] border border-[#ddd] p-5 h-[345px] bg-white"><span className="text-xs text-red-600 font-bold">HOT</span><h2 className="text-xl font-bold mt-2">TIME SALE</h2><div className="relative aspect-square mt-3"><Image src="/images/atelier/jewelry-collection.png" fill alt="Limited gold object" className="object-cover" style={{objectPosition:"90% 80%"}} /></div><strong className="block mt-3">Gold object 999.9</strong><span className="text-red-700 font-bold">₩ 50,000</span><p className="text-xs text-[#777] mt-3">Remaining: <b className="text-[#222]">43D 04:28:31</b></p></aside>
  </div>;
}
