import React from "react";
import Rating from "../ui/Rating";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { badgeLabels } from "@/data/ui-labels";
import SafeProductImage from "./SafeProductImage";

type ProductCardProps = {
  data: Product;
  showSocial?: boolean;
};

const ProductCard = ({ data, showSocial = true }: ProductCardProps) => {
  const badgeColor = {
    HIT: "bg-[#34383d]",
    POPULAR: "bg-[#00978d]",
    RECOMMENDED: "bg-[#f28c00]",
    NEW: "bg-[#c90000]",
    SALE: "bg-[#9b22b4]",
  } as const;

  return (
    <Link
      href={`/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="group flex flex-col items-start aspect-auto min-w-0"
    >
      <div className="relative bg-[#f5f5f5] w-full aspect-square mb-3 overflow-hidden border border-[#e2e2e2]">
        {data.badge && <span className={`absolute z-10 top-2 right-2 min-w-[70px] text-center ${badgeColor[data.badge]} text-white text-[9px] leading-none px-3 py-[5px]`}>{badgeLabels[data.badge]}</span>}
        <SafeProductImage
          src={data.srcUrl}
          width={295}
          height={298}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ objectPosition: data.objectPosition || "center" }}
          alt={data.title}
        />
        <SafeProductImage
          src={data.gallery?.[1] || data.srcUrl}
          width={295}
          height={298}
          className="absolute inset-0 z-[4] h-full w-full object-cover opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100"
          style={{ objectPosition: "42% 76%" }}
          alt=""
          ariaHidden
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-[#666]/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span aria-hidden className="pointer-events-none absolute inset-0 z-[6]">
          <i className="absolute left-0 top-0 h-0 w-0 border border-white/80 transition-[width,height] duration-300 ease-out group-hover:h-full group-hover:w-full" />
          <i className="absolute bottom-0 right-0 h-0 w-0 border border-white/80 transition-[width,height] duration-300 ease-out group-hover:h-full group-hover:w-full" />
        </span>
      </div>
      <strong className="text-[#111] text-sm xl:text-base leading-tight min-h-[42px]">{data.title}</strong>
      <div className="hidden items-end mb-1 xl:mb-2">
        <Rating
          initialValue={data.rating}
          allowFraction
          SVGclassName="inline-block"
          emptyClassName="fill-gray-50"
          size={19}
          readonly
        />
        <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
          {data.rating.toFixed(1)}
          <span className="text-black/60">/5</span>
        </span>
      </div>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        {data.discount.percentage > 0 ? (
          <span className="font-bold text-[#b40000] text-base xl:text-lg">
            {`$${Math.round(
              data.price - (data.price * data.discount.percentage) / 100
            )}`}
          </span>
        ) : data.discount.amount > 0 ? (
          <span className="font-bold text-[#b40000] text-base xl:text-lg">
            {`$${data.price - data.discount.amount}`}
          </span>
        ) : (
          <span className="font-bold text-[#b40000] text-base xl:text-lg">
            ₩ {Math.round(data.price * 1000).toLocaleString()}
          </span>
        )}
        {data.discount.percentage > 0 && (
          <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
            ${data.price}
          </span>
        )}
        {data.discount.amount > 0 && (
          <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
            ${data.price}
          </span>
        )}
        {data.discount.percentage > 0 ? (
          <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
            {`-${data.discount.percentage}%`}
          </span>
        ) : (
          data.discount.amount > 0 && (
            <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              {`-$${data.discount.amount}`}
            </span>
          )
        )}
      </div>
      <p className="text-[11px] text-[#8a8a8a] leading-relaxed line-clamp-2 mt-1">{data.description}</p>
      {showSocial && <div className="product-social-bar flex w-full h-[30px] mt-3 text-[10px] text-white bg-[#cfcfcf]">
        <span className="flex-1 min-w-0 px-1 flex items-center justify-center gap-1 border-r border-white/70 whitespace-nowrap">♡ Favourite</span>
        <span className="flex-1 min-w-0 px-1 flex items-center justify-center gap-1 border-r border-white/70 whitespace-nowrap"><b>f</b> Facebook</span>
        <span className="w-[52px] shrink-0 px-1 flex items-center justify-center gap-1 whitespace-nowrap">𝕏 X</span>
      </div>}
    </Link>
  );
};

export default ProductCard;
