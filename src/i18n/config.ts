export const LOCALES = ["th", "en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "th";

export const LOCALE_META: Record<Locale, { label: string; htmlLang: string; intl: string }> = {
  th: { label: "ไทย", htmlLang: "th", intl: "th-TH-u-ca-gregory" },
  en: { label: "EN", htmlLang: "en", intl: "en-GB" },
  zh: { label: "繁中", htmlLang: "zh-Hant-HK", intl: "zh-Hant-HK" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefix an in-site path with the locale, e.g. href("en", "/day/1/") → "/en/day/1/". */
export function href(locale: Locale, path = "/") {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
