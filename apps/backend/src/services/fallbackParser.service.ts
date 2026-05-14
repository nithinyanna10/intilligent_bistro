import { MENU } from "../data/menu";
import { CartAction, ParseOrderResponse } from "../schemas/order.schema";
import { CartItem, MenuItem } from "../types/cart";

// ---------------- number parsing ----------------

const NUMBER_WORDS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  couple: 2,
  pair: 2,
  dozen: 12,
};

const toInt = (token: string): number | null => {
  const n = Number(token);
  if (!Number.isNaN(n) && Number.isFinite(n)) return Math.floor(n);
  const w = NUMBER_WORDS[token.toLowerCase()];
  return typeof w === "number" ? w : null;
};

// ---------------- text normalization ----------------

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Tokens that should not trigger fuzzy matches on their own.
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "to", "of", "in", "on",
  "my", "me", "i", "id", "want", "would", "like",
  "please", "can", "could", "you", "is", "are", "with",
  "without", "add", "remove", "delete", "drop", "clear",
  "cart", "order", "make", "change", "update", "set",
  "one", "two", "three", "four", "five", "six", "seven",
  "eight", "nine", "ten", "couple", "pair", "dozen",
  "no", "show",
]);

// ---------------- item matching ----------------

interface MatchResult {
  item: MenuItem;
  score: number;
}

const itemKeywords = (item: MenuItem): string[] => {
  const out = new Set<string>();
  normalize(item.name)
    .split(" ")
    .forEach((w) => out.add(w));
  normalize(item.id.replace(/_/g, " "))
    .split(" ")
    .forEach((w) => out.add(w));
  return [...out].filter((w) => w.length > 2 && !STOP_WORDS.has(w));
};

const SYNONYMS: Record<string, string[]> = {
  fries: ["truffle_fries"],
  burger: ["classic_bistro_burger"],
  cheeseburger: ["classic_bistro_burger"],
  sandwich: ["spicy_chicken_sandwich"],
  chicken: ["spicy_chicken_sandwich", "teriyaki_chicken_bowl"],
  spicy: ["spicy_chicken_sandwich"],
  water: ["large_water"],
  lemonade: ["sparkling_lemonade"],
  salad: ["side_salad", "green_goddess_bowl"],
  bowl: ["green_goddess_bowl", "teriyaki_chicken_bowl"],
  cake: ["chocolate_lava_cake", "berry_cheesecake"],
  chocolate: ["chocolate_lava_cake"],
  lava: ["chocolate_lava_cake"],
  cheesecake: ["berry_cheesecake"],
  berry: ["berry_cheesecake"],
  gelato: ["vanilla_gelato"],
  vanilla: ["vanilla_gelato"],
  ice: ["vanilla_gelato"],
  teriyaki: ["teriyaki_chicken_bowl"],
  green: ["green_goddess_bowl"],
  goddess: ["green_goddess_bowl"],
  vegan: ["green_goddess_bowl", "side_salad"],
};

const scoreMatch = (phrase: string, item: MenuItem): number => {
  let score = 0;
  const phraseTokens = phrase.split(" ");
  const kws = itemKeywords(item);
  for (const tok of phraseTokens) {
    if (STOP_WORDS.has(tok)) continue;
    if (kws.includes(tok)) score += 2;
    if (SYNONYMS[tok]?.includes(item.id)) score += 3;
  }
  return score;
};

const bestMatch = (phrase: string): MatchResult | null => {
  let best: MatchResult | null = null;
  for (const item of MENU) {
    const score = scoreMatch(phrase, item);
    if (score > 0 && (!best || score > best.score)) {
      best = { item, score };
    }
  }
  return best;
};

// ---------------- quantity extraction ----------------

const extractQuantity = (segment: string): number => {
  const tokens = segment.split(" ");
  for (let i = 0; i < tokens.length; i++) {
    const n = toInt(tokens[i]);
    if (n !== null && n > 0) return n;
  }
  return 1;
};

// ---------------- modifier extraction ----------------

