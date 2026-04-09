import React, { createContext, useContext, useMemo } from 'react';
import { useDbWallets, useDbTransactions } from '../hooks/useFinanceQueries';
import type { DbWallet, DbTransaction } from '../lib/db';

interface FinanceContextValue {
  wallets: DbWallet[];
  transactions: DbTransaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  isLoading: boolean;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { data: wallets = [], isLoading: wLoading } = useDbWallets();
  const { data: transactions = [], isLoading: tLoading } = useDbTransactions();

  const totalBalance = useMemo(() => wallets.reduce((sum, w) => sum + w.balance, 0), [wallets]);
  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);

  return (
    <FinanceContext.Provider value={{ wallets, transactions, totalBalance, totalIncome, totalExpenses, isLoading: wLoading || tLoading }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider');
  return ctx;
}
