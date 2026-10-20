import Image from "next/image";
import Link from "next/link";
import { DayCard } from "@/components/day-card";
import { PhotoCredit } from "@/components/photo-credit";
import { RouteSchematic } from "@/components/route-schematic";
import { SectionHead } from "@/components/section-head";
import { TripMap } from "@/components/trip-map";
import { UpdatesPanel } from "@/components/updates-panel";
import { getContent, getCover } from "@/content";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill, formatNumber } from "@/i18n/format";
import { ACCENT } from "@/lib/ui";
import { tripPoints } from "@/lib/map-points";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = getDict(locale);
  const { meta, days, paceCheck, budget, checklist, updates } = getContent(locale);
  const hero = getCover("symphony-of-lights");
  const num = (n: number) => formatNumber(locale, n);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {hero ? <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="-z-10 object-cover opacity-45" /> : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:pb-14 sm:pt-20">
          <p className="font-display text-sm font-medium tracking-[0.2em] text-amber">HONG KONG · {meta.nights}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.15] sm:text-6xl">{meta.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{meta.tagline}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {meta.flights.map((f) => (
              <InfoCard key={f.label} label={f.label} value={f.route} note={f.note} />
            ))}
            <InfoCard {...meta.highlight} />
            <InfoCard {...meta.budgetHeadline} />
          </div>
          <p className="mt-6 text-sm text-white/70">
            {t.home.madeFor} <b className="text-white">{meta.owner}</b> · {meta.transportLine}
          </p>
          {hero ? <PhotoCredit photo={hero} className="mt-3 text-white/45" /> : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <SectionHead kicker={t.home.overviewKicker} title={t.home.overviewTitle} />
        <p className="max-w-3xl leading-relaxed text-ink-soft">{meta.overview}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {days.map((d) => (
            <DayCard key={d.n} day={d} locale={locale} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-10">
        <UpdatesPanel updates={updates} t={t.updates} dayWord={t.common.dayN} />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <SectionHead kicker={t.home.mapKicker} title={t.home.mapTitle} />
        <div className="mb-3 flex flex-wrap gap-3 text-sm">
          {days.map((d) => (
            <span key={d.n} className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: ACCENT[d.accent].hex }} />
              {fill(t.common.dayN, { n: d.n })} · {d.short}
            </span>
          ))}
        </div>
        <TripMap points={tripPoints(locale)} height={460} detailsLabel={t.common.detailsArrow} />
        <p className="mt-2 text-xs text-muted">
          {t.home.mapHint}{" "}
          <Link href={href(locale, "/map/")} className="font-semibold text-teal underline-offset-2 hover:underline">
            {t.home.mapOpen}
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <SectionHead kicker={t.home.schematicKicker} title={t.home.schematicTitle} />
        <RouteSchematic t={t.schematic} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <SectionHead kicker={t.home.paceKicker} title={t.home.paceTitle} />
        <p className="mb-4 text-ink-soft">{t.home.paceIntro}</p>
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {paceCheck.map((row) => (
            <div key={row.day} className="grid gap-1 p-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <p className="font-display font-semibold text-rose">{row.day}</p>
              <p className="leading-relaxed text-ink-soft">
                {row.text} <span className="font-semibold text-teal">→ {row.verdict}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pt-14 sm:grid-cols-2">
        <Link href={href(locale, "/budget/")} className="group rounded-2xl border border-line bg-card p-5 transition hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose">{t.home.budgetKicker}</p>
          <p className="mt-2 font-display text-3xl font-semibold">
            ~HK${num(budget.total.hkd)}{" "}
            <span className="text-lg text-muted">
              ≈ {num(budget.total.thb)} {t.home.thbUnit}
            </span>
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {fill(t.home.budgetLeft, { hkd: num(budget.leftover.hkd), thb: num(budget.leftover.thb) })}{" "}
            <span className="font-semibold text-teal group-hover:underline">{t.home.budgetMore}</span>
          </p>
        </Link>
        <Link href={href(locale, "/checklist/")} className="group rounded-2xl border border-line bg-card p-5 transition hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose">{t.home.checklistKicker}</p>
          <p className="mt-2 font-display text-3xl font-semibold">{t.home.checklistTitle}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {fill(t.home.checklistText, { book: checklist.book.length, pack: checklist.pack.length })}{" "}
            <span className="font-semibold text-teal group-hover:underline">{t.home.checklistOpen}</span>
          </p>
        </Link>
      </section>
    </>
  );
}

function InfoCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold text-amber">{label}</p>
      <p className="mt-1.5 text-lg font-semibold leading-snug">{value}</p>
      <p className="mt-0.5 text-sm text-white/70">{note}</p>
    </div>
  );
}
