import { createStore } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CartSlice, createCartSlice } from "./cartSlice";
import { AuthSlice, createAuthSlice } from "./authSlice";

type MyStore = CartSlice & AuthSlice;

export const createShopStore = () =>
  createStore<MyStore>()(
    immer(
      devtools(
        persist(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (set, get, api) => ({
            ...createCartSlice(set as any, get, api as any),
            ...createAuthSlice(set as any, get, api as any),
          }),
          {
            name: "shop-storage",
            partialize: (state) => ({
              cart: state.cart,
              totalCount: state.totalCount,
              totalPrice: state.totalPrice,
              token: state.token,
              user: state.user,
              isAuthenticated: state.isAuthenticated,
            }),
          }
        )
      )
    )
  );
