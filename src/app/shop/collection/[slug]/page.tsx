import { notFound } from "next/navigation";
import CatalogListingPage from "@/components/shop-page/CatalogListingPage";
import { getCollectionListing } from "@/lib/products/catalog";
import type { ProductSection, ProductSort } from "@/lib/products/product-repository";

const labels: Record<ProductSection, string> = { hit: "ヒット商品", recommended: "おすすめ商品", new: "新着商品", popular: "人気商品", sale: "割引商品" };
export const dynamic = "force-dynamic";
export default async function CollectionPage({ params, searchParams }: { params: { slug: ProductSection }; searchParams: { page?: string; sort?: ProductSort } }) {
  if (!(params.slug in labels)) notFound();
  const sort = searchParams.sort || "newest";
  const listing = await getCollectionListing(params.slug, { page: Number(searchParams.page) || 1, pageSize: 8, sort });
  if (!listing) notFound();
  listing.title = labels[params.slug];
  return <CatalogListingPage listing={listing} basePath={`/shop/collection/${params.slug}`} sort={sort} />;
}
