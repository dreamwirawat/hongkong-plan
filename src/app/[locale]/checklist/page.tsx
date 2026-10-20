import type { Metadata } from "next";
import { ChecklistBoard } from "@/components/checklist-board";
import { SectionHead } from "@/components/section-head";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: getDict((await params).locale as Locale).checklist.title };
}

export default async function ChecklistPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  const t = getDict(locale);
  const { checklist, practical } = getContent(locale);
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8">
      <SectionHead kicker={t.checklist.kicker} title={t.checklist.title} />
      <ChecklistBoard
        groups={[
          { id: "book", title: t.checklist.book, items: checklist.book },
          { id: "pack", title: t.checklist.pack, items: checklist.pack },
        ]}
        clearLabel={t.checklist.clear}
        localOnly={t.checklist.localOnly}
      />
      <aside className="mt-8 rounded-2xl border border-line border-l-4 border-l-amber bg-card p-5">
        <h2 className="font-display text-lg font-semibold">{t.checklist.routes}</h2>
        <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
          {checklist.routes.map((r) => (
            <li key={r.label}>
              <b>{r.label}:</b> {r.text}
            </li>
          ))}
        </ul>
      </aside>
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold">{t.checklist.practical}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {practical.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-card p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.text}</p>
              <a href={p.source} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-teal hover:underline">
                {new URL(p.source).hostname.replace(/^www\./, "")}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
