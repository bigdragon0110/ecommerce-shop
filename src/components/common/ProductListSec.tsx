"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product.types";
import Link from "next/link";
import { useState } from "react";
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
  const localizedTitle = sectionLabels[title.toLowerCase()];
  return (
    <section className="atelier-shell">
      <div className="relative flex items-end justify-between mb-8 md:mb-11 border-b border-[#e9e9e9] pb-4">
        <div><h2 className="font-bold text-[22px] md:text-2xl text-[#111]">{localizedTitle ? <><span>{localizedTitle.primary}</span><span className="ml-1 text-[#9a9a9a]">{localizedTitle.secondary}</span></> : title}</h2>{localizedTitle && <span aria-hidden className="absolute -bottom-px left-0 flex gap-1"><i className="block h-px w-10 bg-[#222]"/><i className="block h-px w-5 bg-[#222]"/></span>}</div>
        {viewAllLink && (
          <Link href={viewAllLink} className="hidden sm:inline-block border-b border-[#101b2d] pb-1 font-bold text-sm">View all pieces</Link>
        )}
        {sectionControls && <div className="flex items-center gap-1.5 ml-auto">
          {sectionControls === "arrows-plus" && <>
            <button type="button" onClick={() => setActiveSlide((value) => (value + 7) % 8)} aria-label="Previous product slide" className="section-control w-8 h-8 p-0 border border-[#bfc3c7] bg-white text-[#59616a] inline-flex items-center justify-center"><ChevronLeft size={18} strokeWidth={2.5} className="block" /></button>
            <button type="button" onClick={() => setActiveSlide((value) => (value + 1) % 8)} aria-label="Next product slide" className="section-control w-8 h-8 p-0 border border-[#bfc3c7] bg-white text-[#59616a] inline-flex items-center justify-center"><ChevronRight size={18} strokeWidth={2.5} className="block" /></button>
          </>}
          <Link href="/shop" aria-label={`View all ${title}`} className="section-control w-8 h-8 border border-[#222] bg-white text-[#111] flex items-center justify-center"><Plus size={20} strokeWidth={2.5} /></Link>
        </div>}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
        {data.map((product) => <ProductCard key={product.id} data={product} showSocial={showSocial} />)}
      </div>
      {showSlideIndicators && <div className="flex justify-center items-center gap-2 mt-7" aria-label="Product carousel position">
        {Array.from({ length: 8 }).map((_, index) => <button key={index} type="button" onClick={() => setActiveSlide(index)} aria-label={`Show product slide ${index + 1}`} aria-current={activeSlide === index ? "true" : undefined} className={`block w-7 h-[3px] transition-colors ${activeSlide === index ? "bg-[#b40000]" : "bg-[#bdbdbd]"}`} />)}
      </div>}
      {viewAllLink && <Link href={viewAllLink} className="sm:hidden block text-center mt-8 border border-[#101b2d] py-3 font-bold text-sm">View all pieces</Link>}
    </section>
  );
};

export default ProductListSec;
