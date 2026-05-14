// Production-grade atomic components — depth surfaces, lavender AI accent,
// real food photography, motion language documented in CSS keyframes.

// ─── Tokens ───────────────────────────────────────────────────
const C = {
  // Surfaces
  bg:          "#08080A",
  bgTop:       "#0E0E10",
  card:        "#16161A",
  elevated:    "#1B1B20",
  edge:        "var(--edge, rgba(255,255,255,0.04))",
  border:      "rgba(255,255,255,0.08)",
  borderHi:    "rgba(255,255,255,0.14)",
  innerHi:     "var(--inner-hi, inset 0 1px 0 rgba(255,255,255,0.05))",
  liftShadow:  "var(--lift, 0 8px 24px rgba(0,0,0,0.40))",
  // Accents
  accent:      "#FF6A1A",
  accentHi:    "#FF7A2E",
  accent35:    "rgba(255,106,26,0.35)",
  accentGrad:  "linear-gradient(180deg, #FF7A2E 0%, #FF6A1A 100%)",
  // AI accent (lavender by default, tweakable)
  ai:          "var(--ai, #A39CFF)",
  ai20:        "var(--ai-20, rgba(163,156,255,0.20))",
  ai40:        "var(--ai-40, rgba(163,156,255,0.40))",
  ai60:        "var(--ai-60, rgba(163,156,255,0.60))",
  aiGlow:      "var(--ai-glow, rgba(163,156,255,0.18))",
  // Status
  success:     "#3DD68C",
  success10:   "rgba(61,214,140,0.10)",
  success25:   "rgba(61,214,140,0.25)",
  danger:      "#E5484D",
  // Text tiers
  text1:       "#EDEDF0",
  text2:       "#9A9AA3",
  text3:       "#5C5C65",
};
const FONT = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif';

// ─── Icon helper ──────────────────────────────────────────────
function Icon({ name, size = 20, color, strokeWidth = 2, style = {} }) {
  return (
    <i
      data-lucide={name}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, flexShrink: 0,
        color: color || "currentColor",
        strokeWidth,
        ...style,
      }}
    />
  );
}

// ─── Press wrapper (spring-feel scale) ────────────────────────
function Press({ onClick, children, style = {}, scale = 0.96, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div
      role="button"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      style={{
        cursor: "pointer",
        transform: pressed ? `scale(${scale})` : "scale(1)",
        opacity: pressed ? 0.96 : 1,
        // spring-ish — symmetric ease that decelerates more on release
        transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 160ms ease",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Surface primitive ───────────────────────────────────────
function Surface({ children, elevated = false, style = {} }) {
  return (
    <div style={{
      background: elevated ? C.elevated : C.card,
      borderRadius: "var(--card-radius, 20px)",
      border: `1px solid ${C.border}`,
      borderTopColor: C.edge,                 // light catching the edge
      boxShadow: elevated ? `${C.innerHi}, ${C.liftShadow}` : C.innerHi,
      ...style,
    }}>{children}</div>
  );
}

// ─── Primary button (CTA) ────────────────────────────────────
function PrimaryButton({ label, onClick, icon, disabled, glow = true }) {
  return (
    <Press
      onClick={disabled ? undefined : onClick}
      scale={0.98}
      style={{
        background: C.accentGrad,
        borderRadius: 16,
        padding: "15px 20px",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        boxShadow: glow
          ? `inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px ${C.accent35}`
          : "inset 0 1px 0 rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {icon}
      <span style={{ color: "white", fontWeight: 600, fontSize: 15, fontFamily: FONT, letterSpacing: "-0.005em" }}>{label}</span>
    </Press>
  );
}

// ─── Quiet button (secondary CTA) ─────────────────────────────
function QuietButton({ label, onClick, icon }) {
  return (
    <Press
      onClick={onClick}
      scale={0.98}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTopColor: C.edge,
        borderRadius: 16,
        padding: "13px 20px",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8,
      }}
    >
      {icon}
      <span style={{ color: C.text1, fontWeight: 600, fontSize: 15, fontFamily: FONT, letterSpacing: "-0.005em" }}>{label}</span>
    </Press>
  );
}

// ─── Quick-reply chip ─────────────────────────────────────────
function QuickReplyChip({ label, onClick }) {
  return (
    <Press
      onClick={onClick}
      scale={0.96}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTopColor: C.edge,
        padding: "9px 14px",
        borderRadius: 9999,
        marginRight: 8,
        flexShrink: 0,
      }}
    >
      <span style={{ color: C.text1, fontSize: 13, fontWeight: 500, fontFamily: FONT, letterSpacing: "-0.005em" }}>{label}</span>
    </Press>
  );
}

// ─── Category chip (lavender selected, NOT orange) ───────────
function CategoryChip({ label, active, onClick }) {
  return (
    <Press
      onClick={onClick}
      scale={0.96}
      style={{
        marginRight: 8,
        padding: "8px 14px",
        borderRadius: 9999,
        border: active ? `1px solid ${C.ai60}` : `1px solid ${C.border}`,
        background: active ? C.elevated : "transparent",
        flexShrink: 0,
        transition: "border-color 200ms ease, background-color 200ms ease",
      }}
    >
      <span style={{
        fontSize: 13, fontWeight: 600, fontFamily: FONT, letterSpacing: "-0.005em",
        color: active ? C.text1 : C.text2,
      }}>{label}</span>
    </Press>
  );
}

// ─── Tag pill ────────────────────────────────────────────────
function TagPill({ tag }) {
  const map = {
    spicy:   { icon: "flame", color: "#FB923C", label: "Spicy" },
    vegan:   { icon: "leaf",  color: C.success, label: "Vegan" },
    popular: { icon: "star",  color: "#FBBF24", label: "Popular" },
  };
  const cfg = map[tag];
  if (!cfg) return null;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px",
      borderRadius: 9999,
      background: C.card,
      border: `1px solid ${C.border}`,
    }}>
      <Icon name={cfg.icon} size={11} color={cfg.color} />
      <span style={{ fontSize: 10.5, fontWeight: 500, color: C.text2, fontFamily: FONT, letterSpacing: "0.005em" }}>{cfg.label}</span>
    </div>
  );
}

