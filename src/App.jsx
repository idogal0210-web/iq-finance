import { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard, PieChart, WalletCards, Settings2, Bell,
  TrendingUp, TrendingDown, Repeat, ArrowDownLeft, Sparkles,
  ArrowRight, ArrowLeft, Home, Plus, User, Menu, X, Globe,
  Monitor, Smartphone, Briefcase, Coffee, ShoppingBag, Shield, CreditCard,
  Building2, PiggyBank, BarChart3, Zap, Link2, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════ */

const RICH_BLACK = "#060606";          // Change #1 — deeper luxury black
const SURFACE = "#0c0e10";
const EMERALD = "#2dd4a0";
const EMERALD_GLOW = "rgba(45, 212, 160, 0.35)";
const EMERALD_OUTER = "rgba(45, 212, 160, 0.12)";
const CHARCOAL = "#5a5a64";

/* ═══════════════════════════════════════════════════════════
   WORDMARK
   ═══════════════════════════════════════════════════════════ */

function Wordmark({ size = 15, showTagline = true }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, position: "relative" }}>
      <div style={{
        position: "absolute", top: "-50%", left: "-10%",
        width: "50%", height: "200%", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.045) 0%, transparent 70%)",
        filter: "blur(12px)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "baseline" }}>
        <span style={{ position: "relative", display: "inline-block" }}>
          {/* dotless ı — font tittle removed; green dot serves as the sole dot */}
          <span style={{
            fontSize: size, fontWeight: 500, color: "#fff",
            letterSpacing: "0.02em", fontFamily: "'Aeonik', sans-serif",
          }}>ı</span>
          <span style={{
            position: "absolute",
            top: size <= 14 ? "-0.12em" : "-0.15em",
            left: "0.08em",
            width: "0.26em", height: "0.26em", borderRadius: "50%",
            background: EMERALD, opacity: 0.85,
            boxShadow: `0 0 4px ${EMERALD_GLOW}, 0 0 10px ${EMERALD_OUTER}`,
            animation: "pulseGlow 3s ease-in-out infinite",
          }} />
        </span>
        <span style={{
          fontSize: size, fontWeight: 500, color: "#fff",
          letterSpacing: "0.02em", fontFamily: "'Aeonik', sans-serif",
        }}>Q</span>
        <span style={{
          fontSize: size, fontWeight: 300, color: CHARCOAL,
          letterSpacing: "0.02em", fontFamily: "'Aeonik', sans-serif",
        }}>.finance</span>
      </div>
      {showTagline && (
        <span style={{
          fontSize: size * 0.52, fontWeight: 300, letterSpacing: "0.2em",
          color: "#2a2a30", fontFamily: "'Aeonik', sans-serif",
          position: "relative", zIndex: 1,
        }}>
          Value your money.
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPLASH SCREEN
   ═══════════════════════════════════════════════════════════ */

function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onFinish?.(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: RICH_BLACK,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase >= 1 ? (phase >= 2 ? 0 : 1) : 0,
      transform: phase >= 2 ? "scale(1.03)" : phase >= 1 ? "scale(1)" : "scale(0.97)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
      pointerEvents: phase >= 2 ? "none" : "auto",
    }}>
      <Wordmark size={30} showTagline={true} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   i18n
   ═══════════════════════════════════════════════════════════ */

const t = {
  en: {
    netWorth: "Total Net Worth", income: "Income", flow: "Expenses",
    recentFlow: "Recent Flow", archive: "Archive",
    sub: "Studio Subscription", subSub: "Recurring • Today",
    transfer: "External Transfer", transferSub: "Direct • March 11",
    salary: "Monthly Salary", salarySub: "Deposit • March 1",
    coffee: "Coffee & Co.", coffeeSub: "Debit • Today",
    grocery: "Grocery Store", grocerySub: "Debit • Yesterday",
    insurance: "Health Insurance", insuranceSub: "Recurring • March 1",
    invest: "Investment Return", investSub: "Portfolio • Q1",
    aiInsight: "iQ AI Insight",
    aiBody1: "Capital efficiency is at",
    aiBody2: "Optimal conditions for portfolio reinvestment.",
    goalArch: "Goal Architect", goalPlaceholder: "Enter financial target...",
    plan: "Plan", stable: "v2.4 stable",
    navDashboard: "Dashboard", navAnalytics: "Analytics",
    navWallets: "Wallets", navSettings: "Settings",
    langSwitch: "עברית",
    layoutApp: "App", layoutWeb: "Web",
    portfolioAssets: "Portfolio Assets",
    checking: "Checking Account", savings: "Savings", investments: "Strategic Investments", crypto: "Crypto",
    liquidity: "Liquidity", safety: "Safety", growth: "Growth", highVol: "High Volatility",
    syncLabel: "Sync External Institution",
    cardChecking: "Checking", cardSavings: "Savings", cardInvest: "Investment",
    vsLastMonth: "vs last month",
    performanceTrend: "30-day performance",
  },
  he: {
    netWorth: "שווי נקי כולל", income: "הכנסות", flow: "הוצאות",
    recentFlow: "תנועות אחרונות", archive: "ארכיון",
    sub: "מנוי סטודיו", subSub: "חוזר • היום",
    transfer: "העברה חיצונית", transferSub: "ישירה • 11 במרץ",
    salary: "משכורת חודשית", salarySub: "הפקדה • 1 במרץ",
    coffee: "קפה וחברה", coffeeSub: "חיוב • היום",
    grocery: "סופרמרקט", grocerySub: "חיוב • אתמול",
    insurance: "ביטוח בריאות", insuranceSub: "חוזר • 1 במרץ",
    invest: "תשואת השקעה", investSub: "תיק השקעות • רבעון 1",
    aiInsight: "תובנת iQ AI",
    aiBody1: "יעילות ההון עומדת על",
    aiBody2: "תנאים אופטימליים להשקעה מחדש.",
    goalArch: "אדריכל היעדים", goalPlaceholder: "הכנס יעד פיננסי...",
    plan: "תכנן", stable: "v2.4 יציב",
    navDashboard: "לוח בקרה", navAnalytics: "אנליטיקס",
    navWallets: "ארנקים", navSettings: "הגדרות",
    langSwitch: "English",
    layoutApp: "אפליקציה", layoutWeb: "ווב",
    portfolioAssets: "נכסי תיק",
    checking: "חשבון עובר ושב", savings: "חיסכון", investments: "השקעות אסטרטגיות", crypto: "קריפטו",
    liquidity: "נזילות", safety: "ביטחון", growth: "צמיחה", highVol: "תנודתיות גבוהה",
    syncLabel: "סנכרון מוסד פיננסי חיצוני",
    cardChecking: "עו\"ש", cardSavings: "חיסכון", cardInvest: "השקעות",
    vsLastMonth: "לעומת החודש הקודם",
    performanceTrend: "ביצועים 30 יום",
  },
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

function ordinalSuffix(d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
}
function formatDate(date = new Date()) {
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = date.getDate();
  return `${M[date.getMonth()]} ${String(d).padStart(2,"0")}${ordinalSuffix(d)}, ${date.getFullYear()}`;
}

function useCountUp(target, duration = 2000, start = 125000) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    let startTs = null;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setValue(Math.floor(easeOutQuart(p) * (target - start) + start));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return value;
}

const noiseUrl = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

const glassStyle = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
  backdropFilter: "blur(40px) saturate(150%)",
  WebkitBackdropFilter: "blur(40px) saturate(150%)",
  border: "1px solid rgba(255,255,255,0.04)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px -8px rgba(0,0,0,0.5)",
};
const glassHover = {
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 48px -8px rgba(0,0,0,0.6)",
};
const smooth = { transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)" };

