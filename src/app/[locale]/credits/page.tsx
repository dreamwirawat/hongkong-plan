import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/section-head";
import { allPhotos, getPlace } from "@/content";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";
import { fill } from "@/i18n/format";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: getDict((await params).locale as Locale).credits.title };
}

export default async function CreditsPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  const t = getDict(locale).credits;
  const photos = allPhotos();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <SectionHead kicker={t.kicker} title={fill(t.heading, { n: photos.length })} />
      <p className="mb-6 max-w-3xl text-ink-soft">{t.intro}</p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map(({ slug, photo }) => (
          <li key={photo.src} className="flex gap-3 rounded-xl border border-line bg-card p-2">
            <a href={photo.page} target="_blank" rel="noreferrer" className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-line">
              <Image src={photo.thumb} alt={photo.alt} fill sizes="96px" className="object-cover" />
            </a>
            <div className="min-w-0 text-xs leading-relaxed">
              <Link href={href(locale, `/place/${slug}/`)} className="font-semibold text-ink hover:underline">
                {getPlace(locale, slug).name}
              </Link>
              <p className="truncate text-muted">📷 {photo.artist}</p>
              <p className="truncate">
                {photo.licenseUrl ? (
                  <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="text-teal hover:underline">
                    {photo.license}
                  </a>
                ) : (
                  photo.license
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
