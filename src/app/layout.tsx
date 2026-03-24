import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";

import { allowIndexing } from "@/lib/env";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import "./globals.css";

const untitledSerif = localFont({
  src: [
    {
      path: "../fonts/untitled-serif-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/untitled-serif-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/untitled-serif-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/untitled-serif-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/untitled-serif-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/untitled-serif-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-untitled-serif",
  display: "swap",
});

const untitledSans = localFont({
  src: [
    {
      path: "../fonts/untitled-sans-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-untitled-sans",
  display: "swap",
});

const siteUrl = process.env.SITE_URL ?? "https://grgurevic.hr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/favicon.ico",
  },
  ...(!allowIndexing && {
    robots: { index: false, follow: false },
  }),
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale?: string }> }>) {
  const resolvedParams = await params;
  const lang =
    resolvedParams?.locale && isLocale(resolvedParams.locale)
      ? resolvedParams.locale
      : DEFAULT_LOCALE;

  return (
    <html
      lang={lang}
      className={`${untitledSerif.variable} ${untitledSans.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
