import { TrendingUp, TrendingDown } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import ProgressBar from '../ui/ProgressBar';
import { EMERALD } from '../../theme';
import { formatDate } from '../../utils/dateUtils';
import { useCountUp } from '../../hooks/useCountUp';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFinance } from '../../contexts/FinanceContext';

const gradientText = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #71717a 100%)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function BalanceSection() {
  const { isRtl, t } = useLanguage();
  const { totalBalance, totalIncome, totalExpenses, isLoading } = useFinance();
  const targetBalance = (!isLoading && totalBalance > 0) ? totalBalance : 142650;
  const income = (!isLoading && totalIncome > 0) ? totalIncome : 24000;
  const expenses = (!isLoading && totalExpenses > 0) ? totalExpenses : 8120;
  const displayBalance = useCountUp(targetBalance);

  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexDirection: isRtl ? "row-reverse" : "row" }}>
        <div style={{ position: "relative", width: 6, height: 6, flexShrink: 0 }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: 9999, background: EMERALD, opacity: 0.4, animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
        </div>
        <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em", color: "#52525b", fontWeight: 600 }}>{t.netWorth}</p>
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
            <TrendingUp size={11} strokeWidth={1.5} color={EMERALD} /> {t.income}
          </p>
          <p style={{ fontSize: 26, color: "#e4e4e7", fontWeight: 400, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginBottom: 18, direction: "ltr", textAlign: isRtl ? "right" : "left" }}>
            ₪{income.toLocaleString()}
          </p>
          <ProgressBar ratio={1} glow delay="0.4s" />
        </GlassPanel>
        <GlassPanel style={{ padding: "22px 20px", borderRadius: 22 }}>
          <p style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, flexDirection: isRtl ? "row-reverse" : "row" }}>
            <TrendingDown size={11} strokeWidth={1.5} color="#fb7185" /> {t.flow}
          </p>
          <p style={{ fontSize: 26, color: "#e4e4e7", fontWeight: 400, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginBottom: 18, direction: "ltr", textAlign: isRtl ? "right" : "left" }}>
            ₪{expenses.toLocaleString()}
          </p>
          <ProgressBar ratio={income > 0 ? expenses / income : 0} delay="0.6s" />
        </GlassPanel>
      </div>
    </section>
  );
}
