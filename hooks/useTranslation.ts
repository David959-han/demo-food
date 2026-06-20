'use client';

// Thin hook over I18nContext.
// Usage:
//   const { t, language, setLanguage } = useTranslation();
//   t('nav.dashboard')  // ✓  autocomplete, compile-time safe
//   t('nav.typo')       // ✗  TypeScript error

export { useI18n as useTranslation } from '@/context/I18nContext';
export type { I18nContextValue as TranslationContext } from '@/context/I18nContext';
