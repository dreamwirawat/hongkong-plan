import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoCredit } from "@/components/photo-credit";
import { Timeline } from "@/components/timeline";
import { TripMap } from "@/components/trip-map";
import { UpdatesPanel } from "@/components/updates-panel";
import { getContent, getCover, getDay, getPlace } from "@/content";
import { LOCALES, href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill, formatDate } from "@/i18n/format";
import { ACCENT } from "@/lib/ui";
import { dayPath, dayPoints } from "@/lib/map-points";

type Params = Promise<{ locale: string; n: string }>;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getContent(locale).days.map((d) => ({ locale, n: String(d.n) })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, n } = await params;
  const day = getDay(locale as Locale, Number(n));
  if (!day) return {};
  return { title: `${fill(getDict(locale as Locale).common.dayN, { n: day.n })} · ${day.title}`, description: day.summary };
}

export default async function DayPage({ params }: { params: Params }) {
  const { locale: l, n } = await params;
  const locale = l as Locale;
  const day = getDay(locale, Number(n));
  if (!day) notFound();

  const t = getDict(locale);
  const accent = ACCENT[day.accent];
  const cover = getCover(day.cover);
  const prev = getDay(locale, day.n - 1);
  const next = getDay(locale, day.n + 1);
  const stops = day.route.map((slug, i) => ({ i: i + 1, place: getPlace(locale, slug), cover: getCover(slug) }));
  const updates = getContent(locale).updates.filter((u) => u.days.includes(day.n));

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {cover ? <Image src={cover.src} alt={cover.alt} fill priority sizes="100vw" className="-z-10 object-cover" /> : null}
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${accent.gradient} opacity-80 mix-blend-multiply`} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
        <div className="mx-auto flex min-h-[300px] max-w-6xl flex-col justify-end px-4 pb-8 pt-16 sm:min-h-[380px]">
          <p className="font-display text-sm font-medium tracking-[0.15em] text-white/85">
            {fill(t.common.dayLabel, { n: day.n })} · {formatDate(locale, day.date)}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">{day.title}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{day.summary}</p>
          {cover ? <PhotoCredit photo={cover} className="mt-4 text-white/50" /> : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip label={t.common.transport} value={day.transport} />
          <Chip label={t.common.intensity} value={day.intensity} />
          <Chip label={t.common.budgetToday} value={day.budget} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <section className="min-w-0">
            <div className="mb-8">
              <UpdatesPanel updates={updates} t={t.updates} dayWord={t.common.dayN} title={t.day.updatesTitle} />
            </div>
            <h2 className="mb-5 font-display text-2xl font-semibold">{t.day.timeline}</h2>
            <Timeline items={day.items} accentHex={accent.hex} locale={locale} />

            {day.notes.length ? (
              <aside className="mt-8 rounded-xl border border-line border-l-4 border-l-amber bg-card p-4">
                <h3 className="font-display font-semibold">{t.day.rhythm}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-ink-soft">
                  {day.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </section>

          <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
            <h2 className="mb-3 font-display text-xl font-semibold">{t.day.routeToday}</h2>
            <TripMap points={dayPoints(locale, day.n)} path={dayPath(locale, day.n)} height={380} detailsLabel={t.common.detailsArrow} />
            <p className="mt-2 text-xs text-muted">{t.day.routeNote}</p>
            <ol className="mt-4 space-y-1.5">
              {stops.map(({ i, place, cover: c }) => (
                <li key={place.slug}>
                  <Link href={href(locale, `/place/${place.slug}/`)} className="group flex items-center gap-3 rounded-lg p-1.5 hover:bg-card">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: accent.hex }}>
                      {i}
                    </span>
                    <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md bg-line">
                      {c ? <Image src={c.thumb} alt="" fill sizes="48px" className="object-cover" /> : null}
                    </span>
                    <span className="min-w-0 text-sm">
                      <span className="block truncate font-medium group-hover:underline">{place.name}</span>
                      {place.altNames[0] ? <span className="block truncate text-xs text-muted">{place.altNames[0]}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <nav className="mt-14 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={href(locale, `/day/${prev.n}/`)} className="rounded-xl border border-line bg-card p-4 hover:shadow-sm">
              <span className="text-xs text-muted">{t.day.prev}</span>
              <span className="mt-0.5 block font-display font-semibold">
                {fill(t.common.dayN, { n: prev.n })} · {prev.short}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={href(locale, `/day/${next.n}/`)} className="rounded-xl border border-line bg-card p-4 text-right hover:shadow-sm">
              <span className="text-xs text-muted">{t.day.next}</span>
              <span className="mt-0.5 block font-display font-semibold">
                {fill(t.common.dayN, { n: next.n })} · {next.short}
              </span>
            </Link>
          ) : null}
        </nav>
      </div>
    </>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-line bg-card px-3.5 py-1.5 text-sm shadow-sm">
      <span className="text-muted">{label}</span> <b className="font-semibold">{value}</b>
    </span>
  );
}
