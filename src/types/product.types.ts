export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  category?: string;
  badge?: "NEW" | "POPULAR" | "RECOMMENDED" | "HIT" | "SALE";
  description?: string;
  material?: string;
  objectPosition?: string;
};
