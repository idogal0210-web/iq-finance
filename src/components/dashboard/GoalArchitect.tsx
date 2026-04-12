import { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from '../ui/GlassPanel';
import { EMERALD, smooth } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFinance } from '../../contexts/FinanceContext';
import type { DbTransaction } from '../../lib/db';

function computeProjection(goalAmount: number, transactions: DbTransaction[]) {
  const months = new Set(
    transactions.map(tx => tx.date?.substring(0, 7)).filter(Boolean) as string[],
  );
  const numMonths = Math.max(months.size, 1);
  const totalIn  = transactions.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const totalOut = transactions.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
  const avgNet   = (totalIn - totalOut) / numMonths;
  if (avgNet <= 0) return null;
  const monthsNeeded = Math.ceil(goalAmount / avgNet);
  const targetDate   = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
  return { monthsNeeded, targetDate, avgNet };
}

export default function GoalArchitect() {
  const { isRtl, t } = useLanguage();
  const { transactions } = useFinance();
  const [goal, setGoal]           = useState('');
  const [showResult, setShowResult] = useState(false);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const projection = useMemo(() => {
    const amount = parseFloat(goal.replace(/[^\d.]/g, ''));
    if (!amount || amount <= 0 || !showResult) return null;
    return computeProjection(amount, transactions);
  }, [goal, transactions, showResult]);

  const handlePlan = () => {
    if (!goal.trim()) return;
    setShowResult(true);
  };

  const hasGoal = goal.trim().length > 0;

  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 18, padding: '0 4px',
        flexDirection: isRtl ? 'row-reverse' : 'row',
      }}>
        <h3 style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 600 }}>
          {t.goalArch}
        </h3>
        <span style={{ fontSize: 10, color: '#27272a', letterSpacing: '0.15em', fontWeight: 500 }}>
          {t.stable}
        </span>
      </div>

      <GlassPanel style={{
        display: 'flex', alignItems: 'center', borderRadius: 20,
        padding: isRtl ? '6px 20px 6px 6px' : '6px 6px 6px 20px',
        flexDirection: isRtl ? 'row-reverse' : 'row',
      }}>
        <input
          value={goal}
          onChange={e => { setGoal(e.target.value); setShowResult(false); }}
          onKeyDown={e => e.key === 'Enter' && handlePlan()}
          placeholder={t.goalPlaceholder}
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{
            flex: 1, background: 'transparent', color: '#e4e4e7',
            fontSize: 15, outline: 'none', border: 'none',
            fontWeight: 400, letterSpacing: '0.02em',
            textAlign: isRtl ? 'right' : 'left',
            fontFamily: "'Aeonik', sans-serif",
          }}
        />
        <button
          onClick={handlePlan}
          style={{
            background: hasGoal ? 'rgba(45,212,160,0.08)' : 'rgba(255,255,255,0.08)',
            color: hasGoal ? EMERALD : '#d4d4d8',
            padding: '13px 22px', borderRadius: 14,
            fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.2em',
            border: `1px solid ${hasGoal ? 'rgba(45,212,160,0.2)' : 'rgba(255,255,255,0.08)'}`,
            cursor: hasGoal ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', gap: 8,
            flexDirection: isRtl ? 'row-reverse' : 'row',
            flexShrink: 0, ...smooth,
          }}
        >
          {t.plan} <ArrowIcon size={11} strokeWidth={1.5} />
        </button>
      </GlassPanel>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            <GlassPanel style={{ marginTop: 10, borderRadius: 18, padding: '18px 20px' }}>
              {projection ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  flexDirection: isRtl ? 'row-reverse' : 'row',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(45,212,160,0.08)',
                    border: '1px solid rgba(45,212,160,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Target size={15} strokeWidth={1.5} color={EMERALD} />
                  </div>
                  <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                    <p style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, marginBottom: 6 }}>
                      {t.projectedIn}
                    </p>
                    <p style={{ fontSize: 18, color: '#e4e4e7', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 4 }}>
                      <span style={{ color: EMERALD, fontWeight: 500 }}>
                        {projection.monthsNeeded}
                      </span>
                      {' '}{t.months}
                      <span style={{ fontSize: 13, color: '#52525b', marginLeft: 8 }}>
                        {projection.targetDate.toLocaleDateString(isRtl ? 'he-IL' : 'en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </p>
                    <p style={{ fontSize: 10, color: '#3f3f46', letterSpacing: '0.04em' }}>
                      ₪{Math.round(projection.avgNet).toLocaleString()}/mo avg · {t.atCurrentRate}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: '#3f3f46', textAlign: 'center', padding: '4px 0' }}>
                  {t.insufficientData}
                </p>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