function Reveal({ children, delay = 0, style = {} }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const id = setTimeout(() => setShow(true), delay); return () => clearTimeout(id); }, [delay]);
  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

function GlassPanel({ children, style = {}, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ ...glassStyle, ...(hover ? glassHover : {}), ...smooth, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >{children}</div>
  );
}

function ProgressBar({ ratio, glow = false, delay = "0s" }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(id); }, []);
  return (
    <div style={{ height: 3, width: "100%", borderRadius: 9999, overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
      <div style={{
        height: "100%", borderRadius: 9999,
        width: loaded ? `${Math.min(ratio, 1) * 100}%` : "0%",
        transition: `width 1.8s cubic-bezier(0.22,1,0.36,1) ${delay}`,
        background: glow ? "linear-gradient(90deg, #3f3f46, #e4e4e7)" : "#3f3f46",
        boxShadow: glow ? "0 0 8px rgba(255,255,255,0.2)" : "none",
      }} />
    </div>
  );
}

// Change #4 — strokeWidth={1.5} on all icons for "intelligent & clean" look
function TransactionRow({ icon: Icon, title, subtitle, date, amount, positive = false, isRtl }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 16px", borderRadius: 20, cursor: "pointer",
        background: h ? "rgba(255,255,255,0.025)" : "transparent",
        flexDirection: isRtl ? "row-reverse" : "row", ...smooth,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexDirection: isRtl ? "row-reverse" : "row" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 13, background: SURFACE,
          border: `1px solid ${h ? (positive ? "rgba(45,212,160,0.2)" : "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.04)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: h ? (positive ? EMERALD : "#d4d4d8") : "#52525b",
          flexShrink: 0, ...smooth,
        }}>
          <Icon size={15} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ color: "#e4e4e7", fontSize: 15, fontWeight: 500, letterSpacing: "0.01em", marginBottom: 2, textAlign: isRtl ? "right" : "left" }}>{title}</p>
          <p style={{ fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: isRtl ? "right" : "left" }}>{subtitle}</p>
        </div>
      </div>
      <span style={{ color: positive ? EMERALD : "#e4e4e7", fontSize: 15.5, fontWeight: 600, fontVariantNumeric: "tabular-nums", direction: "ltr", letterSpacing: "-0.01em" }}>
        {positive ? "+" : "-"}₪{amount}
      </span>
    </div>
  );
}

function MenuNavItem({ icon: Icon, label, active = false, isRtl }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px", borderRadius: 14, width: "100%",
        background: active ? "rgba(255,255,255,0.06)" : h ? "rgba(255,255,255,0.03)" : "transparent",
        border: active ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        cursor: "pointer",
        flexDirection: isRtl ? "row-reverse" : "row",
        textAlign: isRtl ? "right" : "left", ...smooth,
      }}
    >
      <Icon size={17} strokeWidth={1.5} style={{ color: active ? "#d4d4d8" : "#52525b", flexShrink: 0 }} />
      <span style={{ color: active ? "#e4e4e7" : h ? "#a1a1aa" : "#52525b", fontSize: 15, fontWeight: active ? 600 : 500, letterSpacing: "0.03em", flex: 1, ...smooth }}>
        {label}
      </span>
      {active && (
        <div style={{
          width: 5, height: 5, borderRadius: 9999, background: EMERALD, opacity: 0.7,
          boxShadow: `0 0 6px ${EMERALD_OUTER}`, flexShrink: 0,
        }} />
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   Change #2 — LAYOUT TOGGLE BUTTON
   ═══════════════════════════════════════════════════════════ */

function LayoutToggle({ mode, onToggle, label }) {
  const isApp = mode === "app";
  return (
    <button
      onClick={onToggle}
      title={label}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "0 10px", height: 38, borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
        cursor: "pointer", color: "#52525b",
        fontSize: 10, letterSpacing: "0.08em", fontWeight: 500,
        fontFamily: "'Aeonik', sans-serif",
        ...smooth,
      }}
    >
      {isApp
        ? <Monitor size={14} strokeWidth={1.5} />
        : <Smartphone size={14} strokeWidth={1.5} />
      }
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE-OUT MENU
   ═══════════════════════════════════════════════════════════ */

function SlideMenu({ open, onClose, lang, onToggleLang }) {
  const l = t[lang];
  const isRtl = lang === "he";
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handler); };
  }, [open, onClose]);

  const navItems = [
    { icon: LayoutDashboard, label: l.navDashboard, active: true },
    { icon: PieChart, label: l.navAnalytics },
    { icon: WalletCards, label: l.navWallets },
    { icon: Settings2, label: l.navSettings },
  ];
  const fromSide = isRtl ? "left" : "right";

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 998,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }} />
      <div
        ref={menuRef}
        style={{
          position: "fixed", top: 0, bottom: 0,
          left: fromSide === "left" ? 0 : "auto",
          right: fromSide === "right" ? 0 : "auto",
          width: 280, zIndex: 999,
          transform: open ? "translateX(0)" : `translateX(${fromSide === "right" ? "100%" : "-100%"})`,
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          background: `linear-gradient(180deg, ${SURFACE} 0%, ${RICH_BLACK} 100%)`,
          borderLeft: fromSide === "right" ? "1px solid rgba(255,255,255,0.04)" : "none",
          borderRight: fromSide === "left" ? "1px solid rgba(255,255,255,0.04)" : "none",
          display: "flex", flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "28px 24px 0" }}>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: "#52525b", ...smooth,
          }}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div style={{
          padding: "24px 24px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", gap: 14,
          flexDirection: isRtl ? "row-reverse" : "row",
        }}>
          <Wordmark size={18} showTagline={true} />
        </div>
        <div style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item, i) => (
            <MenuNavItem key={i} icon={item.icon} label={item.label} active={item.active} isRtl={isRtl} />
          ))}
        </div>
        <div style={{ padding: "16px 12px 36px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <button onClick={onToggleLang} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 14,
            padding: "13px 16px", borderRadius: 14, background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
            color: "#71717a", fontSize: 13.5, fontWeight: 500, letterSpacing: "0.03em",
            flexDirection: isRtl ? "row-reverse" : "row", ...smooth,
          }}>
            <Globe size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <span>{l.langSwitch}</span>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   WALLETS SCREEN
   ═══════════════════════════════════════════════════════════ */

// SVG Growth Trace — 30-day performance data
const GROWTH_POINTS = [
  125000, 126200, 124800, 127400, 128900, 127200, 129800, 131400, 130200, 132800,
  134100, 133000, 135600, 136800, 135200, 137900, 139400, 138100, 140200, 141800,
  140400, 142100, 141200, 143400, 142800, 144100, 143600, 145200, 143900, 142650,
];

function GrowthTrace({ width = 420, height = 64 }) {
  const min = Math.min(...GROWTH_POINTS);
  const max = Math.max(...GROWTH_POINTS);
  const pad = 6;
  const d = GROWTH_POINTS.map((v, i) => {
    const x = pad + (i / (GROWTH_POINTS.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / (max - min)) * (height - pad * 2);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  // last point coordinates for the dot
  const lastX = (width - 6).toFixed(1);
  const lastY = (pad + ((GROWTH_POINTS[GROWTH_POINTS.length - 1] - min) / (max - min)) * (height - pad * 2));
  const dotY = (height - pad - (lastY - pad)).toFixed(1);
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#71717a" stopOpacity="0.7" />
          <stop offset="100%" stopColor={EMERALD} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#traceGrad)" strokeWidth="0.8"
        strokeDasharray="3 3" strokeLinecap="round" />
      <circle cx={lastX} cy={dotY} r="2.5" fill={EMERALD} opacity="0.9"
        style={{ filter: `drop-shadow(0 0 4px ${EMERALD})` }} />
    </svg>
  );
}

function AssetCard({ icon: Icon, label, name, balance, change, positive, isRtl }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        ...glassStyle, ...(h ? glassHover : {}), ...smooth,
        borderRadius: 22, padding: "22px 24px",
        display: "flex", alignItems: "center", gap: 18,
        flexDirection: isRtl ? "row-reverse" : "row",
        cursor: "default",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: h ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${h ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: h ? "#a1a1aa" : "#52525b", ...smooth,
      }}>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      {/* Text */}
      <div style={{ flex: 1, textAlign: isRtl ? "right" : "left" }}>
        <p style={{ fontSize: 9.5, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 5 }}>{label}</p>
        <p style={{ fontSize: 14, color: "#a1a1aa", fontWeight: 400, letterSpacing: "0.01em", marginBottom: 2 }}>{name}</p>
        <p style={{ fontSize: 11, color: positive ? EMERALD : "#fb7185", fontStyle: "italic", fontWeight: 400, letterSpacing: "0.02em", opacity: 0.85 }}>
          {change}
        </p>
      </div>
      {/* Balance */}
      <div style={{ textAlign: isRtl ? "left" : "right", flexShrink: 0 }}>
        <p style={{ fontSize: 18, color: "#e4e4e7", fontWeight: 400, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", direction: "ltr" }}>
          ₪{balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function BrushedMetalCard({ last4, type, isActive = false }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 240, height: 148, borderRadius: 20, flexShrink: 0,
        scrollSnapAlign: "start",
        background: "linear-gradient(135deg, #1d1d23 0%, #0f0f14 30%, #1a1a21 52%, #0c0c11 75%, #171720 100%)",
        border: `1px solid ${isActive || h ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
        boxShadow: h
          ? "inset 0 1px 0 rgba(255,255,255,0.09), 0 24px 48px rgba(0,0,0,0.7)"
          : "inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 32px rgba(0,0,0,0.5)",
        padding: "20px 22px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden", cursor: "pointer", ...smooth,
      }}
    >
      {/* Brushed metal sheen */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(102deg, transparent 0px, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)",
      }} />
      {/* Top row: chip + iQ logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        {/* Chip icon */}
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
          <rect x="6" y="3" width="16" height="16" rx="3" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
          <rect x="9" y="6" width="10" height="10" rx="1.5" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
          <line x1="14" y1="0" x2="14" y2="3" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
          <line x1="14" y1="19" x2="14" y2="22" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
          <line x1="0" y1="11" x2="6" y2="11" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
          <line x1="22" y1="11" x2="28" y2="11" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
          <line x1="9" y1="4" x2="9" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          <line x1="19" y1="4" x2="19" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          <line x1="9" y1="18" x2="9" y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          <line x1="19" y1="18" x2="19" y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        </svg>
        {/* iQ mark */}
        <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", fontFamily: "'Aeonik', sans-serif" }}>
          i<span style={{ color: EMERALD, opacity: 0.6 }}>·</span>Q
        </span>
      </div>
      {/* Bottom row: digits + type */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 6, textTransform: "uppercase" }}>{type}</p>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.2em", fontWeight: 300, fontFamily: "'Aeonik', sans-serif" }}>
          •••• {last4}
        </p>
      </div>
    </div>
  );
}

