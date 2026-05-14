import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { ChatMessage } from "../types/ai";
import { colors } from "../constants/colors";

interface Props {
  message: ChatMessage;
}

export const ChatBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === "user";

  // Mount fade-up (README animation #16 — same recipe for chat bubbles).
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

  if (isUser) {
    return (
      <Animated.View
        className="flex-row justify-end mb-2.5"
        style={{ opacity, transform: [{ translateY }] }}
      >
        <View
          className="px-3.5 py-2.5 max-w-[78%]"
          style={{
            backgroundColor: colors.userBubble,
            borderRadius: 18,
            borderBottomRightRadius: 6,
          }}
        >
          <Text className="text-white text-sm leading-5">{message.text}</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      className="flex-row items-end mb-2.5"
      style={{ gap: 8, opacity, transform: [{ translateY }] }}
    >
      {/* Lavender AI avatar disc (README §AI Waiter) */}
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.elevated,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.ai40,
        }}
      >
        <Sparkles size={12} color={colors.ai} />
      </View>
      <View
        className="px-3.5 py-2.5 max-w-[78%]"
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.ai20,
          borderRadius: 18,
          borderBottomLeftRadius: 6,
        }}
      >
        <Text style={{ color: colors.text1 }} className="text-sm leading-5">
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
};
