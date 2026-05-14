import React, { useEffect, useState } from "react";
import {
  Image,
  ImageErrorEventData,
  NativeSyntheticEvent,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../constants/colors";
import { photoFor } from "../lib/foodImages";

interface Props {
  itemId: string;
  emoji: string;
  size?: number;
  radius?: number;
  fontSize?: number;
  style?: ViewStyle;
}

/**
 * Photo tile with a graceful loading state.
 *
 * Stack:
 *   • Emoji-on-graphite "well" rendered first, always at its natural opacity.
 *   • Unsplash photo layered on top, opacity 0 → 1 over 200ms on load.
 *   • Well's opacity is (1 - photoOpacity), so it visibly fades out as the
 *     photo decodes. README §Assets requires the fallback to be the loading
 *     state, not a post-failure state.
 *   • If the network fails, photo stays at opacity 0, well stays at 1.
 *
 * Dev-time diagnostics are emitted with `console.warn` when a photo URL is
 * missing for an item id or when the Image errors — these surface in Metro.
 */
export const FoodTile: React.FC<Props> = ({
  itemId,
  emoji,
  size = 64,
  radius = 14,
  fontSize,
  style,
}) => {
  const url = photoFor(itemId);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (__DEV__ && !url) {
      console.warn(
        `[FoodTile] No Unsplash URL mapped for itemId="${itemId}". ` +
          `Check apps/mobile/lib/foodImages.ts keys.`
      );
    }
  }, [itemId, url]);

  const photoOpacity = useSharedValue(0);

  const photoStyle = useAnimatedStyle(() => ({
    opacity: photoOpacity.value,
  }));
  const wellStyle = useAnimatedStyle(() => ({
    opacity: 1 - photoOpacity.value,
  }));

  const handleLoad = () => {
    photoOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  };

  const handleError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    if (__DEV__) {
      console.warn(
        `[FoodTile] Image failed for itemId="${itemId}" url="${url}"`,
        e?.nativeEvent?.error ?? "(no nativeEvent.error)"
      );
    }
    setErrored(true);
    photoOpacity.value = withTiming(0, { duration: 120 });
  };

  const showPhoto = !!url && !errored;

  const tile: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#1B1B20",
    ...style,
  };

  const WellGradient = (
    <LinearGradient
      colors={GRADIENTS.emojiWell}
      start={{ x: 0.25, y: 0.15 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: fontSize ?? Math.round(size * 0.5) }}>
        {emoji}
      </Text>
    </LinearGradient>
  );

  if (!showPhoto) {
    return <View style={tile}>{WellGradient}</View>;
  }

  return (
    <View style={tile}>
      {/* Well underneath — fades out as photo fades in. */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, left: 0, width: size, height: size },
          wellStyle,
        ]}
      >
        {WellGradient}
      </Animated.View>

      {/* Photo crossfades from 0 → 1 on decode. Explicit pixel dimensions,
          not className, because NativeWind sizing on <Image> can no-op. */}
      <Animated.View
        style={[
          { position: "absolute", top: 0, left: 0, width: size, height: size },
          photoStyle,
        ]}
      >
        <Image
          source={{ uri: url }}
          onLoad={handleLoad}
          onError={handleError}
          width={size}
          height={size}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};
