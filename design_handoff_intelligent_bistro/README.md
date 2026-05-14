# Handoff: The Intelligent Bistro — Production Polish

## Overview

A refinement pass on the Intelligent Bistro mobile app (Expo + React Native + NativeWind + Zustand). Three screens — **Menu**, **AI Waiter**, **Cart** — refactored from a competent mockup into a shipped-product feel: layered graphite surfaces, a single warm orange CTA, a cool lavender AI accent, real food photography, and a documented motion language.

The existing Expo app at `apps/mobile/` is the target. **Do not rebuild from scratch** — this handoff describes incremental refactors to existing files, plus a small amount of net-new code (animation hooks, photo loader, theme system).

## About the design files

The HTML files in this bundle are **design references created in HTML / React + Babel** — they show the intended look, content, and behaviour. **Do not copy the HTML into the app.** The task is to recreate these designs in the existing **Expo + React Native + NativeWind** environment using its established patterns:

- Use `NativeWind` className strings, not inline CSS.
- Use `expo-linear-gradient`, not CSS gradients.
- Use `react-native-reanimated` v3 or React Native `Animated` for the motion spec, not CSS keyframes.
- Use `lucide-react-native` for icons (already a dep), not the Lucide CDN.
- The Zustand cart store and Express/Zod backend already exist — preserve them.

## Fidelity

**Hi-fi.** Pixel-perfect mockups with final colors, typography, spacing, surface depth, animations, and copy. Match the mockup. Where it conflicts with the existing app, the mockup wins.

---

## Screens

### 1 · Menu

**Purpose:** browse the menu, see what's featured, tap `+` to add items, optionally tap into the AI Waiter for natural-language ordering.

**Layout (top → bottom, inside `SafeAreaView` edges={["top"]}, horizontal gutter 16):**
1. **Status row** — small green pulsing dot + `Open now · 18–25 min` (muted 12), spacer, `📍 Downtown` icon + label (muted 12).
2. **Hero wordmark** — plain text. `The Intelligent Bistro` (bold 26, letter-spacing -0.022em), then `Seasonal comfort food with an AI ordering assistant.` (muted 13.5).
3. **Search bar** — `#16161A` card, rounded 14, `🔍 Search dishes or describe a craving…` placeholder in `#5C5C65`, AI sparkle on the right pulsing with the AI accent color.
4. **AI callout** — graphite card with a 36 × 36 elevated tile (1 px AI-tinted border) holding a Sparkles glyph that breathes (scale 0.95 → 1.05, 3 s). Right side: a small `Start →` pill in `#1F1F22`.
5. **Category strip** — horizontal scroll, transparent chips with 1 px white/10% border when idle; active chip = `#1F1F22` fill with 1 px AI-accent border (NOT orange).
6. **Featured today** — single landscape card (~100 px tall) with a real food photo on the left third and the dish title + price + truncated description on the right. Shimmer sweep runs once on mount.
7. **Menu list** — premium graphite rows (`#16161A`, 20 px radius, 1 px border, top edge highlight at `rgba(255,255,255,0.04)`). Each row: 64 × 64 photo tile, name + 1-line description, price + a single tag pill (priority: spicy > vegan > popular). The `+` button is graphite by default; on press it briefly turns success-green with a check glyph for 700 ms.
8. **Tab bar** — translucent blurred bar (`backdrop-filter: blur(20px) saturate(180%)`) with `Menu / Waiter / Cart`. The active tab sits behind a sliding indicator pill in `#1F1F22` with a 1 px AI-accent border. The cart badge bumps `scale 1 → 1.30 → 1` over 320 ms when the count changes.

**Exact copy:**
- `Open now · 18–25 min` · `Downtown`
- `The Intelligent Bistro` / `Seasonal comfort food with an AI ordering assistant.`
- Search placeholder: `Search dishes or describe a craving…`
- AI callout: `Need help ordering?` / `Tell the AI waiter what you're craving.` / `Start →`
- Section headers: `Featured today` (right: `See all`), `Menu` (right: `12 items`)
- Categories: `All · Popular · Sandwiches · Bowls · Sides · Drinks · Desserts`

### 2 · AI Waiter

**Purpose:** conversational ordering — user types or taps a suggestion, AI updates the cart with structured actions, user sees what was applied.

