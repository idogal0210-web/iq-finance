import { Monitor, Smartphone } from 'lucide-react';
import type { LayoutToggleProps } from '../../types';
import { smooth } from '../../theme';

export default function LayoutToggle({ mode, onToggle, label }: LayoutToggleProps) {
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
