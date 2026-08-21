import { apiProductRepository } from "./api-product-repository";
import { jsonProductRepository } from "./json-product-repository";
import type { ProductRepository, ProductSection } from "./product-repository";
import { getApiCategoryListing, getApiCategoryTree, getApiCollectionListing } from "./api-product-repository";
import type { ProductSort } from "./product-repository";

const source = process.env.PRODUCT_SOURCE || process.env.NEXT_PUBLIC_PRODUCT_SOURCE || "api";
const useApi = source !== "json";
const primaryRepository: ProductRepository = useApi ? apiProductRepository : jsonProductRepository;

export const getAllProducts = () =>
  primaryRepository.getAll();
export const getProductById = (id: number) =>
  primaryRepository.getById(id);
export const getProductsBySection = (section: ProductSection) =>
  primaryRepository.getBySection(section);

export const getCategoryTree = () => getApiCategoryTree();
export const getCategoryListing = (slug: string, options: { page?: number; pageSize?: number; sort?: ProductSort }) =>
  getApiCategoryListing(slug, options);
export const getCollectionListing = (slug: ProductSection, options: { page?: number; pageSize?: number; sort?: ProductSort }) =>
  getApiCollectionListing(slug, options);

export async function getHomepageProducts() {
  const [hit, recommended, newProducts, popular, sale] = await Promise.all([
    getProductsBySection("hit"),
    getProductsBySection("recommended"),
    getProductsBySection("new"),
    getProductsBySection("popular"),
    getProductsBySection("sale"),
  ]);

  return { hit, recommended, newProducts, popular, sale };
}
