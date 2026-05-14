import { create } from "zustand";
import { MenuItem } from "../types/menu";
import { api } from "../lib/api";

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  loadMenu: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loadMenu: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await api.getMenu();
      set({ items: data.items, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load menu",
      });
    }
  },
}));