// ─── Food image tile (with subtle bottom darken) ──────────────
function FoodTile({ item, size = 64, radius = 16 }) {
  return (
    <div className="food-tile" style={{
      width: size, height: size, borderRadius: radius,
      background: C.elevated,
      border: `1px solid ${C.border}`,
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
    }}>
      <img
        className="food-photo"
        src={item.image}
        alt=""
        loading="eager"
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          display: "block",
        }}
      />
      <div className="food-emoji" style={{
        position: "absolute", inset: 0,
        alignItems: "center", justifyContent: "center",
        fontSize: size * 0.55,
        background: `radial-gradient(120% 120% at 30% 20%, #2E2E32 0%, #18181B 100%)`,
      }}>{item.emoji}</div>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "50%",
        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.30) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Status row ───────────────────────────────────────────────
function StatusRow() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "2px 0 10px",
      whiteSpace: "nowrap",
    }}>
      <span className="open-dot" style={{
        width: 7, height: 7, borderRadius: 9999,
        background: C.success, display: "inline-block",
      }} />
      <span style={{ fontSize: 12, color: C.text2, fontWeight: 500, fontFamily: FONT, letterSpacing: "-0.005em" }}>
        Open now <span style={{ color: C.text3 }}>·</span> 18–25 min
      </span>
      <span style={{ flex: 1 }} />
      <Icon name="map-pin" size={12} color={C.text2} />
      <span style={{ fontSize: 12, color: C.text2, fontWeight: 500, fontFamily: FONT }}>Downtown</span>
    </div>
  );
}

// ─── Hero header ──────────────────────────────────────────────
function HeroHeader() {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: FONT, color: C.text1, fontWeight: 700, fontSize: 26, lineHeight: 1.08,
        letterSpacing: "-0.024em",
      }}>
        The Intelligent Bistro
      </div>
      <div style={{
        fontFamily: FONT, color: C.text2, fontSize: 13.5, marginTop: 6, lineHeight: 1.45,
        letterSpacing: "-0.005em",
      }}>
        Seasonal comfort food with an AI ordering assistant.
      </div>
    </div>
  );
}

