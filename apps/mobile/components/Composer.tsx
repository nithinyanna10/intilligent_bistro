import React from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ArrowUp } from "lucide-react-native";
import { colors } from "../constants/colors";

interface Props {
  value: string;
  onChangeText: (next: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
  onFocusChange?: (focused: boolean) => void;
}

/**
 * Pill input + send button with a lavender focus ring (README animation #13).
 *
 * On focus: a 4-px alpha lavender halo expands behind the pill and the pill
 * border switches from white-08 to lavender-60 over 200ms ease-out.
 *
 * The send button is graphite when empty and brightens to the warm orange
 * accent only when there's text to send.
 */
export const Composer: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmit,
  loading = false,
  placeholder = "Ask your waiter…",
  onFocusChange,
}) => {
  const focus = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: focus.value,
  }));
  const pillBorderStyle = useAnimatedStyle(() => ({
    // Border colour interpolates from white/08 → ai/60 as we focus.
    borderColor:
      focus.value > 0.5
        ? colors.ai60
        : "rgba(255,255,255,0.08)",
  }));

  const handleFocus = () => {
    focus.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    onFocusChange?.(true);
  };
  const handleBlur = () => {
    focus.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    onFocusChange?.(false);
  };

  const canSend = value.trim().length > 0 && !loading;

  return (
    <View className="px-4 pb-3 pt-1">
      <View style={{ position: "relative" }}>
        {/* Outer halo — lavender alpha ring, 4 px outside the pill */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              borderRadius: 9999,
              backgroundColor: colors.ai20,
            },
            ringStyle,
          ]}
        />

        {/* Pill with animated border colour */}
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderRadius: 9999,
              paddingLeft: 18,
              paddingRight: 6,
              paddingVertical: 6,
              gap: 8,
              borderWidth: 1,
            },
            pillBorderStyle,
          ]}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.text3}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={onSubmit}
            returnKeyType="send"
            editable={!loading}
            style={{
              flex: 1,
              color: colors.text1,
              fontSize: 14,
              paddingVertical: 6,
            }}
          />
          <Pressable
            onPress={onSubmit}
            disabled={!canSend}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: canSend ? colors.accent : colors.elevated,
            }}
          >
            <ArrowUp
              size={15}
              color={canSend ? "white" : colors.text3}
              strokeWidth={2.4}
            />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};