**Layout (vertical, `KeyboardAvoidingView`):**
1. **Header** — 36 × 36 graphite avatar with AI-tinted border holding a Sparkles that rotates 8 s linear AND breathes 3 s ease-in-out (nested transforms). Title `AI Waiter` (bold 16), subtitle `Tell me what you'd like to order` (muted 11.5). Right side: small `↻` reset in a circular graphite pill.
2. **Success strip (ephemeral)** — when AI mutates cart, a `Cart updated` toast slides in from the top of the chat area for 2.4 s. Background `rgba(34,197,94,0.10)`, 1 px border `rgba(34,197,94,0.25)`, check glyph + emerald text.
3. **Empty state (only when no transcript)** — elevated card with AI-tinted border:
   - Title: `What can I get started for you?` (breathing sparkle on the left)
   - Body: `Try ordering naturally — I'll update your cart for you. You can also ask what's popular, what's vegan, or how spicy things are.`
4. **Chat list**
   - **User bubble** — solid orange `#FF6A1A`, white text, 18-px radius with the bottom-right corner shrunk to 6, max-width 78 %, `inset 0 1px rgba(255,255,255,0.18)` top highlight.
   - **AI bubble** — `#1B1B20` fill with a 1 px AI-accent-20 % outline (NOT a solid fill), 18-px radius with the bottom-left corner shrunk to 6, lavender 28-px avatar disc to its left.
   - **Order update card** (renders below AI message when `message.actions?.length > 0`) — elevated graphite card with a 3-px **orange** left bar (full height, 40 % opacity) to signal "action card, not message." Top row: `✓ Order update` (check in `#3DD68C`) left, `Applied to cart` right (subtle text). Body: one row per action with a sign character (+, −, ↻, ✎) and the item.
5. **Loading bubble** — appears while AI is thinking. Three lavender dots that pulse in sequence (1.4 s, 180 ms stagger) with a `box-shadow: 0 0 12px var(--ai-40)` soft glow, followed by `thinking…` in muted 12.
6. **Suggestion strip** — horizontal scroll above the composer, graphite pills with 1 px border. Default suggestions (concierge style):
   - `Add two spicy chicken sandwiches`
   - `What's popular?`
   - `I want something vegetarian`
   - `Add a drink`
   - `Clear my cart`
7. **Composer** — pill input (`#16161A`, 1 px border, full radius). Placeholder `Ask your waiter…`. On focus, a 1-px lavender ring expands 3 px outside the pill with a 4 px alpha-ring glow (200 ms ease-out). Send button is a 34 × 34 disc that brightens to orange gradient only when there's text.
8. **Ambient AI glow** — *the showstopper detail.* When the composer is focused, an absolute-positioned linear gradient at the bottom of the screen (height 32 % of screen) pulses opacity `0 → 0.45 → 0` on a 3.2-s loop. This is the kind of detail reviewers screenshot.

**Exact copy (transcript samples):**
- Initial assistant: `Good afternoon. What can I get started for you?`
- After `Add two spicy chicken sandwiches and a large water`: `Done — two Spicy Chicken Sandwiches and a Large Water are in your cart.`
- After `I want something vegetarian`: `The Green Goddess Bowl is fully vegan — greens, avocado, quinoa, herb vinaigrette. Want me to add one?`
- After `What's popular?`: `Our most ordered today: Spicy Chicken Sandwich, Classic Bistro Burger, Truffle Fries. Want me to add anything?`
- After `Make my burger without onions` when burger not in cart: `You don't have a burger in your cart yet — want me to add a Classic Bistro Burger without onions?`
- Loading: `thinking…`
- Backend down: `I'm having trouble reaching the kitchen. Try again in a moment.`
- Unknown item: `I couldn't find that on the menu. Did you mean Spicy Chicken Sandwich?`

### 3 · Cart

**Purpose:** review, adjust quantities, see totals, place the order.

