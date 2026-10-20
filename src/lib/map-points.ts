import type { MapPoint } from "@/components/trip-map";
import { getContent, getPlace } from "@/content";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill } from "@/i18n/format";
import { ACCENT } from "@/lib/ui";

function point(locale: Locale, slug: string, label: string, color: string, sub?: string): MapPoint {
  const p = getPlace(locale, slug);
  return { slug, name: p.name, sub: sub ?? p.altNames[0], lat: p.lat, lng: p.lng, label, color, href: href(locale, `/place/${slug}/`) };
}

export function dayPoints(locale: Locale, n: number): MapPoint[] {
  const day = getContent(locale).days.find((d) => d.n === n);
  if (!day) return [];
  return day.route.map((slug, i) => point(locale, slug, String(i + 1), ACCENT[day.accent].hex));
}

export function dayPath(locale: Locale, n: number) {
  const day = getContent(locale).days.find((d) => d.n === n);
  if (!day) return [];
  return [{ color: ACCENT[day.accent].hex, positions: dayPoints(locale, n).map((p) => [p.lat, p.lng] as [number, number]) }];
}

/** One pin per place across the trip, coloured by the first day it appears. */
export function tripPoints(locale: Locale): MapPoint[] {
  const dayWord = getDict(locale).common.dayN;
  const seen = new Set<string>();
  const out: MapPoint[] = [];
  for (const day of getContent(locale).days) {
    for (const slug of day.route) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push(point(locale, slug, String(day.n), ACCENT[day.accent].hex, fill(dayWord, { n: day.n })));
    }
  }
  return out;
}
