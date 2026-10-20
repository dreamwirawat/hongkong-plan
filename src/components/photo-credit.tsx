import type { Photo } from "@/content/schema";

export function PhotoCredit({ photo, className = "" }: { photo: Photo; className?: string }) {
  return (
    <a
      href={photo.page}
      target="_blank"
      rel="noreferrer"
      className={`line-clamp-1 text-[11px] leading-tight hover:underline ${className}`}
      title={`${photo.artist} · ${photo.license}`}
    >
      📷 {photo.artist} · {photo.license} · Wikimedia Commons
    </a>
  );
}
