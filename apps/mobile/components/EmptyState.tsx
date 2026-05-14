import React from "react";
import { Text, View } from "react-native";

interface Props {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({
  icon,
  title,
  subtitle,
  cta,
}) => (
  <View className="items-center justify-center py-12 px-8">
    <View
      className="w-14 h-14 rounded-2xl items-center justify-center mb-5 bg-bistro-elevated"
      style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}
    >
      {icon}
    </View>
    <Text className="text-bistro-text text-lg font-semibold text-center tracking-tight">
      {title}
    </Text>
    {subtitle ? (
      <Text className="text-bistro-textMuted text-sm mt-2 text-center leading-5">
        {subtitle}
      </Text>
    ) : null}
    {cta ? <View className="mt-6 w-full">{cta}</View> : null}
  </View>
);
