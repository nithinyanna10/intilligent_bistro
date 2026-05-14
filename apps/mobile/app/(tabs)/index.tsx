import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  RefreshCw,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useMenuStore } from "../../store/menuStore";
import { useCartStore } from "../../store/cartStore";
import { CATEGORIES, CategoryId, GRADIENTS } from "../../constants/colors";
import { CategoryChip } from "../../components/CategoryChip";
import { MenuCard } from "../../components/MenuCard";
import { FoodTile } from "../../components/FoodTile";
import { AnimatedScreen } from "../../components/AnimatedScreen";
import { MenuItem } from "../../types/menu";

export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  console.log(
    "[Menu] insets.bottom =",
    insets.bottom,
    "| computed paddingBottom =",
    Math.max(insets.bottom, 34) + 100
  );
  const { items, loading, error, loadMenu } = useMenuStore();
  const addItem = useCartStore((s) => s.addItem);

  const [category, setCategory] = useState<CategoryId>("all");

  const filtered = useMemo(() => {
    if (category === "all") return items;
    if (category === "popular")
      return items.filter((i) => i.tags.includes("popular"));
    return items.filter((i) => i.category === category);
  }, [items, category]);

  const featured = useMemo<MenuItem | undefined>(
    () => items.find((i) => i.id === "spicy_chicken_sandwich") ?? items[0],
    [items]
  );

  const renderHeader = () => (
    <View>
      {/* Status row */}
      <View
        className="flex-row items-center pt-1 pb-3"
        style={{ gap: 8 }}
      >
        <View className="w-1.5 h-1.5 rounded-full bg-bistro-success" />
        <Text className="text-bistro-textMuted text-xs font-medium">
          Open now{" "}
          <Text className="text-bistro-textSubtle">·</Text> 18–25 min
        </Text>
        <View className="flex-1" />
        <MapPin size={12} color="#A1A1AA" />
        <Text className="text-bistro-textMuted text-xs font-medium">
          Downtown
        </Text>
      </View>

      {/* Hero — plain wordmark, no card, no gradient */}
      <View className="mb-4">
        <Text className="text-bistro-text font-bold text-2xl tracking-tight">
          The Intelligent Bistro
        </Text>
        <Text className="text-bistro-textMuted text-sm mt-1 leading-5">
          Seasonal comfort food with an AI ordering assistant.
        </Text>
      </View>

      {/* AI callout — restrained graphite card */}
      <Pressable onPress={() => router.push("/ai-waiter")} className="mb-5">
        <LinearGradient
          colors={GRADIENTS.card}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
          }}
        >
          <View className="flex-row items-center" style={{ gap: 12 }}>
            <View
              className="w-9 h-9 rounded-xl bg-bistro-elevated items-center justify-center"
              style={{
                borderWidth: 1,
                borderColor: "rgba(253,186,116,0.28)",
              }}
            >
              <Sparkles size={16} color="#FDBA74" />
            </View>
            <View className="flex-1">
              <Text className="text-bistro-text font-semibold text-sm">
                Need help ordering?
              </Text>
              <Text className="text-bistro-textMuted text-xs mt-0.5">
                Tell the AI waiter what you're craving.
              </Text>
            </View>
            <View
              className="flex-row items-center px-3 py-2 rounded-full bg-bistro-elevated"
              style={{
                gap: 4,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <Text className="text-bistro-text text-xs font-semibold">
                Start
              </Text>
              <ArrowRight size={12} color="#F8FAFC" />
            </View>
          </View>
        </LinearGradient>
      </Pressable>

      {/* Categories — horizontal ScrollView.
          Negative marginHorizontal removed: it extended the inner ScrollView's
          gesture surface into the outer vertical ScrollView's area, causing
          iOS to route vertical pans starting in this region to the inner
          horizontal recognizer and killing outer scroll. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        style={{ marginBottom: 20 }}
      >
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.label}
            active={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </ScrollView>

      {/* Featured today — single landscape card (only on "all") */}
      {category === "all" && featured ? (
        <View className="mb-5">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-bistro-text font-semibold text-[15px]">
              Featured today
            </Text>
            <Pressable onPress={() => setCategory("popular")}>
              <Text className="text-bistro-textMuted text-xs font-medium">
                See all
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={() => addItem(featured, 1)}>
            <LinearGradient
              colors={GRADIENTS.card}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                borderRadius: 16,
                padding: 10,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <FoodTile
                  itemId={featured.id}
                  emoji={featured.emoji}
                  size={72}
                  fontSize={38}
                  radius={14}
                />
                <View className="flex-1">
                  <View
                    className="flex-row items-center mb-1"
                    style={{ gap: 6 }}
                  >
                    <Text className="text-bistro-accentSoft text-[10px] font-semibold uppercase tracking-wider">
                      POPULAR
                    </Text>
                    <View className="w-1 h-1 rounded-full bg-bistro-textSubtle" />
                    <Text className="text-bistro-textMuted text-[10.5px] font-medium">
                      Today's pick
                    </Text>
                  </View>
                  <Text
                    className="text-bistro-text font-semibold"
                    style={{ fontSize: 14.5 }}
                  >
                    {featured.name}
                  </Text>
                  <View
                    className="flex-row items-center mt-1"
                    style={{ gap: 8 }}
                  >
                    <Text
                      className="text-bistro-accent font-bold"
                      style={{ fontSize: 13.5 }}
                    >
                      ${featured.price.toFixed(2)}
                    </Text>
                    <Text
                      className="text-bistro-textMuted flex-1"
                      style={{ fontSize: 11.5 }}
                      numberOfLines={1}
                    >
                      {featured.description}
                    </Text>
                  </View>
                </View>
                <ArrowRight size={16} color="#A1A1AA" />
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      ) : null}

      {/* Menu section header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-bistro-text font-semibold text-[15px]">
          {category === "all"
            ? "Menu"
            : CATEGORIES.find((c) => c.id === category)?.label}
        </Text>
        <Text className="text-bistro-textMuted text-xs font-medium">
          {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </Text>
      </View>
    </View>
  );

  if (loading && items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-bistro-bg items-center justify-center">
        <ActivityIndicator color="#FDBA74" size="large" />
        <Text className="text-bistro-textMuted mt-3 text-sm">
          Loading menu…
        </Text>
      </SafeAreaView>
    );
  }

  if (error && items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-bistro-bg items-center justify-center px-8">
        <Text style={{ fontSize: 48 }}>📡</Text>
        <Text className="text-bistro-text font-semibold text-lg mt-4 text-center">
          Can't reach the kitchen
        </Text>
        <Text className="text-bistro-textMuted text-sm mt-2 text-center">
          {error}
        </Text>
        <Pressable
          onPress={loadMenu}
          className="mt-6 bg-bistro-elevated px-5 py-3 rounded-full flex-row items-center"
          style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}
        >
          <RefreshCw size={14} color="#F8FAFC" />
          <Text className="text-bistro-text font-semibold ml-2">Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#08080A" }}
      edges={["top"]}
    >
      <AnimatedScreen>
        {/* ScrollView (not FlatList) because the menu is capped at 12 items —
            no virtualization needed, and a ScrollView is more forgiving with
            nested Pressables (Reanimated row scale) on iOS. */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            // Math.max(insets.bottom, 34) guarantees a 34px floor even if the
            // simulator reports 0 — robust regardless of insets value.
            paddingBottom: Math.max(insets.bottom, 34) + 100,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {renderHeader()}
          {filtered.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAdd={() => addItem(item, 1)}
            />
          ))}
        </ScrollView>
      </AnimatedScreen>
    </SafeAreaView>
  );
}