const extractModifiers = (segment: string): string[] => {
  const mods: string[] = [];
  const withoutMatch = segment.match(/without\s+([a-z\s]+?)(?:\s+(?:and|on|to|please|$)|$)/);
  if (withoutMatch) {
    mods.push(`no ${withoutMatch[1].trim()}`);
  }
  const noMatch = segment.match(/\bno\s+([a-z]+)/g);
  if (noMatch) {
    for (const m of noMatch) {
      const word = m.replace(/^no\s+/, "").trim();
      const phrase = `no ${word}`;
      if (!mods.includes(phrase)) mods.push(phrase);
    }
  }
  return mods;
};

// ---------------- intent detection ----------------

const hasAny = (s: string, words: string[]) =>
  words.some((w) => new RegExp(`\\b${w}\\b`).test(s));

const pluralize = (name: string, qty: number): string => {
  if (qty <= 1) return name;
  if (/s$/i.test(name)) return name; // "Truffle Fries"
  if (/(sh|ch|x|z)$/i.test(name)) return `${name}es`; // "Sandwich" → "Sandwiches"
  return `${name}s`;
};

const NUMBER_WORDS_OUT = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

/** Format a count as "two Spicy Chicken Sandwiches" / "a Large Water" / "12 Truffle Fries". */
const formatCount = (qty: number, name: string): string => {
  if (qty === 1) {
    const article = /^[aeiou]/i.test(name) ? "an" : "a";
    return `${article} ${name}`;
  }
  const word = qty >= 0 && qty <= 10 ? NUMBER_WORDS_OUT[qty] : String(qty);
  return `${word} ${pluralize(name, qty)}`;
};

/** Last word of an item name, lowercased — used as the colloquial noun. */
const colloquialNoun = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 1] || name).toLowerCase();
};

/** Render a stored modifier ("no onions") as readable prose ("without onions"). */
const modifierToProse = (mod: string): string =>
  mod.startsWith("no ") ? `without ${mod.slice(3)}` : mod;

/**
 * README §"AI Waiter" canonical list — the curated "today's popular" trio.
 * Kept here (not derived from MENU order) so the reply is stable as the menu
 * data file evolves.
 */
const TOP_POPULAR_IDS = [
  "spicy_chicken_sandwich",
  "classic_bistro_burger",
  "truffle_fries",
];

// ---------------- main parser ----------------

