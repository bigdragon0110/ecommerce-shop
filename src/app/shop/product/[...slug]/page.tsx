import PurchaseControls from "@/components/product-page/PurchaseControls";
import ProductZoomGallery from "@/components/product-page/ProductZoomGallery";
import SafeProductImage from "@/components/common/SafeProductImage";
import { getProductById } from "@/lib/products/catalog";
import type { Product } from "@/types/product.types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { uiLabels } from "@/data/ui-labels";

function DetailImage({ product, position, height = "h-[520px]" }: { product: Product; position: string; height?: string }) {
  return <div className={`overflow-hidden ${height}`}><SafeProductImage src={product.srcUrl} alt={product.title} className="h-full w-full object-cover" style={{ objectPosition: position }}/></div>;
}

export default async function ProductPage({ params }: { params: { slug: string[] } }) {
  const product = await getProductById(Number(params.slug[0]));
  if (!product) notFound();
  const price = Math.round(product.price * 1000).toLocaleString();

  return <main className="product-detail-page bg-white pb-16 text-[#171717] dark:bg-[#0b1016] dark:text-[#cdd0d3]">
    <div className="border-b border-[#dedede] dark:border-[#303842] pt-[50px]">
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-4 text-base font-bold">● {product.category || "Gold Jewelry"}</div>
    </div>

    <div className="max-w-frame mx-auto px-4 xl:px-0">
      <div className="py-5 text-xs text-[#777] dark:text-[#92979c]"><Link href="/shop">Shop Main</Link><span className="mx-3">›</span><span className="text-[#b40000]">{product.title}</span></div>

      <section className="grid gap-8 border-t border-[#e1e1e1] dark:border-[#303842] pt-6 md:grid-cols-[430px_1fr]">
        <ProductZoomGallery product={product}/>

        <div>
          <h1 className="border-b border-[#dedede] dark:border-[#343b43] pb-3 text-xl font-bold">{product.title}: Summary Information and Purchase</h1>
          <p className="py-3 text-xs leading-relaxed text-[#858585]">[Ring] Women&apos;s standard size 12 | Men&apos;s standard size 19 | [Necklace] Women&apos;s standard length 42cm | Men&apos;s standard length 50cm | Bracelet 17.5cm</p>
          <dl className="grid grid-cols-[170px_1fr] gap-y-3 border-t border-[#dedede] dark:border-[#343b43] py-4 text-xs">
            <dt>Selling price</dt><dd className="font-bold text-[#c40000]">{price} yen</dd>
            <dt>point</dt><dd>000</dd>
            <dt>Shipping fee payment</dt><dd>Payment at the time of order</dd>
            <dt>Manufacturer</dt><dd>{uiLabels.brand}</dd>
            <dt>Origin</dt><dd>Republic of Korea</dd>
            <dt>Model</dt><dd>GBS_{product.id}-7-5</dd>
          </dl>
          <PurchaseControls product={product}/>
        </div>
      </section>

      <section className="my-7 grid min-h-[125px] place-items-center border border-[#c7c7c7] dark:border-[#343c45]"><div className="text-center"><h2 className="font-bold">Related Products</h2><p className="mt-7 text-xs text-[#888]">● No products have been registered.</p></div></section>

      <div className="grid grid-cols-3 text-center text-xs">
        <div className="border border-b-0 border-[#bbb] dark:border-[#3c444d] bg-white dark:bg-[#151b22] py-3 font-bold">Product Information</div>
        <div className="border-b border-[#bbb] dark:border-[#3c444d] py-3 text-[#aaa]">0 user reviews</div>
        <div className="border-b border-[#bbb] dark:border-[#3c444d] py-3 text-[#aaa]">Product inquiries : 0</div>
      </div>
      <p className="bg-[#f0f0f0] dark:bg-[#272c31] p-4 text-xs">[Ring] Women&apos;s standard size 12 | Men&apos;s standard size 19 [Necklace] Women&apos;s standard length 42cm | Men&apos;s standard length 50cm [Bracelet] Women&apos;s standard length 17.5cm</p>
    </div>

    <article className="mx-auto mt-5 max-w-[760px] bg-[#f3f1ee] text-[#202020] dark:bg-[#d9d9d9]">
      <DetailImage product={product} position="10% 82%" height="h-[600px]"/>
      <section className="px-10 py-20 text-center md:px-20">
        <p className="text-xs tracking-[.3em] text-[#a98a27]">PRECIOUS MATERIAL</p>
        <h2 className="mt-5 font-serif text-4xl">{product.title}</h2>
        <p className="mt-8 text-sm leading-8">A refined piece with balanced proportions and a quiet brilliance. Designed to feel distinctive, tactile, and effortless in everyday wear.</p>
      </section>
      <div className="px-8 md:px-16"><DetailImage product={product} position="8% 18%" height="h-[520px]"/></div>
      <section className="px-10 py-16 text-center"><span className="inline-block h-4 w-4 rounded-full bg-[#c8a41e]"/><p className="mt-2 text-sm">18k recycled gold</p></section>
      <div className="px-8 pb-14 md:px-16"><DetailImage product={product} position="55% 20%" height="h-[560px]"/></div>
      <section className="mx-10 mb-14 bg-[#e5e1dc] px-8 py-10 text-center md:mx-20"><b className="font-serif text-xl text-[#8e2c36]">Point. 01</b><h3 className="mt-4 text-xl">Considered proportions</h3><p className="mt-4 text-sm leading-7">Sculptural surfaces and thoughtful details create a piece that remains expressive from every angle.</p></section>
      <DetailImage product={product} position="88% 20%" height="h-[620px]"/>
      <section className="px-10 py-20 text-center md:px-24"><h3 className="font-serif text-3xl">Made to last</h3><p className="mt-5 text-sm leading-7">Polished by hand and finished for lasting brilliance, with complimentary guidance for lifelong care.</p></section>
      <div className="px-8 pb-16 md:px-20"><DetailImage product={product} position="30% 80%" height="h-[480px]"/></div>
    </article>

    <section className="mx-auto max-w-[760px] px-5 py-20 text-sm leading-7 dark:text-[#bdc1c5]">
      <h2 className="text-xl font-bold">Before ordering</h2><p className="mt-3">• Precious metals may show subtle variations that make every piece unique.<br/>• Product color may vary slightly by display and lighting.<br/>• Please confirm sizing before completing your order.</p>
      <h2 className="mt-10 text-xl font-bold">Order / Delivery</h2><p className="mt-3">• Orders are prepared carefully and shipped with tracking.<br/>• Delivery timing may vary by destination and product availability.</p>
      <h2 className="mt-10 text-xl font-bold">Returns and exchanges</h2><p className="mt-3">• Contact customer support promptly if your item arrives damaged.<br/>• Customized and worn products may not be eligible for return.</p>
      <h2 className="mt-10 text-xl font-bold">Care and warranty</h2><p className="mt-3">• Store separately in a dry case and clean gently with a soft cloth.<br/>• Avoid chemicals, excessive moisture, and strong impact.</p>
    </section>
  </main>;
}
