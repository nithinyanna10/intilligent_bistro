export type MenuCategory =
  | "sandwiches"
  | "bowls"
  | "sides"
  | "drinks"
  | "desserts";

export type MenuTag = "popular" | "spicy" | "vegan";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: MenuCategory;
  tags: MenuTag[];
  description: string;
}
