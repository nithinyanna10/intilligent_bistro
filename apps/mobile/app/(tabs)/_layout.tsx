import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { UtensilsCrossed, Sparkles, ShoppingBag } from "lucide-react-native";
import { useCartStore } from "../../store/cartStore";
import { colors } from "../../constants/colors";

/**
 * Blur background for the tab bar.
 *
 * iOS: a real BlurView ("dark" tint, intensity 40) sitting under a 50%-alpha
 * graphite wash so the bar still feels solid in dark mode.
 *
 * Android: BlurView falls back to a non-blurred tinted view at runtime, so we
 * paint a slightly more opaque background here to match the visual weight.
 */
const TabBarBackground: React.FC = () => (
  <View style={StyleSheet.absoluteFill}>
    <BlurView
      intensity={Platform.OS === "ios" ? 40 : 0}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor:
            Platform.OS === "ios"
              ? "rgba(8,8,10,0.55)"
              : "rgba(8,8,10,0.92)",
        },
      ]}
    />
  </View>
);

const CartIcon = ({ color, size }: { color: string; size: number }) => {
  const count = useCartStore((s) => s.totalCount());
  return (
    <View>
      <ShoppingBag color={color} size={size} />
      {count > 0 ? (
        <View
          style={{
            position: "absolute",
            top: -6,
            right: -10,
            backgroundColor: colors.accent,
            borderRadius: 999,
            minWidth: 18,
            height: 18,
            paddingHorizontal: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="text-white text-[10px] font-bold">{count}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopColor: "rgba(255,255,255,0.08)",
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 82,
          paddingTop: 10,
          paddingBottom: 28,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.text1,
        tabBarInactiveTintColor: colors.text3,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: "600",
          letterSpacing: 0.05,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <UtensilsCrossed color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-waiter"
        options={{
          title: "Waiter",
          // Lavender when the AI tab is focused; muted otherwise.
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: "600",
                letterSpacing: 0.05,
                color: focused ? colors.ai : colors.text3,
              }}
            >
              Waiter
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <Sparkles
              color={focused ? colors.ai : colors.text3}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <CartIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
