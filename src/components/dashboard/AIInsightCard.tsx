import { useMemo, useState, useEffect } from 'react';
import { Sparkles, Repeat, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import { EMERALD } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFinance } from '../../contexts/FinanceContext';
import { useDbSubcategories } from '../../hooks/useFinanceQueries';

interface InsightItem {
  Icon: LucideIcon;
  color: string;
  headline: React.ReactNode;
  detail: string;
}

export default function AIInsightCard() {
  const { isRtl, t } = useLanguage();
  const { transactions, totalIncome, totalExpenses } = useFinance();
  const { data: subcategories = [] } = useDbSubcategories();
  const [idx, setIdx] = useState(0);

  const insights = useMemo((): InsightItem[] => {
    const hasData = transactions.length > 0 && totalIncome > 0;
    const capEff  = hasData ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 94;

    const list: InsightItem[] = [
      {
        Icon: Sparkles,
        color: EMERALD,
        headline: (
          <>{t.aiBody1}{' '}<span style={{ color: '#e4e4e7', fontWeight: 500 }}>{capEff}%</span>.</>
        ),
        detail: t.aiBody2,
      },
    ];

    if (hasData) {
      // Recurring subscriptions
      const recurSubIds = new Set(subcategories.filter(s => s.is_recurring).map(s => s.id));
      const recurTxs    = transactions.filter(tx => tx.subcategory_id && recurSubIds.has(tx.subcategory_id));
      if (recurTxs.length > 0) {
        const total = recurTxs.reduce((s, tx) => s + tx.amount, 0);
        list.push({
          Icon: Repeat,
          color: '#60a5fa',
          headline: (
            <>
              {recurTxs.length} recurring pattern{recurTxs.length > 1 ? 's' : ''} —{' '}
              <span style={{ color: '#e4e4e7', fontWeight: 500 }}>
                ₪{total.toLocaleString()}/mo
              </span>.
            </>
          ),
          detail: 'Review subscriptions to reduce fixed monthly costs.',
        });
      }

      // Anomaly detection
      const expTxs = transactions.filter(tx => tx.type === 'expense');
      if (expTxs.length >= 3) {
        const avg       = expTxs.reduce((s, tx) => s + tx.amount, 0) / expTxs.length;
        const anomalies = expTxs.filter(tx => tx.amount > avg * 3);
        if (anomalies.length > 0) {
          const top = anomalies.sort((a, b) => b.amount - a.amount)[0];
          list.push({
            Icon: AlertCircle,
            color: '#fbbf24',
            headline: (
              <>
                Unusual spend of{' '}
                <span style={{ color: '#e4e4e7', fontWeight: 500 }}>₪{top.amount.toLocaleString()}</span>
                {top.description ? ` — ${top.description}` : ''} flagged.
              </>
            ),
            detail: 'This is significantly above your average transaction size.',
          });
        }
      }
    }

    return list;
  }, [transactions, totalIncome, totalExpenses, subcategories, t]);

  // Auto-rotate every 6 s when multiple insights
  useEffect(() => {
    if (insights.length <= 1) { setIdx(0); return; }
    const id = setInterval(() => setIdx(p => (p + 1) % insights.length), 6000);
    return () => clearInterval(id);
  }, [insights.length]);

  const safeIdx = Math.min(idx, insights.length - 1);
  const { Icon, color, headline, detail } = insights[safeIdx];

  return (
    <GlassPanel
      style={{ borderRadius: 24, padding: 3, cursor: insights.length > 1 ? 'pointer' : 'default' }}
      onClick={insights.length > 1 ? () => setIdx(p => (p + 1) % insights.length) : undefined}
    >
      <div style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.015) 0%, transparent 100%)',
        borderRadius: 21, padding: '20px 22px',
        display: 'flex', gap: 18, alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.02)',
        flexDirection: isRtl ? 'row-reverse' : 'row',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.4s ease',
        }}>
          <Icon size={18} strokeWidth={1.5} color={color} />
        </div>
        <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <p style={{ fontSize: 11, color: '#52525b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.2em' }}>
              {t.aiInsight}
            </p>
            {insights.length > 1 && (
              <div style={{ display: 'flex', gap: 4 }}>
                {insights.map((_, i) => (
                  <div key={i} style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: i === safeIdx ? color : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.4s ease',
                  }} />
                ))}
              </div>
            )}
          </div>
          <p style={{ color: '#71717a', fontSize: 14.5, lineHeight: 1.7, fontWeight: 400 }}>
            {headline}{' '}{detail}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
