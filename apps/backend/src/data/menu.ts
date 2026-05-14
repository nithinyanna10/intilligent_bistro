import { MenuItem } from "../types/cart";

/**
 * Canonical 12-item menu (matches design_handoff_intelligent_bistro README).
 * Order here is the order the API returns and the Menu screen renders.
 */
export const MENU: MenuItem[] = [
  // Sandwiches (3)
  {
    id: "spicy_chicken_sandwich",
    name: "Spicy Chicken Sandwich",
    price: 11.99,
    emoji: "🍔",
    category: "sandwiches",
    tags: ["spicy"],
    description: "Crispy chicken, chili aioli, pickles, brioche bun",
  },
  {
    id: "classic_bistro_burger",
    name: "Classic Bistro Burger",
    price: 12.99,
    emoji: "🍔",
    category: "sandwiches",
    tags: ["popular"],
    description: "Angus beef, cheddar, lettuce, tomato, house sauce",
  },
  {
    id: "crispy_chicken_club",
    name: "Crispy Chicken Club",
    price: 12.49,
    emoji: "🥪",
    category: "sandwiches",
    tags: [],
    description: "Buttermilk chicken, bacon, lettuce, tomato, toasted sourdough",
  },

  // Bowls (3)
  {
    id: "green_goddess_bowl",
    name: "Green Goddess Bowl",
    price: 10.99,
    emoji: "🥗",
    category: "bowls",
    tags: ["vegan"],
    description: "Greens, avocado, quinoa, cucumber, herb vinaigrette",
  },
  {
    id: "teriyaki_chicken_bowl",
    name: "Teriyaki Chicken Bowl",
    price: 13.49,
    emoji: "🍚",
    category: "bowls",
    tags: ["popular"],
    description: "Grilled chicken, rice, broccoli, teriyaki glaze",
  },
  {
    id: "salmon_poke_bowl",
    name: "Salmon Poke Bowl",
    price: 14.99,
    emoji: "🍣",
    category: "bowls",
    tags: [],
    description: "Sushi-grade salmon, sushi rice, edamame, avocado, ginger",
  },

  // Sides (2)
  {
    id: "truffle_fries",
    name: "Truffle Fries",
    price: 6.99,
    emoji: "🍟",
    category: "sides",
    tags: ["popular"],
    description: "Crispy fries, truffle oil, parmesan, herbs",
  },
  {
    id: "side_salad",
    name: "Side Salad",
    price: 5.49,
    emoji: "🥗",
    category: "sides",
    tags: ["vegan"],
    description: "Mixed greens, cherry tomato, lemon vinaigrette",
  },

  // Drinks (2)
  {
    id: "large_water",
    name: "Large Water",
    price: 3.49,
    emoji: "🥤",
    category: "drinks",
    tags: [],
    description: "Large chilled water",
  },
  {
    id: "sparkling_lemonade",
    name: "Sparkling Lemonade",
    price: 4.49,
    emoji: "🍋",
    category: "drinks",
    tags: ["popular"],
    description: "Lemon, bubbles, mint",
  },

  // Desserts (2)
  {
    id: "chocolate_lava_cake",
    name: "Chocolate Lava Cake",
    price: 7.99,
    emoji: "🍰",
    category: "desserts",
    tags: ["popular"],
    description: "Warm chocolate cake, molten center",
  },
  {
    id: "seasonal_sorbet",
    name: "Seasonal Sorbet",
    price: 5.99,
    emoji: "🍧",
    category: "desserts",
    tags: ["vegan"],
    description: "Rotating fruit sorbet — bright, dairy-free",
  },
];
