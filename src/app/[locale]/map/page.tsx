import type { Metadata } from "next";
import { MapExplorer } from "@/components/map-explorer";
import { SectionHead } from "@/components/section-head";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill } from "@/i18n/format";
import { ACCENT } from "@/lib/ui";
import { dayPoints, tripPoints } from "@/lib/map-points";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: getDict((await params).locale as Locale).map.title };
}

export default async function MapPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  const t = getDict(locale);
  const layers = getContent(locale).days.map((d) => ({
    n: d.n,
    label: `${fill(t.common.dayN, { n: d.n })} · ${d.short}`,
    color: ACCENT[d.accent].hex,
    points: dayPoints(locale, d.n),
  }));
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <SectionHead kicker={t.map.kicker} title={t.map.heading} />
      <MapExplorer layers={layers} all={tripPoints(locale)} allLabel={t.map.all} detailsLabel={t.common.detailsArrow} />
      <p className="mt-2 text-xs text-muted">{t.map.hint}</p>
    </div>
  );
}
