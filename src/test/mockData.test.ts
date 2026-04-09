import { describe, it, expect } from 'vitest';
import { getTransactions, getAssets, getCards, mockBalance, GROWTH_POINTS } from '../data/mockData';
import { translations } from '../i18n/translations';

const en = translations.en;
const he = translations.he;

describe('mockBalance', () => {
  it('has correct structure', () => {
    expect(mockBalance).toHaveProperty('targetBalance');
    expect(mockBalance).toHaveProperty('income');
    expect(mockBalance).toHaveProperty('expenses');
    expect(mockBalance.targetBalance).toBeGreaterThan(0);
  });
});

describe('GROWTH_POINTS', () => {
  it('has 30 data points', () => {
    expect(GROWTH_POINTS).toHaveLength(30);
  });

  it('contains only positive numbers', () => {
    GROWTH_POINTS.forEach(p => expect(p).toBeGreaterThan(0));
  });

  it('last point matches mockBalance.targetBalance', () => {
    expect(GROWTH_POINTS[GROWTH_POINTS.length - 1]).toBe(mockBalance.targetBalance);
  });
});

describe('getTransactions', () => {
  it('returns 4 transactions', () => {
    expect(getTransactions(en)).toHaveLength(4);
  });

  it('each transaction has required fields', () => {
    getTransactions(en).forEach(tx => {
      expect(tx).toHaveProperty('icon');
      expect(tx).toHaveProperty('title');
      expect(tx).toHaveProperty('subtitle');
      expect(tx).toHaveProperty('amount');
      expect(typeof tx.positive).toBe('boolean');
    });
  });

  it('translates correctly between en and he', () => {
    const txEn = getTransactions(en);
    const txHe = getTransactions(he);
    expect(txEn[0].title).toBe(en.salary);
    expect(txHe[0].title).toBe(he.salary);
    expect(txEn[0].title).not.toBe(txHe[0].title);
  });
});

describe('getAssets', () => {
  it('returns 4 assets', () => {
    expect(getAssets(en)).toHaveLength(4);
  });

  it('each asset has a numeric balance', () => {
    getAssets(en).forEach(a => {
      expect(typeof a.balance).toBe('number');
      expect(a.balance).toBeGreaterThan(0);
    });
  });
});

describe('getCards', () => {
  it('returns 3 cards', () => {
    expect(getCards(en)).toHaveLength(3);
  });

  it('each card has last4 of 4 digits', () => {
    getCards(en).forEach(c => {
      expect(c.last4).toMatch(/^\d{4}$/);
    });
  });
});
