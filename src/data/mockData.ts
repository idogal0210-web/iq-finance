import { Building2, PiggyBank, BarChart3, Zap, Briefcase, ArrowDownLeft, TrendingUp, Repeat } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import type { Transaction, Asset, Card } from '../types';

export const GROWTH_POINTS: number[] = [
  125000, 126200, 124800, 127400, 128900, 127200, 129800, 131400, 130200, 132800,
  134100, 133000, 135600, 136800, 135200, 137900, 139400, 138100, 140200, 141800,
  140400, 142100, 141200, 143400, 142800, 144100, 143600, 145200, 143900, 142650,
];

export const mockBalance = { targetBalance: 142650, income: 24000, expenses: 8120 };

export function getTransactions(l: TranslationStrings): Transaction[] {
  return [
    { icon: Briefcase,     title: l.salary,   subtitle: l.salarySub,   amount: "18,500", positive: true  },
    { icon: ArrowDownLeft, title: l.transfer,  subtitle: l.transferSub, amount: "4,500",  positive: true  },
    { icon: TrendingUp,    title: l.invest,    subtitle: l.investSub,   amount: "2,340",  positive: true  },
    { icon: Repeat,        title: l.sub,       subtitle: l.subSub,      amount: "120",    positive: false },
  ];
}

export function getAssets(l: TranslationStrings): Asset[] {
  return [
    { icon: Building2, label: l.liquidity, name: l.checking,    balance: 42300, change: `+1.2% ${l.vsLastMonth}`, positive: true  },
    { icon: PiggyBank, label: l.safety,    name: l.savings,     balance: 67800, change: `+0.8% ${l.vsLastMonth}`, positive: true  },
    { icon: BarChart3, label: l.growth,    name: l.investments, balance: 28150, change: `+4.7% ${l.vsLastMonth}`, positive: true  },
    { icon: Zap,       label: l.highVol,   name: l.crypto,      balance: 4400,  change: `-12.3% ${l.vsLastMonth}`, positive: false },
  ];
}

export function getCards(l: TranslationStrings): Card[] {
  return [
    { last4: "4821", type: l.cardChecking },
    { last4: "7734", type: l.cardSavings  },
    { last4: "2209", type: l.cardInvest   },
  ];
}

// Raw mock data for React Query (language-independent)
export const mockTransactions = getTransactions({
  salary: "Monthly Salary", salarySub: "Deposit • March 1",
  transfer: "External Transfer", transferSub: "Direct • March 11",
  invest: "Investment Return", investSub: "Portfolio • Q1",
  sub: "Studio Subscription", subSub: "Recurring • Today",
} as TranslationStrings);

export const mockAssets = getAssets({
  liquidity: "Liquidity", checking: "Checking Account", vsLastMonth: "vs last month",
  safety: "Safety", savings: "Savings",
  growth: "Growth", investments: "Strategic Investments",
  highVol: "High Volatility", crypto: "Crypto",
} as TranslationStrings);

export const mockCards: Card[] = [
  { last4: "4821", type: "Checking" },
  { last4: "7734", type: "Savings"  },
  { last4: "2209", type: "Investment" },
];
