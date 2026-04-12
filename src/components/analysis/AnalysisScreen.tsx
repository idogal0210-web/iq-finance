import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RICH_BLACK, EMERALD, EMERALD_OUTER, noiseUrl, smooth } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLayout } from '../../contexts/LayoutContext';
import { useFinance } from '../../contexts/FinanceContext';
import { useDbCategories } from '../../hooks/useFinanceQueries';
import GlassPanel from '../ui/GlassPanel';
import Reveal from '../ui/Reveal';
import type { DbTransaction, DbCategory } from '../../lib/db';

// ─── Design tokens ────────────────────────────────────────────────────────────
const ROSE   = '#fb7185';
const AMBER  = '#fbbf24';
const BLUE   = '#60a5fa';
const VIOLET = '#a78bfa';
const CHART_COLORS = [EMERALD, ROSE, AMBER, BLUE, VIOLET];

// ─── Data types ───────────────────────────────────────────────────────────────
interface MonthlyBarData { label: string; income: number; expenses: number; }
interface CategoryData   { id: string | null; label: string; amount: number; ratio: number; color: string; }

// ─── Mock fallback data ───────────────────────────────────────────────────────
const MOCK_MONTHLY: MonthlyBarData[] = [
  { label: 'NOV', income: 18500, expenses: 6200 },
  { label: 'DEC', income: 22000, expenses: 9100 },
  { label: 'JAN', income: 18500, expenses: 7400 },
  { label: 'FEB', income: 19200, expenses: 8300 },
  { label: 'MAR', income: 24000, expenses: 8120 },
  { label: 'APR', income: 21500, expenses: 7600 },
];

const MOCK_CATEGORIES: CategoryData[] = [
  { id: null, label: 'Housing',   amount: 3200, ratio: 0.394, color: EMERALD },
  { id: null, label: 'Food',      amount: 1800, ratio: 0.222, color: ROSE   },
  { id: null, label: 'Transport', amount: 1100, ratio: 0.136, color: AMBER  },
  { id: null, label: 'Health',    amount:  920, ratio: 0.113, color: BLUE   },
  { id: null, label: 'Leisure',   amount: 1100, ratio: 0.136, color: VIOLET },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeMonthlyData(transactions: DbTransaction[]): MonthlyBarData[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d   = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const lbl = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const income   = transactions.filter(t => t.type === 'income'  && t.date?.startsWith(key)).reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense' && t.date?.startsWith(key)).reduce((s, t) => s + t.amount, 0);
    return { label: lbl, income, expenses };
  });
}

