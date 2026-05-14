import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Check, RotateCcw, Sparkles } from "lucide-react-native";
import { ChatBubble } from "../../components/ChatBubble";
import { SuggestedPrompt } from "../../components/SuggestedPrompt";
import { ActionPreviewCard } from "../../components/ActionPreviewCard";
import { TypingDots } from "../../components/TypingDots";
import { AnimatedScreen } from "../../components/AnimatedScreen";
import { AmbientAiGlow } from "../../components/AmbientAiGlow";
import { Composer } from "../../components/Composer";
import { useChatStore } from "../../store/chatStore";
import { useCartStore } from "../../store/cartStore";
import { useMenuStore } from "../../store/menuStore";
import { api } from "../../lib/api";
import { ChatMessage } from "../../types/ai";
import { colors } from "../../constants/colors";

const SUGGESTIONS = [
  "Add two spicy chicken sandwiches",
  "What's popular?",
  "I want something vegetarian",
  "Add a drink",
  "Clear my cart",
];

const MUTATING = new Set([
  "ADD_ITEM",
  "REMOVE_ITEM",
  "UPDATE_QUANTITY",
  "UPDATE_MODIFIER",
  "CLEAR_CART",
]);

const SuccessStrip: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -6,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => onDone());
    }, 2400);
    return () => clearTimeout(t);
  }, [opacity, translateY, onDone]);

  return (
    <Animated.View
      className="mx-4 mb-2 self-start flex-row items-center px-3 py-2 rounded-xl"
      style={{
        gap: 8,
        backgroundColor: "rgba(61,214,140,0.10)",
        borderWidth: 1,
        borderColor: "rgba(61,214,140,0.25)",
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Check size={13} color={colors.success} strokeWidth={2.4} />
      <Text
        style={{ color: colors.success }}
        className="text-xs font-semibold"
      >
        Cart updated
      </Text>
    </Animated.View>
  );
};

export default function AiWaiterScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const messages = useChatStore((s) => s.messages);
  const loading = useChatStore((s) => s.loading);
  const error = useChatStore((s) => s.error);
  const pushUser = useChatStore((s) => s.pushUser);
  const pushAssistant = useChatStore((s) => s.pushAssistant);
  const setLoading = useChatStore((s) => s.setLoading);
  const setError = useChatStore((s) => s.setError);
  const resetChat = useChatStore((s) => s.reset);

  const cart = useCartStore((s) => s.items);
  const applyActions = useCartStore((s) => s.applyActions);
  const menu = useMenuStore((s) => s.items);

  const [input, setInput] = useState("");
  const [composerFocused, setComposerFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToEnd = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      pushUser(trimmed);
      setInput("");
      setLoading(true);
      setError(null);
      scrollToEnd();

      try {
        const result = await api.parseOrder(trimmed, cart);
        pushAssistant({
          text: result.assistantMessage,
          actions: result.actions,
        });
        const mutates = result.actions.some((a) => MUTATING.has(a.type));
        applyActions(result.actions, menu);
        if (mutates) setShowSuccess(true);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
        pushAssistant({
          text: "I'm having trouble reaching the kitchen. Try again in a moment.",
        });
      } finally {
        setLoading(false);
        scrollToEnd();
      }
    },
    [
      cart,
      menu,
      loading,
      pushUser,
      pushAssistant,
      applyActions,
      setLoading,
      setError,
    ]
  );

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View>
      <ChatBubble message={item} />
      {item.role === "assistant" && item.actions && item.actions.length > 0 ? (
        <ActionPreviewCard actions={item.actions} menu={menu} />
      ) : null}
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <AnimatedScreen>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={tabBarHeight}
          style={{ flex: 1 }}
        >
          {/* Ambient lavender glow — pulses while composer is focused */}
          <AmbientAiGlow active={composerFocused} />

          {/* Header */}
          <View className="px-4 pt-1 pb-3.5 flex-row items-center justify-between">
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.elevated,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.ai40,
                  // Soft lavender outer glow on iOS
                  shadowColor: colors.ai,
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 0 },
                }}
              >
                <Sparkles size={15} color={colors.ai} />
              </View>
              <View>
                <Text
                  style={{ color: colors.text1 }}
                  className="font-bold text-base tracking-tight"
                >
                  AI Waiter
                </Text>
                <Text
                  style={{ color: colors.text2, fontSize: 11.5 }}
                  className="mt-0.5"
                >
                  Tell me what you'd like to order
                </Text>
              </View>
            </View>
            <Pressable
              onPress={resetChat}
              hitSlop={8}
              style={{
                backgroundColor: colors.card,
                borderRadius: 999,
                padding: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <RotateCcw size={14} color={colors.text2} />
            </Pressable>
          </View>

          {showSuccess ? (
            <SuccessStrip onDone={() => setShowSuccess(false)} />
          ) : null}

          {/* Messages — flex:1 so it fills available space and pushes the
              suggestion strip + composer to the bottom of the screen. */}
          <FlatList<ChatMessage>
            ref={listRef}
            style={{ flex: 1 }}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 8,
            }}
            onContentSizeChange={scrollToEnd}
            ListFooterComponent={
              loading ? (
                <View
                  className="flex-row items-end mb-2.5"
                  style={{ gap: 8 }}
                >
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
                    style={{
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 18,
                      borderBottomLeftRadius: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TypingDots />
                    <Text
                      style={{ color: colors.text2 }}
                      className="text-xs"
                    >
                      thinking…
                    </Text>
                  </View>
                </View>
              ) : null
            }
          />

          {/* Footer: suggestions + composer. Sits above the translucent tab
              bar; the tab bar's BlurView shows the chat list behind it. */}
          <View style={{ paddingBottom: tabBarHeight }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 8,
                gap: 8,
                alignItems: "center",
              }}
            >
              {SUGGESTIONS.map((s) => (
                <SuggestedPrompt
                  key={s}
                  label={s}
                  onPress={() => send(s)}
                />
              ))}
            </ScrollView>

            <Composer
              value={input}
              onChangeText={setInput}
              onSubmit={() => send(input)}
              loading={loading}
              onFocusChange={setComposerFocused}
            />

            {error ? (
              <Text className="text-red-400 text-xs px-4 pb-2">{error}</Text>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </AnimatedScreen>
    </SafeAreaView>
  );
}