// ─── Sticky search bar (with subtle AI sparkle) ──────────────
function SearchBar() {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderTopColor: C.edge,
      boxShadow: C.innerHi,
      borderRadius: 14,
      padding: "11px 14px",
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 18,
    }}>
      <Icon name="search" size={15} color={C.text3} />
      <span style={{
        flex: 1, color: C.text3, fontSize: 14, fontFamily: FONT,
        letterSpacing: "-0.005em",
      }}>Search dishes or describe a craving…</span>
      <span className="ai-pulse" style={{ display: "inline-flex", alignItems: "center" }}>
        <Icon name="sparkles" size={14} color={C.ai} />
      </span>
    </div>
  );
}

// ─── AI assistant callout ─────────────────────────────────────
function AICta({ onClick }) {
  return (
    <Press
      onClick={onClick}
      scale={0.99}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTopColor: C.edge,
        boxShadow: C.innerHi,
        borderRadius: "var(--card-radius, 18px)",
        padding: 14,
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 18,
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: C.elevated,
        border: `1px solid ${C.ai40}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span className="ai-breathe"><Icon name="sparkles" size={16} color={C.ai} /></span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, color: C.text1, fontWeight: 600, fontSize: 14, letterSpacing: "-0.005em" }}>
          Need help ordering?
        </div>
        <div style={{ fontFamily: FONT, color: C.text2, fontSize: 12, marginTop: 2, letterSpacing: "-0.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Tell the AI waiter what you're craving.
        </div>
      </div>
      <div style={{
        padding: "7px 11px",
        borderRadius: 9999,
        background: C.elevated,
        border: `1px solid ${C.border}`,
        display: "inline-flex", alignItems: "center", gap: 4,
        flexShrink: 0, whiteSpace: "nowrap",
      }}>
        <span style={{ fontFamily: FONT, color: C.text1, fontSize: 12, fontWeight: 600, letterSpacing: "-0.005em" }}>Start</span>
        <Icon name="arrow-right" size={12} color={C.text1} />
      </div>
    </Press>
  );
}

// ─── Section header ──────────────────────────────────────────
function SectionHeader({ title, action }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      marginBottom: 10,
    }}>
      <div style={{ fontFamily: FONT, color: C.text1, fontWeight: 700, fontSize: 17, letterSpacing: "-0.018em" }}>{title}</div>
      {action ? (
        <div style={{ fontFamily: FONT, color: C.text2, fontSize: 12, fontWeight: 500, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>{action}</div>
      ) : null}
    </div>
  );
}

// ─── Featured card (1.4× taller, full-height image, shimmer sweep) ──
function FeaturedCard({ item, onAdd, eyebrow = "Popular" }) {
  return (
    <Press
      onClick={onAdd}
      scale={0.99}
      style={{
        background: C.elevated,
        border: `1px solid ${C.border}`,
        borderTopColor: C.edge,
        boxShadow: `${C.innerHi}, ${C.liftShadow}`,
        borderRadius: "var(--card-radius, 20px)",
        padding: 0,
        display: "flex",
        gap: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{
        width: 110, height: 110, flexShrink: 0,
        background: C.bg,
        position: "relative",
      }}>
        <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(27,27,32,0.0) 60%, rgba(27,27,32,0.85) 100%)",
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.ai, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT }}>{eyebrow}</span>
          <span style={{ width: 3, height: 3, borderRadius: 9999, background: C.text3, display: "inline-block" }} />
          <span style={{ fontSize: 10.5, fontWeight: 500, color: C.text2, fontFamily: FONT, letterSpacing: "0.005em" }}>Today's pick</span>
        </div>
        <div style={{ fontFamily: FONT, color: C.text1, fontWeight: 700, fontSize: 16, letterSpacing: "-0.014em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
        <div style={{ fontFamily: FONT, color: C.text2, fontSize: 12, marginTop: 3, letterSpacing: "-0.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontFamily: FONT, color: C.accent, fontWeight: 700, fontSize: 14 }}>${item.price.toFixed(2)}</span>
          <Icon name="arrow-right" size={15} color={C.text2} />
        </div>
      </div>
      {/* Shimmer sweep — runs once */}
      <div className="shimmer-once" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
      }} />
    </Press>
  );
}

// ─── Menu card row (photo + add) ──────────────────────────────
function MenuCardRow({ item, onAdd }) {
  const [justAdded, setJustAdded] = React.useState(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd && onAdd();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };
  const tagPriority = ["spicy", "vegan", "popular"];
  const primaryTag = tagPriority.find(t => item.tags.includes(t));

  return (
    <div style={{
      background: C.card,
      borderRadius: "var(--card-radius, 20px)", padding: 12,
      marginBottom: 10,
      border: `1px solid ${C.border}`,
      borderTopColor: C.edge,
      boxShadow: C.innerHi,
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <FoodTile item={item} size={64} radius={16} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: FONT, color: C.text1, fontWeight: 600, fontSize: 15,
          letterSpacing: "-0.008em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{item.name}</div>
        <div style={{
          fontFamily: FONT, color: C.text2, fontSize: 12, marginTop: 3,
          letterSpacing: "-0.005em", lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{item.description}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
          <div style={{ fontFamily: FONT, color: C.text1, fontWeight: 700, fontSize: 14 }}>${item.price.toFixed(2)}</div>
          {primaryTag ? <TagPill tag={primaryTag} /> : null}
        </div>
      </div>

      <Press
        onClick={handleAdd}
        scale={0.86}
        style={{
          width: 36, height: 36, borderRadius: 9999,
          background: justAdded ? C.success : C.elevated,
          border: `1px solid ${justAdded ? C.success25 : C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: justAdded
            ? "0 0 16px rgba(61,214,140,0.40), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "inset 0 1px 0 rgba(255,255,255,0.06)",
          transition: "background 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
        }}
      >
        <Icon name={justAdded ? "check" : "plus"} size={16} color={C.text1} strokeWidth={2.5} />
      </Press>
    </div>
  );
}

