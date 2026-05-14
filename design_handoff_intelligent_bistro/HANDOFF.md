# Production Refinement Handoff — Intelligent Bistro Mobile

> The three screens shown in **Screens.html** are the target. This document maps every section to NativeWind classes and lists the exact changes to make in `intelligent-bistro/apps/mobile/`.

The brief was *production polish*: calm graphite surfaces, orange used only where it earns its place, an AI assistant that reads as a concierge rather than a chatbot, and microinteractions that communicate state instead of demanding attention.

---

## Refined token system

Add (or replace) the `bistro.*` palette in `tailwind.config.js` with these production values:

```js
// tailwind.config.js
colors: {
  bistro: {
    bg:           "#070707",
    card:         "#161618",
    elevated:     "#1F1F22",
    border:       "rgba(255,255,255,0.10)",
    borderHi:     "rgba(255,255,255,0.16)",
    text:         "#F8FAFC",
    textMuted:    "#A1A1AA",
    textSubtle:   "#6B7280",
    accent:       "#F97316",
    accentSoft:   "#FDBA74",
    success:      "#22C55E",
    successFg:    "#4ADE80",
    warning:      "#F59E0B",
  },
},
```

Old `bistro-cardMuted` → `bistro-elevated`. Old `bistro-border` is now an `rgba()` value, so you can keep using `border-bistro-border/40` or switch to plain `border-bistro-border` (already alpha-baked).

### Gradients

```ts
// Use expo-linear-gradient
ACCENT_CTA = ["#FB923C", "#F97316"]  // 180° — only on Place order
CARD       = ["#1E1E22", "#131316"]  // 180° — Featured tile, AI callout
EMOJI_WELL = ["radial 30% 20%", "#2E2E32", "#18181B"]  // emoji tiles
```

### Where orange is allowed

| Surface | Color | Why |
| --- | --- | --- |
| Add `+` press feedback (white check) | `bistro-accent` brief | Action confirmation |
| Menu card price text | `bistro-accent` | Price anchor |
| User chat bubble | `#E26A1A` (slightly desaturated) | Sender identity |
| Place order CTA | `bistro-accent` gradient | Single primary action |
| AI sparkle glyph (subtle) | `bistro-accentSoft` | AI identity |
| Tab bar cart badge | `bistro-accent` | Status indicator |
| "POPULAR" eyebrow text | `bistro-accentSoft` | Hierarchy |

Everywhere else: graphite + white-on-dark. No orange gradients on hero. No orange-tinted borders on the main hero. No giant `bg-bistro-accent` blocks.

---

## Screen 1 · Menu

### Visual description
At the top, a tiny **status row** — green dot + "Open now · 18–25 min" on the left, "📍 Downtown" on the right, both in 12-px muted. Below that the **wordmark** (24 px bold) and a single-line tagline. Then a **calm AI callout**: a graphite card with a thin amber-tinted icon disc on the left, two short labels in the middle, and a small `Start →` pill on the right. *Not* a giant orange block.

A horizontal **category strip** follows — chips are transparent with a hairline border when inactive, elevated graphite + brighter border when active. There is no big amber chip.

The **Featured today** strip is a single landscape "Today's pick" card with a 72-px emoji tile, an eyebrow `POPULAR · Today's pick`, the dish name, price + truncated description, and a quiet chevron. One card. Not a carousel.

Below that the **menu list** — premium graphite cards (`#161618`) with a `64×64` emoji tile, name, one-line description, price + a single tag pill, and a 36-px circular add button. The add button is graphite by default and momentarily turns success-green with a check glyph on tap (700 ms).

### Layout

```
┌────────────────────────────────────────┐
│ 16-px gutter                           │
│  • Open now · 18–25 min   📍 Downtown │
│  The Intelligent Bistro                │
│  Seasonal comfort food with an AI…     │
│  ┌──────────────────────────────────┐  │
│  │ ✦  Need help ordering?  [Start→] │  │  <- AICta
│  │    Tell the AI waiter…           │  │
│  └──────────────────────────────────┘  │
│  [All] Popular Sandwiches Bowls Sides… │  <- chip strip
│  Featured today              See all   │
│  ┌──────────────────────────────────┐  │
│  │ [🍔] POPULAR · Today's pick   →  │  │  <- single featured
│  │      Spicy Chicken Sandwich      │  │
│  │      $11.99  Crispy chicken…     │  │
│  └──────────────────────────────────┘  │
│  Menu                       12 items   │
│  ┌──────────────────────────────────┐  │
│  │ [🍔] Spicy Chicken Sandwich   ⊕ │  │
│  │      Crispy chicken, chili aioli │  │
│  │      $11.99  🔥 Spicy            │  │
│  └──────────────────────────────────┘  │
│  ⋮ (12 cards total)                    │
└────────────────────────────────────────┘
│ Tab bar (blurred translucent)          │
```

### Exact copy

