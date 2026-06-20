// ── Base language types ────────────────────────────────────────────────────

export type Language      = 'en' | 'ru' | 'uz';
export type TextDirection = 'ltr' | 'rtl';

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
  uz: "O'zbek",
};

// Static direction map for currently supported languages.
// To add RTL: extend Language type and add the new key here (e.g. ar: 'rtl').
// The runtime RTL_LANGUAGES set in lib/i18n.ts handles dynamic lookups.
export const LANGUAGE_DIRECTION: Record<Language, TextDirection> = {
  en: 'ltr',
  ru: 'ltr',
  uz: 'ltr',
  // ar: 'rtl',
  // fa: 'rtl',
};

// ── Type-safe translation keys ─────────────────────────────────────────────

// en.json is the canonical key source — adding/removing keys there
// automatically updates TranslationKey across the entire codebase.
import type enJson from '@/locales/en.json';

// Recursively derives all dotted leaf paths from a nested object type.
// { nav: { dashboard: string } } → 'nav.dashboard'
type Leaves<T extends object, P extends string = ''> = {
  [K in keyof T & string]:
    T[K] extends string
      ? (P extends '' ? K : `${P}.${K}`)
      : T[K] extends object
        ? Leaves<T[K], P extends '' ? K : `${P}.${K}`>
        : never;
}[keyof T & string];

export type TranslationKey = Leaves<typeof enJson>;
//  ✓  'nav.dashboard'       — valid
//  ✓  'kpi.total_orders'    — valid
//  ✗  'nav.dashborad'       — compile-time error
//  ✗  'kpi.totalorders'     — compile-time error