// ─── Cart item row ────────────────────────────────────────────
function CartItemRow({ item, onInc, onDec, onRemove }) {
  const menuItem = window.MENU.find(m => m.id === item.itemId) || {};
  return (
    <div style={{
      background: C.card,
      borderRadius: "var(--card-radius, 20px)", padding: 14, marginBottom: 10,
      border: `1px solid ${C.border}`,
      borderTopColor: C.edge,
      boxShadow: C.innerHi,
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <FoodTile item={menuItem} size={52} radius={14} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ fontFamily: FONT, color: C.text1, fontWeight: 600, fontSize: 15, letterSpacing: "-0.008em" }}>{item.name}</div>
            <Press onClick={onRemove} scale={0.9} style={{ padding: 2, marginTop: -2 }}>
              <Icon name="x" size={15} color={C.text3} />
            </Press>
          </div>
          <div style={{ fontFamily: FONT, color: C.text2, fontSize: 12, marginTop: 2, letterSpacing: "-0.005em" }}>
            ${item.price.toFixed(2)} each
          </div>
          {item.modifiers && item.modifiers.length > 0 ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6,
              padding: "2px 8px", borderRadius: 9999,
              background: C.elevated, border: `1px solid ${C.border}`,
              whiteSpace: "nowrap",
            }}>
              <span style={{ fontFamily: FONT, color: C.ai, fontSize: 11, fontWeight: 500, letterSpacing: "-0.005em" }}>{item.modifiers.join(", ")}</span>
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: C.elevated, borderRadius: 9999, padding: 3,
          border: `1px solid ${C.border}`,
        }}>
          <Press onClick={onDec} scale={0.85} style={{
            width: 26, height: 26, borderRadius: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="minus" size={13} color={C.text1} />
          </Press>
          <span key={item.quantity} className="qty-fade" style={{
            fontFamily: FONT, color: C.text1, fontWeight: 600, fontSize: 14,
            minWidth: 22, textAlign: "center", display: "inline-block",
          }}>{item.quantity}</span>
          <Press onClick={onInc} scale={0.85} style={{
            width: 26, height: 26, borderRadius: 9999,
            background: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="plus" size={13} color={"white"} strokeWidth={2.5} />
          </Press>
        </div>
        <div style={{ fontFamily: FONT, color: C.text1, fontWeight: 700, fontSize: 15 }}>${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    </div>
  );
}

// ─── User chat bubble (solid orange) ──────────────────────────
function UserBubble({ text }) {
  return (
    <div style={{
      display: "flex", marginBottom: 10, justifyContent: "flex-end",
    }}>
      <div style={{
        padding: "10px 14px", borderRadius: 18,
        borderBottomRightRadius: 6,
        maxWidth: "78%",
        background: C.accent,
        color: "white",
        fontSize: 14, lineHeight: 1.4, fontFamily: FONT, letterSpacing: "-0.005em",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
      }}>
        {text}
      </div>
    </div>
  );
}

// ─── AI chat bubble (outlined lavender, NOT filled) ──────────
function AIBubble({ text }) {
  return (
    <div style={{
      display: "flex", marginBottom: 10, justifyContent: "flex-start",
      alignItems: "flex-end", gap: 8,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 9999,
        background: C.elevated, border: `1px solid ${C.ai40}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon name="sparkles" size={12} color={C.ai} />
      </div>
      <div style={{
        background: C.elevated,
        border: `1px solid ${C.ai20}`,
        borderTopColor: C.edge,
        padding: "10px 14px",
        borderRadius: 18, borderBottomLeftRadius: 6,
        maxWidth: "78%",
        color: C.text1,
        fontSize: 14, lineHeight: 1.45, fontFamily: FONT, letterSpacing: "-0.005em",
      }}>
        {text}
      </div>
    </div>
  );
}

function ChatBubble({ message }) {
  return message.role === "user" ? <UserBubble text={message.text} /> : <AIBubble text={message.text} />;
}

// ─── Order update card (with orange left bar) ────────────────
function OrderUpdateCard({ actions, menu }) {
  if (!actions || !actions.length) return null;
  const nameOf = id => (menu.find(m => m.id === id) || {}).name || id;
  const useful = actions.filter(a =>
    ["ADD_ITEM", "REMOVE_ITEM", "UPDATE_QUANTITY", "UPDATE_MODIFIER", "CLEAR_CART"].includes(a.type)
  );
  if (!useful.length) return null;
  const verb = (a) => {
    switch (a.type) {
      case "ADD_ITEM":         return { sign: "+", text: `${a.quantity} × ${nameOf(a.itemId)}` };
      case "REMOVE_ITEM":      return { sign: "−", text: nameOf(a.itemId) };
      case "UPDATE_QUANTITY":  return { sign: "↻", text: `${nameOf(a.itemId)} → ${a.quantity}` };
      case "UPDATE_MODIFIER":  return { sign: "✎", text: `${nameOf(a.itemId)} · ${a.modifiers.join(", ")}` };
      case "CLEAR_CART":       return { sign: "−", text: "Cleared cart" };
      default:                 return null;
    }
  };
  return (
    <div style={{
      background: C.elevated,
      border: `1px solid ${C.border}`,
      borderTopColor: C.edge,
      boxShadow: `${C.innerHi}, ${C.liftShadow}`,
      borderRadius: "var(--card-radius, 18px)", marginBottom: 14, marginLeft: 36, maxWidth: 320,
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Orange left bar — signals action card */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: "rgba(255,106,26,0.40)",
      }} />
      <div style={{ padding: "12px 14px 12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Icon name="check-circle-2" size={13} color={C.success} />
          <span style={{ fontFamily: FONT, color: C.text1, fontSize: 12, fontWeight: 600, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>Order update</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: FONT, color: C.text3, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>Applied to cart</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {useful.map((a, i) => {
            const v = verb(a);
            if (!v) return null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontFamily: FONT, color: C.text2, fontSize: 13, fontWeight: 600,
                  width: 12, textAlign: "center",
                }}>{v.sign}</span>
                <span style={{ fontFamily: FONT, color: C.text1, fontSize: 13, letterSpacing: "-0.005em" }}>{v.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────
function EmptyState({ icon = "shopping-bag", title, subtitle, cta }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 32px", textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 20,
        background: C.elevated, border: `1px solid ${C.border}`,
        borderTopColor: C.edge, boxShadow: C.innerHi,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <Icon name={icon} size={24} color={C.text2} />
      </div>
      <div style={{ fontFamily: FONT, color: C.text1, fontSize: 17, fontWeight: 600, letterSpacing: "-0.018em" }}>{title}</div>
      {subtitle ? <div style={{ fontFamily: FONT, color: C.text2, fontSize: 13, marginTop: 6, lineHeight: 1.45, letterSpacing: "-0.005em" }}>{subtitle}</div> : null}
      {cta ? <div style={{ marginTop: 22, width: "100%" }}>{cta}</div> : null}
    </div>
  );
}

// ─── Bottom tab bar (animated underline + bump badge) ────────
function TabBar({ active, onChange, cartCount }) {
  const tabs = [
    { id: "menu",      label: "Menu",   icon: "utensils-crossed" },
    { id: "ai-waiter", label: "Waiter", icon: "sparkles" },
    { id: "cart",      label: "Cart",   icon: "shopping-bag", badge: cartCount },
  ];
  const idx = tabs.findIndex(t => t.id === active);
  return (
    <div style={{
      background: "rgba(8,8,10,0.92)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      borderTop: `1px solid ${C.border}`,
      padding: "10px 16px 28px",
      display: "flex", justifyContent: "space-around",
      flexShrink: 0,
      position: "relative",
    }}>
      {/* Animated indicator pill (sits behind active tab icon) */}
      <div style={{
        position: "absolute", top: 8,
        left: `calc(${(idx * 100) / tabs.length}% + ${100 / (tabs.length * 2)}% - 22px)`,
        width: 44, height: 32,
        borderRadius: 12,
        background: C.elevated,
        border: `1px solid ${C.ai40}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "left 360ms cubic-bezier(0.34, 1.4, 0.64, 1)",
        pointerEvents: "none",
      }} />
      {tabs.map(t => {
        const isActive = t.id === active;
        const color = isActive ? C.ai : C.text3;
        return (
          <Press key={t.id} onClick={() => onChange(t.id)} scale={0.92} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, position: "relative", zIndex: 1,
            padding: "2px 0",
          }}>
            <div style={{ position: "relative" }}>
              <Icon name={t.icon} size={20} color={color} strokeWidth={isActive ? 2.2 : 1.75} />
              {t.badge ? (
                <div key={t.badge} className="badge-bump" style={{
                  position: "absolute", top: -5, right: -9,
                  background: C.accent, borderRadius: 9999,
                  minWidth: 17, height: 17, padding: "0 4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 10, fontWeight: 700, fontFamily: FONT,
                  border: "1.5px solid #08080A",
                }}>{t.badge}</div>
              ) : null}
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: isActive ? C.text1 : C.text3, fontFamily: FONT, letterSpacing: "0.005em" }}>{t.label}</span>
          </Press>
        );
      })}
    </div>
  );
}

