import { z } from "zod";

export const transportModeSchema = z.enum(["shuttle", "bus", "mtr", "ferry", "cable", "walk", "flight"]);

const timelineItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  leg: z.object({ modes: z.array(transportModeSchema).min(1), text: z.string() }).optional(),
  warn: z.string().optional(),
  key: z.boolean().optional(),
  places: z.array(z.string()).default([]),
});

const daySchema = z.object({
  n: z.number().int().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weekday: z.string(),
  title: z.string(),
  short: z.string(),
  summary: z.string(),
  accent: z.enum(["teal", "rose", "amber", "navy"]),
  transport: z.string(),
  intensity: z.string(),
  budget: z.string(),
  cover: z.string(),
  items: z.array(timelineItemSchema).min(1),
  notes: z.array(z.string()).default([]),
  route: z.array(z.string()).min(1),
});

const factSchema = z.object({ label: z.string(), value: z.string(), source: z.enum(["plan", "research"]) });

const updateSchema = z.object({
  id: z.string(),
  days: z.array(z.number().int().min(1).max(4)),
  places: z.array(z.string()),
  level: z.enum(["warn", "tip", "ok"]),
  title: z.string(),
  text: z.string(),
  sources: z.array(z.string().url()).min(1),
});

const labelled = z.object({ label: z.string(), value: z.string(), note: z.string() });

export const contentSchema = z.object({
  meta: z.object({
    title: z.string(),
    tagline: z.string(),
    owner: z.string(),
    nights: z.string(),
    flights: z.array(z.object({ label: z.string(), route: z.string(), note: z.string() })),
    highlight: labelled,
    budgetHeadline: labelled,
    transportLine: z.string(),
    overview: z.string(),
  }),
  days: z.array(daySchema).length(4),
  paceCheck: z.array(z.object({ day: z.string(), text: z.string(), verdict: z.string() })),
  budget: z.object({
    rate: z.number(),
    rows: z.array(z.object({ item: z.string(), hkd: z.number(), thb: z.number() })),
    total: z.object({ hkd: z.number(), thb: z.number() }),
    leftover: z.object({ hkd: z.number(), thb: z.number(), label: z.string() }),
    perDay: z.array(z.object({ day: z.number(), hkd: z.number() })),
    excluded: z.string(),
  }),
  checklist: z.object({
    book: z.array(z.string()),
    pack: z.array(z.string()),
    routes: z.array(z.object({ label: z.string(), text: z.string() })),
  }),
  updates: z.array(updateSchema),
  practical: z.array(z.object({ title: z.string(), text: z.string(), source: z.string().url() })),
  places: z.record(
    z.string(),
    z.object({
      nameLocal: z.string().optional(),
      intro: z.string(),
      address: z.string().optional(),
      facts: z.array(factSchema).default([]),
      highlights: z.array(z.string()).default([]),
      tips: z.array(z.string()).default([]),
      verifyNote: z.string().optional(),
    }),
  ),
});

export const placeBaseSchema = z.object({
  slug: z.string(),
  area: z.enum(["airport", "lantau", "disney", "island", "kowloon", "transit"]),
  kind: z.enum(["sight", "ride", "food", "shop", "transit", "hotel", "show"]),
  lat: z.number(),
  lng: z.number(),
  nameEn: z.string(),
  nameZh: z.string().optional(),
  officialUrl: z.string().url().optional(),
  sources: z.array(z.string().url()).default([]),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

export const photoSchema = z.object({
  src: z.string(),
  thumb: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
  artist: z.string(),
  license: z.string(),
  licenseUrl: z.string().optional(),
  page: z.string().url(),
});

export type Content = z.infer<typeof contentSchema>;
export type Day = Content["days"][number];
export type TimelineItem = Day["items"][number];
export type TransportMode = z.infer<typeof transportModeSchema>;
export type Update = Content["updates"][number];
export type Fact = z.infer<typeof factSchema>;
export type PlaceBase = z.infer<typeof placeBaseSchema>;
export type Photo = z.infer<typeof photoSchema>;

/** A place with its locale text merged in, ready to render. */
export type Place = PlaceBase & Content["places"][string] & { name: string; altNames: string[] };
