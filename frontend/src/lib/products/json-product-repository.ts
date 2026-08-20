import catalog from "@/data/products.json";
import type { Product } from "@/types/product.types";
import type { ProductRepository, ProductSection } from "./product-repository";

type CatalogProduct = (typeof catalog.products)[number];

const toProduct = (item: CatalogProduct): Product => ({
  id: item.id,
  title: item.title,
  price: item.price,
  category: item.category,
  badge: item.badge as Product["badge"],
  description: item.description,
  material: item.material,
  srcUrl: item.image,
  gallery: item.gallery,
  rating: 0,
  discount: { amount: 0, percentage: 0 },
  objectPosition: "center",
});

const products = catalog.products.map(toProduct);
const productsById = new Map(products.map((product) => [product.id, product]));

export const jsonProductRepository: ProductRepository = {
  async getAll() {
    return products;
  },
  async getById(id) {
    return productsById.get(id);
  },
  async getBySection(section: ProductSection) {
    return catalog.sections[section]
      .map((id) => productsById.get(id))
      .filter((product): product is Product => Boolean(product));
  },
};
