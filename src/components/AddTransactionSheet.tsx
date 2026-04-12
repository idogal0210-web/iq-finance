import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ChevronDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { EMERALD, glassStyle, smooth } from '../theme';
import { useDbCategories, useDbSubcategories } from '../hooks/useFinanceQueries';
import { useLanguage } from '../contexts/LanguageContext';
import { insertTransaction } from '../lib/db';
import type { DbCategory } from '../lib/db';

interface AddTransactionSheetProps {
  open: boolean;
  onClose: () => void;
}

const CURRENCIES = ['₪', '$', '€'] as const;
type Currency = typeof CURRENCIES[number];
const CURRENCY_CODES: Record<Currency, string> = { '₪': 'ILS', '$': 'USD', '€': 'EUR' };
type TxType = 'expense' | 'income' | 'transfer';

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
] as const;

// ── Natural Language Parser ──────────────────────────────────────────────────
function parseNL(
  text: string,
  categories: DbCategory[],
): { amount: string | null; currency: Currency | null; categoryId: string | null; description: string } {
  const amountMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  const amount = amountMatch ? amountMatch[1].replace(',', '.') : null;

  let currency: Currency | null = null;
  if (text.includes('₪')) currency = '₪';
  else if (text.includes('$')) currency = '$';
  else if (text.includes('€')) currency = '€';

  const lower = text.toLowerCase();
  let categoryId: string | null = null;
  for (const cat of categories) {
    if (lower.includes(cat.name.toLowerCase())) { categoryId = cat.id; break; }
    if (cat.name_he && lower.includes(cat.name_he.toLowerCase())) { categoryId = cat.id; break; }
  }

  const forMatch = text.match(/(?:for|on|at|in|ל|על|ב)\s+(.+)$/i);
  const description = forMatch ? forMatch[1] : text;
  return { amount, currency, categoryId, description };
}

// ── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(text: string): { date: string; amount: number; description: string }[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
  const dateIdx   = headers.findIndex(h => h.includes('date') || h.includes('תאריך'));
  const amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('סכום') || h.includes('sum'));
  const descIdx   = headers.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('narr') || h.includes('תיאור') || h.includes('פרטים'));
  if (amountIdx === -1) return [];
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const rawAmt = cols[amountIdx] ?? '0';
    const amount = Math.abs(parseFloat(rawAmt.replace(/[^\d.-]/g, '')) || 0);
    const date = dateIdx >= 0 && cols[dateIdx] ? cols[dateIdx] : new Date().toISOString().split('T')[0];
    const description = descIdx >= 0 && cols[descIdx] ? cols[descIdx] : rawAmt;
    return { date, amount, description };
  }).filter(r => r.amount > 0);
}

