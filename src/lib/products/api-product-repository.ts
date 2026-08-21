import type { Product } from "@/types/product.types";
import type { CategoryNode, Pagination, ProductListing, ProductRepository, ProductSection, ProductSort } from "./product-repository";

type ApiImage = {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
};

type ApiProduct = {
  id: number;
  title: string;
  priceYen: number;
  compareAtPriceYen?: number | null;
  badge?: Product["badge"];
  shortDescription?: string | null;
  description?: string | null;
  material?: string | null;
  ratingAverage?: number;
  category?: { name: string } | null;
  images?: ApiImage[];
};

const apiUrl = (process.env.ECOMMERCE_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100/api")
  .replace(/\/$/, "");

export const toProduct = (item: ApiProduct): Product => {
  const images = [...(item.images || [])].sort(
    (left, right) => Number(right.isPrimary) - Number(left.isPrimary) || left.sortOrder - right.sortOrder,
  );
  return {
    id: Number(item.id),
    title: item.title,
    price: Number(item.priceYen) / 1000,
    category: item.category?.name,
    badge: item.badge,
    description: item.shortDescription || item.description || undefined,
    material: item.material || undefined,
    srcUrl: images[0]?.url || "/images/atelier/jewelry-collection.png",
    gallery: images.map((image) => image.url),
    rating: Number(item.ratingAverage || 0),
    discount: { amount: 0, percentage: 0 },
    objectPosition: "center",
  };
};

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${apiUrl}${path}`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`Ecommerce API returned ${response.status} for ${path}`);
  return response.json() as Promise<T>;
};

export const apiProductRepository: ProductRepository = {
  async getAll() {
    const data = await getJson<{ products: ApiProduct[] }>("/products");
    return data.products.map(toProduct);
  },
  async getById(id) {
    const response = await fetch(`${apiUrl}/products/${id}`, { next: { revalidate: 60 } });
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`Ecommerce API returned ${response.status} for product ${id}`);
    const data = (await response.json()) as { product: ApiProduct };
    return toProduct(data.product);
  },
  async getBySection(section: ProductSection) {
    const data = await getJson<{ products: ApiProduct[] }>(`/collections/${section}/products`);
    return data.products.map(toProduct);
  },
};

type ListingOptions = { page?: number; pageSize?: number; sort?: ProductSort };
const listingQuery = ({ page = 1, pageSize = 12, sort = "newest" }: ListingOptions) =>
  new URLSearchParams({ page: String(page), pageSize: String(pageSize), sort }).toString();

export async function getApiCategoryTree(): Promise<CategoryNode[]> {
  const data = await getJson<{ categories: CategoryNode[] }>("/categories/tree");
  return data.categories;
}

export async function getApiCategoryListing(slug: string, options: ListingOptions = {}): Promise<ProductListing | null> {
  const response = await fetch(`${apiUrl}/categories/${encodeURIComponent(slug)}/products?${listingQuery(options)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Ecommerce API returned ${response.status} for category ${slug}`);
  const data = await response.json() as {
    category: { name: string; slug: string };
    breadcrumbs: Array<{ name: string; slug: string }>;
    products: ApiProduct[];
    pagination: Pagination;
  };
  return { title: data.category.name, slug: data.category.slug, breadcrumbs: data.breadcrumbs, products: data.products.map(toProduct), pagination: data.pagination };
}

export async function getApiCollectionListing(slug: ProductSection, options: ListingOptions = {}): Promise<ProductListing | null> {
  const response = await fetch(`${apiUrl}/collections/${slug}/products?${listingQuery(options)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Ecommerce API returned ${response.status} for collection ${slug}`);
  const data = await response.json() as { collection: { name: string; slug: string }; products: ApiProduct[]; pagination: Pagination };
  return { title: data.collection.name, slug, breadcrumbs: [], products: data.products.map(toProduct), pagination: data.pagination };
}
