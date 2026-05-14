import React from "react";
import { Pressable, Text } from "react-native";
import { colors } from "../constants/colors";

interface Props {
  label: string;
  onPress: () => void;
}

/**
 * Self-sizing pill. Pinned with `flexShrink: 0` and `alignSelf: "flex-start"`
 * so it can never stretch to container width — the bug that turned chips into
 * giant ovals inside an unintended flex column.
 *
 * Layout uses style={{...}} (not className) for the same reason as CategoryChip.
 */
export const SuggestedPrompt: React.FC<Props> = ({ label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flexShrink: 0,
      alignSelf: "flex-start",
      maxWidth: 240,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 9999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <Text
      numberOfLines={1}
      style={{
        fontSize: 12.5,
        fontWeight: "500",
        color: colors.text1,
      }}
    >
      {label}
    </Text>
  </Pressable>
);
