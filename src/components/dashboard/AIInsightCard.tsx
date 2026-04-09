import { Sparkles } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import type { TranslationStrings } from '../../i18n/translations';

interface AIInsightCardProps {
  t: TranslationStrings;
  isRtl: boolean;
}

export default function AIInsightCard({ t, isRtl }: AIInsightCardProps) {
  return (
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
          <p style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.2em", marginBottom: 7 }}>{t.aiInsight}</p>
          <p style={{ color: "#71717a", fontSize: 14.5, lineHeight: 1.7, fontWeight: 400 }}>
            {t.aiBody1} <span style={{ color: "#e4e4e7", fontWeight: 500 }}>94%</span>. {t.aiBody2}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
