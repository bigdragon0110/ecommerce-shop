"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SafeProductImage from "@/components/common/SafeProductImage";
import { badgeLabels } from "@/data/ui-labels";
import type { Product } from "@/types/product.types";

const PAGE_SIZE = 8;

function HitProductCard({ product }: { product: Product }) {
  const href = `/shop/product/${product.id}/${encodeURIComponent(product.title.replaceAll(" ", "-"))}`;

  return (
    <article className="group relative flex min-h-[498px] flex-col border border-[#dedede] bg-white p-[10px] dark:border-[#303840] dark:bg-[#151b22]">
      <Link href={href} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-[#f7f7f7] dark:bg-[#d8d8d8]">
          {product.badge && (
            <span className="absolute right-0 top-0 z-10 min-w-[70px] bg-[#34383d] px-3 py-[5px] text-center text-[9px] leading-none text-white">
              {badgeLabels[product.badge]}
            </span>
          )}
          <SafeProductImage src={product.srcUrl} alt={product.title} width={450} height={450} className="h-full w-full object-contain" />
          <SafeProductImage src={product.gallery?.[1] || product.srcUrl} alt="" ariaHidden width={450} height={450} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-[#666]/10 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          <span aria-hidden className="pointer-events-none absolute inset-0">
            <i className="absolute left-0 top-0 h-0 w-0 border border-white/80 transition-[width,height] duration-200 group-hover:h-full group-hover:w-full" />
            <i className="absolute bottom-0 right-0 h-0 w-0 border border-white/80 transition-[width,height] duration-200 group-hover:h-full group-hover:w-full" />
          </span>
        </div>
        <h2 className="mt-5 min-h-[50px] text-[17px] font-bold leading-[1.4] text-[#111] dark:text-[#d8d8d8]">{product.title} 要約情報及び購入</h2>
      </Link>

      <p className="text-[18px] font-bold text-[#b40000]">₩ {Math.round(product.price * 1000).toLocaleString()}円</p>
      <p className="mt-3 min-h-[38px] text-[13px] leading-[1.45] text-[#929292] line-clamp-2">{product.description || "商品情報をご確認ください。"}</p>

      <div className="mt-auto flex justify-end pt-2 text-white">
        <button type="button" aria-label="Add to favourites" className="grid h-[30px] w-[30px] place-items-center bg-[#b5b5b5] hover:bg-[#ab0000]">♡</button>
        <button type="button" aria-label="Share on Facebook" className="ml-px grid h-[30px] w-[30px] place-items-center bg-[#b5b5b5] font-bold hover:bg-[#39558f]">f</button>
        <button type="button" aria-label="Share on X" className="ml-px grid h-[30px] w-[30px] place-items-center bg-[#b5b5b5] hover:bg-[#252525]">𝕏</button>
      </div>
    </article>
  );
}

export default function PopularProductGrid({ products }: { products: Product[] }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = useMemo(() => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [page, products]);

  const move = (next: number) => {
    setPage(Math.min(pageCount, Math.max(1, next)));
    window.scrollTo({ top: 160, behavior: "smooth" });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => <HitProductCard key={product.id} product={product} />)}
      </div>
      <nav aria-label="Product pages" className="mt-12 flex items-center justify-center gap-1">
        <button type="button" onClick={() => move(1)} disabled={page === 1} className="grid h-[31px] w-[31px] place-items-center border border-[#ddd] text-[#777] disabled:opacity-40 dark:border-[#39414a]">«</button>
        <button type="button" onClick={() => move(page - 1)} disabled={page === 1} className="grid h-[31px] w-[31px] place-items-center border border-[#ddd] text-[#777] disabled:opacity-40 dark:border-[#39414a]">‹</button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <button key={number} type="button" onClick={() => move(number)} className={`grid h-[31px] min-w-[31px] place-items-center border px-2 text-sm ${number === page ? "border-[#27282c] bg-[#27282c] text-white" : "border-[#ddd] text-[#777] dark:border-[#39414a]"}`}>{number}</button>
        ))}
        <button type="button" onClick={() => move(page + 1)} disabled={page === pageCount} className="grid h-[31px] w-[31px] place-items-center border border-[#ddd] text-[#777] disabled:opacity-40 dark:border-[#39414a]">›</button>
        <button type="button" onClick={() => move(pageCount)} disabled={page === pageCount} className="grid h-[31px] w-[31px] place-items-center border border-[#ddd] text-[#777] disabled:opacity-40 dark:border-[#39414a]">»</button>
      </nav>
    </>
  );
}
