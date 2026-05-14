import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { CartAction } from "../types/ai";
import { MenuItem } from "../types/menu";
import { colors } from "../constants/colors";

interface Props {
  actions: CartAction[];
  menu: MenuItem[];
}

const itemName = (id: string, menu: MenuItem[]) =>
  menu.find((m) => m.id === id)?.name ?? id;

const signOf = (action: CartAction): string => {
  switch (action.type) {
    case "ADD_ITEM":
      return "+";
    case "REMOVE_ITEM":
      return "−";
    case "UPDATE_QUANTITY":
      return "↻";
    case "UPDATE_MODIFIER":
      return "✎";
    case "CLEAR_CART":
      return "×";
    case "SHOW_CART":
      return "·";
    case "ASK_MENU_QUESTION":
      return "?";
    case "UNKNOWN":
      return "!";
  }
};

const describeOf = (action: CartAction, menu: MenuItem[]): string => {
  switch (action.type) {
    case "ADD_ITEM":
      return `${action.quantity} × ${itemName(action.itemId, menu)}${
        action.modifiers && action.modifiers.length
          ? ` (${action.modifiers.join(", ")})`
          : ""
      }`;
    case "REMOVE_ITEM":
      return `Removed ${itemName(action.itemId, menu)}`;
    case "UPDATE_QUANTITY":
      return `${itemName(action.itemId, menu)} → ${action.quantity}`;
    case "UPDATE_MODIFIER":
      return `${itemName(action.itemId, menu)}: ${action.modifiers.join(", ")}`;
    case "CLEAR_CART":
      return "Cleared cart";
    case "SHOW_CART":
      return "Showing cart";
    case "ASK_MENU_QUESTION":
      return `Menu: ${action.query}`;
    case "UNKNOWN":
      return action.reason;
  }
};

const MUTATING = new Set([
  "ADD_ITEM",
  "REMOVE_ITEM",
  "UPDATE_QUANTITY",
  "UPDATE_MODIFIER",
  "CLEAR_CART",
]);

export const ActionPreviewCard: React.FC<Props> = ({ actions, menu }) => {
  // Mount fade-up — README animation #16 ("Order-update card entry").
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  if (!actions.length) return null;
  const mutates = actions.some((a) => MUTATING.has(a.type));

  return (
    <Animated.View
      className="rounded-2xl p-3 mb-3 ml-9"
      style={{
        maxWidth: 320,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
        opacity,
        transform: [{ translateY }],
        // README §AI Waiter: 3-px orange left bar (40% opacity, full height)
        // signals "action card, not message."
        overflow: "hidden",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: colors.accent,
          opacity: 0.4,
        }}
      />

      <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
        <CheckCircle2 size={13} color={colors.success} />
        <Text
          style={{ color: colors.text1 }}
          className="text-xs font-semibold"
        >
          Order update
        </Text>
        <View className="flex-1" />
        <Text
          style={{ color: colors.text3 }}
          className="text-[11px] font-medium"
        >
          {mutates ? "Applied to cart" : "Suggested"}
        </Text>
      </View>

      {actions.map((action, idx) => (
        <View
          key={idx}
          className="flex-row items-center"
          style={{ gap: 10, paddingVertical: 2 }}
        >
          <Text
            style={{
              color: colors.text2,
              width: 12,
              textAlign: "center",
            }}
            className="text-[13px] font-semibold"
          >
            {signOf(action)}
          </Text>
          <Text
            style={{ color: colors.text1 }}
            className="text-[13px] flex-1"
          >
            {describeOf(action, menu)}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
};
