import { CartItem } from "../types/cart";
import { ParseOrderResponse } from "../types/ai";
import { MenuItem } from "../types/menu";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      // ignore
    }
    throw new Error(`API ${res.status} ${res.statusText} ${detail}`);
  }

  return (await res.json()) as T;
}

export const api = {
  health: () => request<{ status: string }>("/health"),

  getMenu: () => request<{ items: MenuItem[] }>("/menu"),

  parseOrder: (message: string, cart: CartItem[]) =>
    request<ParseOrderResponse>("/ai/parse-order", {
      method: "POST",
      body: JSON.stringify({ message, cart }),
    }),
};

export const apiBaseUrl = BASE_URL;
