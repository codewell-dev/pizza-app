/**
 * Unit tests for cartSlice logic.
 *
 * We test the business logic functions directly (no Zustand store needed).
 * This keeps tests fast and pure.
 */

import type { Product, Modifier } from "@/types/product";

// ── Helpers extracted from cartSlice (duplicate to test in isolation) ─────────

const isSameModifiers = (a: Modifier[] = [], b: Modifier[] = []): boolean => {
  if (a.length !== b.length) return false;
  const normalize = (mods: Modifier[]) =>
    mods.map((m) => `${m._id}:${m.count ?? 1}`).sort().join("|");
  return normalize(a) === normalize(b);
};

const getModifiersPrice = (modifiers: Modifier[] = []): number =>
  modifiers.reduce(
    (sum, mod) => sum + Number(mod.price ?? 0) * (mod.count ?? 1),
    0
  );

// ── Fixtures ─────────────────────────────────────────────────────────────────

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  ({
    _id: "prod-1",
    title: "Піца Карбонара 30см",
    price: 250,
    weight: "450",
    description: "Опис",
    unit: "г",
    image: { large: "/large.jpg", medium: "/medium.jpg", small: "/small.jpg" },
    category_id: "cat-1",
    group_modifiers: [],
    well_together_products: [],
    group: [],
    is_active: 1,
    ...overrides,
  } as unknown as Product);

const makeModifier = (overrides: Partial<Modifier> = {}): Modifier =>
  ({
    _id: "mod-1",
    title: "Сир Моцарела",
    price: 30,
    count: 1,
    ...overrides,
  } as unknown as Modifier);

// ── isSameModifiers ───────────────────────────────────────────────────────────

describe("isSameModifiers", () => {
  it("returns true for two empty arrays", () => {
    expect(isSameModifiers([], [])).toBe(true);
  });

  it("returns true for identical single modifier", () => {
    const m = makeModifier();
    expect(isSameModifiers([m], [m])).toBe(true);
  });

  it("returns false when one array is longer", () => {
    const m1 = makeModifier({ _id: "mod-1" });
    const m2 = makeModifier({ _id: "mod-2" });
    expect(isSameModifiers([m1], [m1, m2])).toBe(false);
  });

  it("returns true regardless of modifier order", () => {
    const m1 = makeModifier({ _id: "mod-1" });
    const m2 = makeModifier({ _id: "mod-2" });
    expect(isSameModifiers([m1, m2], [m2, m1])).toBe(true);
  });

  it("returns false when counts differ", () => {
    const m1 = makeModifier({ _id: "mod-1", count: 1 });
    const m2 = makeModifier({ _id: "mod-1", count: 2 });
    expect(isSameModifiers([m1], [m2])).toBe(false);
  });
});

// ── getModifiersPrice ─────────────────────────────────────────────────────────

describe("getModifiersPrice", () => {
  it("returns 0 for empty array", () => {
    expect(getModifiersPrice([])).toBe(0);
  });

  it("sums single modifier price", () => {
    expect(getModifiersPrice([makeModifier({ price: 30, count: 1 })])).toBe(30);
  });

  it("multiplies price by count", () => {
    expect(getModifiersPrice([makeModifier({ price: 30, count: 3 })])).toBe(90);
  });

  it("sums multiple modifiers correctly", () => {
    const mods = [
      makeModifier({ _id: "m1", price: 30, count: 2 }), // 60
      makeModifier({ _id: "m2", price: 15, count: 1 }), // 15
    ];
    expect(getModifiersPrice(mods)).toBe(75);
  });

  it("treats missing count as 1", () => {
    const mod = { ...makeModifier({ price: 25 }) };
    delete (mod as Partial<Modifier>).count;
    expect(getModifiersPrice([mod])).toBe(25);
  });
});

// ── Unit price calculation ────────────────────────────────────────────────────

describe("unit price calculation (base + modifiers)", () => {
  it("equals base price with no modifiers", () => {
    const product = makeProduct({ price: 250 });
    const unitPrice = Number(product.price) + getModifiersPrice([]);
    expect(unitPrice).toBe(250);
  });

  it("adds modifier cost to base price", () => {
    const product = makeProduct({ price: 250 });
    const mods = [makeModifier({ price: 30, count: 2 })]; // +60
    const unitPrice = Number(product.price) + getModifiersPrice(mods);
    expect(unitPrice).toBe(310);
  });
});

// ── Total recalculation ───────────────────────────────────────────────────────

describe("cart totals recalculation", () => {
  const recalcTotals = (
    cart: Array<{ price: number; count: number }>
  ) => ({
    totalCount: cart.reduce((acc, item) => acc + item.count, 0),
    totalPrice: cart.reduce((acc, item) => acc + item.price * item.count, 0),
  });

  it("returns zeros for empty cart", () => {
    expect(recalcTotals([])).toEqual({ totalCount: 0, totalPrice: 0 });
  });

  it("calculates single item correctly", () => {
    expect(recalcTotals([{ price: 250, count: 2 }])).toEqual({
      totalCount: 2,
      totalPrice: 500,
    });
  });

  it("aggregates multiple items", () => {
    const cart = [
      { price: 250, count: 1 }, // 250
      { price: 180, count: 2 }, // 360
      { price: 90, count: 3 },  // 270
    ];
    expect(recalcTotals(cart)).toEqual({ totalCount: 6, totalPrice: 880 });
  });
});
