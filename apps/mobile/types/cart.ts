export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string[];
  specialInstructions?: string;
}
