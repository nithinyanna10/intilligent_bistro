import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {
  Apple,
  Check,
  ChevronLeft,
  CreditCard,
} from "lucide-react-native";
import { useCartStore } from "../store/cartStore";
import { useMenuStore } from "../store/menuStore";
import { colors, GRADIENTS } from "../constants/colors";

type Fulfillment = "pickup" | "delivery";

const DELIVERY_FEE = 2.99;

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.calculateSubtotal());
  const tax = useCartStore((s) => s.calculateTax());
  const menu = useMenuStore((s) => s.items);

  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));

  const nameOf = (id: string) =>
    menu.find((m) => m.id === id)?.name ?? id;

  const handlePay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace("/order-success");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 8,
              marginBottom: 12,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={18} color={colors.text1} />
            </Pressable>
            <Text
              style={{
                color: colors.text1,
                fontSize: 24,
                fontWeight: "700",
                letterSpacing: -0.4,
                marginLeft: 4,
              }}
            >
              Checkout
            </Text>
          </View>

          {/* Delivery section */}
          <SectionHeader>Delivery</SectionHeader>
          <Segmented
            value={fulfillment}
            onChange={setFulfillment}
          />

          {fulfillment === "delivery" ? (
            <Row>
              <Text style={{ color: colors.text1, fontSize: 14 }}>
                123 Main St, Downtown
              </Text>
              <Pressable hitSlop={6}>
                <Text
                  style={{
                    color: colors.ai,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  Change
                </Text>
              </Pressable>
            </Row>
          ) : null}

          <Row>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.success,
                }}
              />
              <Text style={{ color: colors.text1, fontSize: 14 }}>
                Ready in 18–25 min
              </Text>
            </View>
          </Row>

          {/* Payment method */}
          <SectionHeader style={{ marginTop: 20 }}>
            Payment method
          </SectionHeader>

          <PaymentRow
            selected
            icon={<Apple size={18} color={colors.text1} />}
            label="Apple Pay"
          />

          <PaymentRow
            disabled
            icon={<CreditCard size={18} color={colors.text3} />}
            label="•••• 4242 Visa"
          />

          {/* Order summary */}
          <SectionHeader style={{ marginTop: 20 }}>
            Order summary
          </SectionHeader>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {items.map((it) => (
              <View
                key={it.itemId}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{ color: colors.text1, fontSize: 13 }}
                  numberOfLines={1}
                >
                  {it.quantity}× {nameOf(it.itemId)}
                </Text>
                <Text
                  style={{
                    color: colors.text1,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  ${(it.price * it.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
                marginVertical: 10,
              }}
            />
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Estimated tax" value={tax} />
            <SummaryRow
              label={
                fulfillment === "delivery" ? "Delivery fee" : "Pickup fee"
              }
              value={deliveryFee}
            />
            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
                marginVertical: 10,
              }}
            />
            <SummaryRow label="Total" value={total} bold />
          </View>
        </ScrollView>

        {/* Sticky Pay button */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: insets.bottom + 12,
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
          <Pressable onPress={handlePay}>
            <LinearGradient
              colors={GRADIENTS.accentCta}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
                shadowColor: colors.accent,
                shadowOpacity: 0.35,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 8 },
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                Pay · ${total.toFixed(2)}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---------------- subcomponents ----------------

const SectionHeader: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => (
  <Text
    style={[
      {
        color: colors.text2,
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 8,
      },
      style,
    ]}
  >
    {children}
  </Text>
);

const Segmented: React.FC<{
  value: Fulfillment;
  onChange: (v: Fulfillment) => void;
}> = ({ value, onChange }) => (
  <View
    style={{
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 9999,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
    }}
  >
    {(["pickup", "delivery"] as const).map((opt) => {
      const active = value === opt;
      return (
        <Pressable
          key={opt}
          onPress={() => onChange(opt)}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 9999,
            backgroundColor: active ? colors.elevated : "transparent",
            alignItems: "center",
            borderWidth: 1,
            borderColor: active ? colors.ai40 : "transparent",
          }}
        >
          <Text
            style={{
              color: active ? colors.text1 : colors.text2,
              fontSize: 13,
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {opt}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View
    style={{
      backgroundColor: colors.card,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    {children}
  </View>
);

const PaymentRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
}> = ({ icon, label, selected, disabled }) => {
  const shake = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shake, {
        toValue: -6,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 6,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -4,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 60,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ translateX: shake }] }}>
      <Pressable
        onPress={disabled ? triggerShake : undefined}
        style={{
          backgroundColor: colors.card,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderWidth: 1,
          borderColor: selected ? colors.ai40 : colors.border,
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: colors.elevated,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            color: disabled ? colors.text3 : colors.text1,
            fontSize: 14,
            fontWeight: "600",
            flex: 1,
          }}
        >
          {label}
        </Text>
        {selected ? <Check size={16} color={colors.ai} /> : null}
      </Pressable>
    </Animated.View>
  );
};

const SummaryRow: React.FC<{
  label: string;
  value: number;
  bold?: boolean;
}> = ({ label, value, bold }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 3,
    }}
  >
    <Text
      style={{
        color: bold ? colors.text1 : colors.text2,
        fontSize: bold ? 15 : 13,
        fontWeight: bold ? "700" : "500",
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        color: colors.text1,
        fontSize: bold ? 15 : 13,
        fontWeight: bold ? "700" : "600",
      }}
    >
      ${value.toFixed(2)}
    </Text>
  </View>
);