- Status: `Open now · 18–25 min` and `Downtown`
- Headline: `The Intelligent Bistro`
- Tagline: `Seasonal comfort food with an AI ordering assistant.`
- AI callout title: `Need help ordering?`
- AI callout sub: `Tell the AI waiter what you're craving.`
- AI callout pill: `Start →` (just `Start` + arrow icon)
- Section headers: `Featured today` (right action: `See all`), `Menu` (right action: `12 items`)
- Categories: `All` · `Popular` · `Sandwiches` · `Bowls` · `Sides` · `Drinks` · `Desserts`

### NativeWind class snippets

```tsx
// Status row
<View className="flex-row items-center gap-2 pt-1 pb-3">
  <View className="w-1.5 h-1.5 rounded-full bg-bistro-success" />
  <Text className="text-bistro-textMuted text-xs font-medium">
    Open now <Text className="text-bistro-textSubtle">·</Text> 18–25 min
  </Text>
  <View className="flex-1" />
  <MapPin size={12} color="#A1A1AA" />
  <Text className="text-bistro-textMuted text-xs font-medium">Downtown</Text>
</View>

// Hero header (no card, no gradient — just type)
<View className="mb-4">
  <Text className="text-bistro-text font-bold text-2xl tracking-tight">
    The Intelligent Bistro
  </Text>
  <Text className="text-bistro-textMuted text-sm mt-1 leading-5">
    Seasonal comfort food with an AI ordering assistant.
  </Text>
</View>

// AI callout (restrained — no orange gradient)
<Pressable onPress={() => router.push("/ai-waiter")}>
  <LinearGradient colors={["#1E1E22", "#131316"]} ...
    style={{ borderRadius: 16, padding: 14, borderWidth: 1,
             borderColor: "rgba(255,255,255,0.10)" }}>
    <View className="flex-row items-center" style={{ gap: 12 }}>
      <View className="w-9 h-9 rounded-xl bg-bistro-elevated items-center justify-center"
            style={{ borderWidth: 1, borderColor: "rgba(253,186,116,0.28)" }}>
        <Sparkles size={16} color="#FDBA74" />
      </View>
      <View className="flex-1">
        <Text className="text-bistro-text font-semibold text-sm">Need help ordering?</Text>
        <Text className="text-bistro-textMuted text-xs mt-0.5">
          Tell the AI waiter what you're craving.
        </Text>
      </View>
      <View className="flex-row items-center gap-1 px-3 py-2 rounded-full bg-bistro-elevated"
            style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
        <Text className="text-bistro-text text-xs font-semibold">Start</Text>
        <ArrowRight size={12} color="#F8FAFC" />
      </View>
    </View>
  </LinearGradient>
</Pressable>

// Category chip — active vs idle
<Pressable className={`mr-2 px-3.5 py-2 rounded-full ${
  active
    ? "bg-bistro-elevated"
    : "bg-transparent"
}`} style={{ borderWidth: 1,
             borderColor: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)" }}>
  <Text className={`text-[13px] font-semibold ${
    active ? "text-bistro-text" : "text-bistro-textMuted"
  }`}>{label}</Text>
</Pressable>

// Featured "Today's pick" landscape card
<Pressable>
  <LinearGradient colors={["#1E1E22", "#131316"]} ...
    style={{ borderRadius: 16, padding: 10, borderWidth: 1,
             borderColor: "rgba(255,255,255,0.10)" }}>
    <View className="flex-row items-center" style={{ gap: 12 }}>
      <View className="w-18 h-18 rounded-xl items-center justify-center"
            style={{ /* radial gradient placeholder for emoji tile */ }}>
        <Text style={{ fontSize: 38 }}>{item.emoji}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 mb-1">
          <Text className="text-bistro-accentSoft text-[10px] font-semibold uppercase tracking-wider">
            POPULAR
          </Text>
          <View className="w-1 h-1 rounded-full bg-bistro-textSubtle" />
          <Text className="text-bistro-textMuted text-[10.5px] font-medium">Today's pick</Text>
        </View>
        <Text className="text-bistro-text font-semibold text-[14.5px]">{item.name}</Text>
        <View className="flex-row items-center gap-2 mt-1">
          <Text className="text-bistro-accent font-bold text-[13.5px]">${item.price.toFixed(2)}</Text>
          <Text className="text-bistro-textMuted text-[11.5px]" numberOfLines={1}>
            {item.description}
          </Text>
        </View>
      </View>
      <ArrowRight size={16} color="#A1A1AA" />
    </View>
  </LinearGradient>
</Pressable>

// Menu card (premium)
<View className="bg-bistro-card rounded-2xl p-3.5 mb-2.5 flex-row items-center"
      style={{ gap: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
  <View className="w-16 h-16 rounded-xl items-center justify-center"
        style={{ /* radial emoji tile gradient */
                 borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
    <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
  </View>
  <View className="flex-1">
    <Text className="text-bistro-text font-semibold text-[15px]" numberOfLines={1}>{item.name}</Text>
    <Text className="text-bistro-textMuted text-xs mt-0.5" numberOfLines={1}>
      {item.description}
    </Text>
    <View className="flex-row items-center gap-2.5 mt-2">
      <Text className="text-bistro-accent font-bold text-sm">${item.price.toFixed(2)}</Text>
      {/* one tag pill, priority spicy > vegan > popular */}
      {primaryTag && <TagPill tag={primaryTag} />}
    </View>
  </View>
  <Animated.View style={{ transform: [{ scale: addScale }] }}>
    <Pressable onPress={handleAdd}
      className="w-9 h-9 rounded-full items-center justify-center"
      style={{ backgroundColor: justAdded ? "#22C55E" : "#1F1F22",
               borderWidth: 1,
               borderColor: justAdded ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.16)" }}>
      {justAdded
        ? <Check size={16} color="#F8FAFC" strokeWidth={2.5} />
        : <Plus  size={16} color="#F8FAFC" strokeWidth={2.5} />}
    </Pressable>
  </Animated.View>
</View>

// Tag pill (single, restrained — only 1 per card)
<View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full"
      style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
  {tagIcon}
  <Text className="text-bistro-textMuted text-[10.5px] font-medium">{label}</Text>
</View>
```

