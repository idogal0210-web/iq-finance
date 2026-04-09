import { ArrowRight, ArrowLeft } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import type { TranslationStrings } from '../../i18n/translations';
import { smooth } from '../../theme';

interface GoalArchitectProps {
  t: TranslationStrings;
  isRtl: boolean;
}

export default function GoalArchitect({ t, isRtl }: GoalArchitectProps) {
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
        <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>{t.goalArch}</h3>
        <span style={{ fontSize: 10, color: "#27272a", letterSpacing: "0.15em", fontWeight: 500 }}>{t.stable}</span>
      </div>
      <GlassPanel style={{
        display: "flex", alignItems: "center", borderRadius: 20,
        padding: isRtl ? "6px 20px 6px 6px" : "6px 6px 6px 20px",
        flexDirection: isRtl ? "row-reverse" : "row",
      }}>
        <input placeholder={t.goalPlaceholder} dir={isRtl ? "rtl" : "ltr"} style={{
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
          {t.plan} <ArrowIcon size={11} strokeWidth={1.5} />
        </button>
      </GlassPanel>
    </section>
  );
}
