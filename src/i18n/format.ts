import { LOCALE_META, type Locale } from "./config";

export function formatDate(locale: Locale, iso: string, style: "long" | "short" = "long") {
  const date = new Date(`${iso}T12:00:00+08:00`);
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    weekday: style === "long" ? "long" : "short",
    day: "numeric",
    month: style === "long" ? "long" : "short",
    ...(style === "long" ? { year: "numeric" } : {}),
    timeZone: "Asia/Hong_Kong",
  }).format(date);
}

export function formatNumber(locale: Locale, n: number) {
  return new Intl.NumberFormat(LOCALE_META[locale].intl).format(n);
}

/** Replace {name} placeholders in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? `{${k}}`));
}
