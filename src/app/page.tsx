import ProductListSec from "@/components/common/ProductListSec";
import Header from "@/components/homepage/Header";
import { hero } from "@/data/products";
import { getHomepageProducts } from "@/lib/products/catalog";
import type { Product } from "@/types/product.types";
import SidePromoSlider from "@/components/homepage/SidePromoSlider";
import { sectionPromos, type SectionPromo } from "@/data/section-promos";
import type { ProductSection } from "@/lib/products/product-repository";

export const dynamic = "force-dynamic";

type RowProps = { title: string; section: ProductSection; promo: SectionPromo; data: Product[]; connected?: boolean; simple?: boolean; indicators?: boolean; controls?: "plus" | "arrows-plus" };
function ProductRow({ title, section, promo, data, connected, simple, indicators, controls = "arrows-plus" }: RowProps) {
  return <div className={connected ? "" : "border-t border-[#e9e9e9]"}>
    <div className="max-w-frame mx-auto px-4 xl:px-0 grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block border-r border-[#e9e9e9] py-10 pr-5"><SidePromoSlider slides={promo.slides} height={460} dark={promo.dark} /></aside>
      <div className="py-10 lg:pl-5"><ProductListSec title={title} data={data} controlLink={`/shop/collection/${section}`} showSocial={!simple} showSlideIndicators={Boolean(simple || indicators)} sectionControls={controls} /></div>
    </div>
  </div>
}

export default async function Home() {
  const { hit: hitData, recommended: relatedProductData, newProducts: newArrivalsData, popular: topSellingData, sale: saleData } = await getHomepageProducts();
  return <main className="bg-white">
    <div className="max-w-frame mx-auto px-4 xl:px-0"><Header /></div>
    <ProductRow title="Recommended products" section="recommended" promo={sectionPromos.featuredRecommended} data={relatedProductData} connected simple />
    <section className="relative h-[400px] md:h-[500px] bg-[#0c1118] text-white overflow-hidden border-y border-[#29303a]">
      <img src={hero} alt="Series exhibition" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-[#08101a]/65" /><button className="absolute left-5 top-1/2 text-5xl font-light">‹</button><button className="absolute right-5 top-1/2 text-5xl font-light">›</button>
      <div className="relative h-full flex flex-col items-center justify-center text-center"><p className="text-xs tracking-[.35em] text-white/50 mb-5">SPECIAL EDITION</p><h2 className="text-3xl md:text-4xl font-bold">SERIES EXHIBITION</h2><p className="mt-5 text-white/70">A collection made for moments worth remembering.</p><span className="mt-24 w-16 border-t-2 border-white/70" /></div>
    </section>
    <ProductRow title="Hit products" section="hit" promo={sectionPromos.hit} data={hitData} controls="arrows-plus" />
    <ProductRow title="Recommended products" section="recommended" promo={sectionPromos.recommended} data={relatedProductData} indicators />
    <ProductRow title="New products" section="new" promo={sectionPromos.newProducts} data={newArrivalsData} />
    <ProductRow title="Popular products" section="popular" promo={sectionPromos.popular} data={topSellingData} />
    <ProductRow title="Discounted products" section="sale" promo={sectionPromos.sale} data={saleData} controls="arrows-plus" />
  </main>
}