export const fallbackParse = (
  message: string,
  cart: CartItem[]
): ParseOrderResponse => {
  const original = message;
  const text = normalize(message);

  // CLEAR CART
  if (/\bclear\b.*\bcart\b|\bempty\b.*\bcart\b|\bstart over\b|\breset\b.*\bcart\b/.test(text)) {
    return {
      intent: "clear_cart",
      actions: [{ type: "CLEAR_CART" }],
      assistantMessage: "Cleared your cart.",
      confidence: 0.95,
    };
  }

  // SHOW CART
  if (/\bshow\b.*\bcart\b|\bwhats in my cart\b|\bview\b.*\bcart\b/.test(text)) {
    return {
      intent: "show_cart",
      actions: [{ type: "SHOW_CART" }],
      assistantMessage:
        cart.length === 0
          ? "Your cart is empty."
          : `You have ${cart.length} item${cart.length === 1 ? "" : "s"} in your cart.`,
      confidence: 0.9,
    };
  }

  // VEGETARIAN suggestion (separate from generic ask, returns no mutation)
  if (/\bvegetarian\b|\bveggie\b|\bplant based\b|\bplant\s*based\b/.test(text)) {
    return {
      intent: "vegetarian",
      actions: [{ type: "ASK_MENU_QUESTION", query: "vegetarian" }],
      assistantMessage:
        "The Green Goddess Bowl is fully vegan — greens, avocado, quinoa, herb vinaigrette. Want me to add one?",
      confidence: 0.85,
    };
  }

  // ASK MENU QUESTION
  if (/\bwhats\b|\bwhat is\b|\bdo you have\b|\bany\b.*\b(spicy|vegan|popular)\b/.test(text)) {
    let query = "general";
    if (/\bspicy\b/.test(text)) query = "spicy_items";
    else if (/\bvegan\b/.test(text)) query = "vegan_items";
    else if (/\bpopular\b/.test(text)) query = "popular_items";

    let answer = "Here are some highlights from our menu.";
    if (query === "spicy_items") {
      const spicy = MENU.filter((m) => m.tags.includes("spicy"));
      answer =
        spicy.length > 0
          ? "Try the Spicy Chicken Sandwich — crispy chicken with chili aioli."
          : "We don't have anything tagged spicy right now.";
    } else if (query === "vegan_items") {
      const vegan = MENU.filter((m) => m.tags.includes("vegan"));
      answer = `Vegan options: ${vegan.map((m) => m.name).join(", ")}.`;
    } else if (query === "popular_items") {
      const curated = TOP_POPULAR_IDS.map(
        (id) => MENU.find((m) => m.id === id)?.name
      ).filter(Boolean) as string[];
      answer = `Our most ordered today: ${curated.join(", ")}. Want me to add anything?`;
    }

    return {
      intent: "ask_menu_question",
      actions: [{ type: "ASK_MENU_QUESTION", query }],
      assistantMessage: answer,
      confidence: 0.85,
    };
  }

  // MODIFIER ONLY (e.g. "make my burger without onions", "no pickles on the sandwich")
  if (/\b(make|change|update|modify)\b/.test(text) || /\bwithout\b/.test(text) || /\bno\s+\w+\s+on\b/.test(text)) {
    const mods = extractModifiers(text);
    if (mods.length > 0) {
      const match = bestMatch(text);
      if (match) {
        const inCart = cart.find((c) => c.itemId === match.item.id);
        if (inCart) {
          return {
            intent: "update_modifier",
            actions: [
              {
                type: "UPDATE_MODIFIER",
                itemId: match.item.id,
                modifiers: mods,
              },
            ],
            assistantMessage: `Updated your ${match.item.name}: ${mods.join(", ")}.`,
            confidence: 0.8,
          };
        }
        const noun = colloquialNoun(match.item.name);
        const prose = mods.map(modifierToProse).join(", ");
        return {
          intent: "update_modifier",
          actions: [
            {
              type: "UNKNOWN",
              reason: `${match.item.name} is not currently in your cart.`,
            },
          ],
          assistantMessage: `You don't have a ${noun} in your cart yet — want me to add a ${match.item.name} ${prose}?`,
          confidence: 0.6,
        };
      }
    }
  }

  // ADD / REMOVE — split on "and" / "," / "plus" to handle compound orders
  const isRemove = hasAny(text, ["remove", "delete", "drop", "cancel", "take off"]);
  const isAdd = hasAny(text, ["add", "get", "order", "want", "give", "bring", "id like", "ill have", "ill take"]) ||
    (!isRemove && /^\s*(a|an|one|two|three|four|five|six|seven|eight|nine|ten)\b/.test(text));

  // UPDATE QUANTITY (e.g. "change fries to two")
  const changeMatch = text.match(/\b(change|update|set|make)\b.*\bto\s+(\w+)/);
  if (changeMatch) {
    const qty = toInt(changeMatch[2]);
    if (qty !== null) {
      const subject = text.replace(/\bto\s+\w+.*$/, "");
      const match = bestMatch(subject);
      if (match) {
        return {
          intent: "update_quantity",
          actions: [
            {
              type: "UPDATE_QUANTITY",
              itemId: match.item.id,
              quantity: qty,
            },
          ],
          assistantMessage: `Set ${match.item.name} quantity to ${qty}.`,
          confidence: 0.85,
        };
      }
    }
  }

  // GENERIC "Add a drink" — when user says "drink" without naming a specific drink
  const mentionsDrink = /\bdrink\b|\bbeverage\b|\bsomething to drink\b/.test(text);
  const mentionsSpecificDrink = /\bwater\b|\blemonade\b|\bjuice\b|\bsoda\b|\bcoffee\b|\btea\b/.test(text);
  if (mentionsDrink && !mentionsSpecificDrink && !isRemove) {
    const defaultDrink = MENU.find((m) => m.id === "sparkling_lemonade");
    if (defaultDrink) {
      return {
        intent: "add_generic_drink",
        actions: [
          {
            type: "ADD_ITEM",
            itemId: defaultDrink.id,
            quantity: 1,
            modifiers: [],
          },
        ],
        assistantMessage:
          "Added a Sparkling Lemonade. Want something else instead?",
        confidence: 0.7,
      };
    }
  }

  // Compound segments
  const segments = text
    .split(/\s+(?:and|plus|,|with)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const actions: CartAction[] = [];
  const summaryParts: string[] = [];

  for (const rawSeg of segments) {
    const seg = rawSeg;
    if (!seg) continue;
    // If the *whole* message is a remove command, every segment inherits it
    // (e.g. "remove fries and water" → both segments are removes).
    // Otherwise, each segment decides for itself.
    const segIsRemove =
      hasAny(seg, ["remove", "delete", "drop", "cancel"]) ||
      (isRemove && !hasAny(seg, ["add", "get", "order", "want"]));
    const match = bestMatch(seg);
    if (!match) continue;

    if (segIsRemove) {
      const inCart = cart.find((c) => c.itemId === match.item.id);
      const removeQty = extractQuantityIfExplicit(seg);
      if (inCart && removeQty !== null && removeQty < inCart.quantity) {
        const next = inCart.quantity - removeQty;
        actions.push({
          type: "UPDATE_QUANTITY",
          itemId: match.item.id,
          quantity: next,
        });
        summaryParts.push(
          `removed ${formatCount(removeQty, match.item.name)}`
        );
      } else {
        actions.push({ type: "REMOVE_ITEM", itemId: match.item.id });
        summaryParts.push(`removed ${match.item.name}`);
      }
    } else {
      // Treat any non-remove segment with a matched item as an add.
      void isAdd;
      const qty = extractQuantity(seg);
      const modifiers = extractModifiers(seg);
      actions.push({
        type: "ADD_ITEM",
        itemId: match.item.id,
        quantity: qty,
        modifiers,
      });
      summaryParts.push(formatCount(qty, match.item.name));
    }
  }

  if (actions.length > 0) {
    if (isRemove) {
      return {
        intent: "remove_items",
        actions,
        assistantMessage: `Done — ${summaryParts.join(", ")}.`,
        confidence: 0.8,
      };
    }

    // README canonical phrasing: "Done — X and Y are in your cart."
    // Use Oxford-style "X, Y, and Z" when three or more items.
    const joined =
      summaryParts.length <= 2
        ? summaryParts.join(" and ")
        : `${summaryParts.slice(0, -1).join(", ")}, and ${summaryParts[summaryParts.length - 1]}`;

    // Verb agreement: singular only when there's one action AND its qty is 1.
    const totalQty = actions.reduce(
      (sum, a) => sum + ("quantity" in a ? a.quantity : 0),
      0
    );
    const verb = actions.length === 1 && totalQty === 1 ? "is" : "are";

    return {
      intent: "add_items",
      actions,
      assistantMessage: `Done — ${joined} ${verb} in your cart.`,
      confidence: 0.8,
    };
  }

  // Nothing matched
  return {
    intent: "unknown",
    actions: [
      {
        type: "UNKNOWN",
        reason: `Could not identify an item or action in: "${original}"`,
      },
    ],
    assistantMessage:
      "I didn't quite catch that. Try something like 'Add two spicy chicken sandwiches' or 'Clear my cart'.",
    confidence: 0.3,
  };
};

const extractQuantityIfExplicit = (segment: string): number | null => {
  const tokens = segment.split(" ");
  for (const tok of tokens) {
    const n = toInt(tok);
    if (n !== null && n > 0) return n;
  }
  return null;
};
