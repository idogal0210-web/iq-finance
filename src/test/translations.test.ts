import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';

const EN_KEYS = Object.keys(translations.en) as (keyof typeof translations.en)[];

describe('translations', () => {
  it('Hebrew has all keys present in English', () => {
    EN_KEYS.forEach(key => {
      expect(translations.he).toHaveProperty(key);
    });
  });

  it('no translation value is an empty string', () => {
    EN_KEYS.forEach(key => {
      expect(translations.en[key]).not.toBe('');
      expect(translations.he[key]).not.toBe('');
    });
  });

  it('English and Hebrew values differ for user-visible strings', () => {
    const sameCount = EN_KEYS.filter(k => translations.en[k] === translations.he[k]).length;
    // A few keys (like version numbers) may be identical — but not most
    expect(sameCount).toBeLessThan(EN_KEYS.length / 2);
  });
});
