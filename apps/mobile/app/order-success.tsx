import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { useCartStore } from "../store/cartStore";
import { colors } from "../constants/colors";

const AUTO_RETURN_MS = 2500;
const CHECK_SIZE = 88;
const RING_SIZE = 88;

export default function OrderSuccessScreen() {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  // ---- Checkmark spring (scale 0 → 1.1 → 1 over 500ms) ----
  const checkScale = useSharedValue(0);
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  // ---- Looping ring (scale 1 → 2.5 + opacity 0.3 → 0 over 1.2s) ----
  const ring = useSharedValue(0);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(ring.value, [0, 1], [1, 2.5]) }],
    opacity: interpolate(ring.value, [0, 1], [0.3, 0]),
  }));

  useEffect(() => {
    // Success haptic on mount.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );

    // Checkmark entry.
    checkScale.value = withSequence(
      withTiming(1.1, { duration: 300, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );

    // Ring loop.
    ring.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) }),
      -1,
      false
    );

    // Auto-return: navigate home and clear the cart so the badge resets.
    const t = setTimeout(() => {
      clearCart();
      router.replace("/");
    }, AUTO_RETURN_MS);

    return () => clearTimeout(t);
  }, [checkScale, ring, clearCart, router]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <View
        style={{
          width: 200,
          height: 200,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        {/* Expanding lavender ring (loop) */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              width: RING_SIZE,
              height: RING_SIZE,
              borderRadius: RING_SIZE / 2,
              borderWidth: 2,
              borderColor: colors.ai,
            },
            ringStyle,
          ]}
        />
        {/* Checkmark disc */}
        <Animated.View
          style={[
            {
              width: CHECK_SIZE,
              height: CHECK_SIZE,
              borderRadius: CHECK_SIZE / 2,
              backgroundColor: colors.ai20,
              borderWidth: 1,
              borderColor: colors.ai40,
              alignItems: "center",
              justifyContent: "center",
            },
            checkStyle,
          ]}
        >
          <Check size={42} color={colors.ai} strokeWidth={3} />
        </Animated.View>
      </View>

      <Text
        style={{
          color: colors.text1,
          fontSize: 28,
          fontWeight: "700",
          letterSpacing: -0.6,
        }}
      >
        Order placed
      </Text>
      <Text
        style={{
          color: colors.text2,
          fontSize: 14,
          marginTop: 8,
          textAlign: "center",
        }}
      >
        Estimated ready time: 18–25 min
      </Text>

      <Pressable
        // Placeholder — no destination yet.
        onPress={() => {}}
        hitSlop={10}
        style={{ marginTop: 28 }}
      >
        <Text
          style={{
            color: colors.text2,
            fontSize: 13,
            fontWeight: "500",
            textDecorationLine: "underline",
          }}
        >
          View order
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
