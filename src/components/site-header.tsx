"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_META, href, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dict";
import { fill } from "@/i18n/format";

export function SiteHeader({ locale, nav, days }: { locale: Locale; nav: Dict["nav"]; days: number[] }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "") || "/";

  const items = [
    { path: "/", label: nav.overview },
    ...days.map((n) => ({ path: `/day/${n}/`, label: fill(nav.day, { n }) })),
    { path: "/map/", label: nav.map },
    { path: "/budget/", label: nav.budget },
    { path: "/checklist/", label: nav.checklist },
  ];
  const isActive = (path: string) => (path === "/" ? rest === "/" : rest.startsWith(path));

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link href={href(locale)} className="shrink-0 font-display text-lg font-semibold tracking-tight">
          HK<span className="text-amber">·</span>2026
        </Link>
        <nav className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
          {items.map((item) => (
            <Link
              key={item.path}
              href={href(locale, item.path)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive(item.path) ? "bg-amber font-semibold text-ink" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div role="group" aria-label={nav.language} className="flex shrink-0 rounded-full bg-white/10 p-0.5 text-xs">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={href(l, rest)}
              hrefLang={LOCALE_META[l].htmlLang}
              aria-current={l === locale ? "true" : undefined}
              className={`rounded-full px-2 py-1 ${l === locale ? "bg-white font-semibold text-ink" : "text-white/75 hover:text-white"}`}
            >
              {LOCALE_META[l].label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
