import { apiProductRepository } from "./api-product-repository";
import { jsonProductRepository } from "./json-product-repository";
import type { ProductRepository, ProductSection } from "./product-repository";

const useApi = process.env.PRODUCT_SOURCE === "api" || process.env.NEXT_PUBLIC_PRODUCT_SOURCE === "api";
const primaryRepository: ProductRepository = useApi ? apiProductRepository : jsonProductRepository;

const withJsonFallback = async <T>(apiCall: () => Promise<T>, jsonCall: () => Promise<T>) => {
  try {
    return await apiCall();
  } catch (error) {
    if (!useApi) throw error;
    console.warn("Product API unavailable; using the local JSON catalog.", error);
    return jsonCall();
  }
};

export const getAllProducts = () =>
  withJsonFallback(() => primaryRepository.getAll(), () => jsonProductRepository.getAll());
export const getProductById = (id: number) =>
  withJsonFallback(() => primaryRepository.getById(id), () => jsonProductRepository.getById(id));
export const getProductsBySection = (section: ProductSection) =>
  withJsonFallback(
    () => primaryRepository.getBySection(section),
    () => jsonProductRepository.getBySection(section),
  );

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
