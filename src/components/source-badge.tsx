import type { Dict } from "@/i18n/dict";

export function SourceBadge({ source, t }: { source: "plan" | "research"; t: Dict["badge"] }) {
  return source === "plan" ? (
    <span className="inline-flex shrink-0 items-center rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-ink-soft">{t.plan}</span>
  ) : (
    <span className="inline-flex shrink-0 items-center rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">{t.research}</span>
  );
}

export function ConfidenceBadge({ level, t }: { level: "verified" | "partial" | "unverified"; t: Dict["badge"] }) {
  const cls = { verified: "bg-teal/10 text-teal", partial: "bg-amber/15 text-[#9a5b06]", unverified: "bg-rose/10 text-rose" }[level];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{t[level]}</span>;
}
