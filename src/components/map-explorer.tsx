"use client";

import { useMemo, useState } from "react";
import type { MapPoint } from "./trip-map";
import { TripMap } from "./trip-map";

type DayLayer = { n: number; label: string; color: string; points: MapPoint[] };

export function MapExplorer({ layers, all, allLabel, detailsLabel }: { layers: DayLayer[]; all: MapPoint[]; allLabel: string; detailsLabel: string }) {
  const [active, setActive] = useState<number | null>(null);
  const layer = layers.find((l) => l.n === active);
  const points = layer ? layer.points : all;
  const path = useMemo(
    () => (layer ? [{ color: layer.color, positions: layer.points.map((p) => [p.lat, p.lng] as [number, number]) }] : undefined),
    [layer],
  );

  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2">
        <FilterButton active={active === null} onClick={() => setActive(null)} color="#14213d">
          {allLabel}
        </FilterButton>
        {layers.map((l) => (
          <FilterButton key={l.n} active={active === l.n} onClick={() => setActive(l.n)} color={l.color}>
            {l.label}
          </FilterButton>
        ))}
      </div>
      {/* key forces a remount so the map re-fits its bounds to the selected layer */}
      <TripMap key={active ?? "all"} points={points} path={path} height={620} detailsLabel={detailsLabel} />
    </>
  );
}

function FilterButton({ active, onClick, color, children }: { active: boolean; onClick: () => void; color: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-transparent text-white" : "border-line bg-card hover:border-ink/30"}`}
      style={active ? { background: color } : undefined}
    >
      {!active ? <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> : null}
      {children}
    </button>
  );
}
