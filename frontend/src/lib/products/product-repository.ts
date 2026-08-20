import type { Product } from "@/types/product.types";

export type ProductSection = "hit" | "recommended" | "new" | "popular" | "sale";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | undefined>;
  getBySection(section: ProductSection): Promise<Product[]>;
}
