export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

export async function shopApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/backend/${path.replace(/^\//, "")}`, {
    ...init,
    headers: { "content-type": "application/json", ...init.headers },
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ message: "Invalid server response." }));
  if (!response.ok) throw new ApiError(data.message || `Request failed (${response.status}).`, response.status);
  return data as T;
}

export type Customer = { id:number;username:string;email:string;firstName?:string|null;lastName?:string|null;status:string };
export type BackendCartItem = { id:number;productId:number;variantId:number|null;quantity:number;unitPriceYen:number;title:string;slug:string;sku:string;imageUrl:string|null };
export type BackendCart = { id:number;items:BackendCartItem[];subtotalYen:number;totalQuantity:number };
export type WishlistProduct = { id:number;title:string;slug:string;priceYen:number;badge?:string;imageUrl:string|null;createdAt:string };
