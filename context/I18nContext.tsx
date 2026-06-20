'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { translations, resolve } from '@/lib/i18n';
import { LANGUAGE_DIRECTION } from '@/types/i18n';
import type { Language, TextDirection, TranslationKey } from '@/types/i18n';

// ── Types ──────────────────────────────────────────────────────────────────

export interface I18nContextValue {
  language:    Language;
  direction:   TextDirection;
  setLanguage: (lang: Language) => void;
  t:           (key: TranslationKey) => string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'restaurant-language';

const VALID_LANGS = new Set<string>(['en', 'uz', 'ru']);

function isLanguage(value: string | null): value is Language {
  return value !== null && VALID_LANGS.has(value);
}

function buildT(language: Language) {
  return (key: TranslationKey): string => {
    const k = key as string;

    const primary = resolve(translations[language] as Record<string, unknown>, k);
    if (primary !== undefined) return primary;

    if (language !== 'en') {
      const fallback = resolve(translations.en as Record<string, unknown>, k);
      if (fallback !== undefined) return fallback;
    }

    return k;
  };
}

// ── Context ────────────────────────────────────────────────────────────────

const I18nContext = createContext<I18nContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start with 'en' on both server and client — avoids SSR/client mismatch.
  // useEffect reads localStorage after hydration and switches to stored language.
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    Promise.resolve(localStorage.getItem(STORAGE_KEY)).then((stored) => {
      if (isLanguage(stored)) setLanguageState(stored);
    });
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  const value: I18nContextValue = {
    language,
    direction: LANGUAGE_DIRECTION[language],
    setLanguage,
    t: buildT(language),
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
