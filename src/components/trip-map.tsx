"use client";

import dynamic from "next/dynamic";

export type MapPoint = {
  slug: string;
  name: string;
  sub?: string;
  lat: number;
  lng: number;
  label: string;
  color: string;
  href: string;
};

const Inner = dynamic(() => import("./trip-map-inner"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-xl bg-line/60" />,
});

export function TripMap({
  points,
  path,
  height = 420,
  detailsLabel,
}: {
  points: MapPoint[];
  path?: { color: string; positions: [number, number][] }[];
  height?: number;
  detailsLabel: string;
}) {
  if (points.length === 0) return null;
  return (
    <div style={{ height }} className="overflow-hidden rounded-xl border border-line bg-card">
      <Inner points={points} path={path} height={height} detailsLabel={detailsLabel} />
    </div>
  );
}