function computeCategoryData(
  transactions: DbTransaction[],
  categories: DbCategory[],
  isHe: boolean,
): CategoryData[] {
  const expenseTxs = transactions.filter(t => t.type === 'expense' && t.category_id);
  const total = expenseTxs.reduce((s, t) => s + t.amount, 0);
  if (total === 0) return MOCK_CATEGORIES;

  const catMap = new Map<string, number>();
  expenseTxs.forEach(t => {
    if (t.category_id) catMap.set(t.category_id, (catMap.get(t.category_id) ?? 0) + t.amount);
  });

  return Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([catId, amount], i) => {
      const cat = categories.find(c => c.id === catId);
      return {
        id: catId,
        label: (isHe ? cat?.name_he : cat?.name) ?? 'Other',
        amount,
        ratio: amount / total,
        color: CHART_COLORS[i % CHART_COLORS.length],
      };
    });
}

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function MonthlyBarChart({ data }: { data: MonthlyBarData[] }) {
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expenses]), 1);
  const W = 320, CHART_H = 120;
  const gW = W / data.length;          // group width
  const bW = 13, bGap = 5;             // bar width, gap between income/expense
  const gPad = (gW - bW * 2 - bGap) / 2;

  return (
    <svg viewBox={`0 0 ${W} 155`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="iq-income-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={EMERALD} stopOpacity="0.95" />
          <stop offset="100%" stopColor={EMERALD} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="iq-exp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ROSE} stopOpacity="0.85" />
          <stop offset="100%" stopColor={ROSE} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Subtle horizontal guides */}
      {[0.25, 0.5, 0.75].map(frac => (
        <line
          key={frac}
          x1={0} y1={CHART_H * (1 - frac)}
          x2={W} y2={CHART_H * (1 - frac)}
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}

      {/* Baseline */}
      <line x1={0} y1={CHART_H} x2={W} y2={CHART_H} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {data.map((d, i) => {
        const incomeH = d.income   > 0 ? Math.max((d.income   / maxVal) * CHART_H, 4) : 0;
        const expH    = d.expenses > 0 ? Math.max((d.expenses / maxVal) * CHART_H, 4) : 0;
        const incomeX = i * gW + gPad;
        const expX    = i * gW + gPad + bW + bGap;
        const labelX  = i * gW + gW / 2;

        return (
          <g key={i}>
            {incomeH > 0 && (
              <rect
                x={incomeX} y={CHART_H - incomeH}
                width={bW} height={incomeH} rx={3}
                fill="url(#iq-income-grad)"
              />
            )}
            {expH > 0 && (
              <rect
                x={expX} y={CHART_H - expH}
                width={bW} height={expH} rx={3}
                fill="url(#iq-exp-grad)"
              />
            )}
            <text
              x={labelX} y={140}
              textAnchor="middle"
              fill="#3f3f46"
              fontSize="8.5"
              fontWeight="500"
              letterSpacing="0.06em"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
function CategoryDonut({ data }: { data: CategoryData[] }) {
  const r = 56, cx = 80, cy = 80;
  const circ   = 2 * Math.PI * r;
  const strokeW = 11;
  const GAP     = data.length > 1 ? 2.5 : 0;
  const topCat  = data[0];

  let cumOffset = 0;
  const segments = data.map(item => {
    const fullLen = item.ratio * circ;
    const drawLen = Math.max(fullLen - GAP, 0);
    const seg = { ...item, drawLen, dashOffset: -cumOffset };
    cumOffset += fullLen;
    return seg;
  });

  return (
    <svg viewBox="0 0 160 160" width="148" height="148" style={{ flexShrink: 0 }}>
      {/* Track ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeW} />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeW}
          strokeDasharray={`${seg.drawLen} ${circ - seg.drawLen}`}
          strokeDashoffset={seg.dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.88}
          style={i === 0 ? { filter: `drop-shadow(0 0 5px ${seg.color}50)` } : undefined}
        />
      ))}
      {topCat && (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#e4e4e7" fontSize="17" fontWeight="300">
            {Math.round(topCat.ratio * 100)}%
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#3f3f46" fontSize="8" fontWeight="500" letterSpacing="0.12em">
            {topCat.label.substring(0, 7).toUpperCase()}
          </text>
        </>
      )}
    </svg>
  );
}

// ─── Drill-Down Transaction List ──────────────────────────────────────────────
function DrillDownList({
  transactions,
  categoryId,
  label,
  color,
  onClear,
  isRtl,
  t,
}: {
  transactions: import('../../lib/db').DbTransaction[];
  categoryId: string;
  label: string;
  color: string;
  onClear: () => void;
  isRtl: boolean;
  t: import('../../i18n/translations').TranslationStrings;
}) {
  const row = (isRtl ? 'row-reverse' : 'row') as 'row' | 'row-reverse';
  const filtered = transactions.filter(tx => tx.category_id === categoryId);
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexDirection: row }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: row }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}60` }} />
          <span style={{ fontSize: 11, color: '#a1a1aa', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {label}
          </span>
        </div>
        <button
          onClick={onClear}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '4px 12px',
            color: '#52525b', fontSize: 10, cursor: 'pointer',
            letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit',
          }}
        >
          {t.allCategories}
        </button>
      </div>
      {filtered.length === 0 ? (
        <p style={{ fontSize: 13, color: '#27272a', textAlign: 'center', padding: '16px 0' }}>No transactions</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.map((tx, i) => {
            const isIncome = tx.type === 'income';
            const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
            return (
              <div key={tx.id ?? i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                borderRadius: 14, flexDirection: row,
                background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={13} strokeWidth={1.5} color={isIncome ? EMERALD : '#fb7185'} />
                </div>
                <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                  <p style={{ fontSize: 13, color: '#d4d4d8', fontWeight: 400, marginBottom: 2 }}>
                    {tx.description ?? (isIncome ? t.income : t.flow)}
                  </p>
                  <p style={{ fontSize: 10, color: '#3f3f46' }}>{tx.date}</p>
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums',
                  color: isIncome ? EMERALD : '#e4e4e7', flexShrink: 0,
                }}>
                  {isIncome ? '+' : '−'}₪{tx.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AnalysisScreen() {
  const { isRtl, t } = useLanguage();
  const { layoutMode, containerMaxWidth } = useLayout();
  const { transactions, totalIncome, totalExpenses } = useFinance();
  const { data: categories = [] } = useDbCategories();
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const hasLiveData = transactions.length > 0;
  const income   = hasLiveData && totalIncome   > 0 ? totalIncome   : 24000;
  const expenses = hasLiveData && totalExpenses > 0 ? totalExpenses : 8120;
  const net          = income - expenses;
  const netPositive  = net >= 0;
  const savingsRatePct = income > 0 ? Math.round((net / income) * 100) : 0;
  const savingsBarW    = income > 0 ? Math.max(0, Math.min(100, (net / income) * 100)) : 0;

  const monthlyData = useMemo(
    () => hasLiveData ? computeMonthlyData(transactions) : MOCK_MONTHLY,
    [transactions, hasLiveData],
  );

  const categoryData = useMemo(
    () => hasLiveData ? computeCategoryData(transactions, categories, isRtl) : MOCK_CATEGORIES,
    [transactions, categories, isRtl, hasLiveData],
  );

  const row = (isRtl ? 'row-reverse' : 'row') as 'row' | 'row-reverse';

  return (
    <div style={{
      minHeight: '100vh',
      background: RICH_BLACK,
      color: '#a1a1aa',
      fontFamily: "'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/* Noise overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none', backgroundImage: noiseUrl }} />

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-15%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(255,255,255,0.008)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '10%', width: '40%', height: '30%', borderRadius: '50%', background: `radial-gradient(ellipse, ${EMERALD_OUTER}, transparent 70%)`, filter: 'blur(80px)', opacity: 0.25 }} />
      </div>

      <main style={{
        maxWidth: containerMaxWidth,
        margin: '0 auto',
        padding: layoutMode === 'web' ? '56px 48px 140px' : '56px 24px 140px',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* ── Header ── */}
        <Reveal delay={0}>
          <header style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 64, flexDirection: row }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.025)',
                cursor: 'pointer', color: '#71717a', ...smooth,
              }}
            >
              {isRtl
                ? <ChevronRight size={16} strokeWidth={1.5} />
                : <ChevronLeft  size={16} strokeWidth={1.5} />}
            </button>
            <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>
              {t.analysis}
            </p>
          </header>
        </Reveal>

        {/* ── Summary stats ── */}
        <Reveal delay={80}>
          <section style={{ marginBottom: 52 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {/* Income */}
              <GlassPanel style={{ padding: '18px 14px', borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10, flexDirection: row }}>
                  <TrendingUp size={10} strokeWidth={1.5} color={EMERALD} />
                  <p style={{ fontSize: 9, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                    {t.income}
                  </p>
                </div>
                <p style={{ fontSize: 19, color: '#e4e4e7', fontWeight: 400, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
                  ₪{income.toLocaleString()}
                </p>
              </GlassPanel>

              {/* Expenses */}
              <GlassPanel style={{ padding: '18px 14px', borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10, flexDirection: row }}>
                  <TrendingDown size={10} strokeWidth={1.5} color={ROSE} />
                  <p style={{ fontSize: 9, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                    {t.flow}
                  </p>
                </div>
                <p style={{ fontSize: 19, color: '#e4e4e7', fontWeight: 400, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
                  ₪{expenses.toLocaleString()}
                </p>
              </GlassPanel>

              {/* Net */}
              <GlassPanel style={{ padding: '18px 14px', borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10, flexDirection: row }}>
                  <TrendingUp size={10} strokeWidth={1.5} color={netPositive ? EMERALD : ROSE} />
                  <p style={{ fontSize: 9, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                    {t.netSavings}
                  </p>
                </div>
                <p style={{ fontSize: 19, color: netPositive ? EMERALD : ROSE, fontWeight: 400, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
                  {netPositive ? '+' : '−'}₪{Math.abs(net).toLocaleString()}
                </p>
              </GlassPanel>
            </div>
          </section>
        </Reveal>

        {/* ── Monthly Flow bar chart ── */}
        <Reveal delay={160}>
          <section style={{ marginBottom: 52 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '0 4px', flexDirection: row }}>
              <h3 style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 600 }}>
                {t.monthlyFlow}
              </h3>
              {/* Legend */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexDirection: row }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: EMERALD, opacity: 0.9 }} />
                  <span style={{ fontSize: 9, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{t.income}</span>
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: ROSE, opacity: 0.75 }} />
                  <span style={{ fontSize: 9, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{t.flow}</span>
                </div>
              </div>
            </div>
            <GlassPanel style={{ padding: '20px 16px 12px', borderRadius: 24 }}>
              <MonthlyBarChart data={monthlyData} />
            </GlassPanel>
          </section>
        </Reveal>

        {/* ── Spending Breakdown donut ── */}
        <Reveal delay={240}>
          <section style={{ marginBottom: 52 }}>
            <div style={{ marginBottom: 20, padding: '0 4px' }}>
              <h3 style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 600 }}>
                {t.spendingBreakdown}
              </h3>
            </div>
            <GlassPanel style={{ padding: '20px', borderRadius: 24 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexDirection: row }}>
                <CategoryDonut data={categoryData} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {/* All filter chip */}
                  {selectedCatId && (
                    <button
                      onClick={() => setSelectedCatId(null)}
                      style={{
                        alignSelf: isRtl ? 'flex-end' : 'flex-start',
                        padding: '4px 10px', borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#a1a1aa', fontSize: 10, cursor: 'pointer',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        fontFamily: 'inherit', marginBottom: 2,
                      }}
                    >
                      {t.allCategories} ×
                    </button>
                  )}
                  {categoryData.map((cat, i) => {
                    const isSelected = selectedCatId === cat.id;
                    const canDrill   = cat.id !== null && hasLiveData;
                    return (
                      <div
                        key={i}
                        onClick={() => canDrill ? setSelectedCatId(isSelected ? null : cat.id) : undefined}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 9, flexDirection: row,
                          cursor: canDrill ? 'pointer' : 'default',
                          opacity: selectedCatId && !isSelected ? 0.4 : 1,
                          transition: 'opacity 0.25s ease',
                          padding: '2px 4px', borderRadius: 8,
                          background: isSelected ? 'rgba(255,255,255,0.04)' : 'transparent',
                        }}
                      >
                        <div style={{
                          width: 7, height: 7, borderRadius: 9999, flexShrink: 0,
                          background: cat.color,
                          boxShadow: isSelected ? `0 0 7px ${cat.color}80` : `0 0 5px ${cat.color}60`,
                        }} />
                        <span style={{
                          flex: 1, fontSize: 12, color: isSelected ? '#e4e4e7' : '#a1a1aa',
                          fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {cat.label}
                        </span>
                        <span style={{ fontSize: 11, color: isSelected ? '#e4e4e7' : '#52525b', fontWeight: 500, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                          {Math.round(cat.ratio * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drill-down list */}
              {selectedCatId && hasLiveData && (() => {
                const cat = categoryData.find(c => c.id === selectedCatId);
                return cat ? (
                  <DrillDownList
                    transactions={transactions}
                    categoryId={selectedCatId}
                    label={cat.label}
                    color={cat.color}
                    onClear={() => setSelectedCatId(null)}
                    isRtl={isRtl}
                    t={t}
                  />
                ) : null;
              })()}
            </GlassPanel>
          </section>
        </Reveal>

        {/* ── Savings Rate ── */}
        <Reveal delay={320}>
          <section style={{ marginBottom: 56 }}>
            <div style={{ marginBottom: 20, padding: '0 4px' }}>
              <h3 style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 600 }}>
                {t.savingsRate}
              </h3>
            </div>
            <GlassPanel style={{ padding: '24px 20px', borderRadius: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, flexDirection: row }}>
                <span style={{ fontSize: 11, color: '#52525b', fontWeight: 500 }}>{t.monthlySavingsRate}</span>
                <span style={{
                  fontSize: 28, color: netPositive ? '#e4e4e7' : ROSE,
                  fontWeight: 300, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em',
                }}>
                  {savingsRatePct}%
                </span>
              </div>
              {/* Progress track */}
              <div style={{ height: 5, borderRadius: 9999, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${savingsBarW}%`,
                  borderRadius: 9999,
                  background: netPositive
                    ? `linear-gradient(90deg, ${EMERALD}50 0%, ${EMERALD} 100%)`
                    : `linear-gradient(90deg, ${ROSE}50 0%, ${ROSE} 100%)`,
                  boxShadow: `0 0 8px ${netPositive ? EMERALD : ROSE}40`,
                  transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', flexDirection: row }}>
                <span style={{ fontSize: 10, color: '#27272a', fontWeight: 500, letterSpacing: '0.1em' }}>₪0</span>
                <span style={{ fontSize: 10, color: '#27272a', fontWeight: 500, letterSpacing: '0.1em' }}>₪{income.toLocaleString()}</span>
              </div>
            </GlassPanel>
          </section>
        </Reveal>

      </main>
    </div>
  );
}
