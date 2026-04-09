import { useState, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { EMERALD, glassStyle, smooth } from '../theme';
import { useDbCategories, useDbSubcategories } from '../hooks/useFinanceQueries';
import { insertTransaction } from '../lib/db';
import type { DbTransaction } from '../lib/db';

interface AddTransactionSheetProps {
  open: boolean;
  onClose: () => void;
}

const CURRENCIES = ['₪', '$', '€'] as const;
type Currency = typeof CURRENCIES[number];
const CURRENCY_CODES: Record<Currency, string> = { '₪': 'ILS', '$': 'USD', '€': 'EUR' };

function parseCSV(text: string): { date: string; amount: number; description: string }[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
  const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('תאריך'));
  const amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('סכום') || h.includes('sum'));
  const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('narr') || h.includes('תיאור') || h.includes('פרטים'));
  if (amountIdx === -1) return [];

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const rawAmount = cols[amountIdx] ?? '0';
    const amount = Math.abs(parseFloat(rawAmount.replace(/[^\d.-]/g, '')) || 0);
    const date = dateIdx >= 0 && cols[dateIdx] ? cols[dateIdx] : new Date().toISOString().split('T')[0];
    const description = descIdx >= 0 && cols[descIdx] ? cols[descIdx] : rawAmount;
    return { date, amount, description };
  }).filter(r => r.amount > 0);
}

export default function AddTransactionSheet({ open, onClose }: AddTransactionSheetProps) {
  const qc = useQueryClient();
  const { data: categories = [] } = useDbCategories();
  const { data: subcategories = [] } = useDbSubcategories();

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('₪');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [parsedRows, setParsedRows] = useState<{ date: string; amount: number; description: string; checked: boolean; categoryId: string | null }[]>([]);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const catSubs = subcategories.filter(s => s.category_id === categoryId);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#e4e4e7',
    fontSize: 14,
    padding: '12px 16px',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 20,
    border: `1px solid ${active ? EMERALD : 'rgba(255,255,255,0.08)'}`,
    color: active ? EMERALD : '#71717a',
    background: active ? 'rgba(45,212,160,0.06)' : 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontFamily: 'inherit',
    ...smooth,
  });

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setSubmitting(true);
    try {
      await insertTransaction({
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(amount),
        currency: CURRENCY_CODES[currency],
        type,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        wallet_id: null,
        description: description || null,
      });
      qc.invalidateQueries({ queryKey: ['db-transactions'] });
      qc.invalidateQueries({ queryKey: ['db-wallets'] });
      setAmount('');
      setDescription('');
      setCategoryId(null);
      setSubcategoryId(null);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setParsedRows(rows.map(r => ({
        ...r,
        checked: true,
        categoryId: null,
      })));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const checked = parsedRows.filter(r => r.checked);
    if (!checked.length) return;
    setImporting(true);
    try {
      await Promise.all(checked.map(r => insertTransaction({
        date: r.date,
        amount: r.amount,
        currency: CURRENCY_CODES[currency],
        type,
        category_id: r.categoryId,
        subcategory_id: null,
        wallet_id: null,
        description: r.description || null,
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

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
        borderRadius: '28px 28px 0 0',
        maxHeight: '85vh', overflowY: 'auto',
        ...glassStyle,
        background: 'linear-gradient(180deg, rgba(14,16,18,0.98) 0%, rgba(6,6,6,0.99) 100%)',
        padding: '0 24px 48px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 20px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>Add Transaction</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 4 }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            style={{
              flex: 1, fontSize: 48, fontWeight: 300, background: 'none', border: 'none',
              color: '#e4e4e7', outline: 'none', fontFamily: 'inherit',
              letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
            }}
          />
          <button
            onClick={() => {
              const idx = CURRENCIES.indexOf(currency);
              setCurrency(CURRENCIES[(idx + 1) % CURRENCIES.length]);
            }}
            style={{
              padding: '8px 14px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#a1a1aa', fontSize: 18, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {currency} <ChevronDown size={12} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <button onClick={() => setType('income')} style={chipStyle(type === 'income')}>
            Income
          </button>
          <button onClick={() => setType('expense')} style={chipStyle(type === 'expense')}>
            Expense
          </button>
        </div>

        {categories.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, marginBottom: 10 }}>Category</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCategoryId(cat.id === categoryId ? null : cat.id); setSubcategoryId(null); }}
                  style={chipStyle(categoryId === cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {categoryId && catSubs.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, marginBottom: 10 }}>Subcategory</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
              {catSubs.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSubcategoryId(sub.id === subcategoryId ? null : sub.id)}
                  style={{ ...chipStyle(subcategoryId === sub.id), fontSize: 11 }}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !amount}
          style={{
            width: '100%', padding: '18px 24px', borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            color: amount ? '#e4e4e7' : '#3f3f46',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase',
            cursor: amount ? 'pointer' : 'default', fontFamily: 'inherit',
            marginBottom: 32, ...smooth,
          }}
        >
          {submitting ? 'Adding...' : 'ADD TRANSACTION'}
        </button>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24 }}>
          <p style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, marginBottom: 14 }}>Parse Statement</p>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 80, borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)',
            cursor: 'pointer', color: '#3f3f46', fontSize: 13,
            flexDirection: 'column', gap: 6,
          }}>
            Drop PDF or CSV
            <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>click to select file</span>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: 'none' }} />
          </label>

          {parsedRows.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 10 }}>
                Review ({parsedRows.filter(r => r.checked).length} selected)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
                {parsedRows.map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    borderRadius: 12, background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={e => {
                        const next = [...parsedRows];
                        next[i] = { ...next[i], checked: e.target.checked };
                        setParsedRows(next);
                      }}
                      style={{ accentColor: EMERALD }}
                    />
                    <span style={{ fontSize: 11, color: '#71717a', flexShrink: 0 }}>{row.date}</span>
                    <span style={{ flex: 1, fontSize: 12, color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.description}</span>
                    <span style={{ fontSize: 13, color: '#e4e4e7', fontWeight: 500, flexShrink: 0 }}>
                      {currency}{row.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleImport}
                disabled={importing || parsedRows.filter(r => r.checked).length === 0}
                style={{
                  width: '100%', marginTop: 14, padding: '14px 20px', borderRadius: 14,
                  border: `1px solid ${EMERALD}30`,
                  background: 'rgba(45,212,160,0.06)',
                  color: EMERALD, fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {importing ? 'Importing...' : `IMPORT ${parsedRows.filter(r => r.checked).length} TRANSACTIONS`}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
