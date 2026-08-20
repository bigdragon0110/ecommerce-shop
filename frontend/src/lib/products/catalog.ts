import { jsonProductRepository } from "./json-product-repository";
import type { ProductRepository, ProductSection } from "./product-repository";

// Replace this assignment with an API-backed repository when the backend is ready.
const repository: ProductRepository = jsonProductRepository;

export const getAllProducts = () => repository.getAll();
export const getProductById = (id: number) => repository.getById(id);
export const getProductsBySection = (section: ProductSection) =>
  repository.getBySection(section);

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
