"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function PurchaseControls({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const total = Math.round(product.price * 1000 * quantity).toLocaleString();

  const add = () => dispatch(addToCart({ id: product.id, name: product.title, srcUrl: product.srcUrl, price: product.price, attributes: [product.category || "Jewelry", product.material || "Gold"], discount: product.discount, quantity }));

  return <div className="mt-3">
    <div className="flex min-h-10 items-center justify-between border-y border-[#dedede] dark:border-[#343b43] text-xs">
      <strong className="pr-3">{product.title}</strong>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-7 border border-[#c9c9c9] dark:border-[#434b54]">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid w-7 place-items-center"><Minus size={12}/></button>
          <span className="grid w-8 place-items-center border-x border-[#c9c9c9] dark:border-[#434b54]">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className="grid w-7 place-items-center"><Plus size={12}/></button>
        </div>
        <span>+0 yen</span>
      </div>
    </div>
    <div className="flex items-center justify-between py-3"><b>total amount :</b><strong className="text-lg text-[#c40000]">{total} yen</strong></div>
    <div className="grid grid-cols-[1fr_1fr_48px] gap-1.5">
      <button type="button" onClick={add} className="h-11 bg-[#414375] text-sm font-bold text-white hover:bg-[#33355f]">Purchase</button>
      <button type="button" onClick={add} className="h-11 border border-[#414375] text-sm font-bold text-[#414375] dark:text-[#c6c7e4]">Add to cart</button>
      <button type="button" aria-label="Add to wishlist" className="grid h-11 place-items-center border border-[#d2d2d2] dark:border-[#3a424b]"><Heart size={17}/></button>
    </div>
  </div>;
}
