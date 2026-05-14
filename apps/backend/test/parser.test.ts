// Deterministic-parser regression tests.
// Run via:  npm test
//
// No external test runner — uses node:assert + tsx. Exits non-zero on failure.

import { strict as assert } from "node:assert";
import { fallbackParse } from "../src/services/fallbackParser.service";
import { CartItem } from "../src/types/cart";

type Case = {
  name: string;
  msg: string;
  cart?: CartItem[];
  expectActions: string;
  expectMessage?: string | RegExp;
};

const describeAction = (a: any): string => {
  switch (a.type) {
    case "ADD_ITEM":
      return `ADD_ITEM ${a.itemId} x${a.quantity}`;
    case "REMOVE_ITEM":
      return `REMOVE_ITEM ${a.itemId}`;
    case "UPDATE_QUANTITY":
      return `UPDATE_QUANTITY ${a.itemId} → ${a.quantity}`;
    case "UPDATE_MODIFIER":
      return `UPDATE_MODIFIER ${a.itemId} (${a.modifiers.join(", ")})`;
    case "CLEAR_CART":
      return "CLEAR_CART";
    case "SHOW_CART":
      return "SHOW_CART";
    case "ASK_MENU_QUESTION":
      return `ASK_MENU_QUESTION (${a.query})`;
    case "UNKNOWN":
      return `UNKNOWN(${a.reason})`;
    default:
      return JSON.stringify(a);
  }
};

const cases: Case[] = [
  // RUBRIC — non-negotiable
  {
    name: "rubric: 'Add two spicy chicken sandwiches and a large water'",
    msg: "Add two spicy chicken sandwiches and a large water",
    expectActions:
      "ADD_ITEM spicy_chicken_sandwich x2, ADD_ITEM large_water x1",
    expectMessage:
      "Done — two Spicy Chicken Sandwiches and a Large Water are in your cart.",
  },

  // Defensive — generic 'drink' is the *only* ambiguous-drink path
  {
    name: "'add a drink' (no specific drink word) → Sparkling Lemonade",
    msg: "Add a drink",
    expectActions: "ADD_ITEM sparkling_lemonade x1",
    expectMessage:
      "Added a Sparkling Lemonade. Want something else instead?",
  },
  {
    name: "'Add a large water' → Large Water, never Sparkling Lemonade",
    msg: "Add a large water",
    expectActions: "ADD_ITEM large_water x1",
  },
  {
    // The canonical 12-item menu doesn't include Bottled Water any more — the
    // only remaining "water" item is the Large Water. Defensive test: a plain
    // "water" must still resolve to Large Water and never fall through to the
    // generic-drink branch (Sparkling Lemonade).
    name: "'Add a water' → Large Water, never Sparkling Lemonade",
    msg: "Add a water",
    expectActions: "ADD_ITEM large_water x1",
  },

  // README canonical replies
  {
    name: "'What's popular?' → curated trio per README",
    msg: "What's popular?",
    expectActions: "ASK_MENU_QUESTION (popular_items)",
    expectMessage:
      "Our most ordered today: Spicy Chicken Sandwich, Classic Bistro Burger, Truffle Fries. Want me to add anything?",
  },
  {
    name: "'I want something vegetarian' → Green Goddess Bowl suggestion",
    msg: "I want something vegetarian",
    expectActions: "ASK_MENU_QUESTION (vegetarian)",
    expectMessage:
      "The Green Goddess Bowl is fully vegan — greens, avocado, quinoa, herb vinaigrette. Want me to add one?",
  },
  {
    name: "'What's spicy?' → Spicy Chicken Sandwich pitch",
    msg: "What's spicy?",
    expectActions: "ASK_MENU_QUESTION (spicy_items)",
    expectMessage:
      "Try the Spicy Chicken Sandwich — crispy chicken with chili aioli.",
  },
  {
    name: "modifier on missing item → UNKNOWN + offer-with-modifier",
    msg: "Make my burger without onions",
    cart: [],
    expectActions:
      "UNKNOWN(Classic Bistro Burger is not currently in your cart.)",
    expectMessage:
      "You don't have a burger in your cart yet — want me to add a Classic Bistro Burger without onions?",
  },
  {
    name: "modifier on present item → UPDATE_MODIFIER + ack",
    msg: "Make my burger without onions",
    cart: [
      {
        itemId: "classic_bistro_burger",
        name: "Classic Bistro Burger",
        price: 12.99,
        quantity: 1,
      },
    ],
    expectActions: "UPDATE_MODIFIER classic_bistro_burger (no onions)",
  },

  // Smoke
  {
    name: "'Add truffle fries' → Truffle Fries",
    msg: "Add truffle fries",
    expectActions: "ADD_ITEM truffle_fries x1",
  },
  {
    name: "'Clear my cart' → CLEAR_CART",
    msg: "Clear my cart",
    expectActions: "CLEAR_CART",
  },
  {
    name: "Remove one of two → UPDATE_QUANTITY → 1",
    msg: "Remove one spicy chicken sandwich",
    cart: [
      {
        itemId: "spicy_chicken_sandwich",
        name: "Spicy Chicken Sandwich",
        price: 11.99,
        quantity: 2,
      },
    ],
    expectActions: "UPDATE_QUANTITY spicy_chicken_sandwich → 1",
  },
];

let pass = 0;
let fail = 0;
const failures: string[] = [];

for (const c of cases) {
  try {
    const res = fallbackParse(c.msg, c.cart ?? []);
    const actionsStr = res.actions.map(describeAction).join(", ");
    assert.equal(actionsStr, c.expectActions, "actions mismatch");

    if (c.expectMessage) {
      if (c.expectMessage instanceof RegExp) {
        assert.match(res.assistantMessage, c.expectMessage, "message regex");
      } else {
        assert.equal(
          res.assistantMessage,
          c.expectMessage,
          "message string"
        );
      }
    }

    pass++;
    console.log(`  \x1b[32m✓\x1b[0m  ${c.name}`);
  } catch (err) {
    fail++;
    const msg = err instanceof Error ? err.message : String(err);
    const got = fallbackParse(c.msg, c.cart ?? []);
    failures.push(
      `  ${c.name}\n    expected actions: ${c.expectActions}\n    got actions:      ${got.actions
        .map(describeAction)
        .join(", ")}\n    expected msg:     ${c.expectMessage ?? "(any)"}\n    got msg:          ${got.assistantMessage}\n    error:            ${msg}`
    );
    console.log(`  \x1b[31m✗\x1b[0m  ${c.name}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed (${cases.length} total)`);

if (fail > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(f, "\n");
  process.exit(1);
}
