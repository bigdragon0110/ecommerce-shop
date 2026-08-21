import Link from "next/link";
import { CircleArrowRight, Grid2X2, List } from "lucide-react";
import SafeProductImage from "@/components/common/SafeProductImage";
import { badgeLabels } from "@/data/ui-labels";
import type { ProductListing, ProductSort } from "@/lib/products/product-repository";

const sorts: Array<[ProductSort, string]> = [
  ["newest", "新着順"], ["best-selling", "売れ筋順"], ["price-asc", "低価格順"],
  ["price-desc", "高価格順"], ["rating", "高評価順"], ["reviews", "レビュー多い順"],
];

const pageHref = (basePath: string, page: number, sort: string) => `${basePath}?page=${page}&sort=${sort}`;

const compactPages = (current: number, total: number): Array<number | "ellipsis-left" | "ellipsis-right"> => {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis-right", total];
  if (current >= total - 3) return [1, "ellipsis-left", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis-left", current - 1, current, current + 1, "ellipsis-right", total];
};

export default function CatalogListingPage({ listing, basePath, sort, categoryLayout = false }: {
  listing: ProductListing; basePath: string; sort: ProductSort; categoryLayout?: boolean;
}) {
  const { page, pageCount } = listing.pagination;
  return (
    <main className="bg-white pb-20 dark:bg-[#0b1016]">
      <header className="border-b border-[#bdbdbd] dark:border-[#343c45]">
        <div className="mx-auto flex min-h-[114px] max-w-frame items-end justify-between px-4 pb-5 xl:px-0">
          <h1 className="flex items-center gap-3 text-[21px] font-bold text-[#111] dark:text-[#dedede]">
            <CircleArrowRight aria-hidden size={20} className="fill-[#111] text-white dark:fill-[#d9d9d9] dark:text-[#0b1016]" />{listing.title}
          </h1>
          <nav aria-label="Breadcrumb" className="hidden text-sm text-[#777] sm:block">
            <Link href="/" className="text-[#111] dark:text-[#d1d1d1]">Home</Link><span className="mx-2">/</span>
            {listing.breadcrumbs.map((crumb, index) => <span key={crumb.slug}><Link href={`/shop/category/${crumb.slug}`} className={index === listing.breadcrumbs.length - 1 ? "text-[#777]" : "text-[#111] dark:text-[#d1d1d1]"}>{crumb.name}</Link>{index < listing.breadcrumbs.length - 1 && <span className="mx-2">/</span>}</span>)}
            {!listing.breadcrumbs.length && listing.title}
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-frame px-4 py-10 xl:px-0">
        {categoryLayout && <div className="mb-10">
          <div className="mb-7 flex flex-wrap items-center border-b border-t-[3px] border-[#dedede] border-t-[#777] dark:border-[#333c45] dark:border-t-[#777]">
            <div className="flex min-h-[50px] flex-1 flex-wrap items-center gap-x-8">
              {sorts.map(([value, label]) => <Link key={value} href={pageHref(basePath, 1, value)} className={`border-b px-1 py-4 text-sm ${sort === value ? "border-[#111] text-[#111] dark:border-white dark:text-white" : "border-transparent text-[#999] hover:text-[#222] dark:hover:text-white"}`}>{label}</Link>)}
            </div>
            <div className="flex"><span className="grid h-[40px] w-[40px] place-items-center border border-[#ddd] dark:border-[#39414a]"><List size={16} /></span><span className="grid h-[40px] w-[40px] place-items-center border border-l-0 border-[#ddd] dark:border-[#39414a]"><Grid2X2 size={16} /></span></div>
          </div>
        </div>}
        {listing.products.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listing.products.map((product) => <article key={product.id} className="group relative flex min-h-[498px] flex-col border border-[#dedede] bg-white p-[10px] dark:border-[#303840] dark:bg-[#151b22]">
            <Link href={`/shop/product/${product.id}/${encodeURIComponent(product.title.replaceAll(" ", "-"))}`}>
              <div className="relative aspect-square overflow-hidden bg-[#f7f7f7] dark:bg-[#d8d8d8]">
                {product.badge && <span className="absolute right-0 top-0 z-10 min-w-[70px] bg-[#34383d] px-3 py-[5px] text-center text-[9px] leading-none text-white">{badgeLabels[product.badge]}</span>}
                <SafeProductImage src={product.srcUrl} alt={product.title} width={450} height={450} className="h-full w-full object-contain" />
                <SafeProductImage src={product.gallery?.[1] || product.srcUrl} alt="" ariaHidden width={450} height={450} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-[#666]/10 opacity-0 transition-opacity duration-100 group-hover:opacity-100" />
                <i className="pointer-events-none absolute left-0 top-0 h-0 w-0 border border-white/80 transition-[width,height] duration-150 group-hover:h-full group-hover:w-full" />
                <i className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 border border-white/80 transition-[width,height] duration-150 group-hover:h-full group-hover:w-full" />
              </div>
              <h2 className="mt-5 min-h-[50px] text-[17px] font-bold leading-[1.4] text-[#111] dark:text-[#d8d8d8]">{product.title} 要約情報及び購入</h2>
            </Link>
            <p className="text-[18px] font-bold text-[#b40000]">₩ {Math.round(product.price * 1000).toLocaleString()}円</p>
            <p className="mt-3 min-h-[38px] line-clamp-2 text-[13px] leading-[1.45] text-[#929292]">{product.description || "商品情報をご確認ください。"}</p>
            <div className="mt-auto flex justify-end pt-2 text-white"><button className="grid h-[30px] w-[30px] place-items-center bg-[#b5b5b5]">♡</button><button className="ml-px grid h-[30px] w-[30px] place-items-center bg-[#b5b5b5] font-bold">f</button><button className="ml-px grid h-[30px] w-[30px] place-items-center bg-[#b5b5b5]">𝕏</button></div>
          </article>)}
        </div> : <div className="border border-[#ddd] py-20 text-center text-[#777] dark:border-[#343c45]">登録された商品がありません。</div>}
        {pageCount > 1 && <nav aria-label="Product pages" className="mt-12 flex flex-wrap justify-center gap-1">
          <Link aria-disabled={page === 1} href={pageHref(basePath, 1, sort)} className={`grid h-[31px] w-[31px] place-items-center border border-[#ddd] ${page === 1 ? "pointer-events-none opacity-40" : ""}`}>«</Link>
          <Link aria-disabled={page === 1} href={pageHref(basePath, Math.max(1, page - 1), sort)} className={`grid h-[31px] w-[31px] place-items-center border border-[#ddd] ${page === 1 ? "pointer-events-none opacity-40" : ""}`}>‹</Link>
          {compactPages(page, pageCount).map((item) => typeof item === "number"
            ? <Link key={item} href={pageHref(basePath, item, sort)} aria-current={item === page ? "page" : undefined} className={`grid h-[31px] min-w-[31px] place-items-center border px-2 ${item === page ? "border-[#27282c] bg-[#27282c] text-white" : "border-[#ddd] dark:border-[#39414a]"}`}>{item}</Link>
            : <span key={item} aria-hidden className="grid h-[31px] min-w-[24px] place-items-center text-[#888]">…</span>)}
          <Link aria-disabled={page === pageCount} href={pageHref(basePath, Math.min(pageCount, page + 1), sort)} className={`grid h-[31px] w-[31px] place-items-center border border-[#ddd] ${page === pageCount ? "pointer-events-none opacity-40" : ""}`}>›</Link>
          <Link aria-disabled={page === pageCount} href={pageHref(basePath, pageCount, sort)} className={`grid h-[31px] w-[31px] place-items-center border border-[#ddd] ${page === pageCount ? "pointer-events-none opacity-40" : ""}`}>»</Link>
        </nav>}
      </section>
    </main>
  );
}
