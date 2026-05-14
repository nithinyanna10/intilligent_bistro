import React, { useEffect, useRef } from "react";
import { Animated, Easing, ViewStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Mount transition: fade-up (opacity 0→1, translateY 8→0) over 240ms.
 */
export const AnimatedScreen: React.FC<Props> = ({ children, style }) => {
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

  return (
    <Animated.View
      style={[{ flex: 1, opacity, transform: [{ translateY }] }, style]}
    >
      {children}
    </Animated.View>
  );
};
