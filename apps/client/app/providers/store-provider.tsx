"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createShopStore } from "../stores/shop-store";
import { CartSlice } from "../stores/cartSlice";
import { AuthSlice } from "../stores/authSlice";

export type ShopStore = CartSlice & AuthSlice;
export type ShopStoreApi = ReturnType<typeof createShopStore>;

export const ShopStoreContext = createContext<ShopStoreApi | undefined>(undefined);

export function ShopStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ShopStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createShopStore();
  }

  return (
    <ShopStoreContext.Provider value={storeRef.current}>
      {children}
    </ShopStoreContext.Provider>
  );
}

export function useShopStore<T>(selector: (store: ShopStore) => T): T {
  const ctx = useContext(ShopStoreContext);
  if (!ctx) throw new Error("useShopStore must be used within ShopStoreProvider");
  return useStore(ctx, selector);
}