### Notes for Claude Code

- In `apps/mobile/components/MenuCard.tsx`, **render at most one tag pill** (priority: `spicy > vegan > popular`). Multiple pills makes the card look like a sticker.
- Move the add button's `bg-bistro-accent` fill **out** of the default state — keep it `bistro-elevated`. Only flash accent/success during the press-confirm microanimation.
- Drop the hero gradient card entirely in `app/(tabs)/index.tsx` — the new hero is plain text. The "AI-POWERED" eyebrow goes away.
- The AI waiter callout is no longer `LinearGradient colors={["#F97316", "#FB923C"]}`. Use the card gradient. **Reducing orange usage is the single biggest visual improvement.**
- Wrap the menu in a `FlatList`'s `ListHeaderComponent` so the hero/AICta/categories/featured stack scrolls with the list.

---

## Screen 2 · AI Waiter

### Visual description
A minimal header — small graphite disc with an amber-tinted border holding a 14 px Sparkles glyph, `AI Waiter` in bold 16, `Tell me what you'd like to order` in 11.5-px muted underneath. A tiny rounded `↻` reset button on the right.

When the AI just edited the cart, a compact **success strip** floats at the top: a small check icon + `Cart updated` in 12-px success-foreground green, on a 10%-alpha success background. ~2.4 s, then fades.

Bubbles are tight: **assistant** = graphite card (`#161618`) with a thin border, accent-tinted 28-px avatar disc to its left; **user** = a less-saturated orange (`#E26A1A`) so the chat doesn't shout. Both at 14 px text and 18-px corners with one diagonal corner shrunk to 6 px.

After any assistant message that carries actions, render a separate **Order update** card — graphite, 16 radius, thin amber-soft border. Header reads `✓ Order update` on the left and `Applied to cart` on the right in 11-px subtle. Each action is a row: `[sign char] [item text]`. Example signs: `+`, `−`, `↻`, `✎`. Never put orange in this card.

The **suggestion strip** is now practical, not demo-y: *Add two spicy chicken sandwiches · What's popular? · I want something vegetarian · Add a drink · Clear my cart*. Pills are graphite (`#161618`) with a hairline border and full-radius. Composer below is a pill input that's all graphite, with the send button as a small 34-px disc that brightens to accent only when there's text.

The typing indicator is a horizontal trio of muted dots that bounce in sequence (220 ms each, staggered 120 ms) with the label `checking the menu…` — calmer than a generic "thinking…".

### Layout

```
┌────────────────────────────────────────┐
│ [○✦] AI Waiter                  [↻]    │
│      Tell me what you'd like to order  │
│ ─ ✓ Cart updated ─                     │
│ [○]  Good afternoon. What can I…       │
│                     ↳ Add two spicy…  [user]
│ [○]  Done — two Spicy Chicken… ┐       │
│      ┌─────────────────────────────┐   │
│      │ ✓ Order update    Applied… │   │
│      │ + 2 × Spicy Chicken Sand…  │   │
│      │ + 1 × Large Water          │   │
│      └─────────────────────────────┘   │
│                ↳ I want something veg.[user]
│ [○]  The Green Goddess Bowl is fully…  │
│      …Want me to add one?              │
│ ─                                      │
│ [chip] [chip] [chip] [chip] [chip]     │
│ [   Ask your waiter…              →]   │
└────────────────────────────────────────┘
│ Tab bar                                │
```

### Exact copy

