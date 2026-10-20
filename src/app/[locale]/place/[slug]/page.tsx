import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { ConfidenceBadge, SourceBadge } from "@/components/source-badge";
import { TripMap } from "@/components/trip-map";
import { UpdatesPanel } from "@/components/updates-panel";
import { getContent, getCover, getPhotos, getPlace, getVisits, placeSlugs } from "@/content";
import { LOCALES, href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill, formatDate } from "@/i18n/format";
import { ACCENT } from "@/lib/ui";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => placeSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!placeSlugs().includes(slug)) return {};
  const place = getPlace(locale as Locale, slug);
  return { title: place.name, description: place.intro };
}

export default async function PlacePage({ params }: { params: Params }) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  if (!placeSlugs().includes(slug)) notFound();
  const place = getPlace(locale, slug);
  const t = getDict(locale);

  const photos = getPhotos(place.slug);
  const visits = getVisits(locale, place.slug);
  const firstDay = visits[0]?.day;
  const color = firstDay ? ACCENT[firstDay.accent].hex : "#14213d";
  const related = firstDay ? firstDay.route.filter((s) => s !== place.slug).map((s) => getPlace(locale, s)) : [];
  const updates = getContent(locale).updates.filter((u) => u.places.includes(place.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href={href(locale)} className="hover:text-ink hover:underline">{t.nav.overview}</Link>
        {firstDay ? (
          <>
            <span>/</span>
            <Link href={href(locale, `/day/${firstDay.n}/`)} className="hover:text-ink hover:underline">
              {fill(t.common.dayN, { n: firstDay.n })}
            </Link>
          </>
        ) : null}
        <span>/</span>
        <span className="text-ink">{place.name}</span>
      </nav>

      <header className="mb-5">
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-ink px-2.5 py-1 font-medium text-white">{t.place.area[place.area]}</span>
          <span className="rounded-full bg-line px-2.5 py-1 font-medium text-ink-soft">{t.place.kind[place.kind]}</span>
          <ConfidenceBadge level={place.confidence} t={t.badge} />
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{place.name}</h1>
        <p className="mt-1 text-muted">
          {place.altNames.join(" · ")}
        </p>
      </header>

      <Gallery photos={photos} name={place.name} t={t.gallery} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <section>
            <p className="text-[17px] leading-relaxed text-ink-soft">{place.intro}</p>
            {place.verifyNote ? (
              <p className="mt-3 rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-[#7a4a05]"><b>{t.place.researchNote}</b> {place.verifyNote}</p>
            ) : null}
          </section>

          <UpdatesPanel updates={updates} t={t.updates} dayWord={t.common.dayN} title={t.place.updatesTitle} />

          {visits.length ? (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold">{t.place.visits}</h2>
              <ul className="space-y-2">
                {visits.map(({ day, item }, i) => (
                  <li key={i} className="rounded-xl border border-line bg-card p-3">
                    <Link href={href(locale, `/day/${day.n}/`)} className="group block">
                      <p className="text-xs font-semibold" style={{ color: ACCENT[day.accent].hex }}>
                        {fill(t.common.dayN, { n: day.n })} · {formatDate(locale, day.date, "short")} · {item.time}
                      </p>
                      <p className="mt-0.5 font-semibold group-hover:underline">{item.title}</p>
                      {item.detail ? <p className="mt-1 text-sm text-ink-soft/85">{item.detail}</p> : null}
                      {item.leg ? <p className="mt-1.5 text-xs font-medium text-teal">{item.leg.text}</p> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {place.facts.length ? (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold">{t.place.facts}</h2>
              <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
                {place.facts.map((f) => (
                  <div key={f.label} className="grid gap-1 p-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                    <dt className="text-sm font-semibold text-muted">{f.label}</dt>
                    <dd className="flex flex-wrap items-start justify-between gap-2 text-[15px]">
                      <span className="min-w-0 flex-1 whitespace-pre-line break-words">{f.value}</span>
                      <SourceBadge source={f.source} t={t.badge} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {place.highlights.length ? (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold">{t.place.highlights}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {place.highlights.map((h) => (
                  <li key={h} className="rounded-xl border border-line bg-card p-3 text-[15px] leading-relaxed">
                    ✦ {h}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {place.tips.length ? (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold">{t.place.tips}</h2>
              <ul className="space-y-2">
                {place.tips.map((tip) => (
                  <li key={tip} className="flex gap-2 rounded-xl border border-line border-l-4 border-l-teal bg-card p-3 text-[15px] leading-relaxed">
                    <span aria-hidden>💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-20 lg:self-start">
          <section>
            <TripMap
              points={[{ slug: place.slug, name: place.name, sub: place.altNames[0], lat: place.lat, lng: place.lng, label: "●", color, href: href(locale, `/place/${place.slug}/`) }]}
              detailsLabel={t.common.detailsArrow}
              height={240}
            />
            {place.address ? <p className="mt-2 text-sm text-ink-soft">📍 {place.address}</p> : null}
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-ink px-3 py-1.5 font-medium text-white hover:bg-ink-soft"
              >
                {t.place.googleMaps}
              </a>
              {place.officialUrl ? (
                <a href={place.officialUrl} target="_blank" rel="noreferrer" className="rounded-full border border-line bg-card px-3 py-1.5 font-medium hover:border-ink/30">
                  {t.place.official}
                </a>
              ) : null}
            </div>
          </section>

          {place.sources.length ? (
            <section>
              <h2 className="mb-2 font-display font-semibold">{t.place.sources}</h2>
              <ul className="space-y-1 text-xs">
                {place.sources.map((s) => (
                  <li key={s} className="truncate">
                    <a href={s} target="_blank" rel="noreferrer" className="text-teal hover:underline">
                      {s.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {related.length ? (
            <section>
              <h2 className="mb-2 font-display font-semibold">{fill(t.place.sameDay, { n: firstDay!.n })}</h2>
              <ul className="space-y-1">
                {related.map((p) => {
                  const c = getCover(p.slug);
                  return (
                    <li key={p.slug}>
                      <Link href={href(locale, `/place/${p.slug}/`)} className="group flex items-center gap-2.5 rounded-lg p-1 hover:bg-card">
                        <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md bg-line">
                          {c ? <Image src={c.thumb} alt="" fill sizes="48px" className="object-cover" /> : null}
                        </span>
                        <span className="truncate text-sm group-hover:underline">{p.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
