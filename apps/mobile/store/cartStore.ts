import { create } from "zustand";
import { CartItem } from "../types/cart";
import { MenuItem } from "../types/menu";
import { CartAction } from "../types/ai";

const TAX_RATE = 0.0825;

interface CartState {
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    quantity?: number,
    modifiers?: string[]
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateModifiers: (itemId: string, modifiers: string[]) => void;
  clearCart: () => void;
  totalCount: () => number;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  applyActions: (actions: CartAction[], menu: MenuItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (menuItem, quantity = 1, modifiers) =>
    set((state) => {
      const existing = state.items.find((i) => i.itemId === menuItem.id);
      if (existing && !modifiers?.length) {
        return {
          items: state.items.map((i) =>
            i.itemId === menuItem.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            itemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity,
            modifiers: modifiers && modifiers.length ? modifiers : undefined,
          },
        ],
      };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.itemId !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.itemId !== itemId) };
      }
      return {
        items: state.items.map((i) =>
          i.itemId === itemId ? { ...i, quantity } : i
        ),
      };
    }),

  updateModifiers: (itemId, modifiers) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.itemId === itemId
          ? { ...i, modifiers: modifiers.length ? modifiers : undefined }
          : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  calculateSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  calculateTax: () => Number((get().calculateSubtotal() * TAX_RATE).toFixed(2)),

  calculateTotal: () =>
    Number((get().calculateSubtotal() + get().calculateTax()).toFixed(2)),

  applyActions: (actions, menu) => {
    for (const action of actions) {
      switch (action.type) {
        case "ADD_ITEM": {
          const menuItem = menu.find((m) => m.id === action.itemId);
          if (menuItem) {
            get().addItem(menuItem, action.quantity, action.modifiers);
          }
          break;
        }
        case "REMOVE_ITEM":
          get().removeItem(action.itemId);
          break;
        case "UPDATE_QUANTITY":
          get().updateQuantity(action.itemId, action.quantity);
          break;
        case "UPDATE_MODIFIER":
          get().updateModifiers(action.itemId, action.modifiers);
          break;
        case "CLEAR_CART":
          get().clearCart();
          break;
        // SHOW_CART / ASK_MENU_QUESTION / UNKNOWN: no cart mutation
        default:
          break;
      }
    }
  },
}));
