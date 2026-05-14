// Unsplash photo URLs for menu items, lifted from
// design_handoff_intelligent_bistro/ui_kits/mobile/data.js.
//
// We keep this on the frontend instead of extending the backend's MenuItem
// shape so the existing Zod schema stays untouched. Components look photos
// up by item id; if a key is missing, components fall back to the emoji tile.
//
// Query params: `auto=format` lets Unsplash serve WebP where supported; `q=80`
// is a good quality/size tradeoff at 480 × 480. Keep the size at 480 even
// though tiles render smaller — looks crisp on retina without being heavy.

const params = "w=480&h=480&fit=crop&auto=format&q=80";
const base = "https://images.unsplash.com";

/**
 * Exactly 12 entries — one per canonical menu item. If you add or remove an
 * item in apps/backend/src/data/menu.ts, update this map in lockstep.
 */
export const FOOD_IMAGES: Record<string, string> = {
  spicy_chicken_sandwich: `${base}/photo-1606755962773-d324e0a13086?${params}`,
  classic_bistro_burger: `${base}/photo-1568901346375-23c9450c58cd?${params}`,
  crispy_chicken_club: `${base}/photo-1521305916504-4a1121188589?${params}`,
  green_goddess_bowl: `${base}/photo-1512621776951-a57141f2eefd?${params}`,
  teriyaki_chicken_bowl: `${base}/photo-1546069901-ba9599a7e63c?${params}`,
  salmon_poke_bowl: `${base}/photo-1563379091339-03b21ab4a4f8?${params}`,
  truffle_fries: `${base}/photo-1573080496219-bb080dd4f877?${params}`,
  side_salad: `${base}/photo-1551248429-40975aa4de74?${params}`,
  large_water: `${base}/photo-1523362628745-0c100150b504?${params}`,
  sparkling_lemonade: `${base}/photo-1621263764928-df1444c5e859?${params}`,
  chocolate_lava_cake: `${base}/photo-1624353365286-3f8d62daad51?${params}`,
  seasonal_sorbet: `${base}/photo-1501443762994-82bd5dace89a?${params}`,
};

export const photoFor = (itemId: string): string | undefined =>
  FOOD_IMAGES[itemId];
