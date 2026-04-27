import "server-only";
import { config } from "@/app/config";
import { Product, Category, Pizza } from "@/types/product";

// All server-side fetches go through here
async function apiFetch<T>(
  path: string,
  revalidate = 60,
  token?: string
): Promise<T> {
  const url = `${config.url}/api${path}`;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    next: { revalidate },
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${path}`);
  }

  return res.json() as Promise<T>;
}

// ── Public endpoints ──────────────────────────────────────────────────────────

export async function getPizzas(): Promise<Pizza[]> {
  // API returns paginated result { data, total, page, ... }
  // We fetch all at once (limit=200) for the catalog page — add infinite scroll later
  const result = await apiFetch<{ data: Pizza[] }>("/products/grouped?limit=200", 60);
  return result.data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", 3600);
}

export async function getPizzaById(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, 300);
}

export async function getCategoryById(
  id: string
): Promise<{ category_products: Product[] }> {
  // Category now returns the category object directly (no pageProps wrapper)
  return apiFetch(`/categories/${id}`, 300);
}
