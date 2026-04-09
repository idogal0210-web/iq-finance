import { useState } from 'react';
import { SURFACE, EMERALD, smooth } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import type React from 'react';

interface TransactionRowProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
}

export default function TransactionRow({ icon: Icon, title, subtitle, amount, positive = false }: TransactionRowProps) {
  const { isRtl } = useLanguage();
  const [h, setH] = useState<boolean>(false);
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