// ─── Success modal ────────────────────────────────────────────
function SuccessModal({ open, onDone }) {
  if (!open) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.72)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 28px",
    }}>
      <div style={{
        background: C.elevated, border: `1px solid ${C.border}`,
        borderTopColor: C.edge, boxShadow: `${C.innerHi}, ${C.liftShadow}`,
        borderRadius: 22, padding: 24,
        display: "flex", flexDirection: "column", alignItems: "center",
        width: "100%", maxWidth: 320,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 9999,
          background: C.success10,
          border: `1px solid ${C.success25}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 14,
        }}>
          <Icon name="check" size={26} color={C.success} strokeWidth={2.4} />
        </div>
        <div style={{ fontFamily: FONT, color: C.text1, fontWeight: 700, fontSize: 18, textAlign: "center", letterSpacing: "-0.018em" }}>Order placed</div>
        <div style={{ fontFamily: FONT, color: C.text2, fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 1.45, letterSpacing: "-0.005em" }}>
          Your AI waiter sent the order to the kitchen.
        </div>
        <div style={{ width: "100%", marginTop: 22 }}>
          <PrimaryButton label="Back to menu" onClick={onDone} />
        </div>
      </div>
    </div>
  );
}

// ─── Composer (with focused lavender ring) ───────────────────
function Composer({ value, onChange, onSend, disabled, focused, onFocus, onBlur }) {
  const canSend = value.trim().length > 0 && !disabled;
  return (
    <div style={{ position: "relative" }}>
      {/* Expanding ring when focused */}
      <div style={{
        position: "absolute", inset: focused ? -3 : 0,
        borderRadius: 9999,
        border: `1px solid ${focused ? C.ai60 : "transparent"}`,
        boxShadow: focused ? `0 0 0 4px rgba(163,156,255,0.10)` : "none",
        transition: "all 200ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        pointerEvents: "none",
      }} />
      <div style={{
        display: "flex", alignItems: "center",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTopColor: C.edge,
        boxShadow: C.innerHi,
        borderRadius: 9999, padding: "5px 6px 5px 18px", gap: 8,
        position: "relative",
      }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={e => { if (e.key === "Enter" && canSend) onSend(); }}
          placeholder="Ask your waiter…"
          style={{
            flex: 1, background: "transparent", border: 0, outline: 0,
            color: C.text1, fontSize: 14, fontFamily: FONT, letterSpacing: "-0.005em",
            padding: "8px 0",
          }}
        />
        <Press
          onClick={canSend ? onSend : undefined}
          scale={0.88}
          style={{
            width: 34, height: 34, borderRadius: 9999,
            background: canSend ? C.accentGrad : C.elevated,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 200ms ease",
            boxShadow: canSend ? "inset 0 1px 0 rgba(255,255,255,0.18)" : "none",
          }}
        >
          <Icon name="arrow-up" size={15} color={canSend ? "white" : C.text3} strokeWidth={2.4} />
        </Press>
      </div>
    </div>
  );
}

// ─── Typing indicator (lavender glow, sequenced pulse) ───────
function LoadingBubble() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 9999,
        background: C.elevated, border: `1px solid ${C.ai40}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon name="sparkles" size={12} color={C.ai} />
      </div>
      <div style={{
        background: C.elevated, border: `1px solid ${C.ai20}`,
        borderRadius: 18, borderBottomLeftRadius: 6,
        padding: "10px 14px",
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ display: "inline-flex", gap: 5, alignItems: "center", height: 14 }}>
          <span className="thinking-dot" style={{ animationDelay: "0ms" }} />
          <span className="thinking-dot" style={{ animationDelay: "180ms" }} />
          <span className="thinking-dot" style={{ animationDelay: "360ms" }} />
        </div>
        <span style={{ color: C.text2, fontSize: 12, fontFamily: FONT, letterSpacing: "-0.005em" }}>thinking…</span>
      </div>
    </div>
  );
}

