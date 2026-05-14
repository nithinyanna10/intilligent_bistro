import React from "react";
import { Pressable, Text } from "react-native";
import { colors } from "../constants/colors";

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

/**
 * Self-sizing pill for the Menu category strip.
 *
 * Active:   bg #1B1B20 (colors.elevated), 1 px #A39CFF @40% border (colors.ai40), text1.
 * Inactive: bg #16161A (colors.card),    1 px rgba(255,255,255,0.06) border, text2 (muted).
 *
 * `flexShrink: 0` is critical inside a horizontal ScrollView — otherwise long
 * labels ("Sandwiches") get clipped to "Sand...".
 */
export const CategoryChip: React.FC<Props> = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flexShrink: 0,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 9999,
      backgroundColor: active ? colors.elevated : colors.card,
      borderWidth: 1,
      borderColor: active ? colors.ai40 : "rgba(255,255,255,0.06)",
    }}
  >
    <Text
      numberOfLines={1}
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: active ? colors.text1 : colors.text2,
      }}
    >
      {label}
    </Text>
  </Pressable>
);
