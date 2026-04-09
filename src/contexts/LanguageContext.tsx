import React, { createContext, useContext, useCallback, useState } from 'react';
import type { Lang } from '../types';
import { translations } from '../i18n/translations';
import type { TranslationStrings } from '../i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  isRtl: boolean;
  t: TranslationStrings;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const isRtl = lang === 'he';
  const t = translations[lang];
  const toggleLang = useCallback(() => setLang(prev => prev === 'en' ? 'he' : 'en'), []);
  return (
    <LanguageContext.Provider value={{ lang, isRtl, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
