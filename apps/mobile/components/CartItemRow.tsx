import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { Minus, Plus, X } from "lucide-react-native";
import { CartItem } from "../types/cart";
import { FoodTile } from "./FoodTile";
import { colors } from "../constants/colors";

interface Props {
  item: CartItem;
  emoji?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

/**
 * Stepper layout (per spec):
 *   - Pill container, alignSelf: flex-start (no stretch).
 *   - 3 equal-width slots: 32 × 32 minus, 32 × 32 number, 32 × 32 plus.
 *   - 4 px container padding. No justify-between / flex-1 anywhere inside.
 *   - Qty number scales 1.16 → 1 on change (Animated, native driver) — the
 *     animation lives on a wrapper View so it can't perturb text metrics.
 */
export const CartItemRow: React.FC<Props> = ({
  item,
  emoji = "🍽️",
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const qtyScale = useRef(new Animated.Value(1)).current;
  const prevQty = useRef(item.quantity);

  useEffect(() => {
    if (item.quantity !== prevQty.current) {
      Animated.sequence([
        Animated.timing(qtyScale, {
          toValue: 1.16,
          duration: 110,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(qtyScale, {
          toValue: 1,
          duration: 110,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      prevQty.current = item.quantity;
    }
  }, [item.quantity, qtyScale]);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Top row: photo + name/price + remove */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <FoodTile
          itemId={item.itemId}
          emoji={emoji}
          size={48}
          fontSize={24}
          radius={12}
        />

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Text
              style={{
                color: colors.text1,
                fontSize: 15,
                fontWeight: "600",
                flex: 1,
              }}
            >
              {item.name}
            </Text>
            <Pressable hitSlop={8} onPress={onRemove} style={{ padding: 2 }}>
              <X size={15} color={colors.text3} />
            </Pressable>
          </View>

          <Text style={{ color: colors.text2, fontSize: 12, marginTop: 2 }}>
            ${item.price.toFixed(2)} each
          </Text>

          {item.modifiers && item.modifiers.length > 0 ? (
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 9999,
                backgroundColor: colors.elevated,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: colors.accentHi,
                  fontSize: 11,
                  fontWeight: "500",
                }}
              >
                {item.modifiers.join(", ")}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Bottom row: stepper (alignSelf:flex-start) | line total (right) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.elevated,
            borderRadius: 9999,
            padding: 4,
          }}
        >
          <Pressable
            onPress={onDecrement}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Minus size={16} color={colors.text2} />
          </Pressable>

          <Animated.View
            style={{
              width: 32,
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: qtyScale }],
            }}
          >
            <Text
              style={{
                color: colors.text1,
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {item.quantity}
            </Text>
          </Animated.View>

          <Pressable
            onPress={onIncrement}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.accent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={16} color="white" strokeWidth={2.5} />
          </Pressable>
        </View>

        <Text style={{ color: colors.text1, fontSize: 15, fontWeight: "700" }}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};
