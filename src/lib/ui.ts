import type { TransportMode } from "@/content/schema";

export const ACCENT: Record<string, { hex: string; gradient: string }> = {
  teal: { hex: "#0f8b8d", gradient: "from-[#f2a541] via-[#d9603b] to-[#4a2545]" },
  rose: { hex: "#d62839", gradient: "from-[#2a1b5c] via-[#3d2a7a] to-[#14102e]" },
  amber: { hex: "#e8912a", gradient: "from-[#7cc3e8] via-[#3c86b8] to-[#1f5f8b]" },
  navy: { hex: "#1d2b4f", gradient: "from-[#a8d5e2] via-[#5f9e6e] to-[#3f6f4a]" },
};

export const MODE_ICON: Record<TransportMode, string> = {
  shuttle: "🚐",
  bus: "🚌",
  mtr: "🚇",
  ferry: "⛴️",
  cable: "🚡",
  walk: "🚶",
  flight: "✈️",
};