export default function AddTransactionSheet({ open, onClose }: AddTransactionSheetProps) {
  const qc = useQueryClient();
  const { t, isRtl } = useLanguage();
  const { data: categories = [] } = useDbCategories();
  const { data: subcategories = [] } = useDbSubcategories();

  const [amount, setAmount]         = useState('');
  const [currency, setCurrency]     = useState<Currency>('₪');
  const [type, setType]             = useState<TxType>('expense');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcatId, setSubcatId]     = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [quickAdd, setQuickAdd]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [showCSV, setShowCSV]       = useState(false);
  const [parsedRows, setParsedRows] = useState<{ date: string; amount: number; description: string; checked: boolean; categoryId: string | null }[]>([]);
  const [importing, setImporting]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const catSubs = subcategories.filter(s => s.category_id === categoryId);

  useEffect(() => {
    if (open) {
      setAmount(''); setType('expense'); setCategoryId(null); setSubcatId(null);
      setDescription(''); setQuickAdd(''); setSuccess(false); setShowCSV(false); setParsedRows([]);
    }
  }, [open]);

  // ── Keypad handler ───────────────────────────────────────────────────────
  const handleKey = (key: string) => {
    if (key === '⌫') { setAmount(p => p.slice(0, -1)); return; }
    if (key === '.') { if (!amount.includes('.')) setAmount(p => p + '.'); return; }
    if (amount.length >= 10) return;
    setAmount(p => (p === '0' ? key : p + key));
  };

  // ── Quick Add NL ─────────────────────────────────────────────────────────
  const handleQuickAdd = (text: string) => {
    setQuickAdd(text);
    if (!text.trim()) return;
    const parsed = parseNL(text, categories);
    if (parsed.amount) setAmount(parsed.amount);
    if (parsed.currency) setCurrency(parsed.currency);
    if (parsed.categoryId) { setCategoryId(parsed.categoryId); setSubcatId(null); }
    if (parsed.description !== text) setDescription(parsed.description);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) return;
    setSubmitting(true);
    try {
      await insertTransaction({
        date: new Date().toISOString().split('T')[0],
        amount: num,
        currency: CURRENCY_CODES[currency],
        type: (type === 'transfer' ? 'expense' : type) as 'income' | 'expense',
        category_id: categoryId,
        subcategory_id: subcatId,
        wallet_id: null,
        description: description || (type === 'transfer' ? 'Transfer' : null),
      });
      qc.invalidateQueries({ queryKey: ['db-transactions'] });
      qc.invalidateQueries({ queryKey: ['db-wallets'] });
      setSuccess(true);
      setTimeout(onClose, 700);
    } finally {
      setSubmitting(false);
    }
  };

  // ── CSV Import ────────────────────────────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const rows = parseCSV(ev.target?.result as string);
      setParsedRows(rows.map(r => ({ ...r, checked: true, categoryId: null })));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const checked = parsedRows.filter(r => r.checked);
    if (!checked.length) return;
    setImporting(true);
    try {
      await Promise.all(checked.map(r => insertTransaction({
        date: r.date, amount: r.amount, currency: CURRENCY_CODES[currency],
        type: (type === 'transfer' ? 'expense' : type) as 'income' | 'expense',
        category_id: r.categoryId, subcategory_id: null,
        wallet_id: null, description: r.description || null,
      })));
      qc.invalidateQueries({ queryKey: ['db-transactions'] });
      qc.invalidateQueries({ queryKey: ['db-wallets'] });
      setParsedRows([]);
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setImporting(false);
    }
  };

  if (!open) return null;

  const hasAmount   = amount.length > 0 && parseFloat(amount) > 0;
  const typeAccent  = type === 'income' ? EMERALD : type === 'transfer' ? '#60a5fa' : '#fb7185';
  const types: TxType[] = ['expense', 'income', 'transfer'];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
        borderRadius: '28px 28px 0 0',
        maxHeight: '92vh', overflowY: 'auto',
        ...glassStyle,
        background: 'linear-gradient(180deg, rgba(14,16,18,0.99) 0%, rgba(6,6,6,0.99) 100%)',
        scrollbarWidth: 'none',
      }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px 0', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <p style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>
            {t.addEntry}
          </p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 4 }}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Quick Add NL */}
        <div style={{ padding: '12px 24px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '10px 14px',
          }}>
            <Zap size={13} strokeWidth={1.5} color={EMERALD} style={{ flexShrink: 0, opacity: 0.7 }} />
            <input
              value={quickAdd}
              onChange={e => handleQuickAdd(e.target.value)}
              placeholder={isRtl ? 'לדוגמה: "80 ₪ על מכולת"' : 'e.g. "80 ₪ for Groceries"'}
              dir={isRtl ? 'rtl' : 'ltr'}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#71717a', fontSize: 13, fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Amount display */}
        <div style={{
          padding: '16px 24px 0',
          display: 'flex', alignItems: 'baseline', gap: 8,
          flexDirection: isRtl ? 'row-reverse' : 'row',
        }}>
          <span style={{ fontSize: 22, color: '#3f3f46', fontWeight: 300, letterSpacing: '-0.02em', alignSelf: 'center' }}>
            {currency}
          </span>
          <span style={{
            fontSize: 'clamp(48px, 14vw, 68px)', fontWeight: 300,
            letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
            color: hasAmount ? '#e4e4e7' : '#27272a',
            minWidth: '2ch', flex: 1,
            textAlign: isRtl ? 'right' : 'left',
            transition: 'color 0.3s ease',
          }}>
            {amount || '0'}
          </span>
          <button
            onClick={() => { const i = CURRENCIES.indexOf(currency); setCurrency(CURRENCIES[(i + 1) % CURRENCIES.length]); }}
            style={{
              padding: '6px 10px', borderRadius: 10, alignSelf: 'center',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
              color: '#52525b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 3,
            }}
          >
            {currency} <ChevronDown size={9} strokeWidth={1.5} />
          </button>
        </div>

        {/* Type toggle */}
        <div style={{ padding: '10px 24px 0', display: 'flex', gap: 8, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          {types.map(tp => {
            const accent = tp === 'income' ? EMERALD : tp === 'transfer' ? '#60a5fa' : '#fb7185';
            const label = tp === 'income' ? t.income : tp === 'transfer' ? t.txTransfer : t.flow;
            const active = type === tp;
            return (
              <button key={tp} onClick={() => setType(tp)} style={{
                padding: '8px 16px', borderRadius: 20, flexShrink: 0,
                border: `1px solid ${active ? accent : 'rgba(255,255,255,0.07)'}`,
                color: active ? accent : '#52525b',
                background: active ? `${accent}12` : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.06em', fontFamily: 'inherit', ...smooth,
              }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div style={{ padding: '10px 0 0' }}>
            <div style={{
              display: 'flex', gap: 8, overflowX: 'auto',
              padding: '0 24px 4px', scrollbarWidth: 'none',
              flexDirection: isRtl ? 'row-reverse' : 'row',
            }}>
              {categories.map(cat => {
                const active = categoryId === cat.id;
                return (
                  <button key={cat.id} onClick={() => { setCategoryId(active ? null : cat.id); setSubcatId(null); }} style={{
                    padding: '7px 14px', borderRadius: 18, flexShrink: 0,
                    border: `1px solid ${active ? EMERALD : 'rgba(255,255,255,0.07)'}`,
                    color: active ? EMERALD : '#52525b',
                    background: active ? 'rgba(45,212,160,0.07)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer', fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.04em', fontFamily: 'inherit', ...smooth,
                  }}>
                    {isRtl && cat.name_he ? cat.name_he : cat.name}
                  </button>
                );
              })}
            </div>
            {categoryId && catSubs.length > 0 && (
              <div style={{
                display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none',
                padding: '6px 24px 4px', flexDirection: isRtl ? 'row-reverse' : 'row',
              }}>
                {catSubs.map(sub => {
                  const active = subcatId === sub.id;
                  return (
                    <button key={sub.id} onClick={() => setSubcatId(active ? null : sub.id)} style={{
                      padding: '5px 12px', borderRadius: 14, flexShrink: 0,
                      border: `1px solid ${active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                      color: active ? '#e4e4e7' : '#3f3f46',
                      background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                      cursor: 'pointer', fontSize: 10, fontWeight: 500,
                      letterSpacing: '0.06em', fontFamily: 'inherit', ...smooth,
                    }}>
                      {isRtl && sub.name_he ? sub.name_he : sub.name}{sub.is_recurring ? ' ↻' : ''}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div style={{ padding: '10px 24px 0' }}>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={isRtl ? 'הערה (אופציונלי)' : 'Note (optional)'}
            dir={isRtl ? 'rtl' : 'ltr'}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, color: '#71717a', fontSize: 13,
              padding: '10px 14px', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Numeric Keypad */}
        <div style={{ padding: '14px 24px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {KEYPAD_ROWS.flat().map(key => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                style={{
                  height: 54, borderRadius: 16,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  color: key === '⌫' ? '#52525b' : '#c4c4c8',
                  fontSize: key === '⌫' ? 18 : 22,
                  fontWeight: 300, cursor: 'pointer', fontFamily: 'inherit',
                  ...smooth,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e4e4e7'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.color = key === '⌫' ? '#52525b' : '#c4c4c8'; }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ padding: '12px 24px 0' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasAmount}
            style={{
              width: '100%', padding: '18px 24px', borderRadius: 18,
              border: hasAmount ? `1px solid ${typeAccent}30` : '1px solid rgba(255,255,255,0.06)',
              background: hasAmount ? `${typeAccent}10` : 'rgba(255,255,255,0.02)',
              color: hasAmount ? typeAccent : '#27272a',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase',
              cursor: hasAmount ? 'pointer' : 'default', fontFamily: 'inherit', ...smooth,
            }}
          >
            {success ? '✓' : submitting ? '...' : `${t.plan} ${type === 'income' ? t.income : type === 'transfer' ? t.txTransfer : t.flow}`}
          </button>
        </div>

        {/* CSV Import (collapsed) */}
        <div style={{ padding: '10px 24px 32px' }}>
          <button
            onClick={() => setShowCSV(p => !p)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#27272a', fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase', fontFamily: 'inherit', width: '100%',
              padding: '8px 0',
            }}
          >
            {showCSV ? '↑ Hide' : '+ Import CSV'}
          </button>
          <AnimatePresence>
            {showCSV && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: 72, borderRadius: 14, border: '1px dashed rgba(255,255,255,0.08)',
                  cursor: 'pointer', color: '#3f3f46', fontSize: 12,
                  flexDirection: 'column', gap: 4, marginTop: 4,
                }}>
                  Drop CSV / Bank Statement
                  <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#27272a' }}>click to select</span>
                  <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: 'none' }} />
                </label>
                {parsedRows.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 9, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                      Review ({parsedRows.filter(r => r.checked).length} selected)
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 180, overflowY: 'auto' }}>
                      {parsedRows.map((row, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                          borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}>
                          <input type="checkbox" checked={row.checked} onChange={e => {
                            const next = [...parsedRows]; next[i] = { ...next[i], checked: e.target.checked }; setParsedRows(next);
                          }} style={{ accentColor: EMERALD }} />
                          <span style={{ fontSize: 10, color: '#52525b', flexShrink: 0 }}>{row.date}</span>
                          <span style={{ flex: 1, fontSize: 11, color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.description}</span>
                          <span style={{ fontSize: 12, color: '#e4e4e7', fontWeight: 500, flexShrink: 0 }}>{currency}{row.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleImport}
                      disabled={importing || parsedRows.filter(r => r.checked).length === 0}
                      style={{
                        width: '100%', marginTop: 10, padding: '12px 16px', borderRadius: 12,
                        border: `1px solid ${EMERALD}30`, background: 'rgba(45,212,160,0.05)',
                        color: EMERALD, fontSize: 10, fontWeight: 600,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      {importing ? '...' : `Import ${parsedRows.filter(r => r.checked).length}`}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
