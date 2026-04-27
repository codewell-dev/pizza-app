// Centralized type definitions - single source of truth

export interface ProductImage {
  large: string;
  medium: string;
  small: string;
}

export interface Modifier {
  _id: string;
  title: string;
  price: number;
  weight?: string;
  count?: number;
  is_active?: boolean;
}

export interface GroupModifier {
  _id: string;
  title: string;
  type: "select_one" | "select_many" | "multiple";
  modifiers: Modifier[];
  min_quantity?: number;
  max_quantity?: number;
}

export interface Product {
  _id: string;
  id?: string;
  price: number;
  weight: string;
  analytics_title: string;
  unit: string;
  analytics_category_title: string;
  title: string;
  description: string;
  promotion_text: string;
  url: string;
  route: string;
  open_graph: string;
  count?: number;
  cartItemId: string;
  modifiers: Modifier[];
  group_modifiers?: GroupModifier[];
  well_together_products?: RelatedProduct[];
  image: ProductImage;
  tags: string[];
  options: boolean;
}

export interface RelatedProduct {
  id: string;
  _id?: string;
  title: string;
  image: ProductImage;
  price: number;
  url: string;
}

export interface Category {
  _id: number | string;
  title: string;
  url: string;
  image: string;
}

export interface Pizza {
  _id: string;
  title: string;
  image: ProductImage;
  products: Product[];
}
