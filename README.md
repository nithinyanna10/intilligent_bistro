# The Intelligent Bistro

A premium mobile restaurant ordering experience where users browse a menu, manage a cart manually, **and** drive that same cart through a conversational AI waiter. Natural-language messages are converted by the backend into structured JSON cart actions, validated with Zod, and applied to a shared Zustand store on the device.

---

## ✨ Features

- 🍽 **Beautiful dark bistro UI** — Expo + React Native + NativeWind, warm amber accents, gradients, badges, empty states.
- 🛒 **Manual cart** — add, remove, change quantity, view subtotal/tax/total, place order, success modal.
- 🤖 **AI waiter** — chat with a natural-language assistant, see what it understood, and watch the cart update.
- 🔒 **Schema-first AI** — every AI response is parsed against a Zod `discriminatedUnion`; invalid payloads are rejected and a fallback runs instead.
- 🧰 **Deterministic fallback parser** — handles all required demo phrases offline, so the app is fully functional **without** an `OPENAI_API_KEY`.
- 🧱 **Single source of truth** — manual UI and AI assistant write to the same Zustand cart store.
- 🧭 **Clean monorepo** — `apps/backend` (Node/Express/TS) and `apps/mobile` (Expo/RN/TS).

---

## 🧱 Tech stack

| Layer            | Stack                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| Mobile           | Expo, React Native, TypeScript, Expo Router, NativeWind, Zustand          |
| Icons / FX       | `lucide-react-native`, `expo-linear-gradient`                             |
| Backend          | Node.js, Express, TypeScript, Zod, CORS, dotenv                           |
| AI               | OpenAI Chat Completions (`json_object` response format), Zod validation   |
| Fallback         | Deterministic rules-based parser (synonyms, quantity words, modifiers)    |

---

## 🗂 Repository layout

```
intelligent-bistro/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── index.ts                 # Express entrypoint
│   │       ├── routes/
│   │       │   ├── menu.routes.ts       # GET /menu
│   │       │   └── ai.routes.ts         # POST /ai/parse-order
│   │       ├── services/
│   │       │   ├── aiParser.service.ts        # OpenAI + Zod validation
│   │       │   ├── fallbackParser.service.ts  # Deterministic NL parser
│   │       │   └── menu.service.ts
│   │       ├── schemas/order.schema.ts        # Zod request/response/action schemas
│   │       ├── data/menu.ts                   # Static menu (12 items)
│   │       └── types/cart.ts
│   └── mobile/
│       ├── app/
│       │   ├── _layout.tsx
│       │   └── (tabs)/
│       │       ├── _layout.tsx                # Menu | AI Waiter | Cart (with badge)
│       │       ├── index.tsx                  # Menu screen
│       │       ├── ai-waiter.tsx              # Chat screen
│       │       └── cart.tsx                   # Cart screen
│       ├── components/                        # MenuCard, ChatBubble, ActionPreviewCard, ...
│       ├── store/                             # cartStore, menuStore, chatStore
│       ├── lib/api.ts                         # Typed fetch client
│       ├── types/                             # menu / cart / ai
│       └── constants/colors.ts
└── README.md
```

---

## 🔁 Architecture & AI parsing flow

```
User taps suggestion or types a message
            │
            ▼
   Mobile sends POST /ai/parse-order
   { message, cart }
            │
            ▼
   Backend → aiParser.service.ts
            │
   ┌────────┴─────────┐
   │                  │
   │ OPENAI_API_KEY?  │
   │                  │
   ▼ yes              ▼ no / failure
OpenAI call           fallbackParser.service.ts
JSON-only output      (regex + synonyms + qty words)
   │                  │
   └────────┬─────────┘
            ▼
  Zod ParseOrderResponseSchema
  (discriminatedUnion of actions)
            │
            ▼
  Action list + assistantMessage
            │
            ▼
   Mobile → cartStore.applyActions()
   (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY,
    UPDATE_MODIFIER, CLEAR_CART, ...)
            │
            ▼
  Manual UI and AI share one cart state.
```

The LLM **never mutates cart state directly**. It only returns structured actions; the mobile client decides whether and how to apply them. Unknown item IDs are filtered out before the response leaves the backend.

---

## 🧪 Example AI request / response

**Request**

```http
POST /ai/parse-order
Content-Type: application/json

{
  "message": "Add two spicy chicken sandwiches and a large water",
  "cart": []
}
```

**Response**

```json
{
  "intent": "add_items",
  "actions": [
    {
      "type": "ADD_ITEM",
      "itemId": "spicy_chicken_sandwich",
      "quantity": 2,
      "modifiers": []
    },
    {
      "type": "ADD_ITEM",
      "itemId": "large_water",
      "quantity": 1,
      "modifiers": []
    }
  ],
  "assistantMessage": "Added 2 Spicy Chicken Sandwiches and 1 Large Water to your cart.",
  "confidence": 0.95
}
```

