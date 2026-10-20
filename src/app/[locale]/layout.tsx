import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getContent } from "@/content";
import { LOCALES, LOCALE_META, isLocale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fontVariables } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    title: { default: t.siteTitle, template: `%s · ${t.siteTitle}` },
    description: t.siteDescription,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [LOCALE_META[l].htmlLang, `/${l}/`])) },
  };
}

export const viewport: Viewport = { themeColor: "#14213d" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const days = getContent(locale).days.map((d) => d.n);

  return (
    <html lang={LOCALE_META[locale].htmlLang} className={`${fontVariables} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <SiteHeader locale={locale} nav={t.nav} days={days} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
