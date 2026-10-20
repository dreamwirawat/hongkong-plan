import type { Update } from "@/content/schema";
import type { Dict } from "@/i18n/dict";
import { fill } from "@/i18n/format";

const LEVEL = {
  warn: { icon: "⚠️", cls: "border-l-rose" },
  tip: { icon: "💡", cls: "border-l-amber" },
  ok: { icon: "✅", cls: "border-l-teal" },
} as const;

export function UpdatesPanel({ updates, t, dayWord, title }: { updates: Update[]; t: Dict["updates"]; dayWord: string; title?: string }) {
  if (updates.length === 0) return null;
  return (
    <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-semibold">{title ?? t.title}</h2>
        <span className="text-xs text-muted">{t.subtitle}</span>
      </div>
      <ul className="space-y-2.5">
        {updates.map((u) => {
          const l = LEVEL[u.level];
          return (
            <li key={u.id} className={`rounded-lg border border-line border-l-4 ${l.cls} bg-paper/60 p-3`}>
              <p className="font-semibold leading-snug">
                <span aria-hidden>{l.icon}</span> {u.title}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{u.text}</p>
              <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                <span className="text-muted">
                  {t[u.level]}
                  {u.days.length ? ` · ${u.days.map((n) => fill(dayWord, { n })).join(", ")}` : ""}
                </span>
                {u.sources.map((s) => (
                  <a key={s} href={s} target="_blank" rel="noreferrer" className="max-w-[16rem] truncate text-teal hover:underline">
                    {new URL(s).hostname.replace(/^www\./, "")}
                  </a>
                ))}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