**Layout:**
1. **Header** — `Your Cart` bold 22, muted 13 subtitle `Review your order before checkout.`. Quiet `Clear` text button on the right (no pill background).
2. **Item rows** — `#16161A` cards with 48 × 48 photo tiles. Each row: name, `${price} each` muted, optional modifier as a small AI-accent-tinted pill (e.g. `No parmesan`), `×` (not trash) for remove at top-right. Below: pill stepper (`−` neutral, `+` warm orange disc) on left, line total bold on right. The qty number crossfades + scales on every change (220 ms).
3. **Swipe-to-delete** — left-swipe reveals a `#E5484D` background panel with a Trash glyph; releasing past 80 px removes the item.
4. **Summary card** — graphite, 20 px radius, with `Subtotal · Estimated tax · Total`. The Total value count-ups on change (interpolate previous → next over 400 ms).
5. **Place-order CTA** — full-width amber gradient button `Place order · $XX.XX` with a soft orange glow underneath (`box-shadow: 0 8px 32px rgba(255,106,26,0.35)`). On press: scale 0.98 + `Haptics.impactAsync(Medium)`.
6. **Success modal** (on `Place order`) — backdrop blur 8 px, dim 72 %. Card scales `0.96 → 1` + fades over 200 ms. 52 × 52 success-tinted disc with a check, title `Order placed`, body `Your AI waiter sent the order to the kitchen.`, CTA `Back to menu` (closes modal, clears cart, routes to Menu).

**Empty state (cart.items.length === 0):**
- Icon-in-tile (64 × 64 graphite tile with a `ShoppingBag` glyph)
- Title: `Your cart is waiting.`
- Body: `Add something from the menu or ask the AI waiter.`
- Primary: `Browse menu` · Secondary: `Ask AI waiter` (quiet button)

---

## Interactions & behavior

### Navigation
- Bottom tab bar routes between Menu (`/`), AI Waiter (`/ai-waiter`), Cart (`/cart`). Already wired via `expo-router` in `app/(tabs)/_layout.tsx` — only the styling needs updating.
- Cart `×` removes item; trash via swipe-left.
- Place order shows success modal; `Back to menu` closes modal, clears cart, navigates home.

### Animations (full spec in `HANDOFF.md` §8)
All animations via **`react-native-reanimated` v3** for the worklet path or **`Animated`** for the simple ones. 20 animations total — start with the cheap wins (press scale on all tappables, mount fade-up on screens, qty crossfade, badge bump, thinking dots) before tackling the showstoppers (ambient glow, shimmer sweep, count-up total).

### Haptics
On every primary action: `Haptics.impactAsync(ImpactFeedbackStyle.Light)`. On `Place order`: `Medium`.

### Loading states
- Menu: `Loading menu…` with `ActivityIndicator` in AI-accent color, centered.
- AI Waiter: replace the activity indicator with the **three-dot thinking bubble** described above.
- Cart: no global loading — cart is local state.

### Error states
- Network failure on menu: `Can't reach the kitchen` + `Try again` button.
- Network failure on AI: AI replies `I'm having trouble reaching the kitchen. Try again in a moment.`
- Backend `UNKNOWN` action: AI replies `I couldn't find that on the menu. Did you mean Spicy Chicken Sandwich?` (use the closest menu item by Levenshtein).

---

## State management

The existing **Zustand** stores stay. Verify these slices:
- `cartStore` — items, quantities, modifiers, totalCount, calculateSubtotal/Tax/Total, applyActions(actions, menu).
- `chatStore` — messages, loading, error, pushUser, pushAssistant, reset.
- `menuStore` — items, loadMenu, loading, error.

New state needed:
- `themeStore` (or just a `useTheme()` hook reading from AsyncStorage) — `aiPersonality: "lavender" | "amber" | "emerald"`, `material: "minimal" | "premium" | "cinematic"`, `imagery: "photo" | "emoji" | "mono"`. Default to `lavender / premium / photo`. See HANDOFF.md §7 for the full token map per option.
- Local component state for `composerFocused` on AI Waiter (drives the lavender focus ring + ambient glow).
- Local component state for `justAdded` in `MenuCard` (drives the green-check confirm animation, resets after 900 ms).

---

## Design tokens

Replace the `bistro.*` palette in `tailwind.config.js`:

