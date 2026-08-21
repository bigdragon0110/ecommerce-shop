"use client";
import { useAuth } from "@/components/auth/AuthProvider";
import { shopApi,WishlistProduct } from "@/lib/api/client";
import Image from "next/image";import Link from "next/link";import { useEffect,useState } from "react";

export default function WishlistPage(){const{user,loading,refreshCounts}=useAuth();const[products,setProducts]=useState<WishlistProduct[]>([]);const[error,setError]=useState("");
  const load=async()=>{try{const data=await shopApi<{products:WishlistProduct[]}>("wishlist");setProducts(data.products);}catch(value){setError(value instanceof Error?value.message:"Unable to load favourites.");}};
  useEffect(()=>{if(user)void load();},[user]);
  if(loading)return <main className="min-h-[500px] p-20 text-center">Loading…</main>;
  if(!user)return <main className="min-h-[500px] p-20 text-center"><p>Please log in to view favourites.</p><Link href="/" className="mt-5 inline-block border px-6 py-3">Return home</Link></main>;
  return <main className="min-h-[600px] bg-white px-4 py-20 dark:bg-[#0b1016] dark:text-white"><div className="mx-auto max-w-frame"><h1 className="mb-8 text-3xl font-bold">Favourites</h1>{error&&<p className="text-red-600">{error}</p>}<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map(product=><article key={product.id}><Link href={`/shop/product/${product.id}/${product.slug}`}><div className="relative aspect-square border"><Image fill className="object-cover" src={product.imageUrl||"/images/atelier/jewelry-collection.png"} alt={product.title}/></div><h2 className="mt-3 min-h-10 font-bold">{product.title}</h2><b className="text-[#b40000]">₩ {Number(product.priceYen).toLocaleString()}</b></Link><button onClick={async()=>{await shopApi(`wishlist/${product.id}`,{method:"DELETE"});await Promise.all([load(),refreshCounts()]);}} className="mt-3 w-full border py-2 text-sm">Remove</button></article>)}</div>{!products.length&&!error&&<p>Your favourites list is empty.</p>}</div></main>}
