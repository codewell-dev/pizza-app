import { StateCreator } from "zustand";
import { Product, Modifier } from "@/types/product";

type MyStore = CartSlice;

export interface ProductWithCartId extends Product {
  cartItemId: string;
  count: number;
  modifiers: Modifier[];
  /** Per-unit price (base + modifiers). Multiply by count for line total. */
  price: number;
  /** Base price without modifiers — stored for recalculation when modifiers change */
  basePrice?: number;
}

export interface CartSlice {
  cart: ProductWithCartId[];
  totalCount: number;
  totalPrice: number;

  modifiers: Modifier[];
  addModifier: (modifier: Modifier) => void;
  removeModifier: (id: string) => void;
  clearModifiers: () => void;

  addProductToCart: (product: Product, cartItemId?: string) => void;
  removeProductFromCart: (cartItemId: string) => void;
  /** Remove a specific modifier from a cart item and recalculate its price */
  removeModifierFromCartItem: (cartItemId: string, modifierId: string) => void;
  clearCart: () => void;
}

const isSameModifiers = (a: Modifier[] = [], b: Modifier[] = []): boolean => {
  if (a.length !== b.length) return false;
  const normalize = (mods: Modifier[]) =>
    mods.map((m) => `${m._id}:${m.count ?? 1}`).sort().join("|");
  return normalize(a) === normalize(b);
};

const getModifiersPrice = (modifiers: Modifier[] = []): number =>
  modifiers.reduce((sum, mod) => sum + Number(mod.price ?? 0) * (mod.count ?? 1), 0);

const recalcTotals = (cart: ProductWithCartId[]) => ({
  totalCount: cart.reduce((acc, item) => acc + (item.count ?? 1), 0),
  totalPrice: cart.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.count ?? 1),
    0
  ),
});

export const createCartSlice: StateCreator<
  MyStore,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  CartSlice
> = (set) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,
  modifiers: [],

  addModifier: (modifier) =>
    set(
      (state) => {
        const existing = state.modifiers.find((m) => m._id === modifier._id);
        if (existing) {
          existing.count = (existing.count ?? 1) + 1;
        } else {
          state.modifiers.push({ ...modifier, count: 1 });
        }
      },
      false,
      "cart/addModifier"
    ),

  removeModifier: (id) =>
    set(
      (state) => {
        const index = state.modifiers.findIndex((m) => m._id === id);
        if (index === -1) return;
        const item = state.modifiers[index];
        if ((item.count ?? 1) > 1) {
          item.count!--;
        } else {
          state.modifiers.splice(index, 1);
        }
      },
      false,
      "cart/removeModifier"
    ),

  clearModifiers: () =>
    set((state) => { state.modifiers = []; }, false, "cart/clearModifiers"),

  addProductToCart: (product) =>
    set(
      (state) => {
        const currentModifiers: Modifier[] = JSON.parse(
          JSON.stringify(state.modifiers)
        );
        const basePrice = Number(product.price ?? 0);
        const unitPrice = basePrice + getModifiersPrice(currentModifiers);

        const cartItemId = (product as ProductWithCartId).cartItemId;

        if (cartItemId) {
          // Increment existing item (called from cart quantity controls)
          const existing = state.cart.find((i) => i.cartItemId === cartItemId);
          if (existing) {
            existing.count++;
          }
        } else {
          // Add new or merge with identical existing
          const existing = state.cart.find(
            (item) =>
              item._id === product._id &&
              isSameModifiers(item.modifiers, currentModifiers)
          );

          if (existing) {
            existing.count++;
          } else {
            state.cart.push({
              ...product,
              cartItemId: crypto.randomUUID(),
              count: 1,
              modifiers: currentModifiers,
              price: unitPrice,
              basePrice,
            });
          }
        }

        state.modifiers = [];
        const totals = recalcTotals(state.cart);
        state.totalCount = totals.totalCount;
        state.totalPrice = totals.totalPrice;
      },
      false,
      "cart/addProduct"
    ),

  removeProductFromCart: (cartItemId) =>
    set(
      (state) => {
        const item = state.cart.find((i) => i.cartItemId === cartItemId);
        if (!item) return;

        if ((item.count ?? 1) > 1) {
          item.count!--;
        } else {
          state.cart = state.cart.filter((i) => i.cartItemId !== cartItemId);
        }

        const totals = recalcTotals(state.cart);
        state.totalCount = totals.totalCount;
        state.totalPrice = totals.totalPrice;
      },
      false,
      "cart/removeProduct"
    ),

  removeModifierFromCartItem: (cartItemId, modifierId) =>
    set(
      (state) => {
        const item = state.cart.find((i) => i.cartItemId === cartItemId);
        if (!item) return;

        // Remove the modifier from the item's modifier list
        item.modifiers = item.modifiers.filter((m) => m._id !== modifierId);

        // Recalculate unit price: basePrice + remaining modifiers
        const base = item.basePrice ?? Number(item.price ?? 0);
        item.price = base + getModifiersPrice(item.modifiers);

        const totals = recalcTotals(state.cart);
        state.totalCount = totals.totalCount;
        state.totalPrice = totals.totalPrice;
      },
      false,
      "cart/removeModifierFromCartItem"
    ),

  clearCart: () =>
    set(
      (state) => {
        state.cart = [];
        state.totalCount = 0;
        state.totalPrice = 0;
        state.modifiers = [];
      },
      false,
      "cart/clearCart"
    ),
});
