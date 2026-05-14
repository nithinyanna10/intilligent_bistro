import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  emoji: string;
  size?: number;
  fontSize?: number;
  radius?: number;
  style?: ViewStyle;
}

/**
 * Soft graphite "well" that holds an emoji.
 * Approximates the radial gradient from the handoff with a diagonal linear
 * gradient (radial isn't supported by expo-linear-gradient).
 */
export const EmojiTile: React.FC<Props> = ({
  emoji,
  size = 64,
  fontSize = 32,
  radius = 12,
  style,
}) => (
  <LinearGradient
    colors={["#2E2E32", "#18181B"]}
    start={{ x: 0.25, y: 0.15 }}
    end={{ x: 1, y: 1 }}
    style={[
      {
        width: size,
        height: size,
        borderRadius: radius,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
      },
      style,
    ]}
  >
    <View>
      <Text style={{ fontSize }}>{emoji}</Text>
    </View>
  </LinearGradient>
);
