import en from '@/locales/en.json';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import type { Language, TextDirection } from '@/types/i18n';

// ── Translations map ───────────────────────────────────────────────────────

export const translations: Record<Language, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  uz: uz as Record<string, unknown>,
  ru: ru as Record<string, unknown>,
};

// ── resolve() ─────────────────────────────────────────────────────────────
// Traverses a nested object by dotted path and returns the leaf string.
// Returns undefined if the path doesn't exist or the leaf isn't a string.

export function resolve(
  obj: Record<string, unknown>,
  path: string,
): string | undefined {
  let current: unknown = obj;
  for (const part of path.split('.')) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

// ── getDirection() ─────────────────────────────────────────────────────────
// RTL_LANGUAGES is the single place to extend when adding RTL locales.
// Currently supported: ar (Arabic), fa (Farsi), he (Hebrew).
// Adding a new RTL language only requires: RTL_LANGUAGES.add('xx')
// plus extending the Language type in types/i18n.ts.

const RTL_LANGUAGES = new Set<string>(['ar', 'fa', 'he']);

export function getDirection(lang: string): TextDirection {
  return RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr';
}
