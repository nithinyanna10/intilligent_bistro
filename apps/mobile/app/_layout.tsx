import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useMenuStore } from "../store/menuStore";

export default function RootLayout() {
  const loadMenu = useMenuStore((s) => s.loadMenu);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#08080A" },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="checkout"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="order-success"
          options={{
            presentation: "fullScreenModal",
            animation: "fade",
            gestureEnabled: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
