import { MENU } from "../data/menu";
import { MenuItem } from "../types/cart";

export const getMenu = (): MenuItem[] => MENU;

export const findMenuItemById = (id: string): MenuItem | undefined =>
  MENU.find((m) => m.id === id);

export const findMenuItemsByTag = (tag: string): MenuItem[] =>
  MENU.filter((m) => m.tags.includes(tag as any));
