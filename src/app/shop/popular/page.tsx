import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import PopularProductGrid from "@/components/shop-page/PopularProductGrid";
import { getProductsBySection } from "@/lib/products/catalog";

export const dynamic = "force-dynamic";

export default async function PopularProductsPage() {
  const products = await getProductsBySection("hit");

  return (
    <main className="bg-white pb-20 pt-[50px] dark:bg-[#0b1016]">
      <header className="border-b border-[#bdbdbd] dark:border-[#343c45]">
        <div className="mx-auto flex min-h-[114px] max-w-frame items-end justify-between px-4 pb-5 xl:px-0">
          <h1 className="flex items-center gap-3 text-[21px] font-bold text-[#111] dark:text-[#dedede]">
            <CircleArrowRight aria-hidden size={20} className="fill-[#111] text-white dark:fill-[#d9d9d9] dark:text-[#0b1016]" />
            ヒット商品
          </h1>
          <nav aria-label="Breadcrumb" className="hidden text-sm text-[#777] sm:block">
            <Link href="/" className="text-[#111] dark:text-[#d1d1d1]">Home</Link><span className="mx-2">/</span>
            <Link href="/shop" className="text-[#111] dark:text-[#d1d1d1]">ショッピング</Link><span className="mx-2">/</span>ヒット商品
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-frame px-4 py-10 xl:px-0">
        {products.length ? <PopularProductGrid products={products} /> : <div className="border border-[#ddd] py-20 text-center text-[#777] dark:border-[#343c45]">登録されたヒット商品がありません。</div>}
      </section>
    </main>
  );
}
