import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { ShoppingBag, Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../../store/cartStore";
import { useMenuStore } from "../../store/menuStore";
import { CartItemRow } from "../../components/CartItemRow";
import { GradientButton } from "../../components/GradientButton";
import { EmptyState } from "../../components/EmptyState";
import { AnimatedScreen } from "../../components/AnimatedScreen";
import { colors } from "../../constants/colors";

export default function CartScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const items = useCartStore((s) => s.items);
  const menu = useMenuStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.calculateSubtotal());
  const tax = useCartStore((s) => s.calculateTax());
  const total = useCartStore((s) => s.calculateTotal());

  const [footerHeight, setFooterHeight] = useState(180);

  const handleCheckout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push("/checkout");
  };

  const emojiFor = (itemId: string) =>
    menu.find((m) => m.id === itemId)?.emoji ?? "🍽️";

  // ---------- Empty cart state ----------
  if (items.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.bg }}
        edges={["top"]}
      >
        <AnimatedScreen>
          <View className="px-4 pt-2 pb-4">
            <Text
              style={{ color: colors.text1 }}
              className="font-bold text-[22px] tracking-tight"
            >
              Your Cart
            </Text>
            <Text style={{ color: colors.text2 }} className="text-sm mt-1">
              Review your order before checkout.
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingBottom: tabBarHeight,
            }}
          >
            <EmptyState
              icon={<ShoppingBag size={22} color={colors.text2} />}
              title="Your cart is waiting."
              subtitle="Add something from the menu or ask the AI waiter."
              cta={
                <View style={{ gap: 10 }}>
                  <GradientButton
                    label="Browse menu"
                    onPress={() => router.push("/")}
                  />
                  <GradientButton
                    variant="ghost"
                    label="Ask AI waiter"
                    icon={<Sparkles size={14} color={colors.ai} />}
                    onPress={() => router.push("/ai-waiter")}
                  />
                </View>
              }
            />
          </View>
        </AnimatedScreen>
      </SafeAreaView>
    );
  }

  // ---------- Populated cart ----------
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <AnimatedScreen>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: footerHeight + 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="pb-3 flex-row items-start justify-between">
              <View>
                <Text
                  style={{ color: colors.text1 }}
                  className="font-bold text-[22px] tracking-tight"
                >
                  Your Cart
                </Text>
                <Text
                  style={{ color: colors.text2 }}
                  className="text-sm mt-1"
                >
                  Review your order before checkout.
                </Text>
              </View>
              <Pressable onPress={clearCart} hitSlop={8} className="pt-1.5">
                <Text
                  style={{ color: colors.text2 }}
                  className="text-sm font-medium"
                >
                  Clear
                </Text>
              </Pressable>
            </View>

            {items.map((item) => (
              <CartItemRow
                key={item.itemId}
                item={item}
                emoji={emojiFor(item.itemId)}
                onIncrement={() =>
                  updateQuantity(item.itemId, item.quantity + 1)
                }
                onDecrement={() =>
                  updateQuantity(item.itemId, item.quantity - 1)
                }
                onRemove={() => removeItem(item.itemId)}
              />
            ))}
          </ScrollView>

          {/* Sticky footer above the translucent tab bar. */}
          <View
            onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: tabBarHeight,
              paddingHorizontal: 16,
              paddingBottom: 12,
              paddingTop: 4,
              backgroundColor: colors.bg,
            }}
          >
            <LinearGradient
              colors={["rgba(8,8,10,0)", colors.bg]}
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: -24,
                height: 24,
              }}
            />

            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 20,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Row label="Subtotal" value={subtotal} />
              <Row label="Estimated tax" value={tax} />
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: 10,
                }}
              />
              <Row label="Total" value={total} bold />
            </View>

            <GradientButton
              label={`Place order · $${total.toFixed(2)}`}
              onPress={handleCheckout}
            />
          </View>
        </View>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const Row: React.FC<{ label: string; value: number; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => (
  <View className="flex-row items-center justify-between py-1">
    <Text
      style={{ color: bold ? colors.text1 : colors.text2 }}
      className={bold ? "font-bold text-base" : "text-sm"}
    >
      {label}
    </Text>
    <Text
      style={{ color: colors.text1 }}
      className={bold ? "font-bold text-base" : "text-sm font-semibold"}
    >
      ${value.toFixed(2)}
    </Text>
  </View>
);
