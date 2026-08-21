"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product.types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { sectionLabels } from "@/data/ui-labels";

type ProductListSecProps = {
  title: string;
  data: Product[];
  viewAllLink?: string;
  showSocial?: boolean;
  showSlideIndicators?: boolean;
  sectionControls?: "plus" | "arrows-plus";
};

const ProductListSec = ({ title, data, viewAllLink, showSocial = true, showSlideIndicators = false, sectionControls }: ProductListSecProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [sectionHovered, setSectionHovered] = useState(false);
  const localizedTitle = sectionLabels[title.toLowerCase()];
  const productsPerSlide = 4;
  const slideCount = showSlideIndicators ? Math.max(1, data.length) : Math.max(1, Math.ceil(data.length / productsPerSlide));
  const visibleProducts = showSlideIndicators && data.length
    ? Array.from({ length: Math.min(productsPerSlide, data.length) }, (_, offset) => data[(activeSlide + offset) % data.length])
    : data;
  const moveSlide = (direction: -1 | 1) => setActiveSlide((value) => (value + direction + slideCount) % slideCount);

  useEffect(() => {
    if (activeSlide >= slideCount) setActiveSlide(Math.max(0, slideCount - 1));
  }, [activeSlide, slideCount]);
  return (
    <section className="atelier-shell" onMouseEnter={() => setSectionHovered(true)} onMouseLeave={() => setSectionHovered(false)}>
      <div className="relative flex items-end justify-between mb-8 md:mb-11 border-b border-[#e9e9e9] pb-4">
        <div><h2 className="font-bold text-[22px] md:text-2xl text-[#111]">{localizedTitle ? <><span>{localizedTitle.primary}</span><span className="ml-1 text-[#9a9a9a]">{localizedTitle.secondary}</span></> : title}</h2>{localizedTitle && <span aria-hidden className="absolute -bottom-px left-0 flex gap-1"><i className="block h-px w-10 bg-[#222]"/><i className="block h-px w-5 bg-[#222]"/></span>}</div>
        {viewAllLink && (
          <Link href={viewAllLink} className="hidden sm:inline-block border-b border-[#101b2d] pb-1 font-bold text-sm">View all pieces</Link>
        )}
        {sectionControls && <div className="flex items-center gap-1.5 ml-auto">
          {sectionControls === "arrows-plus" && <>
            <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous product slide" className={`section-control inline-flex h-8 w-8 items-center justify-center border border-[#bfc3c7] bg-white p-0 text-[#59616a] transition-opacity duration-150 focus-visible:opacity-100 ${sectionHovered ? "opacity-100" : "opacity-0"}`}><ChevronLeft size={18} strokeWidth={2.5} className="block" /></button>
            <button type="button" onClick={() => moveSlide(1)} aria-label="Next product slide" className={`section-control inline-flex h-8 w-8 items-center justify-center border border-[#bfc3c7] bg-white p-0 text-[#59616a] transition-opacity duration-150 focus-visible:opacity-100 ${sectionHovered ? "opacity-100" : "opacity-0"}`}><ChevronRight size={18} strokeWidth={2.5} className="block" /></button>
          </>}
          <Link href="/shop" aria-label={`View all ${title}`} className="section-control w-8 h-8 border border-[#222] bg-white text-[#111] flex items-center justify-center"><Plus size={20} strokeWidth={2.5} /></Link>
        </div>}
      </div>
      <div className="relative">
        {showSlideIndicators && slideCount > 1 && <>
          <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous product slide" className={`absolute -left-1 top-[42%] z-10 grid h-[34px] w-[34px] -translate-y-1/2 place-items-center rounded-[2px] bg-[#777]/85 text-white transition-[opacity,background-color] duration-150 hover:bg-[#5f5f5f] focus-visible:opacity-100 md:-left-2 ${sectionHovered ? "opacity-100" : "opacity-0"}`}><ChevronLeft size={21} /></button>
          <button type="button" onClick={() => moveSlide(1)} aria-label="Next product slide" className={`absolute -right-1 top-[42%] z-10 grid h-[34px] w-[34px] -translate-y-1/2 place-items-center rounded-[2px] bg-[#777]/85 text-white transition-[opacity,background-color] duration-150 hover:bg-[#5f5f5f] focus-visible:opacity-100 md:-right-2 ${sectionHovered ? "opacity-100" : "opacity-0"}`}><ChevronRight size={21} /></button>
        </>}
        <div key={activeSlide} className="grid grid-cols-2 gap-x-4 gap-y-10 animate-in fade-in duration-200 lg:grid-cols-4 md:gap-x-6">
          {visibleProducts.map((product) => <ProductCard key={product.id} data={product} showSocial={showSocial} />)}
        </div>
      </div>
      {showSlideIndicators && <div className="flex justify-center items-center gap-2 mt-7" aria-label="Product carousel position">
        {Array.from({ length: slideCount }).map((_, index) => <button key={index} type="button" onClick={() => setActiveSlide(index)} aria-label={`Show product slide ${index + 1}`} aria-current={activeSlide === index ? "true" : undefined} className={`block w-7 h-[3px] transition-colors ${activeSlide === index ? "bg-[#b40000]" : "bg-[#bdbdbd]"}`} />)}
      </div>}
      {viewAllLink && <Link href={viewAllLink} className="sm:hidden block text-center mt-8 border border-[#101b2d] py-3 font-bold text-sm">View all pieces</Link>}
    </section>
  );
};

export default ProductListSec;
