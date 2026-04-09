import {
  mockBalance,
  GROWTH_POINTS,
  mockTransactions,
  mockAssets,
  mockCards,
} from '../data/mockData';
import type { Transaction, Asset, Card } from '../types';

export interface BalanceData {
  targetBalance: number;
  income: number;
  expenses: number;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchBalance(): Promise<BalanceData> {
  await delay(200);
  return mockBalance;
}

export async function fetchGrowthPoints(): Promise<number[]> {
  await delay(150);
  return GROWTH_POINTS;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(180);
  return mockTransactions;
}

export async function fetchAssets(): Promise<Asset[]> {
  await delay(200);
  return mockAssets;
}

export async function fetchCards(): Promise<Card[]> {
  await delay(120);
  return mockCards;
}
