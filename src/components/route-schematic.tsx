import type { Dict } from "@/i18n/dict";

/** Schematic of the trip's transit lines, redrawn from page 2 of the PDF plan (not to scale). */
export function RouteSchematic({ t }: { t: Dict["schematic"] }) {
  const station = (x: number, y: number, label: string, anchor: "start" | "end" | "middle" = "start", dx = 12, dy = 4) => (
    <g key={label}>
      <circle cx={x} cy={y} r={8} fill="#fff" stroke="#14213d" strokeWidth={3} />
      <text x={x + dx} y={y + dy} textAnchor={anchor} className="fill-ink text-[13px] font-semibold">
        {label}
      </text>
    </g>
  );

  return (
    <figure className="rounded-2xl border border-line bg-card p-3 sm:p-5">
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft">
        <Legend color="#0f8b8d" dash="6 5" label={t.legendShuttle} />
        <Legend color="#f38b1c" label="MTR Tung Chung Line" />
        <Legend color="#e05aa0" label="Disneyland Resort Line" />
        <Legend color="#e2231a" label="Tsuen Wan Line" />
        <Legend color="#14213d" dash="2 5" label={t.legendCable} />
        <Legend color="#2f6fed" dash="6 5" label="Star Ferry" />
      </div>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 760 330" className="min-w-[640px]" role="img" aria-label={t.caption}>
          <rect x="0" y="0" width="760" height="330" rx="14" fill="#eef3f7" />
          <path d="M20 95 Q40 70 140 75 L300 95 Q330 120 320 260 Q250 320 150 300 Q40 300 22 220 Z" fill="#e3eedb" />
          <text x="190" y="285" className="fill-[#7c8b6a] text-[13px]">{t.lantau}</text>
          <path d="M430 40 L740 40 L740 240 L640 240 Q590 215 540 225 L450 170 Z" fill="#ece5d8" />
          <text x="650" y="64" className="fill-[#8c7a5b] text-[13px]">{t.kowloon}</text>
          <path d="M520 268 L740 260 L740 330 L505 330 Z" fill="#ece5d8" />
          <text x="625" y="318" className="fill-[#8c7a5b] text-[13px]">{t.island}</text>

          <path d="M95 160 L160 182" stroke="#0f8b8d" strokeWidth={4} strokeDasharray="6 5" fill="none" />
          <path d="M160 182 L270 182 L350 150 L480 150 L580 205 L640 268" stroke="#f38b1c" strokeWidth={8} fill="none" strokeLinejoin="round" />
          <path d="M480 150 L555 115 L660 115 L660 195" stroke="#e2231a" strokeWidth={7} fill="none" strokeLinejoin="round" />
          <path d="M350 150 L368 222" stroke="#e05aa0" strokeWidth={7} fill="none" />
          <path d="M160 182 L122 258" stroke="#14213d" strokeWidth={3} strokeDasharray="2 5" fill="none" />
          <path d="M660 195 L640 268" stroke="#2f6fed" strokeWidth={3} strokeDasharray="6 5" fill="none" />

          <circle cx={95} cy={160} r={9} fill="#fff" stroke="#14213d" strokeWidth={3} />
          <circle cx={95} cy={160} r={4} fill="#d62839" />
          <text x={22} y={138} className="fill-ink text-[13px] font-semibold">{t.airport}</text>
          {station(160, 182, "Tung Chung", "start", 10, 26)}
          {station(350, 150, "Sunny Bay", "middle", 0, -14)}
          {station(368, 222, "Disneyland")}
          {station(480, 150, "Lai King", "middle", 0, 26)}
          {station(660, 115, "Jordan")}
          {station(660, 195, "TST")}
          {station(640, 268, "Hong Kong Stn · Central", "end", -12, 26)}
          {station(122, 258, "Ngong Ping", "end", -12, 22)}
        </svg>
      </div>
      <figcaption className="mt-3 text-xs text-muted">{t.caption}</figcaption>
    </figure>
  );
}

function Legend({ color, label, dash }: { color: string; label: string; dash?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="26" height="8" aria-hidden>
        <line x1="1" y1="4" x2="25" y2="4" stroke={color} strokeWidth={dash ? 3 : 5} strokeDasharray={dash} />
      </svg>
      {label}
    </span>
  );
}
