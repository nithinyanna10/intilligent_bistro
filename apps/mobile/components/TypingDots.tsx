import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../constants/colors";

/**
 * Three lavender dots that pulse in sequence with a soft AI-color glow.
 *
 * Per README §AI Waiter (#15): opacity 0.30 → 1.0, scale 0.85 → 1.0, 1.4 s cycle
 * with 180 ms stagger between dots. iOS gets a 12-px shadow glow at the peak;
 * Android falls back to just the dot itself (no native equivalent for radial
 * non-rectangular shadows).
 */
const DOT_SIZE = 6;
const PERIOD = 1400;
const STAGGER = 180;

const Dot: React.FC<{ delay: number }> = ({ delay }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    // 0 → 1 → 0 over a full period; loops forever, with an initial delay.
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: PERIOD * 0.3,
            easing: Easing.out(Easing.cubic),
          }),
          withTiming(0, {
            duration: PERIOD * 0.7,
            easing: Easing.in(Easing.cubic),
          })
        ),
        -1,
        false
      )
    );
  }, [progress, delay]);

  const dotStyle = useAnimatedStyle(() => {
    // Map progress (0..1) → opacity (0.30..1.0) and scale (0.85..1.0).
    const opacity = 0.3 + progress.value * 0.7;
    const scale = 0.85 + progress.value * 0.15;
    return {
      opacity,
      transform: [{ scale }],
      // Glow intensity rides with the pulse.
      shadowOpacity: Platform.OS === "ios" ? 0.2 + progress.value * 0.4 : 0,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: colors.ai,
          shadowColor: colors.ai,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
        },
        dotStyle,
      ]}
    />
  );
};

export const TypingDots: React.FC = () => (
  <View className="flex-row items-center" style={{ gap: 5 }}>
    <Dot delay={0} />
    <Dot delay={STAGGER} />
    <Dot delay={STAGGER * 2} />
  </View>
);
