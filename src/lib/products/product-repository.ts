import type { Product } from "@/types/product.types";

export type ProductSection = "hit" | "recommended" | "new" | "popular" | "sale";
export type ProductSort = "newest" | "best-selling" | "price-asc" | "price-desc" | "rating" | "reviews";
export type Pagination = { page: number; pageSize: number; total: number; pageCount: number };
export type CategoryNode = {
  id: number; sourceCategoryId?: number | null; parentId?: number | null; name: string; slug: string;
  children: CategoryNode[];
};
export type ProductListing = {
  title: string;
  slug: string;
  products: Product[];
  pagination: Pagination;
  breadcrumbs: Array<{ name: string; slug: string }>;
};

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | undefined>;
  getBySection(section: ProductSection): Promise<Product[]>;
}
