import Link from "next/link";
import { getContent } from "@/content";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill } from "@/i18n/format";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDict(locale).footer;
  return (
    <footer className="no-print mt-16 border-t border-line bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{fill(t.line, { owner: getContent(locale).meta.owner })}</p>
        <p>
          {t.photos} ·{" "}
          <Link href={href(locale, "/credits/")} className="underline underline-offset-2 hover:text-ink">
            {t.credits}
          </Link>{" "}
          · {t.map}
        </p>
      </div>
    </footer>
  );
}