```js
colors: {
  bistro: {
    bg:         "#08080A",   // app canvas (radial-gradient from #0E0E10 at top)
    card:       "#16161A",   // primary surface
    elevated:   "#1B1B20",   // elevated surface (chips, tiles, modal)
    border:     "rgba(255,255,255,0.08)",
    borderHi:   "rgba(255,255,255,0.14)",
    edge:       "rgba(255,255,255,0.04)",   // top hairline highlight
    text1:      "#EDEDF0",
    text2:      "#9A9AA3",
    text3:      "#5C5C65",
    accent:     "#FF6A1A",   // orange CTA (single use)
    accentHi:   "#FF7A2E",
    ai:         "#A39CFF",   // lavender AI accent (themeable)
    success:    "#3DD68C",
    danger:     "#E5484D",
  },
},
```

### Gradients

```ts
ACCENT_CTA = ["#FF7A2E", "#FF6A1A"]   // 180° — only on Place order
EMOJI_TILE = radial-gradient at 30% 20% from "#2E2E32" to "#18181B"
```

### Radii
- Cards / surfaces: **20** (Premium material default)
- Chips / pills: **9999** (full)
- Buttons: **16** (CTA), **14** (search bar)
- Chat bubbles: **18** (one corner shrunk to 6 for tail)
- Modal: **22**

### Shadows
- Card inner highlight: `inset 0 1px 0 rgba(255,255,255,0.05)`
- Card lift (Premium): `0 8px 24px rgba(0,0,0,0.40)`
- CTA glow: `0 8px 32px rgba(255,106,26,0.35)`
- AI focus ring: `0 0 0 4px rgba(163,156,255,0.10)`
- Thinking dot glow: `0 0 12px rgba(163,156,255,0.40)`

### Typography
- Family: `System` (renders SF Pro on iOS, Roboto on Android). Inter is the web stand-in only.
- Hero: 26 / 700 / -0.022em
- Section header: 17 / 700 / -0.018em
- Item name: 15 / 600 / -0.008em
- Body: 13–14 / 400–500 / -0.005em
- Caption: 11.5–12 / 500 / -0.005em
- Eyebrow (`POPULAR`, `AI-POWERED`): 10 / 600 / 0.08em uppercase

---

## Assets

### Icons — `lucide-react-native` (already a dep)

```
Sparkles, ArrowRight, ArrowUp, Search, MapPin, Plus, Minus, Check,
CheckCircle2, X, Trash2, RotateCcw, RefreshCw, Flame, Leaf, Star,
UtensilsCrossed, ShoppingBag
```

### Food photography — Unsplash

