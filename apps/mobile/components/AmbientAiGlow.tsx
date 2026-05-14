import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface Props {
  active: boolean;
}

/**
 * Bottom-up lavender gradient that pulses while the AI Waiter composer is
 * focused. Per README animation #14:
 *   opacity 0 → 0.45 → 0 on a 3.2 s loop, ease-in-out.
 *
 * Pointer events are off so it never blocks the chat list underneath.
 */
const HEIGHT = Math.round(Dimensions.get("window").height * 0.32);
const PERIOD = 3200;

export const AmbientAiGlow: React.FC<Props> = ({ active }) => {
  const intensity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      intensity.value = withRepeat(
        withSequence(
          withTiming(0.45, {
            duration: PERIOD / 2,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0, {
            duration: PERIOD / 2,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        false
      );
    } else {
      intensity.value = withTiming(0, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [active, intensity]);

  const style = useAnimatedStyle(() => ({ opacity: intensity.value }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: HEIGHT,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={["transparent", "rgba(163,156,255,0.55)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

// Suppress an unused-variable warning when callers don't pass children.
export const __ambientGlow = View;
