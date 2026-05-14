// Whole-screen compositions — production-polish revision with depth,
// lavender AI, and ambient focus state.

const C = window.Bistro_C;
const FONT = window.Bistro_FONT;

// ─── Menu screen ──────────────────────────────────────────────
function MenuScreen({ menu, onAdd, goAiWaiter }) {
  const [category, setCategory] = React.useState("all");

  const filtered = (() => {
    if (category === "all") return menu;
    if (category === "popular") return menu.filter(m => m.tags.includes("popular"));
    return menu.filter(m => m.category === category);
  })();

  const featured = menu.filter(m => m.tags.includes("popular")).slice(0, 3);

  return (
    <div style={{ padding: "0 16px 32px" }}>
      <StatusRow />
      <HeroHeader />
      <SearchBar />

      <AICta onClick={goAiWaiter} />

      {/* Category strip */}
      <div style={{
        display: "flex", overflowX: "auto", marginBottom: 18,
        paddingBottom: 4,
      }} className="hide-scroll">
        {[
          { id: "all",        label: "All" },
          { id: "popular",    label: "Popular" },
          { id: "sandwiches", label: "Sandwiches" },
          { id: "bowls",      label: "Bowls" },
          { id: "sides",      label: "Sides" },
          { id: "drinks",     label: "Drinks" },
          { id: "desserts",   label: "Desserts" },
        ].map(c => (
          <CategoryChip key={c.id} label={c.label} active={category === c.id} onClick={() => setCategory(c.id)} />
        ))}
      </div>

      {/* Featured row */}
      {category === "all" && featured.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <SectionHeader title="Featured today" action="See all" />
          <FeaturedCard item={featured[0]} onAdd={() => onAdd(featured[0], 1)} />
        </div>
      ) : null}

      <SectionHeader
        title={
          category === "all" ? "Menu" :
          category === "popular" ? "Popular" :
          window.CATEGORIES.find(c => c.id === category)?.label || "Menu"
        }
        action={`${filtered.length} items`}
      />

      {filtered.map(item => (
        <MenuCardRow key={item.id} item={item} onAdd={() => onAdd(item, 1)} />
      ))}
    </div>
  );
}