// ─── Success toast (slides in) ───────────────────────────────
function Banner({ text }) {
  if (!text) return null;
  return (
    <div style={{
      margin: "0 16px 8px",
      background: C.success10,
      border: `1px solid ${C.success25}`,
      borderRadius: 12, padding: "8px 12px",
      display: "inline-flex", alignItems: "center", gap: 8,
      width: "fit-content",
    }}>
      <Icon name="check" size={13} color={C.success} strokeWidth={2.4} />
      <span style={{ color: C.success, fontSize: 12, fontWeight: 600, fontFamily: FONT, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
}

// ─── AI waiter header (rotating + breathing sparkle) ─────────
function AIWaiterHeader({ onReset }) {
  return (
    <div style={{
      padding: "4px 16px 14px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9999,
          background: C.elevated, border: `1px solid ${C.ai40}`,
          borderTopColor: C.edge,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `${C.innerHi}, 0 0 16px rgba(163,156,255,0.18)`,
        }}>
          <span className="ai-orbit" style={{ display: "inline-flex" }}>
            <span className="ai-breathe" style={{ display: "inline-flex" }}>
              <Icon name="sparkles" size={15} color={C.ai} />
            </span>
          </span>
        </div>
        <div>
          <div style={{ color: C.text1, fontWeight: 700, fontSize: 16, fontFamily: FONT, letterSpacing: "-0.014em" }}>AI Waiter</div>
          <div style={{ color: C.text2, fontSize: 11.5, fontFamily: FONT, marginTop: 1, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>Tell me what you'd like to order</div>
        </div>
      </div>
      <Press onClick={onReset} scale={0.9} style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderTopColor: C.edge,
        borderRadius: 9999, padding: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="rotate-ccw" size={14} color={C.text2} />
      </Press>
    </div>
  );
}

// ─── Ambient AI glow (when composer focused) ────────────────
function AmbientGlow({ visible }) {
  if (!visible) return null;
  return (
    <div className="ambient-glow" style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      height: "32%",
      background: "linear-gradient(180deg, transparent 0%, rgba(163,156,255,0.18) 100%)",
      pointerEvents: "none",
      zIndex: 1,
    }} />
  );
}

Object.assign(window, {
  Bistro_C: C, Bistro_FONT: FONT,
  Icon, Press, Surface,
  PrimaryButton, QuietButton, QuickReplyChip, CategoryChip, TagPill,
  StatusRow, HeroHeader, SearchBar, AICta, SectionHeader,
  FeaturedCard, MenuCardRow, CartItemRow,
  ChatBubble, UserBubble, AIBubble, OrderUpdateCard,
  EmptyState, TabBar, SuccessModal, Composer, LoadingBubble, Banner,
  AIWaiterHeader, AmbientGlow, FoodTile,
});