- Header title: `AI Waiter`
- Header subtitle: `Tell me what you'd like to order`
- Initial assistant message: `Good afternoon. What can I get started for you?`
- Empty-state card (only when there's no transcript yet):
  - Title: `What can I get started for you?`
  - Sub: `Try ordering naturally — I'll update your cart for you. You can also ask about what's popular, what's vegan, or how spicy things are.`
- Loading bubble label: `checking the menu…`
- Success strip: `Cart updated`
- Composer placeholder: `Ask your waiter…`
- Reply when "Add a drink" with no item named: `Added a Sparkling Lemonade. Want something else instead?`
- Reply to "What's popular?": `Our most ordered today: {items}. Want me to add anything?`
- Reply to "I want something vegetarian": `The Green Goddess Bowl is fully vegan — greens, avocado, quinoa, herb vinaigrette. Want me to add one?`
- Reply to "What's spicy?": `Try the Spicy Chicken Sandwich — crispy chicken with chili aioli.`
- Ambiguous-item fallback: `I couldn't find that on the menu. Did you mean Spicy Chicken Sandwich?`
- Backend-down fallback: `I'm having trouble reaching the kitchen. Try again in a moment.`

### NativeWind class snippets

```tsx
// Header
<View className="px-4 pt-1 pb-3.5 flex-row items-center justify-between">
  <View className="flex-row items-center" style={{ gap: 12 }}>
    <View className="w-9 h-9 rounded-full bg-bistro-elevated items-center justify-center"
          style={{ borderWidth: 1, borderColor: "rgba(253,186,116,0.28)" }}>
      <Sparkles size={15} color="#FDBA74" />
    </View>
    <View>
      <Text className="text-bistro-text font-bold text-base tracking-tight">AI Waiter</Text>
      <Text className="text-bistro-textMuted text-[11.5px] mt-0.5">
        Tell me what you'd like to order
      </Text>
    </View>
  </View>
  <Pressable className="bg-bistro-card rounded-full p-2"
             style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
    <RotateCcw size={14} color="#A1A1AA" />
  </Pressable>
</View>

// Success strip
<View className="mx-4 mb-2 self-start flex-row items-center gap-2 px-3 py-2 rounded-xl"
      style={{ backgroundColor: "rgba(34,197,94,0.10)",
               borderWidth: 1, borderColor: "rgba(34,197,94,0.25)" }}>
  <Check size={13} color="#4ADE80" strokeWidth={2.4} />
  <Text className="text-[#4ADE80] text-xs font-semibold">Cart updated</Text>
</View>

// Assistant bubble
<View className="flex-row items-end mb-2.5" style={{ gap: 8 }}>
  <View className="w-7 h-7 rounded-full bg-bistro-elevated items-center justify-center"
        style={{ borderWidth: 1, borderColor: "rgba(253,186,116,0.28)" }}>
    <Sparkles size={12} color="#FDBA74" />
  </View>
  <View className="bg-bistro-card px-3.5 py-2.5 rounded-[18px] max-w-[78%]"
        style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)",
                 borderBottomLeftRadius: 6 }}>
    <Text className="text-bistro-text text-sm leading-5">{message.text}</Text>
  </View>
</View>

// User bubble (less saturated)
<View className="flex-row justify-end mb-2.5">
  <View className="px-3.5 py-2.5 rounded-[18px] max-w-[78%]"
        style={{ backgroundColor: "#E26A1A", borderBottomRightRadius: 6 }}>
    <Text className="text-white text-sm leading-5">{message.text}</Text>
  </View>
</View>

// Order update card (replaces "AI understood")
<View className="bg-bistro-card rounded-2xl p-3 mb-3 ml-9 max-w-[320px]"
      style={{ borderWidth: 1, borderColor: "rgba(253,186,116,0.28)" }}>
  <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
    <CheckCircle2 size={13} color="#4ADE80" />
    <Text className="text-bistro-text text-xs font-semibold">Order update</Text>
    <View className="flex-1" />
    <Text className="text-bistro-textSubtle text-[11px] font-medium">Applied to cart</Text>
  </View>
  {actions.map((a, i) => (
    <View key={i} className="flex-row items-center" style={{ gap: 10, paddingVertical: 2 }}>
      <Text className="text-bistro-textMuted text-[13px] font-semibold w-3 text-center">
        {signOf(a)}
      </Text>
      <Text className="text-bistro-text text-[13px]">{describeOf(a)}</Text>
    </View>
  ))}
</View>

// Typing indicator
<View className="flex-row items-end mb-2.5" style={{ gap: 8 }}>
  {/* avatar disc as above */}
  <View className="bg-bistro-card rounded-[18px] px-3.5 py-2.5 flex-row items-center gap-2"
        style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)",
                 borderBottomLeftRadius: 6 }}>
    <TypingDots />
    <Text className="text-bistro-textMuted text-xs">checking the menu…</Text>
  </View>
</View>

// Composer (pill input)
<View className="flex-row items-center bg-bistro-card rounded-full px-4.5 pr-1.5 py-1.5 gap-2"
      style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
  <TextInput placeholder="Ask your waiter…" placeholderTextColor="#6B7280"
             className="flex-1 text-bistro-text text-sm" />
  <Pressable className="w-8.5 h-8.5 rounded-full items-center justify-center"
             style={{ backgroundColor: canSend ? "#F97316" : "#1F1F22" }}>
    <ArrowUp size={15} color={canSend ? "white" : "#6B7280"} strokeWidth={2.4} />
  </Pressable>
</View>
```

### Notes for Claude Code

- The most important change in this screen is reducing **chat-as-bot** signals. Renames:
  - `AI understood` → `Order update`
  - `AI waiter is reading your order…` → `checking the menu…`
  - `Hi! I'm your AI waiter. Tap a suggestion below…` → `Good afternoon. What can I get started for you?`
  - `Cart updated by AI waiter.` → `Cart updated`
- Use `lucide-react-native`'s `ArrowUp` (not `Send`) for the composer button — feels less like a chat app, more like an assistant input.
- In `apps/backend/src/services/fallbackParser.service.ts`, add three new intent branches: `whatsPopular`, `vegetarian`, `addGenericDrink`. They return `actions: []` (no cart mutation) plus a tailored `assistantMessage`. The new suggested prompts above are wired to these.
- When the AI applies a modifier to an item that **isn't in the cart**, return `UNKNOWN` with `assistantMessage: "You don't have {item} in your cart yet — want me to add one?"`.

---

## Screen 3 · Cart

### Visual description
Header: `Your Cart` in bold 22 with `Review your order before checkout.` muted underneath. A plain text **Clear** button on the right (no pill, no border — it's a quiet action).

Each cart row is a graphite card with a 48-px emoji tile, item name, `${price} each` in muted, an optional **modifier chip** (small pill, amber-soft text, e.g. `No parmesan`). A small `×` (not a trash icon) sits in the top-right of the row for removal. Below: a pill-shaped qty stepper (`−` neutral, `+` accent) on the left, line total on the right.

At the bottom: a **summary card** (no orange) showing Subtotal · Estimated tax · Total. Below that, the **single** orange action of the screen — `Place order · $45.85` — an amber gradient with subtle shadow.

A faint fade behind the summary (`linear-gradient(180deg, transparent, #070707)`) keeps the bottom edge legible as items scroll under it.

### Layout

```
┌────────────────────────────────────────┐
│ Your Cart                       Clear  │
│ Review your order before checkout.     │
│ ┌──────────────────────────────────┐   │
│ │ [🍔] Spicy Chicken Sandwich   ×  │   │
│ │      $11.99 each                 │   │
│ │  [− 2 +]                $23.98   │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │
│ │ [🥤] Large Water              ×  │   │
│ │      $3.49 each                  │   │
│ │  [− 1 +]                 $3.49   │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │
│ │ [🍟] Truffle Fries            ×  │   │
│ │      $6.99 each                  │   │
│ │      [No parmesan]               │   │
│ │  [− 1 +]                 $6.99   │   │
│ └──────────────────────────────────┘   │
│ ⋮ (4 rows total)                       │
│ ┌──────────────────────────────────┐   │
│ │ Subtotal                  $42.45 │   │
│ │ Estimated tax              $3.40 │   │
│ │ ─────────────                    │   │
│ │ Total                     $45.85 │   │
│ └──────────────────────────────────┘   │
│ [    Place order · $45.85         ]    │
└────────────────────────────────────────┘
│ Tab bar                                │
```

### Exact copy

- Title: `Your Cart`
- Subtitle: `Review your order before checkout.`
- Clear button: `Clear` (plain text, no pill background)
- Per-unit line: `${price.toFixed(2)} each`
- Modifier chip: free text e.g. `No parmesan`, `Without onions`
- Summary rows: `Subtotal` · `Estimated tax` · `Total`
- CTA: `Place order · $${total.toFixed(2)}` (middle-dot, not bullet)
- Empty state title: `Your cart is waiting.`
- Empty state sub: `Add something from the menu or ask the AI waiter.`
- Empty state buttons: `Browse menu` (primary) · `Ask AI waiter` (quiet)
- Success modal title: `Order placed`
- Success modal sub: `Your AI waiter sent the order to the kitchen.`
- Success modal CTA: `Back to menu`

### NativeWind class snippets

```tsx
// Cart row
<View className="bg-bistro-card rounded-2xl p-3.5 mb-2.5"
      style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
  <View className="flex-row items-start" style={{ gap: 12 }}>
    <View className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ /* radial emoji tile */
                   borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
      <Text style={{ fontSize: 24 }}>{emoji}</Text>
    </View>
    <View className="flex-1">
      <View className="flex-row items-start justify-between gap-2">
        <Text className="text-bistro-text font-semibold text-[15px]">{item.name}</Text>
        <Pressable hitSlop={8} className="p-0.5 -mt-0.5">
          <X size={15} color="#6B7280" />
        </Pressable>
      </View>
      <Text className="text-bistro-textMuted text-xs mt-0.5">${item.price.toFixed(2)} each</Text>
      {item.modifiers?.length > 0 && (
        <View className="self-start flex-row items-center mt-1.5 px-2 py-0.5 rounded-full bg-bistro-elevated"
              style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
          <Text className="text-bistro-accentSoft text-[11px] font-medium">
            {item.modifiers.join(", ")}
          </Text>
        </View>
      )}
    </View>
  </View>
  <View className="flex-row items-center justify-between mt-3">
    <View className="flex-row items-center bg-bistro-elevated rounded-full p-0.5"
          style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
      <Pressable className="w-6.5 h-6.5 rounded-full items-center justify-center">
        <Minus size={13} color="#F8FAFC" />
      </Pressable>
      <Animated.Text style={{ transform: [{ scale: qtyScale }] }}
        className="text-bistro-text font-semibold text-sm min-w-[22px] text-center">
        {item.quantity}
      </Animated.Text>
      <Pressable className="w-6.5 h-6.5 rounded-full bg-bistro-accent items-center justify-center">
        <Plus size={13} color="white" strokeWidth={2.5} />
      </Pressable>
    </View>
    <Text className="text-bistro-text font-bold text-[15px]">
      ${(item.price * item.quantity).toFixed(2)}
    </Text>
  </View>
</View>

// Summary
<View className="bg-bistro-card rounded-2xl p-3.5 mb-2.5"
      style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
  <Row label="Subtotal" value={subtotal} />
  <Row label="Estimated tax" value={tax} />
  <View className="h-px bg-bistro-border my-2.5" />
  <Row label="Total" value={total} bold />
</View>

// Place order CTA
<Pressable>
  <LinearGradient colors={["#FB923C", "#F97316"]} ...
    style={{ borderRadius: 14, paddingVertical: 14, paddingHorizontal: 20,
             borderWidth: 1, borderColor: "rgba(255,255,255,0.10)",
             shadowColor: "#F97316", shadowOpacity: 0.18, shadowRadius: 24,
             shadowOffset: { width: 0, height: 8 } }}>
    <Text className="text-white text-center font-semibold text-[15px]">
      Place order · ${total.toFixed(2)}
    </Text>
  </LinearGradient>
</Pressable>
```

### Notes for Claude Code

- Replace the `Trash2` icon with `X` (it's a row-level remove, not a destructive delete).
- The summary card uses **no orange** — that single line of orange is reserved for the CTA. Resist any urge to color the Total line.
- The summary card should be **non-floating** in the empty-cart state — the buttons are inside the centered EmptyState instead.
- Success modal CTA is `Back to menu`, not `Done`.

---

## Tab bar

A blurred translucent bar (`backdropFilter: blur(20px) saturate(180%)` on iOS, fallback `rgba(7,7,7,0.92)` on Android) with `Menu` · `Waiter` · `Cart`. The active icon is white (the AI Waiter icon gets the amber `accentSoft` when active to keep the AI identity quiet but present). Inactive icons are `textSubtle` (`#6B7280`).

```tsx
// _layout.tsx — update the tabBarStyle
tabBarStyle: {
  position: "absolute",
  backgroundColor: "rgba(7,7,7,0.92)",
  borderTopColor: "rgba(255,255,255,0.10)",
  borderTopWidth: 1,
  height: 82,
  paddingTop: 10,
  paddingBottom: 28,
},
tabBarActiveTintColor: "#F8FAFC",  // was #FB923C — only the Waiter tab keeps amber
tabBarInactiveTintColor: "#6B7280",
tabBarLabelStyle: { fontSize: 10.5, fontWeight: "600", letterSpacing: 0.05 },
```

For just-the-waiter-tab amber, render a custom `tabBarIcon` for the `ai-waiter` route that branches on `focused` and uses `#FDBA74` when true.

---

## 6. GLOBAL MOTION LANGUAGE (recap from earlier sections)

Use these everywhere via reusable constants:

```ts
// constants/motion.ts
import { Easing } from "react-native";
export const M = {
  pressSpring: { damping: 15, stiffness: 300 },
  entrySpring: { damping: 20, stiffness: 180 },
  fadeTiming:  { duration: 200, easing: Easing.out(Easing.cubic) },
  stagger:     40,         // ms between list items on mount
};
```

---

## 7. DESIGN EXPLORATION — Tweaks panel

The web mockup at `Screens.html` ships with a **Tweaks panel** (toggle from the toolbar) so design decisions can be re-tested live against three high-leverage axes. Every control re-themes the entire mockup via CSS variables on `:root`:

### Axis 1 · AI personality
Rewires `--ai`, `--ai-20/40/60`, `--ai-glow` across **every** AI surface — sparkles, bubble outlines, focus ring, ambient glow, search hint, tab indicator, modifier chip text.

| Option | `--ai` | Feel |
| --- | --- | --- |
| **Concierge** (default) | `#A39CFF` lavender | Cool, polished, technical — reads as "smart assistant" |
| **Warm waiter** | `#FDBA74` amber | Warm and human — reads as "in-restaurant service" |
| **Sommelier** | `#6EE7B7` emerald | Calm and expert — reads as "knowledgeable guide" |

### Axis 2 · Material
A coordinated ladder of `--card-radius`, `--edge` (top hairline highlight), `--inner-hi`, `--lift` (outer shadow).

| Option | Radius | Edge | Inner | Lift | Feel |
| --- | --- | --- | --- | --- | --- |
| **Minimal** | 14 | none | none | none | Editorial flatness — closer to a docs surface |
| **Premium** (default) | 20 | `rgba(255,255,255,0.04)` | `inset 0 1px rgba(255,255,255,0.05)` | `0 8px 24px rgba(0,0,0,0.40)` | Subtle depth, light catching the edge |
| **Cinematic** | 24 | `rgba(255,255,255,0.10)` | `inset 0 1px rgba(255,255,255,0.10)` | `0 16px 48px rgba(0,0,0,0.60)` | Heavy depth — reads as luxury app store screenshot |

### Axis 3 · Imagery
Toggles which child of `.food-tile` is visible. The `.food-photo` and `.food-emoji` siblings always render; CSS picks one.

| Option | Effect |
| --- | --- |
| **Photography** (default) | Real food photos (Unsplash sources documented in `data.js`) |
| **Hand-drawn glyph** | Emoji on a radial graphite tile (matches the original brand README direction) |
| **Editorial mono** | Photos with `grayscale(1) contrast(1.05) brightness(0.92)` plus a faint orange wash — magazine cover energy |

The HANDOFF version of this for the RN app: keep all three options as compile-time themes selectable from a `useTheme()` hook tied to AsyncStorage. Default to **Concierge / Premium / Photography** for shipped builds; expose the other modes behind a hidden dev menu.

---

## 8. ANIMATIONS — verifier checklist for the Loom

Every animation actually present in the spec, mapped to what the reviewer will see:

| # | Animation | Where | When fires | Spec |
| --- | --- | --- | --- | --- |
| 1 | **Press scale + opacity** | All `Press`-wrapped tappables (chips, buttons, qty steppers, tab items, add `+`, send) | On press | `withSpring({damping: 15, stiffness: 300})` scale 1 → 0.96 |
| 2 | **Screen mount fade-up** | Every screen root | On mount | opacity 0→1 + translateY 8→0, 240 ms, `Easing.out(cubic)` |
| 3 | **List item stagger** | Menu / cart row lists | On mount | 40 ms per row, fade + translateY 8 → 0 |
| 4 | **Open-now dot pulse** | Status row · Menu | Looping | opacity 0.65 → 1, 2 s ease-in-out, with ring shadow expansion |
| 5 | **AI sparkle orbit** | Waiter header avatar | Looping | 8 s linear rotation |
| 6 | **AI sparkle breathe** | Waiter header avatar (nested under orbit) | Looping | scale 0.95 → 1.05, 3 s ease-in-out |
| 7 | **Search-bar sparkle pulse** | Menu search input · trailing icon | Looping | opacity 0.55 → 1, 2.4 s |
| 8 | **Featured shimmer sweep** | Featured card | Once on mount | `translateX -110% → 120%`, 1.6 s, 600 ms delay |
| 9 | **Add-to-cart confirm** | Menu card `+` button | On press | bg → success, icon swaps `Plus → Check`, 700 ms hold |
| 10 | **Cart badge bump** | Tab bar badge | When cart count changes | scale 1 → 1.30 → 1, 320 ms |
| 11 | **Qty crossfade** | Cart row stepper number | When quantity changes | opacity 0 → 1, scale 1.18 → 1, 220 ms |
| 12 | **Total count-up** | Cart summary "Total" | When total changes | interpolate prev → next, 400 ms ease-out |
| 13 | **Composer focus ring** | AI Waiter composer | On focus / blur | 1 px lavender border + 4 px alpha-ring, 200 ms ease-out |
| 14 | **Ambient AI glow** | AI Waiter screen | While composer focused | bottom-up lavender gradient, opacity 0 → 0.45 → 0, 3.2 s loop |
| 15 | **Thinking dots** | AI loading bubble | While waiting | 3 dots, scale 0.85 → 1 with `box-shadow: 0 0 12px var(--ai)`, 1.4 s, 180 ms stagger |
| 16 | **Order-update card entry** | After AI mutates cart | Once on mount | opacity + translateY 8 → 0, 240 ms |
| 17 | **Success toast slide** | "Cart updated" strip · Waiter | When AI mutates cart | translateY -6 → 0 + opacity 0 → 1, 200 ms; auto-dismiss after 2.4 s |
| 18 | **Tab indicator slide** | Tab bar background pill | When active tab changes | `withSpring({damping: 18, stiffness: 220})` to new position, ~360 ms |
| 19 | **Success modal scale** | Place-order success | On open | scale 0.96 → 1 + opacity 0 → 1, 200 ms |
| 20 | **Swipe-to-delete reveal** | Cart row | While swiping | translateX follows finger; reveal `#E5484D` action behind on left swipe |

For animations 1, 9, 10, 11, 12, 18 — also fire `Haptics.impactAsync(ImpactFeedbackStyle.Light)` (or `Medium` for the Place-order CTA).

---

## Files changed (web mockup)

The mockup that backs this handoff lives in this project:

| File | Purpose |
| --- | --- |
| `Screens.html` | The headline file — three pre-populated iOS frames |
| `HANDOFF.md` | This document |
| `colors_and_type.css` | CSS custom-property tokens |
| `ui_kits/mobile/components.jsx` | All atomic components, production-revision |
| `ui_kits/mobile/screens.jsx` | MenuScreen, AiWaiterScreen, CartScreen |
| `ui_kits/mobile/data.js` | Menu, suggestions, deterministic parser with new intents |
| `ui_kits/mobile/index.html` | Clickable demo of the same components |

## Files to change in `intelligent-bistro/apps/mobile/`

| File | Action |
| --- | --- |
| `tailwind.config.js` | Replace `bistro.*` palette per "Refined token system" above |
| `app/(tabs)/_layout.tsx` | New tab bar style + amber-only-on-Waiter icon |
| `app/(tabs)/index.tsx` | New header layout — plain wordmark, restrained AI callout, single Today's pick card, neutral category chips |
| `app/(tabs)/ai-waiter.tsx` | New header, rename labels, new suggestions, new composer (ArrowUp icon, pill input) |
| `app/(tabs)/cart.tsx` | Quiet `Clear` text, `X` remove, modifier chip styling, neutral summary card, updated empty state, new success copy |
| `components/MenuCard.tsx` | Premium card; single tag pill; add-button confirmation animation |
| `components/ChatBubble.tsx` | Less-saturated user color (`#E26A1A`); smaller avatar disc |
| `components/ActionPreviewCard.tsx` | Rename to "Order update"; new layout with sign + text rows; right-aligned "Applied to cart" label |
| `components/CartItemRow.tsx` | New layout with emoji tile; `X` instead of `Trash2`; modifier chip pill |
| `components/GradientButton.tsx` | New gradient direction (180°), shadow tuned to amber |
| `components/EmptyState.tsx` | Icon-in-tile instead of giant emoji |
| `components/SuggestedPrompt.tsx` | Use `bistro-text` for label (not muted) |
| Backend `services/fallbackParser.service.ts` | Add `whatsPopular`, `vegetarian`, `addGenericDrink`, fix modifier-on-missing-item → UNKNOWN |

---

## Commands to run

```bash
# Mobile
cd intelligent-bistro/apps/mobile
npm install
npx expo start --clear           # --clear to bust Metro cache after the Tailwind config edit

# Backend (optional — fallback parser still works without)
cd ../backend
npm install
npm run dev
```

If the simulator is on a different machine than the backend, set `EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:4000` in `apps/mobile/.env`.

---

## Loom demo flow (5 min)

1. **Cold open (0:00–0:20)** — Show the Menu screen on a real iPhone. Pan slowly. Status row, hero, AI callout, featured pick, menu list. *Voiceover: "Premium dark bistro, no marketing slop, one warm accent."*
2. **Tap a menu add (0:20–0:40)** — Tap `+` on Spicy Chicken Sandwich. The button flashes success-green, ticks the badge to 1. Tap one more.
3. **Switch to AI Waiter (0:40–1:30)** — Tap the AI tab. Show the calm empty-state card. Tap the *"Add two spicy chicken sandwiches"* suggestion. Watch the typing dots → assistant reply → **Order update** card → cart badge bumps.
4. **Concierge moment (1:30–2:30)** — Type `I want something vegetarian too`. Show the AI suggesting the Green Goddess Bowl without forcing it on you. Then type `What's popular?` for the popularity reply. *Voiceover: "It asks before doing — feels like a waiter, not a parser."*
5. **Cart screen (2:30–3:30)** — Switch to Cart. Show real items with the **No parmesan** modifier on the Truffle Fries (added earlier off-camera). Bump quantity on Spicy Chicken Sandwich — the qty number scales briefly. Hit `Place order · $45.85`.
6. **Order placed modal (3:30–4:00)** — Modal fades in. `Order placed` / `Your AI waiter sent the order to the kitchen.` Tap `Back to menu`. Cart clears.
7. **Architecture beat (4:00–4:45)** — Cut to README diagram. *Voiceover: "Zod-validated schema between the LLM and the cart, a deterministic fallback parser so the demo runs without an API key, a single Zustand store shared by manual UI and AI."*
8. **Outro (4:45–5:00)** — Pan back to the Menu. End on the wordmark.

---

## Quality checklist before you ship

- [ ] No screen overflows horizontally on iPhone 14/15 (390 × 844 logical).
- [ ] No orange except where the table at the top permits it.
- [ ] Hero is **not** a gradient card anymore.
- [ ] AI waiter callout is **not** a giant amber block.
- [ ] "AI understood" string does not exist anywhere — it's `Order update`.
- [ ] The empty-cart state has both `Browse menu` and `Ask AI waiter` buttons.
- [ ] Cart "Clear" is plain text, not a pill.
- [ ] `Place order · $XX.XX` uses middle-dot `·`.
- [ ] Tab bar has translucent blur on iOS.
- [ ] Add-to-cart shows the green-check microanimation.
- [ ] Qty number scales briefly on change.
- [ ] Typing indicator dots bounce in sequence.
- [ ] Modifier appears as a chip (amber-soft text on graphite), not a bare line of text.
