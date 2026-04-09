import { useState } from 'react';
import type { BrushedMetalCardProps } from '../../types';
import { EMERALD, smooth } from '../../theme';

export default function BrushedMetalCard({ last4, type, isActive = false }: BrushedMetalCardProps) {
  const [h, setH] = useState<boolean>(false);
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
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(102deg, transparent 0px, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
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
        <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", fontFamily: "'Aeonik', sans-serif" }}>
          i<span style={{ color: EMERALD, opacity: 0.6 }}>·</span>Q
        </span>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 6, textTransform: "uppercase" }}>{type}</p>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.2em", fontWeight: 300, fontFamily: "'Aeonik', sans-serif" }}>
          •••• {last4}
        </p>
      </div>
    </div>
  );
}