// ─── AI Waiter screen ─────────────────────────────────────────
function AiWaiterScreen({ messages, send, loading, menu, banner, onReset, composerFocused, ambient }) {
  const [input, setInput] = React.useState("");
  const [focused, setFocused] = React.useState(!!composerFocused);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Allow host to force focus state for showcase frames
  React.useEffect(() => {
    if (composerFocused !== undefined) setFocused(composerFocused);
  }, [composerFocused]);

  const submit = () => {
    if (!input.trim() || loading) return;
    send(input.trim());
    setInput("");
  };

  const showAmbient = ambient ?? focused;
  const isEmpty = messages.length <= 1 && messages[0]?.id === "m0";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <AmbientGlow visible={showAmbient} />

      <AIWaiterHeader onReset={onReset} />
      <Banner text={banner} />

      {/* Messages or empty state */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto",
        padding: "0 16px 8px",
        position: "relative", zIndex: 2,
      }} className="hide-scroll">
        {isEmpty ? (
          <div style={{ paddingTop: 16 }}>
            <div style={{
              background: C.elevated, border: `1px solid ${C.ai20}`,
              borderTopColor: C.edge,
              borderRadius: "var(--card-radius, 20px)", padding: 18, marginBottom: 16,
              boxShadow: C.innerHi,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span className="ai-breathe" style={{ display: "inline-flex" }}>
                  <Icon name="sparkles" size={14} color={C.ai} />
                </span>
                <span style={{ fontFamily: FONT, color: C.text1, fontWeight: 600, fontSize: 14, letterSpacing: "-0.005em" }}>What can I get started for you?</span>
              </div>
              <div style={{ fontFamily: FONT, color: C.text2, fontSize: 13, lineHeight: 1.5, letterSpacing: "-0.005em" }}>
                Try ordering naturally — I'll update your cart for you. You can also ask what's popular, what's vegan, or how spicy things are.
              </div>
            </div>
          </div>
        ) : (
          messages.map(m => (
            <React.Fragment key={m.id}>
              <ChatBubble message={m} />
              {m.role === "assistant" && m.actions && m.actions.length ? (
                <OrderUpdateCard actions={m.actions} menu={menu} />
              ) : null}
            </React.Fragment>
          ))
        )}
        {loading ? <LoadingBubble /> : null}
      </div>

      {/* Suggestion strip */}
      <div style={{
        display: "flex", overflowX: "auto",
        padding: "10px 16px",
        flexShrink: 0, position: "relative", zIndex: 2,
      }} className="hide-scroll">
        {window.SUGGESTIONS.map(s => (
          <QuickReplyChip key={s} label={s} onClick={() => send(s)} />
        ))}
      </div>

      {/* Composer */}
      <div style={{ padding: "0 16px 12px", flexShrink: 0, position: "relative", zIndex: 2 }}>
        <Composer
          value={input}
          onChange={setInput}
          onSend={submit}
          disabled={loading}
          focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

// ─── Cart screen ──────────────────────────────────────────────
function CartScreen({ items, updateQty, removeItem, clearCart, onPlaceOrder, goMenu, goAiWaiter }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "4px 16px 16px", flexShrink: 0 }}>
          <div style={{ color: C.text1, fontWeight: 700, fontSize: 22, fontFamily: FONT, letterSpacing: "-0.022em" }}>Your Cart</div>
          <div style={{ color: C.text2, fontSize: 13, marginTop: 4, fontFamily: FONT, letterSpacing: "-0.005em" }}>Review your order before checkout.</div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EmptyState
            icon="shopping-bag"
            title="Your cart is waiting."
            subtitle="Add something from the menu or ask the AI waiter."
            cta={
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 12px" }}>
                <PrimaryButton label="Browse menu" onClick={goMenu} />
                <QuietButton label="Ask AI waiter" icon={<Icon name="sparkles" size={14} color={C.ai} />} onClick={goAiWaiter} />
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "4px 16px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: C.text1, fontWeight: 700, fontSize: 22, fontFamily: FONT, letterSpacing: "-0.022em" }}>Your Cart</div>
            <div style={{ color: C.text2, fontSize: 13, marginTop: 4, fontFamily: FONT, letterSpacing: "-0.005em" }}>
              Review your order before checkout.
            </div>
          </div>
          <Press onClick={clearCart} scale={0.94} style={{ padding: "8px 12px" }}>
            <span style={{ color: C.text2, fontSize: 12, fontWeight: 600, fontFamily: FONT, letterSpacing: "-0.005em" }}>Clear</span>
          </Press>
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 12px" }} className="hide-scroll">
        {items.map(item => (
          <CartItemRow
            key={item.itemId}
            item={item}
            onInc={() => updateQty(item.itemId, item.quantity + 1)}
            onDec={() => updateQty(item.itemId, item.quantity - 1)}
            onRemove={() => removeItem(item.itemId)}
          />
        ))}
      </div>

      {/* Summary + CTA */}
      <div style={{ padding: "12px 16px 16px", flexShrink: 0,
        background: "linear-gradient(180deg, rgba(8,8,10,0) 0%, #08080A 30%)",
      }}>
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderTopColor: C.edge,
          boxShadow: C.innerHi,
          borderRadius: "var(--card-radius, 20px)", padding: 14, marginBottom: 10,
        }}>
          <Row label="Subtotal" value={subtotal} />
          <Row label="Estimated tax" value={tax} />
          <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
          <Row label="Total" value={total} bold />
        </div>
        <PrimaryButton label={`Place order · $${total.toFixed(2)}`} onClick={onPlaceOrder} />
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
      <span style={{
        color: bold ? C.text1 : C.text2,
        fontWeight: bold ? 600 : 500,
        fontSize: bold ? 15 : 13,
        fontFamily: FONT, letterSpacing: "-0.005em", whiteSpace: "nowrap",
      }}>{label}</span>
      <span style={{
        color: C.text1,
        fontWeight: bold ? 700 : 600,
        fontSize: bold ? 15 : 13,
        fontFamily: FONT,
      }}>${value.toFixed(2)}</span>
    </div>
  );
}

Object.assign(window, { MenuScreen, AiWaiterScreen, CartScreen });
