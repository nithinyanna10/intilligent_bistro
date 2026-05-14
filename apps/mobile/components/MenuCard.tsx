import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Plus, Check, Flame, Leaf, Star } from "lucide-react-native";
import { MenuItem, MenuTag } from "../types/menu";
import { FoodTile } from "./FoodTile";
import { TAG_PRIORITY, colors } from "../constants/colors";

interface Props {
  item: MenuItem;
  onAdd: () => void;
}

const TAG_STYLES: Record<
  MenuTag,
  { bg: string; fg: string; label: string; icon: React.ReactNode }
> = {
  spicy: {
    bg: "rgba(255,106,26,0.12)",
    fg: "#FF6A1A",
    label: "Spicy",
    icon: <Flame size={10} color="#FF6A1A" />,
  },
  popular: {
    bg: "rgba(163,156,255,0.12)",
    fg: "#A39CFF",
    label: "Popular",
    icon: <Star size={10} color="#A39CFF" />,
  },
  vegan: {
    bg: "rgba(61,214,140,0.12)",
    fg: "#3DD68C",
    label: "Vegan",
    icon: <Leaf size={10} color="#3DD68C" />,
  },
};

const pickPrimaryTag = (tags: MenuTag[]): MenuTag | null => {
  for (const candidate of TAG_PRIORITY) {
    if (tags.includes(candidate)) return candidate;
  }
  return null;
};

// Tap-feedback springs (README §motion #1)
const PRESS_SPRING = { damping: 15, stiffness: 300 };

export const MenuCard: React.FC<Props> = ({ item, onAdd }) => {
  const [justAdded, setJustAdded] = useState(false);

  // Row press scale (0.98 on press)
  const rowScale = useSharedValue(1);
  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));

  // + button bounce (1 → 1.2 → 1 over 200ms)
  const addScale = useSharedValue(1);
  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));

  const primaryTag = pickPrimaryTag(item.tags);

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      // Haptics fail silently on unsupported devices / simulator without it.
    });
    onAdd();
    setJustAdded(true);
    addScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setTimeout(() => setJustAdded(false), 300);
  };

  return (
    <Pressable
      // Delay onPressIn by ~120ms so a quick drag-to-scroll on iOS isn't
      // captured as a press — without this the parent ScrollView's pan
      // gesture loses to the Pressable's touchable area and the list
      // feels stuck. Press animation still feels instant when you tap.
      unstable_pressDelay={120}
      onPressIn={() => {
        rowScale.value = withSpring(0.98, PRESS_SPRING);
      }}
      onPressOut={() => {
        rowScale.value = withSpring(1, PRESS_SPRING);
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: colors.card,
            borderRadius: 18,
            padding: 14,
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            // Faint 1px inner top highlight — catches simulated light.
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.04)",
          },
          rowStyle,
        ]}
      >
        <FoodTile
          itemId={item.id}
          emoji={item.emoji}
          size={64}
          fontSize={32}
          radius={14}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{ color: colors.text1, fontSize: 15, fontWeight: "600" }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={{ color: colors.text2, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {item.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 8,
            }}
          >
            <Text
              style={{ color: colors.accent, fontSize: 14, fontWeight: "700" }}
            >
              ${item.price.toFixed(2)}
            </Text>
            {primaryTag ? <TagPill tag={primaryTag} /> : null}
          </View>
        </View>

        <Animated.View style={addStyle}>
          <Pressable
            onPress={handleAdd}
            hitSlop={8}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: justAdded ? colors.success : colors.elevated,
              borderWidth: 1,
              borderColor: justAdded
                ? "rgba(61,214,140,0.4)"
                : "rgba(255,255,255,0.16)",
            }}
          >
            {justAdded ? (
              <Check size={16} color={colors.text1} strokeWidth={2.5} />
            ) : (
              <Plus size={16} color={colors.text1} strokeWidth={2.5} />
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const TagPill: React.FC<{ tag: MenuTag }> = ({ tag }) => {
  const t = TAG_STYLES[tag];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 9999,
        backgroundColor: t.bg,
      }}
    >
      {t.icon}
      <Text style={{ color: t.fg, fontSize: 11, fontWeight: "600" }}>
        {t.label}
      </Text>
    </View>
  );
};
