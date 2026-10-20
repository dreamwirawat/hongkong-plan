"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from "@/i18n/config";

function pickLocale(): Locale {
  for (const lang of navigator.languages ?? [navigator.language]) {
    const l = lang.toLowerCase();
    if (l.startsWith("th")) return "th";
    if (l.startsWith("zh")) return "zh";
    if (l.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function LanguageRedirect() {
  useEffect(() => {
    window.location.replace(`/${pickLocale()}/`);
  }, []);

  return (
    <div className="grid min-h-dvh place-items-center bg-ink p-6 text-white">
      <div className="text-center">
        <p className="font-display text-3xl font-semibold">
          Hong Kong <span className="text-amber">25–28</span> Nov 2026
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {LOCALES.map((l) => (
            <a key={l} href={`/${l}/`} className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
              {LOCALE_META[l].label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
