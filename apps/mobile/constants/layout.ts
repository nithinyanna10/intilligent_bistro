// Layout constants reused across screens.
//
// The tab bar is `position: "absolute"` (BlurView translucent) — every screen
// must reserve bottom space equal to TAB_BAR_HEIGHT or the content draws under
// the bar.
//
// Prefer `useBottomTabBarHeight()` from "@react-navigation/bottom-tabs" inside
// tab screens — it returns the actual measured height. Use this constant only
// when a hook isn't available (e.g. shared constants or estimating layout
// before mount).

export const TAB_BAR_HEIGHT = 82;
