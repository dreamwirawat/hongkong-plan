import Image from "next/image";
import Link from "next/link";
import { getCover } from "@/content";
import type { Day } from "@/content/schema";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill, formatDate } from "@/i18n/format";
import { ACCENT } from "@/lib/ui";

export function DayCard({ day, locale }: { day: Day; locale: Locale }) {
  const t = getDict(locale).common;
  const cover = getCover(day.cover);
  return (
    <Link
      href={href(locale, `/day/${day.n}/`)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] bg-line">
        {cover ? (
          <Image src={cover.thumb} alt={cover.alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : null}
        <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: ACCENT[day.accent].hex }} />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 font-display text-xs font-medium tracking-wide text-white backdrop-blur">
          {fill(t.dayLabel, { n: day.n })}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold text-muted">{formatDate(locale, day.date)}</p>
        <h3 className="mt-1 font-display text-xl font-semibold leading-tight">{day.short}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft/85">{day.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-paper px-2 py-0.5 text-ink-soft">
            {t.intensity} {day.intensity}
          </span>
          <span className="rounded-full bg-paper px-2 py-0.5 text-ink-soft">
            {t.budget} {day.budget}
          </span>
        </div>
      </div>
    </Link>
  );
}
