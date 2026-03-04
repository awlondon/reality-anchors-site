/**
 * Internationalization (i18n) scaffold.
 *
 * Provides a lightweight translation system ready for expansion.
 * Currently serves English only. To add a new language:
 *   1. Create a new file in lib/i18n/locales/ (e.g., es.ts)
 *   2. Add translations matching the keys in en.ts
 *   3. Import and register in the LOCALES map below
 *
 * Usage:
 *   import { t } from '@/lib/i18n';
 *   t('hero.headline')
 */

import en from './locales/en';

type TranslationKeys = keyof typeof en;

const LOCALES: Record<string, Record<string, string>> = {
  en,
};

let currentLocale = 'en';

export function setLocale(locale: string) {
  if (LOCALES[locale]) {
    currentLocale = locale;
  }
}

export function getLocale(): string {
  return currentLocale;
}

export function t(key: TranslationKeys): string {
  return LOCALES[currentLocale]?.[key] ?? LOCALES.en[key] ?? key;
}

export function getSupportedLocales(): string[] {
  return Object.keys(LOCALES);
}
