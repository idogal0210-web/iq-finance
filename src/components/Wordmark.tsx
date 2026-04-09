import type { WordmarkProps } from '../types';
import { EMERALD, EMERALD_GLOW, EMERALD_OUTER, CHARCOAL } from '../theme';

export default function Wordmark({ size = 15, showTagline = true }: WordmarkProps) {
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
