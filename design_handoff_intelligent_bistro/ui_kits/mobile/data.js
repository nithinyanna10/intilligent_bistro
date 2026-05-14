// Menu (lifted 1:1 from apps/backend/src/data/menu.ts) + suggested prompts.

window.MENU = [
  // Sandwiches
  { id: "spicy_chicken_sandwich", name: "Spicy Chicken Sandwich", price: 11.99, emoji: "🍔", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=240&h=240&fit=crop&q=80", category: "sandwiches", tags: ["spicy", "popular"], description: "Crispy chicken, chili aioli, pickles, brioche bun" },
  { id: "classic_bistro_burger",  name: "Classic Bistro Burger",  price: 12.99, emoji: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240&h=240&fit=crop&q=80", category: "sandwiches", tags: ["popular"],          description: "Angus beef, cheddar, lettuce, tomato, house sauce" },

  // Bowls
  { id: "green_goddess_bowl",     name: "Green Goddess Bowl",     price: 10.99, emoji: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=240&h=240&fit=crop&q=80", category: "bowls",      tags: ["vegan"],            description: "Greens, avocado, quinoa, cucumber, herb vinaigrette" },
  { id: "teriyaki_chicken_bowl",  name: "Teriyaki Chicken Bowl",  price: 13.49, emoji: "🍚", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=240&h=240&fit=crop&q=80", category: "bowls",      tags: ["popular"],          description: "Grilled chicken, rice, broccoli, teriyaki glaze" },

  // Sides
  { id: "truffle_fries",          name: "Truffle Fries",          price: 6.99,  emoji: "🍟", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=240&h=240&fit=crop&q=80", category: "sides",      tags: ["popular"],          description: "Crispy fries, truffle oil, parmesan, herbs" },
  { id: "side_salad",             name: "Side Salad",             price: 5.49,  emoji: "🥗", image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=240&h=240&fit=crop&q=80", category: "sides",      tags: ["vegan"],            description: "Mixed greens, cherry tomato, lemon vinaigrette" },

  // Drinks
  { id: "bottled_water",          name: "Bottled Water",          price: 2.49,  emoji: "💧", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&h=240&fit=crop&q=80", category: "drinks",     tags: [],                   description: "Still bottled water" },
  { id: "large_water",            name: "Large Water",            price: 3.49,  emoji: "🥤", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=240&h=240&fit=crop&q=80", category: "drinks",     tags: [],                   description: "Large chilled water" },
  { id: "sparkling_lemonade",     name: "Sparkling Lemonade",     price: 4.99,  emoji: "🍋", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=240&h=240&fit=crop&q=80", category: "drinks",     tags: ["popular"],          description: "Lemon, bubbles, mint" },

  // Desserts
  { id: "chocolate_lava_cake",    name: "Chocolate Lava Cake",    price: 7.99,  emoji: "🍰", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=240&h=240&fit=crop&q=80", category: "desserts",   tags: ["popular"],          description: "Warm chocolate cake, molten center" },
  { id: "vanilla_gelato",         name: "Vanilla Gelato",         price: 5.99,  emoji: "🍨", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=240&h=240&fit=crop&q=80", category: "desserts",   tags: [],                   description: "Creamy vanilla gelato" },
  { id: "berry_cheesecake",       name: "Berry Cheesecake",       price: 6.99,  emoji: "🍓", image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=240&h=240&fit=crop&q=80", category: "desserts",   tags: [],                   description: "New York cheesecake, berry compote" },
];

window.CATEGORIES = [
  { id: "all",         label: "All" },
  { id: "sandwiches",  label: "Sandwiches" },
  { id: "bowls",       label: "Bowls" },
  { id: "sides",       label: "Sides" },
  { id: "drinks",      label: "Drinks" },
  { id: "desserts",    label: "Desserts" },
];

window.SUGGESTIONS = [
  "Add two spicy chicken sandwiches",
  "What's popular?",
  "I want something vegetarian",
  "Add a drink",
  "Clear my cart",
];

// ─── Tiny deterministic AI parser ──────────────────────────────
// Mirrors apps/backend/src/services/fallbackParser.service.ts at a sketch level.
// Returns { actions: [...], assistantMessage }.
const QTY_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

function findItem(phrase, menu) {
  const p = phrase.toLowerCase();
  // synonyms / shortenings
  const aliases = {
    "spicy chicken sandwich": "spicy_chicken_sandwich",
    "spicy chicken":          "spicy_chicken_sandwich",
    "bistro burger":          "classic_bistro_burger",
    "classic burger":         "classic_bistro_burger",
    "burger":                 "classic_bistro_burger",
    "green goddess bowl":     "green_goddess_bowl",
    "green goddess":          "green_goddess_bowl",
    "teriyaki chicken bowl":  "teriyaki_chicken_bowl",
    "teriyaki chicken":       "teriyaki_chicken_bowl",
    "teriyaki":               "teriyaki_chicken_bowl",
    "truffle fries":          "truffle_fries",
    "fries":                  "truffle_fries",
    "side salad":             "side_salad",
    "bottled water":          "bottled_water",
    "large water":            "large_water",
    "water":                  "bottled_water",
    "lemonade":               "sparkling_lemonade",
    "sparkling lemonade":     "sparkling_lemonade",
    "chocolate lava cake":    "chocolate_lava_cake",
    "lava cake":              "chocolate_lava_cake",
    "chocolate cake":         "chocolate_lava_cake",
    "vanilla gelato":         "vanilla_gelato",
    "gelato":                 "vanilla_gelato",
    "berry cheesecake":       "berry_cheesecake",
    "cheesecake":             "berry_cheesecake",
  };
  // longest match wins
  const keys = Object.keys(aliases).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (p.includes(k)) return menu.find(m => m.id === aliases[k]);
  }
  return null;
}

function parseQuantity(phrase) {
  const p = phrase.toLowerCase();
  const num = p.match(/\b(\d+)\b/);
  if (num) return parseInt(num[1], 10);
  for (const [w, n] of Object.entries(QTY_WORDS)) {
    if (new RegExp(`\\b${w}\\b`).test(p)) return n;
  }
  return 1;
}

window.parseOrder = function(message, cart, menu) {
  const text = message.toLowerCase().trim();

  // POPULAR Q
  if (/(what'?s|whats|what is|what are).*(popular|trending|best)|popular\?/.test(text) || /popular$/.test(text)) {
    const items = menu.filter(m => m.tags.includes("popular")).slice(0, 3).map(m => m.name).join(", ");
    return { actions: [], assistantMessage: `Our most ordered today: ${items}. Want me to add anything?` };
  }

  // VEGETARIAN / VEGAN
  if (/(vegetarian|vegan|plant.based|meatless)/.test(text)) {
    const items = menu.filter(m => m.tags.includes("vegan")).map(m => m.name).join(" or the ");
    return { actions: [], assistantMessage: `The ${items} are both fully vegan. Want me to add one?` };
  }

  // SPICY Q
  if (/(what.?s|whats|what is).*(spicy|hot)|spicy\?$/.test(text)) {
    const items = menu.filter(m => m.tags.includes("spicy")).map(m => m.name).join(", ") || "the Spicy Chicken Sandwich";
    return { actions: [], assistantMessage: `Try the ${items} — crispy chicken with chili aioli.` };
  }

  // CLEAR
  if (/\b(clear|empty)\b.*(cart|order)|\bstart over\b/.test(text)) {
    return { actions: [{ type: "CLEAR_CART" }], assistantMessage: "Cleared your cart." };
  }

  // SHOW
  if (/(show|see|view).*cart|what.+in.+cart/.test(text)) {
    return { actions: [{ type: "SHOW_CART" }], assistantMessage: "Here's your cart." };
  }

  // REMOVE
  if (/\b(remove|delete|take off|drop)\b/.test(text)) {
    const item = findItem(text, menu);
    if (item) {
      return {
        actions: [{ type: "REMOVE_ITEM", itemId: item.id }],
        assistantMessage: `Removed ${item.name} from your cart.`
      };
    }
  }

  // MODIFIER ("make my burger without onions")
  const withoutMatch = text.match(/(?:make my |with )?(?:no |without )([a-z, ]+)/);
  if (withoutMatch && /\b(make|with|without)\b/.test(text)) {
    const item = findItem(text, menu);
    if (item) {
      const mods = withoutMatch[1].split(/[,\s]+/).filter(Boolean).map(w => `without ${w}`);
      return {
        actions: [{ type: "UPDATE_MODIFIER", itemId: item.id, modifiers: mods }],
        assistantMessage: `Updated ${item.name}: ${mods.join(", ")}.`
      };
    }
  }

  // ADD a generic drink (no specific item)
  if (/\b(add|order|get|grab).{0,20}\bdrink\b/.test(text) && !findItem(text, menu)) {
    return {
      actions: [{ type: "ADD_ITEM", itemId: "sparkling_lemonade", quantity: 1, modifiers: [] }],
      assistantMessage: "Added a Sparkling Lemonade. Want something else instead?"
    };
  }

  // ADD — default
  if (/\b(add|order|get|i'?ll have|grab|put)\b/.test(text) || findItem(text, menu)) {
    // Try to find multiple items split by "and"
    const parts = text.split(/\band\b/);
    const actions = [];
    const names = [];
    for (const part of parts) {
      const item = findItem(part, menu);
      if (!item) continue;
      const qty = parseQuantity(part);
      actions.push({ type: "ADD_ITEM", itemId: item.id, quantity: qty, modifiers: [] });
      names.push(`${qty} ${item.name}${qty > 1 ? "s" : ""}`);
    }
    if (actions.length) {
      return { actions, assistantMessage: `Added ${names.join(" and ")} to your cart.` };
    }
  }

  return {
    actions: [{ type: "UNKNOWN", reason: "I'm not sure what to add — could you mention an item by name?" }],
    assistantMessage: "I'm not sure what to add — could you mention an item by name?"
  };
};
