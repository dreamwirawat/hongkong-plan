"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useMemo } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import type { MapPoint } from "./trip-map";

function pinIcon(label: string, color: string) {
  return L.divIcon({
    className: "",
    html: `<span class="map-pin" style="background:${color}">${label}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

export default function TripMapInner({
  points,
  path,
  height,
  detailsLabel,
}: {
  points: MapPoint[];
  path?: { color: string; positions: [number, number][] }[];
  height: number;
  detailsLabel: string;
}) {
  const bounds = useMemo(() => L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])).pad(0.15), [points]);

  return (
    <MapContainer bounds={bounds} scrollWheelZoom={false} style={{ height, width: "100%" }} className="rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {path?.map((line, i) => (
        <Polyline key={i} positions={line.positions} pathOptions={{ color: line.color, weight: 4, opacity: 0.75, dashArray: "6 8" }} />
      ))}
      {points.map((p) => (
        <Marker key={`${p.slug}-${p.label}`} position={[p.lat, p.lng]} icon={pinIcon(p.label, p.color)}>
          <Popup>
            <div className="min-w-40">
              <p className="font-semibold">{p.name}</p>
              {p.sub ? <p className="text-xs text-gray-500">{p.sub}</p> : null}
              <Link href={p.href} className="mt-1 inline-block text-xs font-semibold text-teal underline">
                {detailsLabel}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
