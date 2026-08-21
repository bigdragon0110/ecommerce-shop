import { notFound } from "next/navigation";
import CatalogListingPage from "@/components/shop-page/CatalogListingPage";
import { getCategoryListing } from "@/lib/products/catalog";
import type { ProductSort } from "@/lib/products/product-repository";

export const dynamic = "force-dynamic";
export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string; sort?: ProductSort } }) {
  const sort = searchParams.sort || "newest";
  const listing = await getCategoryListing(params.slug, { page: Number(searchParams.page) || 1, pageSize: 12, sort });
  if (!listing) notFound();
  return <CatalogListingPage listing={listing} basePath={`/shop/category/${params.slug}`} sort={sort} categoryLayout />;
}
