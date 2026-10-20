import type { Metadata } from "next";
import { SectionHead } from "@/components/section-head";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill, formatNumber } from "@/i18n/format";
import { ACCENT } from "@/lib/ui";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: getDict((await params).locale as Locale).budget.title };
}

export default async function BudgetPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  const t = getDict(locale);
  const { budget, days, meta } = getContent(locale);
  const num = (n: number) => formatNumber(locale, n);
  const maxDay = Math.max(...budget.perDay.map((d) => d.hkd));

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8">
      <SectionHead kicker={t.budget.kicker} title={t.budget.heading} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={t.budget.set} value="HK$2,300" sub={t.budget.setValue} />
        <Stat label={t.budget.used} value={`~HK$${num(budget.total.hkd)}`} sub={`≈ ${num(budget.total.thb)} ${t.home.thbUnit}`} />
        <Stat label={budget.leftover.label} value={`~HK$${num(budget.leftover.hkd)}`} sub={`≈ ${num(budget.leftover.thb)} ${t.home.thbUnit}`} accent />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-ink text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.budget.item}</th>
              <th className="px-4 py-3 text-right font-semibold">HKD</th>
              <th className="px-4 py-3 text-right font-semibold">{fill(t.budget.thb, { rate: budget.rate })}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {budget.rows.map((r) => (
              <tr key={r.item}>
                <td className="px-4 py-3">{r.item}</td>
                <td className="px-4 py-3 text-right tabular-nums">~{num(r.hkd)}</td>
                <td className="px-4 py-3 text-right tabular-nums">~{num(r.thb)}</td>
              </tr>
            ))}
            <tr className="bg-paper font-semibold">
              <td className="px-4 py-3">{t.budget.total}</td>
              <td className="px-4 py-3 text-right tabular-nums">~{num(budget.total.hkd)}</td>
              <td className="px-4 py-3 text-right tabular-nums">~{num(budget.total.thb)}</td>
            </tr>
            <tr className="bg-teal/10 font-semibold text-teal">
              <td className="px-4 py-3">{budget.leftover.label}</td>
              <td className="px-4 py-3 text-right tabular-nums">~{num(budget.leftover.hkd)}</td>
              <td className="px-4 py-3 text-right tabular-nums">~{num(budget.leftover.thb)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">{budget.excluded}</p>

      <h2 className="mb-3 mt-10 font-display text-xl font-semibold">{t.budget.perDay}</h2>
      <div className="space-y-3 rounded-2xl border border-line bg-card p-4">
        {budget.perDay.map((d) => {
          const day = days.find((x) => x.n === d.day)!;
          return (
            <div key={d.day} className="grid grid-cols-[5.5rem_1fr_4.5rem] items-center gap-3 text-sm">
              <span className="font-semibold">{fill(t.common.dayN, { n: d.day })}</span>
              <span className="h-3 overflow-hidden rounded-full bg-paper">
                <span className="block h-full rounded-full" style={{ width: `${(d.hkd / maxDay) * 100}%`, background: ACCENT[day.accent].hex }} />
              </span>
              <span className="text-right tabular-nums">≈ HK${num(d.hkd)}</span>
            </div>
          );
        })}
        <p className="pt-1 text-xs text-muted">{t.budget.perDayNote}</p>
      </div>
      <p className="mt-6 text-sm text-ink-soft">{meta.transportLine}</p>
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-teal/30 bg-teal/10" : "border-line bg-card"}`}>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${accent ? "text-teal" : ""}`}>{value}</p>
      <p className="text-sm text-ink-soft">{sub}</p>
    </div>
  );
}
