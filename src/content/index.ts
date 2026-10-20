import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { LOCALES } from "@/i18n/config";
import rawBase from "./places-base.json";
import rawPhotos from "./photos.json";
import rawTh from "./th.json";
import rawEn from "./en.json";
import rawZh from "./zh.json";
import { contentSchema, photoSchema, placeBaseSchema, type Content, type Photo, type Place } from "./schema";

const BASE = z.array(placeBaseSchema).parse(rawBase);
const PHOTOS = z.record(z.string(), z.array(photoSchema)).parse(rawPhotos);
const CONTENT: Record<Locale, Content> = {
  th: contentSchema.parse(rawTh),
  en: contentSchema.parse(rawEn),
  zh: contentSchema.parse(rawZh),
};

const baseIndex = new Map(BASE.map((p) => [p.slug, p]));

/**
 * Translations must not drift from the Thai source: everything that is not prose
 * (slugs, dates, routes, amounts, sources) has to be identical in every locale.
 */
function assertParity() {
  const th = CONTENT.th;
  const structural = (c: Content) =>
    JSON.stringify({
      days: c.days.map((d) => ({
        n: d.n,
        date: d.date,
        accent: d.accent,
        cover: d.cover,
        route: d.route,
        notes: d.notes.length,
        items: d.items.map((i) => ({ places: i.places, modes: i.leg?.modes ?? null, key: !!i.key, warn: !!i.warn, detail: !!i.detail })),
      })),
      pace: c.paceCheck.length,
      budget: { ...c.budget, rows: c.budget.rows.map((r) => [r.hkd, r.thb]), leftover: [c.budget.leftover.hkd, c.budget.leftover.thb], excluded: null },
      checklist: [c.checklist.book.length, c.checklist.pack.length, c.checklist.routes.length],
      updates: c.updates.map((u) => [u.id, u.days, u.places, u.level, u.sources]),
      practical: c.practical.map((p) => p.source),
      places: Object.keys(c.places)
        .sort()
        .map((k) => [k, c.places[k].facts.map((f) => f.source), c.places[k].highlights.length, c.places[k].tips.length, !!c.places[k].verifyNote]),
    });
  const expected = structural(th);
  for (const locale of LOCALES) {
    if (structural(CONTENT[locale]) !== expected) throw new Error(`Content for "${locale}" does not match the structure of "th"`);
  }
  for (const slug of baseIndex.keys()) {
    if (!th.places[slug]) throw new Error(`Place "${slug}" has no text`);
  }
  for (const day of th.days) {
    for (const slug of [...day.route, day.cover, ...day.items.flatMap((i) => i.places)]) {
      if (!baseIndex.has(slug)) throw new Error(`Day ${day.n} references unknown place "${slug}"`);
    }
  }
}
assertParity();

export function getContent(locale: Locale): Content {
  return CONTENT[locale];
}

export function getDay(locale: Locale, n: number) {
  return CONTENT[locale].days.find((d) => d.n === n);
}

export function getPlace(locale: Locale, slug: string): Place {
  const base = baseIndex.get(slug);
  const text = CONTENT[locale].places[slug];
  if (!base || !text) throw new Error(`Unknown place slug: ${slug}`);
  const name = locale === "zh" && base.nameZh ? base.nameZh : base.nameEn;
  const altNames = [
    locale === "zh" ? base.nameEn : undefined,
    text.nameLocal && text.nameLocal !== name ? text.nameLocal : undefined,
    locale !== "zh" ? base.nameZh : undefined,
  ].filter((v): v is string => !!v);
  return { ...base, ...text, name, altNames };
}

export function listPlaces(locale: Locale): Place[] {
  return BASE.map((p) => getPlace(locale, p.slug));
}

export function placeSlugs() {
  return BASE.map((p) => p.slug);
}

export function getPhotos(slug: string): Photo[] {
  return PHOTOS[slug] ?? [];
}

export function getCover(slug: string): Photo | undefined {
  return PHOTOS[slug]?.[0];
}

export function allPhotos() {
  return Object.entries(PHOTOS).flatMap(([slug, list]) => list.map((photo) => ({ slug, photo })));
}

/** Every timeline slot that references a place, so its page can show when it is visited. */
export function getVisits(locale: Locale, slug: string) {
  return CONTENT[locale].days.flatMap((day) => day.items.filter((item) => item.places.includes(slug)).map((item) => ({ day, item })));
}
