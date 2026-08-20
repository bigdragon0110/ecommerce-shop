"use client";

import type { Product } from "@/types/product.types";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useState } from "react";

const galleryPositions = ["8% 18%", "30% 75%", "55% 18%", "88% 78%", "50% 45%"];

export default function ProductZoomGallery({ product }: { product: Product }) {
  const [imageSrc, setImageSrc] = useState(product.srcUrl);
  const [selected, setSelected] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [point, setPoint] = useState({ x: 50, y: 50 });

  const selectImage = (index: number) => {
    setZooming(false);
    setSelected((index + galleryPositions.length) % galleryPositions.length);
  };

  const previousImage = () => selectImage(selected - 1);
  const nextImage = () => selectImage(selected + 1);

  const moveLens = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPoint({
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  };

  return <div
    className="product-zoom-gallery relative outline-none"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === "ArrowLeft") previousImage();
      if (event.key === "ArrowRight") nextImage();
    }}
  >
    <div
      className="relative h-[470px] overflow-hidden bg-[#f1f1f1] touch-pan-y"
      onPointerEnter={() => setZooming(true)}
      onPointerLeave={() => setZooming(false)}
      onPointerMove={moveLens}
    >
      <img src={imageSrc} onError={() => setImageSrc("/images/atelier/jewelry-collection.png")} alt={product.title} className="h-full w-full object-cover" style={{ objectPosition: galleryPositions[selected] }}/>
      {zooming && <span className="pointer-events-none absolute hidden h-[245px] w-[245px] -translate-x-1/2 -translate-y-1/2 bg-white/40 lg:block" style={{ left: `${point.x}%`, top: `${point.y}%` }}/>} 
    </div>

    {zooming && <div className="pointer-events-none absolute left-full top-0 z-50 ml-0 hidden h-[655px] w-[655px] border-4 border-[#76787c] bg-no-repeat lg:block" style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: "215% 215%", backgroundPosition: `${point.x}% ${point.y}%` }}/>} 

    <div className="mt-0 grid h-[94px] grid-cols-[repeat(4,minmax(0,1fr))_30px] overflow-hidden border-x border-b border-[#d2d2d2] dark:border-[#343c45]">
      {galleryPositions.slice(0, 4).map((position, index) => <button key={position} type="button" onClick={() => selectImage(index)} aria-label={`View product image ${index + 1}`} aria-current={selected === index ? "true" : undefined} className={`relative overflow-hidden border-r border-[#c8c8c8] dark:border-[#343c45] ${selected === index ? "ring-2 ring-inset ring-[#777]" : ""}`}><img src={imageSrc} alt="" className="h-full w-full object-cover" style={{objectPosition:position}}/></button>)}
      <button type="button" onClick={nextImage} aria-label="Next gallery image" className="grid place-items-center bg-[#11171e] text-white hover:bg-[#202832]"><ChevronRight size={18}/></button>
    </div>

    <div className="mt-8 grid h-14 grid-cols-[48px_1fr_1fr_48px] border border-[#e0e0e0] text-sm text-[#a5a5a5] dark:border-[#343c45] dark:bg-[#151b22] dark:text-[#a8adb2]">
      <button type="button" aria-label="Previous product" className="grid place-items-center border-r border-[#e0e0e0] text-[#12334c] hover:bg-black/[.03] dark:border-[#343c45] dark:text-[#b8c0c7] dark:hover:bg-white/[.04]"><ChevronLeft size={20} strokeWidth={3}/></button>
      <button type="button" className="border-r border-[#e0e0e0] hover:text-[#555] dark:border-[#343c45] dark:hover:text-white">Previous product</button>
      <button type="button" className="border-r border-[#e0e0e0] hover:text-[#555] dark:border-[#343c45] dark:hover:text-white">Next product</button>
      <button type="button" aria-label="Next product" className="grid place-items-center text-[#12334c] hover:bg-black/[.03] dark:text-[#b8c0c7] dark:hover:bg-white/[.04]"><ChevronRight size={20} strokeWidth={3}/></button>
    </div>
    <div className="flex h-10 items-center gap-6 border-x border-b border-[#e0e0e0] px-4 text-xs text-[#9a9a9a] dark:border-[#343c45] dark:text-[#9da3a8]"><span>◉ 0</span><span>♡ 0</span><Share2 size={15} className="ml-auto"/></div>
  </div>;
}
