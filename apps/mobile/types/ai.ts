export type CartAction =
  | {
      type: "ADD_ITEM";
      itemId: string;
      quantity: number;
      modifiers?: string[];
    }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "UPDATE_QUANTITY"; itemId: string; quantity: number }
  | { type: "UPDATE_MODIFIER"; itemId: string; modifiers: string[] }
  | { type: "CLEAR_CART" }
  | { type: "SHOW_CART" }
  | { type: "ASK_MENU_QUESTION"; query: string }
  | { type: "UNKNOWN"; reason: string };

export interface ParseOrderResponse {
  intent: string;
  actions: CartAction[];
  assistantMessage: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: CartAction[];
  timestamp: number;
}
