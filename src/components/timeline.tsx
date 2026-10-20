import Image from "next/image";
import Link from "next/link";
import { getCover, getPlace } from "@/content";
import type { TimelineItem } from "@/content/schema";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { MODE_ICON } from "@/lib/ui";

export function Timeline({ items, accentHex, locale }: { items: TimelineItem[]; accentHex: string; locale: Locale }) {
  const t = getDict(locale).common;
  return (
    <ol className="relative">
      {items.map((item, idx) => (
        <li key={`${item.time}-${idx}`} className="relative grid grid-cols-[3.75rem_1.5rem_1fr] gap-x-2 pb-7 last:pb-0 sm:grid-cols-[5.5rem_1.75rem_1fr] sm:gap-x-3">
          <div className="pt-0.5 text-right font-display text-[15px] font-semibold tabular-nums sm:text-base">{item.time}</div>
          <div className="relative flex justify-center">
            {idx < items.length - 1 ? <span className="absolute top-5 bottom-[-1.75rem] w-0.5 bg-line" aria-hidden /> : null}
            <span
              className="relative mt-1 h-4 w-4 rounded-full border-[3px] bg-paper"
              style={item.key ? { background: "#d62839", borderColor: "#d62839" } : { borderColor: accentHex }}
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug">{item.title}</h3>
            {item.detail ? <p className="mt-1 text-[15px] leading-relaxed text-ink-soft/85">{item.detail}</p> : null}
            <div className="mt-2 flex flex-wrap gap-2">
              {item.leg ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-teal/10 px-2 py-1 text-xs font-medium text-teal">
                  <span aria-hidden>{item.leg.modes.map((m) => MODE_ICON[m]).join(" ")}</span>
                  {item.leg.text}
                </span>
              ) : null}
              {item.warn ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-rose/10 px-2 py-1 text-xs font-medium text-rose">⚠️ {item.warn}</span>
              ) : null}
            </div>
            {item.places.length ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {item.places.map((slug) => {
                  const place = getPlace(locale, slug);
                  const cover = getCover(slug);
                  return (
                    <Link
                      key={slug}
                      href={href(locale, `/place/${slug}/`)}
                      className="group flex w-64 shrink-0 items-center gap-2.5 rounded-xl border border-line bg-card p-1.5 pr-3 transition hover:border-ink/30 hover:shadow-sm"
                    >
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-line">
                        {cover ? <Image src={cover.thumb} alt={cover.alt} fill sizes="64px" className="object-cover" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="line-clamp-1 text-sm font-semibold group-hover:underline">{place.name}</span>
                        <span className="line-clamp-1 text-xs text-muted">{place.altNames[0] ?? t.details}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
