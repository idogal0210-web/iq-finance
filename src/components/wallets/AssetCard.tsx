import { useState } from 'react';
import { EMERALD, glassStyle, glassHover, smooth } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import type React from 'react';

interface AssetCardProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  name: string;
  balance: number;
  change: string;
  positive: boolean;
}

export default function AssetCard({ icon: Icon, label, name, balance, change, positive }: AssetCardProps) {
  const { isRtl } = useLanguage();
  const [h, setH] = useState<boolean>(false);
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
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: h ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${h ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: h ? "#a1a1aa" : "#52525b", ...smooth,
      }}>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, textAlign: isRtl ? "right" : "left" }}>
        <p style={{ fontSize: 9.5, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 5 }}>{label}</p>
        <p style={{ fontSize: 14, color: "#a1a1aa", fontWeight: 400, letterSpacing: "0.01em", marginBottom: 2 }}>{name}</p>
        <p style={{ fontSize: 11, color: positive ? EMERALD : "#fb7185", fontStyle: "italic", fontWeight: 400, letterSpacing: "0.02em", opacity: 0.85 }}>
          {change}
        </p>
      </div>
      <div style={{ textAlign: isRtl ? "left" : "right", flexShrink: 0 }}>
        <p style={{ fontSize: 18, color: "#e4e4e7", fontWeight: 400, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", direction: "ltr" }}>
          ₪{balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
