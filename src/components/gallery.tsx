"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/content/schema";
import type { Dict } from "@/i18n/dict";
import { fill } from "@/i18n/format";
import { PhotoCredit } from "./photo-credit";

export function Gallery({ photos, name, t }: { photos: Photo[]; name: string; t: Dict["gallery"] }) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    // event.code keeps working on a Thai keyboard layout
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") setOpen(null);
      else if (e.code === "ArrowRight") step(1);
      else if (e.code === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  if (photos.length === 0) {
    return (
      <div className="grid aspect-[16/7] place-items-center rounded-2xl border border-dashed border-line bg-card text-sm text-muted">
        {t.empty}
      </div>
    );
  }

  const [hero, ...rest] = photos;
  const current = open === null ? null : photos[open];

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => setOpen(0)}
          className={`group relative overflow-hidden rounded-2xl bg-line ${rest.length ? "sm:col-span-3 sm:row-span-2" : "sm:col-span-4 sm:row-span-2"} aspect-[4/3] sm:aspect-auto sm:min-h-[420px]`}
        >
          <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width:640px) 75vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        </button>
        {rest.slice(0, 2).map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i + 1)}
            className="group relative hidden overflow-hidden rounded-2xl bg-line sm:block"
          >
            <Image src={p.thumb} alt={p.alt} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            {i === 1 && photos.length > 3 ? (
              <span className="absolute inset-0 grid place-items-center bg-ink/55 font-display text-lg text-white">{fill(t.more, { n: photos.length - 3 })}</span>
            ) : null}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-muted">
        <PhotoCredit photo={hero} />
        <button type="button" onClick={() => setOpen(0)} className="shrink-0 text-xs font-semibold text-teal hover:underline">
          {fill(t.all, { n: photos.length })}
        </button>
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fill(t.dialog, { name })}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              {name} · {open! + 1}/{photos.length}
            </span>
            <button type="button" className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20" onClick={() => setOpen(null)}>
              {t.close}
            </button>
          </div>
          <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            {photos.length > 1 ? (
              <>
                <button type="button" aria-label={t.prev} onClick={() => step(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-3 py-2 text-xl hover:bg-white/25">
                  ‹
                </button>
                <button type="button" aria-label={t.next} onClick={() => step(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-3 py-2 text-xl hover:bg-white/25">
                  ›
                </button>
              </>
            ) : null}
          </div>
          <div className="px-4 py-3 text-white/70" onClick={(e) => e.stopPropagation()}>
            <p className="mb-1 line-clamp-2 text-sm text-white/90">{current.alt}</p>
            <PhotoCredit photo={current} />
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-4" onClick={(e) => e.stopPropagation()}>
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setOpen(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 ${i === open ? "ring-amber" : "ring-transparent opacity-60"}`}
              >
                <Image src={p.thumb} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
