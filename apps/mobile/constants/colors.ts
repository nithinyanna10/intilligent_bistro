// Production-polish palette (README — design_handoff_intelligent_bistro).
// Mirrors the values in tailwind.config.js so both className and inline-style
// consumers stay in sync.

export const colors = {
  bg: "#08080A",
  card: "#16161A",
  elevated: "#1B1B20",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.14)",
  edge: "rgba(255,255,255,0.04)",

  text1: "#EDEDF0",
  text2: "#9A9AA3",
  text3: "#5C5C65",

  accent: "#FF6A1A",
  accentHi: "#FF7A2E",

  ai: "#A39CFF",
  ai20: "rgba(163,156,255,0.20)",
  ai40: "rgba(163,156,255,0.40)",
  ai60: "rgba(163,156,255,0.60)",
  aiGlow: "rgba(163,156,255,0.18)",

  success: "#3DD68C",
  successBg: "rgba(61,214,140,0.10)",
  successBorder: "rgba(61,214,140,0.25)",

  danger: "#E5484D",

  userBubble: "#FF6A1A",
} as const;

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "bowls", label: "Bowls" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const GRADIENTS = {
  accentCta: ["#FF7A2E", "#FF6A1A"] as const, // 180° — only on Place order
  card: ["#1E1E22", "#131316"] as const, // graphite — featured tile, AI callout
  emojiWell: ["#2E2E32", "#18181B"] as const, // emoji / photo tile background
  bottomFade: ["transparent", "#08080A"] as const,
  ambientAi: ["transparent", "rgba(163,156,255,0.18)"] as const,
} as const;

export const TAG_PRIORITY = ["spicy", "vegan", "popular"] as const;