---

## 🚀 Setup

### 1. Backend

```bash
cd apps/backend
npm install
cp .env.example .env       # optional — leave OPENAI_API_KEY blank to use fallback
npm run dev
```

The backend starts on `http://localhost:4000` and prints whether it's running in **OpenAI** or **deterministic fallback** mode.

### 2. Mobile

```bash
cd apps/mobile
npm install
cp .env.example .env       # set EXPO_PUBLIC_API_URL if needed
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR code in Expo Go.

> ⚠️ **Testing on a physical phone:** `localhost` resolves to the phone, not your laptop. Replace it with your machine's LAN IP:
>
> ```
> EXPO_PUBLIC_API_URL=http://192.168.1.25:4000
> ```
>
> (Find your IP with `ipconfig getifaddr en0` on macOS.)

---

## 🔐 Environment variables

### Backend — `apps/backend/.env`

| Variable         | Required | Default        | Notes                                                 |
| ---------------- | -------- | -------------- | ----------------------------------------------------- |
| `PORT`           | no       | `4000`         | Express port                                          |
| `OPENAI_API_KEY` | no       | _(empty)_      | If unset, falls back to deterministic parser          |
| `OPENAI_MODEL`   | no       | `gpt-4o-mini`  | Any chat-completions-capable model                    |

### Mobile — `apps/mobile/.env`

| Variable               | Default                  | Notes                                  |
| ---------------------- | ------------------------ | -------------------------------------- |
| `EXPO_PUBLIC_API_URL`  | `http://localhost:4000`  | Use LAN IP for physical devices        |

---

## 🎬 Demo script (Loom — ~5 min)

1. **Intro (0:00 – 0:30)** — Show the dark hero, AI-waiter callout, category chips, popular section.
2. **Manual cart (0:30 – 1:15)** — Tap `+` on Truffle Fries and Bistro Burger. Open Cart, change quantities, remove an item.
3. **AI ordering (1:15 – 3:00)** — Switch to AI Waiter. Send the following in order:
   - `Add two spicy chicken sandwiches and a large water` → see the **AI understood** preview, cart badge updates.
   - `Add truffle fries`
   - `Remove one spicy chicken sandwich` → quantity drops from 2 → 1.
   - `Make my burger without onions` → if burger is in cart, modifier appears; otherwise it asks.
   - `What's spicy?` → assistant mentions the Spicy Chicken Sandwich.
   - `Clear my cart`
4. **Architecture (3:00 – 4:30)** — Explain on the slide / diagram:
   - Single Zustand store shared by manual UI + AI.
   - Backend Zod schema for every action.
   - OpenAI path vs deterministic fallback path.
5. **Wrap (4:30 – 5:00)** — Mention that the app runs end-to-end with **no API key** thanks to the fallback parser.

---

## 🤖 Supported AI actions

| Action              | Shape                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| `ADD_ITEM`          | `{ type, itemId, quantity, modifiers }`                              |
| `REMOVE_ITEM`       | `{ type, itemId }`                                                   |
| `UPDATE_QUANTITY`   | `{ type, itemId, quantity }`                                         |
| `UPDATE_MODIFIER`   | `{ type, itemId, modifiers }`                                        |
| `CLEAR_CART`        | `{ type }`                                                            |
| `SHOW_CART`         | `{ type }`                                                            |
| `ASK_MENU_QUESTION` | `{ type, query }`                                                     |
| `UNKNOWN`           | `{ type, reason }`                                                    |

All actions are validated by `ParseOrderResponseSchema` (Zod `discriminatedUnion`) before reaching the client.

---

## 🛠 Troubleshooting

- **`Network request failed` in Expo Go on a phone** — your `EXPO_PUBLIC_API_URL` is still `localhost`. Use your machine's LAN IP.
- **Backend says "AI mode: deterministic fallback"** — that's expected when `OPENAI_API_KEY` is empty. Demo phrases still work.
- **NativeWind classes not applying** — make sure `babel.config.js` includes the `nativewind/babel` preset and you restarted Metro after install.
- **iOS simulator can't reach backend** — confirm `npm run dev` is running and try `curl http://localhost:4000/health`.

---

## 📝 Notes on AI tools used

I used AI coding tools to accelerate implementation, but kept the architecture explicit around **schema validation**, **deterministic fallbacks**, and **clean state management**:

- All AI responses are validated by Zod *before* touching cart state.
- A handwritten fallback parser guarantees the demo works without an API key.
- The LLM only emits structured actions — it never mutates cart state directly.
- Manual UI and AI share a single Zustand store so the two paths can never drift.

---

## 📦 What's intentionally out of scope

- Auth, payments, persistence (DB), order history
- Admin panel / staff dashboard
- Image assets (we use emoji as visual placeholders by design)
- Streaming responses (the parse step is short; a single round-trip is the right shape)
