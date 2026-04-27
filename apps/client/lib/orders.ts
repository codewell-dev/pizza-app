import { config } from "@/app/config";
import { ProductWithCartId } from "@/app/stores/cartSlice";

const BASE_URL = `${config.url ?? ""}/api`;

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "done"
  | "cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  count: number;
  weight?: string;
  imageLarge?: string;
  modifiers: { _id: string; title: string; price: number; count: number }[];
}

export interface Order {
  _id: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  deliveryType: "delivery" | "pickup";
  paymentMethod: "cash" | "card" | "online";
  customerName: string;
  customerPhone: string;
  address?: { street: string; house: string; apartment?: string };
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  pages: number;
}

// Map cart items → OrderItem DTOs
export function cartToOrderItems(cart: ProductWithCartId[]): OrderItem[] {
  return cart.map((item) => ({
    productId: item._id,
    title: item.title,
    price: item.price,
    count: item.count ?? 1,
    weight: item.weight,
    imageLarge: item.image?.large,
    modifiers: (item.modifiers ?? []).map((m) => ({
      _id: m._id,
      title: m.title,
      price: m.price,
      count: m.count ?? 1,
    })),
  }));
}

export async function createOrder(
  token: string,
  body: {
    items: OrderItem[];
    totalPrice: number;
    deliveryType: string;
    paymentMethod: string;
    customerName: string;
    customerPhone: string;
    address?: { street: string; house: string; apartment?: string };
    comment?: string;
  }
): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to create order");
  }
  return res.json();
}

export async function getMyOrders(
  token: string,
  page = 1,
  limit = 10
): Promise<OrdersResponse> {
  const res = await fetch(
    `${BASE_URL}/orders/my?page=${page}&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getOrderById(
  token: string,
  id: string
): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders/my/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}