function WalletsScreen({ lang, layoutMode, onBack }) {
  const l = t[lang];
  const isRtl = lang === "he";
  const containerMaxWidth = layoutMode === "web" ? 860 : 460;

  const gradientText = {
    background: "linear-gradient(180deg, #FFFFFF 0%, #71717a 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    textTransform: "none",
  };

  const assets = [
    { icon: Building2, label: l.liquidity,  name: l.checking,     balance: 42300, change: `+1.2% ${l.vsLastMonth}`, positive: true  },
    { icon: PiggyBank, label: l.safety,     name: l.savings,      balance: 67800, change: `+0.8% ${l.vsLastMonth}`, positive: true  },
    { icon: BarChart3, label: l.growth,     name: l.investments,  balance: 28150, change: `+4.7% ${l.vsLastMonth}`, positive: true  },
    { icon: Zap,       label: l.highVol,    name: l.crypto,       balance: 4400,  change: `-12.3% ${l.vsLastMonth}`, positive: false },
  ];

  const cards = [
    { last4: "4821", type: l.cardChecking },
    { last4: "7734", type: l.cardSavings  },
    { last4: "2209", type: l.cardInvest   },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: RICH_BLACK, color: "#a1a1aa",
      fontFamily: "'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: "hidden", position: "relative",
    }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", backgroundImage: noiseUrl }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "45%", height: "45%", borderRadius: "50%", background: "rgba(255,255,255,0.008)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "10%", width: "40%", height: "30%", borderRadius: "50%", background: `radial-gradient(ellipse, ${EMERALD_OUTER}, transparent 70%)`, filter: "blur(80px)", opacity: 0.3 }} />
      </div>

      <main style={{
        maxWidth: containerMaxWidth, margin: "0 auto",
        padding: layoutMode === "web" ? "56px 48px 140px" : "56px 24px 140px",
        position: "relative", zIndex: 10,
      }}>

        {/* ── Header ── */}
        <Reveal delay={0}>
          <header style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 64,
            flexDirection: isRtl ? "row-reverse" : "row",
          }}>
            <button
              onClick={onBack}
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)",
                cursor: "pointer", color: "#71717a", ...smooth,
              }}
            >
              {isRtl ? <ChevronRight size={16} strokeWidth={1.5} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
            </button>
            <p style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 600 }}>
              {l.portfolioAssets}
            </p>
          </header>
        </Reveal>

        {/* ── Net Worth Hero ── */}
        <Reveal delay={80}>
          <section style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 8 }}>
              <h2 style={{
                fontSize: "clamp(46px, 12vw, 72px)", fontWeight: 200,
                letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
                direction: "ltr", textAlign: isRtl ? "right" : "left",
                textShadow: "0 0 40px rgba(255,255,255,0.08), 0 0 80px rgba(255,255,255,0.04)",
                ...gradientText,
              }}>
                ₪142,650
              </h2>
            </div>
            {/* Growth Trace */}
            <div style={{ marginTop: 16, marginBottom: 6, opacity: 0.85 }}>
              <GrowthTrace />
            </div>
            <p style={{ fontSize: 9.5, color: "#27272a", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 500 }}>
              {l.performanceTrend}
            </p>
          </section>
        </Reveal>

        {/* ── Asset Allocation ── */}
        <Reveal delay={160}>
          <section style={{ marginBottom: 60 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
              <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>
                {l.wallets ?? "Wallets"}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {assets.map((a, i) => (
                <AssetCard key={i} {...a} isRtl={isRtl} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── Digital Card Management ── */}
        <Reveal delay={240}>
          <section style={{ marginBottom: 60 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
              <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>
                Digital Wealth Cards
              </h3>
            </div>
            <div style={{
              display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8,
              scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none", msOverflowStyle: "none",
              marginLeft: layoutMode === "web" ? 0 : -2,
            }}>
              {cards.map((c, i) => (
                <BrushedMetalCard key={i} last4={c.last4} type={c.type} isActive={i === 0} />
              ))}
              {/* Add card slot */}
              <div style={{
                width: 240, height: 148, borderRadius: 20, flexShrink: 0,
                scrollSnapAlign: "start",
                border: "1px dashed rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", ...smooth,
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
              >
                <Plus size={18} strokeWidth={1} color="#3f3f46" />
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Integration Hub ── */}
        <Reveal delay={320}>
          <section style={{ marginBottom: 64 }}>
            <button style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "18px 24px", borderRadius: 20,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer", color: "#52525b",
              flexDirection: isRtl ? "row-reverse" : "row",
              ...smooth,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#a1a1aa"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#52525b"; }}
            >
              <Plus size={14} strokeWidth={1} />
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {l.syncLabel}
              </span>
              <Link2 size={12} strokeWidth={1.5} style={{ opacity: 0.5 }} />
            </button>
          </section>
        </Reveal>
      </main>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════ */

export default function IQFinanceApp() {
  const [splashDone, setSplashDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState("app");
  const [screen, setScreen] = useState("dashboard"); // "dashboard" | "wallets"

  const l = t[lang];
  const isRtl = lang === "he";
  const state = { targetBalance: 142650, income: 24000, expenses: 8120 };
  const displayBalance = useCountUp(state.targetBalance);

  useEffect(() => { if (splashDone) setVisible(true); }, [splashDone]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "he" : "en"));
  }, []);

  const toggleLayout = useCallback(() => {
    setLayoutMode((prev) => (prev === "app" ? "web" : "app"));
  }, []);

  const gradientText = {
    background: "linear-gradient(180deg, #FFFFFF 0%, #71717a 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Change #2 — container width driven by layoutMode
  const containerMaxWidth = layoutMode === "web" ? 860 : 460;

  const transactions = [
    { icon: Briefcase,    title: l.salary,    subtitle: l.salarySub,    amount: "18,500", positive: true,  date: formatDate(new Date(2026, 3, 1))  },
    { icon: ArrowDownLeft,title: l.transfer,  subtitle: l.transferSub,  amount: "4,500",  positive: true,  date: formatDate(new Date(2026, 2, 11)) },
    { icon: TrendingUp,   title: l.invest,    subtitle: l.investSub,    amount: "2,340",  positive: true,  date: formatDate(new Date(2026, 2, 31)) },
    { icon: Repeat,       title: l.sub,       subtitle: l.subSub,       amount: "120",    positive: false, date: formatDate(new Date(2026, 3, 9))  },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: RICH_BLACK, color: "#a1a1aa",
      fontFamily: "'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: "hidden", position: "relative",
    }}>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}

      {screen === "wallets" && (
        <WalletsScreen lang={lang} layoutMode={layoutMode} onBack={() => setScreen("dashboard")} />
      )}

      <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", backgroundImage: noiseUrl, display: screen === "wallets" ? "none" : "block" }} />

      <div style={{ display: screen === "wallets" ? "none" : "block" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "55%", height: "55%", borderRadius: "50%", background: "rgba(255,255,255,0.01)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-20%", width: "50%", height: "50%", borderRadius: "50%", background: "rgba(255,255,255,0.007)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "20%", width: "40%", height: "30%", borderRadius: "50%", background: `radial-gradient(ellipse, ${EMERALD_OUTER}, transparent 70%)`, filter: "blur(80px)", opacity: 0.35 }} />
      </div>

      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} onToggleLang={toggleLang} />

      <main style={{
        maxWidth: containerMaxWidth,          // Change #2 — reactive width
        margin: "0 auto",
        padding: layoutMode === "web" ? "56px 48px 140px" : "56px 24px 140px",
        position: "relative", zIndex: 10,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.6s ease, transform 0.6s ease, max-width 0.6s cubic-bezier(0.22,1,0.36,1), padding 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* ── Header ── */}
        <Reveal delay={0}>
          <header style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 72,
            flexDirection: isRtl ? "row-reverse" : "row",
          }}>
            <Wordmark size={28} showTagline={true} />

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: isRtl ? "row-reverse" : "row" }}>
              {/* Change #2 — layout toggle button */}
              <LayoutToggle mode={layoutMode} onToggle={toggleLayout} label={layoutMode === "app" ? l.layoutWeb : l.layoutApp} />

              <button style={{
                width: 38, height: 38, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", ...smooth,
              }}>
                <Bell size={15} strokeWidth={1.5} color="#52525b" />
              </button>
              <button onClick={() => setMenuOpen(true)} style={{
                width: 38, height: 38, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", ...smooth,
              }}>
                <Menu size={15} strokeWidth={1.5} color="#52525b" />
              </button>
            </div>
          </header>
        </Reveal>

        {/* ── Balance ── */}
        <Reveal delay={100}>
          <section style={{ marginBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexDirection: isRtl ? "row-reverse" : "row" }}>
              <div style={{ position: "relative", width: 6, height: 6, flexShrink: 0 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: 9999, background: EMERALD, opacity: 0.4, animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span style={{ position: "relative", display: "inline-flex", width: 6, height: 6, borderRadius: 9999, background: EMERALD, opacity: 0.6 }} />
              </div>
              <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em", color: "#52525b", fontWeight: 600 }}>{l.netWorth}</p>
              <p style={{ fontSize: 12, color: "#52525b", letterSpacing: "0.12em", marginLeft: "auto", fontWeight: 500 }}>{formatDate()}</p>
            </div>
            <h2 style={{
              fontSize: "clamp(50px, 13vw, 76px)", fontWeight: 300,
              letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
              marginBottom: 44, direction: "ltr", textAlign: isRtl ? "right" : "left",
              ...gradientText,
            }}>
              ₪{displayBalance.toLocaleString()}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <GlassPanel style={{ padding: "22px 20px", borderRadius: 22 }}>
                <p style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, flexDirection: isRtl ? "row-reverse" : "row" }}>
                  <TrendingUp size={11} strokeWidth={1.5} color={EMERALD} /> {l.income}
                </p>
                <p style={{ fontSize: 26, color: "#e4e4e7", fontWeight: 400, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginBottom: 18, direction: "ltr", textAlign: isRtl ? "right" : "left" }}>
                  ₪{state.income.toLocaleString()}
                </p>
                <ProgressBar ratio={1} glow delay="0.4s" />
              </GlassPanel>
              <GlassPanel style={{ padding: "22px 20px", borderRadius: 22 }}>
                <p style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, flexDirection: isRtl ? "row-reverse" : "row" }}>
                  <TrendingDown size={11} strokeWidth={1.5} color="#fb7185" /> {l.flow}
                </p>
                <p style={{ fontSize: 26, color: "#e4e4e7", fontWeight: 400, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginBottom: 18, direction: "ltr", textAlign: isRtl ? "right" : "left" }}>
                  ₪{state.expenses.toLocaleString()}
                </p>
                <ProgressBar ratio={state.expenses / state.income} delay="0.6s" />
              </GlassPanel>
            </div>
          </section>
        </Reveal>

        {/* ── Recent Flow — Change #5: 7 items ── */}
        <Reveal delay={200}>
          <section style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
              <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>{l.recentFlow}</h3>
              <button style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.15em", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>{l.archive}</button>
            </div>
            <GlassPanel style={{ borderRadius: 28, padding: "6px" }}>
              {transactions.map((tx, i) => (
                <div key={i}>
                  {i > 0 && <div style={{ height: 1, margin: "0 16px", background: "rgba(255,255,255,0.03)" }} />}
                  <TransactionRow
                    icon={tx.icon}
                    title={tx.title}
                    subtitle={tx.subtitle}
                    date={tx.date}
                    amount={tx.amount}
                    positive={tx.positive}
                    isRtl={isRtl}
                  />
                </div>
              ))}
            </GlassPanel>
          </section>
        </Reveal>

        {/* ── AI Insight ── */}
        <Reveal delay={300}>
          <section style={{ marginBottom: 56 }}>
            <GlassPanel style={{ borderRadius: 24, padding: 3, cursor: "pointer" }}>
              <div style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.015) 0%, transparent 100%)",
                borderRadius: 21, padding: "20px 22px",
                display: "flex", gap: 18, alignItems: "center",
                border: "1px solid rgba(255,255,255,0.02)",
                flexDirection: isRtl ? "row-reverse" : "row",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Sparkles size={18} strokeWidth={1.5} color="#a1a1aa" />
                </div>
                <div style={{ flex: 1, textAlign: isRtl ? "right" : "left" }}>
                  <p style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.2em", marginBottom: 7 }}>{l.aiInsight}</p>
                  <p style={{ color: "#71717a", fontSize: 14.5, lineHeight: 1.7, fontWeight: 400 }}>
                    {l.aiBody1} <span style={{ color: "#e4e4e7", fontWeight: 500 }}>94%</span>. {l.aiBody2}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </section>
        </Reveal>

        {/* ── Goal Architect ── */}
        <Reveal delay={400}>
          <section style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
              <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>{l.goalArch}</h3>
              <span style={{ fontSize: 10, color: "#27272a", letterSpacing: "0.15em", fontWeight: 500 }}>{l.stable}</span>
            </div>
            <GlassPanel style={{
              display: "flex", alignItems: "center", borderRadius: 20,
              padding: isRtl ? "6px 20px 6px 6px" : "6px 6px 6px 20px",
              flexDirection: isRtl ? "row-reverse" : "row",
            }}>
              <input placeholder={l.goalPlaceholder} dir={isRtl ? "rtl" : "ltr"} style={{
                flex: 1, background: "transparent", color: "#e4e4e7",
                fontSize: 15, outline: "none", border: "none",
                fontWeight: 400, letterSpacing: "0.02em",
                textAlign: isRtl ? "right" : "left",
                fontFamily: "'Aeonik', sans-serif",
              }} />
              <button style={{
                background: "rgba(255,255,255,0.08)", color: "#d4d4d8",
                padding: "13px 22px", borderRadius: 14,
                fontSize: 11.5, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.2em", border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                flexDirection: isRtl ? "row-reverse" : "row",
                flexShrink: 0, ...smooth,
              }}>
                {l.plan} <ArrowIcon size={11} strokeWidth={1.5} />
              </button>
            </GlassPanel>
          </section>
        </Reveal>
      </main>

      </div>{/* end dashboard wrapper */}

      {/* ── Bottom Nav ── */}
      <div style={{ display: screen === "wallets" ? "none" : "block" }}>
      <div style={{
        position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
        zIndex: 55, width: 280, height: 64,
      }}>
        <div style={{
          borderRadius: 20, height: "100%", width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px",
          background: `linear-gradient(145deg, rgba(10,11,12,0.94) 0%, rgba(6,6,6,0.97) 100%)`,
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.8)", ...smooth,
        }}>
          <button style={{ color: "#52525b", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 10 }}>
            <Home size={19} strokeWidth={1.5} />
          </button>
          <div style={{ position: "relative", top: -20 }}>
            <button style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#d4d4d8", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)", ...smooth,
            }}>
              <Plus size={22} strokeWidth={1.5} />
            </button>
          </div>
          <button
            onClick={() => setScreen("wallets")}
            style={{ color: "#52525b", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, ...smooth }}
          >
            <WalletCards size={19} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      </div>{/* end bottom nav wrapper */}

      <style>{`
        @font-face { font-family:'Aeonik'; src:url('https://cdn.jsdelivr.net/gh/nicholasgillespie/fonts@main/aeonik/AeonikTRIAL-Light.woff2') format('woff2'); font-weight:300; font-style:normal; font-display:swap; }
        @font-face { font-family:'Aeonik'; src:url('https://cdn.jsdelivr.net/gh/nicholasgillespie/fonts@main/aeonik/AeonikTRIAL-Regular.woff2') format('woff2'); font-weight:400; font-style:normal; font-display:swap; }
        @font-face { font-family:'Aeonik'; src:url('https://cdn.jsdelivr.net/gh/nicholasgillespie/fonts@main/aeonik/AeonikTRIAL-Medium.woff2') format('woff2'); font-weight:500; font-style:normal; font-display:swap; }
        @font-face { font-family:'Aeonik'; src:url('https://cdn.jsdelivr.net/gh/nicholasgillespie/fonts@main/aeonik/AeonikTRIAL-Bold.woff2') format('woff2'); font-weight:700; font-style:normal; font-display:swap; }
        @keyframes ping { 75%,100% { transform:scale(2.5); opacity:0; } }
        @keyframes pulseGlow {
          0%,100% { box-shadow:0 0 4px ${EMERALD_GLOW},0 0 10px ${EMERALD_OUTER}; opacity:0.8; }
          50% { box-shadow:0 0 7px ${EMERALD_GLOW},0 0 16px ${EMERALD_OUTER}; opacity:1; }
        }
        input::placeholder { color:#3f3f46; }
      `}</style>
    </div>
  );
}
