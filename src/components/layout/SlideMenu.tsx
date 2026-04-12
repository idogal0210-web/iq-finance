import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, PieChart, WalletCards, Settings2, X, Globe } from 'lucide-react';
import { SURFACE, RICH_BLACK, EMERALD, EMERALD_OUTER, smooth } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import Wordmark from '../Wordmark';

interface MenuNavItemProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  active?: boolean;
  isRtl: boolean;
}

function MenuNavItem({ icon: Icon, label, active = false, isRtl }: MenuNavItemProps) {
  const [h, setH] = useState<boolean>(false);
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

interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
  onToggleLang: () => void;
  onSettings?: () => void;
  onAnalysis?: () => void;
  onWallets?: () => void;
  onDashboard?: () => void;
  activePath?: string;
}

export default function SlideMenu({ open, onClose, onToggleLang, onSettings, onAnalysis, onWallets, onDashboard, activePath = '/' }: SlideMenuProps) {
  const { isRtl, t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handler); };
  }, [open, onClose]);

  const navItems = [
    { icon: LayoutDashboard, label: t.navDashboard, active: activePath === '/',         onClick: onDashboard },
    { icon: PieChart,        label: t.navAnalytics, active: activePath === '/analysis', onClick: onAnalysis  },
    { icon: WalletCards,     label: t.navWallets,   active: activePath === '/wallets',  onClick: onWallets   },
    { icon: Settings2,       label: t.navSettings,  active: activePath === '/settings', onClick: onSettings  },
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
            <div key={i} onClick={() => { if (item.onClick) { item.onClick(); onClose(); } }}>
              <MenuNavItem icon={item.icon} label={item.label} active={item.active} isRtl={isRtl} />
            </div>
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
            <span>{t.langSwitch}</span>
          </button>
        </div>
      </div>
    </>
  );
}
