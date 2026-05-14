import { Easing } from "react-native";

// Shared motion language for the production polish pass.
// Keep durations conservative — these are felt, not noticed.
export const M = {
  pressSpring: { damping: 15, stiffness: 300 },
  entrySpring: { damping: 20, stiffness: 180 },
  fadeTiming: { duration: 200, easing: Easing.out(Easing.cubic) },
  stagger: 40,
} as const;
