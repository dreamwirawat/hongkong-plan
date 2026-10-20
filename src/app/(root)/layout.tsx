import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Hong Kong · 25–28 Nov 2026",
  description: "ฮ่องกง 25–28 พ.ย. 2026 · Hong Kong trip plan · 香港行程",
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
