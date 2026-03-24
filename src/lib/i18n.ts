export const SUPPORTED_LOCALES = ["hr", "en"] as const;
export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0];

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const isLocale = (value: string): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale);
