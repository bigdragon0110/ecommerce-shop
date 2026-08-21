"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { shopApi } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function PurchaseControls({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const {user,refreshCounts}=useAuth();
  const router=useRouter();
  const[message,setMessage]=useState("");
  const[busy,setBusy]=useState(false);
  const total = Math.round(product.price * 1000 * quantity).toLocaleString();

  const add = async() => {
    setMessage("");
    if(!user){dispatch(addToCart({ id: product.id, name: product.title, srcUrl: product.srcUrl, price: product.price, attributes: [product.category || "Jewelry", product.material || "Gold"], discount: product.discount, quantity }));setMessage("Added to guest cart.");return;}
    setBusy(true);try{await shopApi("cart/items",{method:"POST",body:JSON.stringify({productId:product.id,quantity})});await refreshCounts();setMessage("Added to cart.");}catch(value){setMessage(value instanceof Error?value.message:"Unable to add item.");}finally{setBusy(false);}
  };
  const favourite=async()=>{if(!user){setMessage("Please log in to use favourites.");return;}setBusy(true);try{await shopApi(`wishlist/${product.id}`,{method:"POST"});await refreshCounts();setMessage("Added to favourites.");}catch(value){setMessage(value instanceof Error?value.message:"Unable to add favourite.");}finally{setBusy(false);}};

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
      <button disabled={busy} type="button" onClick={async()=>{await add();router.push("/cart");}} className="h-11 bg-[#414375] text-sm font-bold text-white hover:bg-[#33355f] disabled:opacity-50">Purchase</button>
      <button disabled={busy} type="button" onClick={()=>void add()} className="h-11 border border-[#414375] text-sm font-bold text-[#414375] disabled:opacity-50 dark:text-[#c6c7e4]">Add to cart</button>
      <button disabled={busy} onClick={()=>void favourite()} type="button" aria-label="Add to wishlist" className="grid h-11 place-items-center border border-[#d2d2d2] disabled:opacity-50 dark:border-[#3a424b]"><Heart size={17}/></button>
    </div>
    {message&&<p role="status" className="mt-2 text-xs text-[#777] dark:text-[#aaa]">{message}</p>}
  </div>;
}
