import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DEFAULT_LOCALE } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grgurević & partneri",
  description: "Architecture and urban planning studio based in Zagreb.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
