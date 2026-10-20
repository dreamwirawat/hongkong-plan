import { IBM_Plex_Sans_Thai, Kanit, Noto_Sans_TC } from "next/font/google";

export const bodyFont = IBM_Plex_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const displayFont = Kanit({
  variable: "--font-display-face",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// CJK glyphs come from unicode-range slices, so only what a page uses is downloaded.
export const cjkFont = Noto_Sans_TC({
  variable: "--font-cjk",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

export const fontVariables = `${bodyFont.variable} ${displayFont.variable} ${cjkFont.variable}`;
