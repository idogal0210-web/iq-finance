import { useQuery } from '@tanstack/react-query';
import {
  fetchBalance,
  fetchGrowthPoints,
  fetchTransactions,
  fetchAssets,
  fetchCards,
} from '../services/financeService';
import { fetchCategories, fetchSubcategories, fetchWallets, fetchTransactions as fetchDbTransactions } from '../lib/db';

export function useBalance() {
  return useQuery({ queryKey: ['balance'], queryFn: fetchBalance, staleTime: 60_000 });
}

export function useGrowthPoints() {
  return useQuery({ queryKey: ['growth'], queryFn: fetchGrowthPoints, staleTime: 60_000 });
}

export function useTransactions() {
  return useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions, staleTime: 30_000 });
}

export function useAssets() {
  return useQuery({ queryKey: ['assets'], queryFn: fetchAssets, staleTime: 30_000 });
}

export function useCards() {
  return useQuery({ queryKey: ['cards'], queryFn: fetchCards, staleTime: 60_000 });
}

export function useDbCategories() {
  return useQuery({ queryKey: ['db-categories'], queryFn: fetchCategories, staleTime: 60_000 });
}

export function useDbSubcategories() {
  return useQuery({ queryKey: ['db-subcategories'], queryFn: fetchSubcategories, staleTime: 60_000 });
}

export function useDbWallets() {
  return useQuery({ queryKey: ['db-wallets'], queryFn: fetchWallets, staleTime: 30_000 });
}

export function useDbTransactions() {
  return useQuery({ queryKey: ['db-transactions'], queryFn: fetchDbTransactions, staleTime: 10_000 });
}
