import { z } from "zod";

export const CartItemSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(0),
  modifiers: z.array(z.string()).optional(),
  specialInstructions: z.string().optional(),
});

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  emoji: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
});

export const ParseOrderRequestSchema = z.object({
  message: z.string().min(1, "message is required").max(1000),
  cart: z.array(CartItemSchema).default([]),
  menu: z.array(MenuItemSchema).optional(),
});

export type ParseOrderRequest = z.infer<typeof ParseOrderRequestSchema>;

// ----- Action schemas (discriminated union) -----

const AddItemAction = z.object({
  type: z.literal("ADD_ITEM"),
  itemId: z.string(),
  quantity: z.number().int().min(1),
  modifiers: z.array(z.string()).default([]),
});

const RemoveItemAction = z.object({
  type: z.literal("REMOVE_ITEM"),
  itemId: z.string(),
});

const UpdateQuantityAction = z.object({
  type: z.literal("UPDATE_QUANTITY"),
  itemId: z.string(),
  quantity: z.number().int().min(0),
});

const UpdateModifierAction = z.object({
  type: z.literal("UPDATE_MODIFIER"),
  itemId: z.string(),
  modifiers: z.array(z.string()),
});

const ClearCartAction = z.object({
  type: z.literal("CLEAR_CART"),
});

const ShowCartAction = z.object({
  type: z.literal("SHOW_CART"),
});

const AskMenuQuestionAction = z.object({
  type: z.literal("ASK_MENU_QUESTION"),
  query: z.string(),
});

const UnknownAction = z.object({
  type: z.literal("UNKNOWN"),
  reason: z.string(),
});

export const CartActionSchema = z.discriminatedUnion("type", [
  AddItemAction,
  RemoveItemAction,
  UpdateQuantityAction,
  UpdateModifierAction,
  ClearCartAction,
  ShowCartAction,
  AskMenuQuestionAction,
  UnknownAction,
]);

export type CartAction = z.infer<typeof CartActionSchema>;

export const ParseOrderResponseSchema = z.object({
  intent: z.string(),
  actions: z.array(CartActionSchema),
  assistantMessage: z.string(),
  confidence: z.number().min(0).max(1),
});

export type ParseOrderResponse = z.infer<typeof ParseOrderResponseSchema>;
