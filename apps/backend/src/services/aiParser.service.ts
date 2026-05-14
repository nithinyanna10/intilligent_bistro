import OpenAI from "openai";
import { MENU } from "../data/menu";
import {
  ParseOrderResponse,
  ParseOrderResponseSchema,
} from "../schemas/order.schema";
import { CartItem } from "../types/cart";
import { fallbackParse } from "./fallbackParser.service";

const SYSTEM_PROMPT = `You are an AI restaurant ordering assistant for The Intelligent Bistro.

Your job is to convert user messages into structured JSON cart actions.

You must only reference valid menu items from the provided menu.

Return JSON only. No markdown. No explanation outside JSON.

Supported actions:
ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, UPDATE_MODIFIER, CLEAR_CART, SHOW_CART, ASK_MENU_QUESTION, UNKNOWN.

If the user asks for an item that partially matches multiple menu items, ask a clarification question in assistantMessage and return no destructive action.

If the user asks a menu question, return ASK_MENU_QUESTION and answer using the provided menu.

If the user asks to modify an item already in cart, use the current cart context.

Always be conservative and safe.

Output schema:
{
  "intent": "string",
  "actions": [
    // discriminated by "type"
    // ADD_ITEM: { type, itemId, quantity, modifiers: string[] }
    // REMOVE_ITEM: { type, itemId }
    // UPDATE_QUANTITY: { type, itemId, quantity }
    // UPDATE_MODIFIER: { type, itemId, modifiers: string[] }
    // CLEAR_CART: { type }
    // SHOW_CART: { type }
    // ASK_MENU_QUESTION: { type, query }
    // UNKNOWN: { type, reason }
  ],
  "assistantMessage": "string",
  "confidence": 0.0-1.0
}`;

const buildUserPrompt = (message: string, cart: CartItem[]) => {
  return [
    `User message: ${message}`,
    "",
    "Menu (JSON):",
    JSON.stringify(
      MENU.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        tags: m.tags,
        category: m.category,
      })),
      null,
      2
    ),
    "",
    "Current cart (JSON):",
    JSON.stringify(cart, null, 2),
    "",
    "Return JSON only.",
  ].join("\n");
};

export const parseWithAI = async (
  message: string,
  cart: CartItem[]
): Promise<ParseOrderResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return fallbackParse(message, cart);
  }

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(message, cart) },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    const parsedJson = JSON.parse(raw);
    const result = ParseOrderResponseSchema.safeParse(parsedJson);

    if (!result.success) {
      console.warn(
        "[aiParser] Zod validation failed, using fallback:",
        result.error.flatten()
      );
      return fallbackParse(message, cart);
    }

    // Defensive: drop actions that reference unknown itemIds
    const validIds = new Set(MENU.map((m) => m.id));
    const filteredActions = result.data.actions.filter((a) => {
      if ("itemId" in a) return validIds.has(a.itemId);
      return true;
    });

    return {
      ...result.data,
      actions: filteredActions,
    };
  } catch (err) {
    console.warn("[aiParser] AI call failed, using fallback:", err);
    return fallbackParse(message, cart);
  }
};
