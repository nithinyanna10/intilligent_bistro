import React from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../constants/colors";

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "muted" | "ghost";
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = "primary",
}) => {
  if (variant === "ghost") {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={{ opacity: disabled ? 0.5 : 1 }}
        className="bg-bistro-card border border-bistro-border rounded-2xl py-3.5 px-5"
      >
        <View className="flex-row items-center justify-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className="text-bistro-text font-semibold text-[15px]">
            {label}
          </Text>
        </View>
      </Pressable>
    );
  }

  const colors =
    variant === "primary" ? GRADIENTS.accentCta : (["#1F1F22", "#161618"] as const);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <LinearGradient
        colors={colors}
        // 180° top→bottom
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.10)",
          shadowColor: variant === "primary" ? "#F97316" : "#000",
          shadowOpacity: variant === "primary" ? 0.18 : 0,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <View className="flex-row items-center justify-center">
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              {icon ? <View className="mr-2">{icon}</View> : null}
              <Text className="text-white font-semibold text-[15px]">
                {label}
              </Text>
            </>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};