Each menu item has an `image` URL field in `ui_kits/mobile/data.js`. For production:
1. **Download the 12 images** from those URLs (they're all licensed under the Unsplash License — free for commercial use).
2. **Drop them in `apps/mobile/assets/menu/`** with the item id as the filename (e.g. `spicy_chicken_sandwich.jpg`).
3. **Update `apps/backend/src/data/menu.ts`** so each item has an `image: string` field with the local require path (or a CDN URL once you have one).
4. Render via `<Image source={{ uri: item.image }} ... />` in the new `MenuCard.tsx`. Add a `defaultSource` that renders the emoji-on-graphite tile while the real image loads (so the mockup's `<FoodTile>` fallback path is the loading state, not a fallback).

For the **mockup's** Editorial mono variant: `filter: grayscale(1) contrast(1.05) brightness(0.92)` with a `linear-gradient(180deg, rgba(255,106,26,0.06) 0%, transparent 60%)` overlay. Reproduce in RN with `Image` `tintColor` is *not* enough — use `<Image style={{ opacity: 0.95 }} />` inside a wrapper with a colored gradient overlay on top.

### Brand
There is no logo file in the source codebase — the wordmark is plain text `The Intelligent Bistro` in the system font, bold 26, letter-spacing -0.022em. Keep it that way.

---

## Files in this bundle

| File | Purpose |
| --- | --- |
| **README.md** | This file. Orientation. |
| **HANDOFF.md** | Deep implementation spec — NativeWind class snippets for every section, full animation catalogue, per-file change list for `apps/mobile/`. Read second. |
| **Screens.html** | The interactive mockup. Open in any modern browser. Toolbar "Tweaks" toggle exposes the three theme axes. |
| `colors_and_type.css` | CSS custom property tokens. Reference — do not copy into the RN app. |
| `tweaks-panel.jsx` | Reusable Tweaks shell used by `Screens.html`. Web-only — RN app should use a `useTheme()` hook (see HANDOFF §7). |
| `ui_kits/mobile/index.html` | Standalone clickable demo (tap through all 3 tabs). |
| `ui_kits/mobile/components.jsx` | Web JSX recreations: `MenuCardRow`, `CartItemRow`, `AIBubble`, `UserBubble`, `OrderUpdateCard`, `Composer`, `TabBar`, `PrimaryButton`, `QuickReplyChip`, etc. The component **structure and prop shapes** here are intended to map 1-to-1 to the RN components you'll edit in `apps/mobile/components/`. |
| `ui_kits/mobile/screens.jsx` | Web JSX recreations of `MenuScreen`, `AiWaiterScreen`, `CartScreen`. |
| `ui_kits/mobile/data.js` | Menu items (with photo URLs) + suggested prompts + concierge-style deterministic parser. |
| `ui_kits/mobile/ios-frame.jsx` | iOS bezel for the mockup. Web-only. |

## Per-file change list for the Expo app

See **HANDOFF.md §"Files to change in `intelligent-bistro/apps/mobile/`"** for the exact line-by-line refactor instructions. The big ones:

- `tailwind.config.js` — replace `bistro.*` palette as above.
- `app/(tabs)/_layout.tsx` — translucent blurred tab bar, animated indicator pill, badge bump, AI-tinted active state.
- `app/(tabs)/index.tsx` — new Menu layout (status row, plain wordmark, search bar, restrained AI callout, single Featured card with shimmer, premium menu list).
- `app/(tabs)/ai-waiter.tsx` — concierge greeting, outlined AI bubbles, thinking dots, composer focus ring, ambient glow, new suggestions.
- `app/(tabs)/cart.tsx` — `×` not trash, swipe-to-delete, modifier chip, gradient CTA with glow, new success copy.
- `components/MenuCard.tsx` — photo tile, single tag pill, green-check confirm animation on add.
- `components/ChatBubble.tsx` — outlined AI variant + solid user variant, AI-accent avatar disc.
- `components/ActionPreviewCard.tsx` — rename to "Order update", add orange left bar, action sign-character rows.
- `components/CartItemRow.tsx` — photo tile, modifier chip, qty crossfade.
- `components/GradientButton.tsx` — 180° gradient direction, amber glow shadow.
- Backend `services/fallbackParser.service.ts` — new intents: `whatsPopular`, `vegetarian`, `addGenericDrink`. Fix modifier-on-missing-item → return `UNKNOWN` with a clarifying question.

## Quality checklist before shipping

- [ ] No orange except where HANDOFF.md §"Where orange is allowed" permits it.
- [ ] AI accent is themeable — verify by switching to `amber` or `emerald` in your theme store and confirming every AI surface re-tints in one shot.
- [ ] Add-to-cart shows the green-check microanimation.
- [ ] Qty number crossfades on change.
- [ ] Thinking dots pulse in sequence with a soft AI-color glow.
- [ ] Composer focus ring is lavender and the ambient glow appears at the bottom of the Waiter screen.
- [ ] Tab indicator slides between tabs with a spring (not a snap).
- [ ] Cart badge bumps when count changes.
- [ ] Place-order CTA has the warm orange shadow and triggers `Haptics.Medium` on press.
- [ ] Success modal scales in with `Back to menu` (not `Done`).
- [ ] All 12 menu items render real photography (not emoji) in the default theme.

---

## Commands

```bash
cd intelligent-bistro/apps/mobile
npm install
# tailwind palette changed — clear Metro cache:
npx expo start --clear

# Backend (optional — fallback parser works without):
cd ../backend && npm install && npm run dev
```

If running on a physical device, set `EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:4000` in `apps/mobile/.env`.

---

**Implementation order suggestion:**
1. Tokens (`tailwind.config.js`) — everything cascades from here.
2. Bottom tab bar — sets the global chrome.
3. Menu screen (it's the entry point and the most complex layout).
4. AI Waiter screen (it has the showstopper details).
5. Cart screen (mostly polish over the existing layout).
6. Animations pass — work top-to-bottom on HANDOFF §8 in order.
7. Theme system (axis 1/2/3) — last, once the default theme ships clean.
