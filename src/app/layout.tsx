import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";

import { allowIndexing } from "@/lib/env";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import "./globals.css";

const untitledSerif = localFont({
  src: [
    { path: "../fonts/untitled-serif-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/untitled-serif-regular-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/untitled-serif-medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/untitled-serif-medium-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/untitled-serif-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/untitled-serif-bold-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-untitled-serif",
  display: "swap",
});

const siteUrl = process.env.SITE_URL ?? "https://grgurevic.hr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Grgurević & partneri",
    template: "%s | Grgurević & partneri",
  },
  description: "Architecture and urban planning studio based in Zagreb.",
  openGraph: {
    type: "website",
    siteName: "Grgurević & partneri",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  ...(!allowIndexing && {
    robots: { index: false, follow: false },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={DEFAULT_LOCALE} className={untitledSerif.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
