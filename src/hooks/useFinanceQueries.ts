import { useQuery } from '@tanstack/react-query';
import {
  fetchBalance,
  fetchGrowthPoints,
  fetchTransactions,
  fetchAssets,
  fetchCards,
} from '../services/financeService';

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
