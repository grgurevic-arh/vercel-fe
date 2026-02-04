import Link from "next/link";
import type { ReactNode } from "react";

import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";

const navigationLinks = [
  { label: "Homepage", path: "" },
  { label: "Work", path: "/work" },
  { label: "EU Projects", path: "/eu-projects" },
  { label: "News", path: "/news" },
  { label: "Office", path: "/office" },
  { label: "Research", path: "/research" },
  { label: "Legal", path: "/legal" },
];

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = await resolveLocaleParam(params);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900" data-locale={locale}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <nav className="flex flex-wrap gap-3 border-b border-zinc-200 pb-4 text-sm text-zinc-600">
          {navigationLinks.map(({ label, path }) => (
            <Link
              key={path || label}
              href={`/${locale}${path}`}
              className="underline-offset-4 hover:text-zinc-900 hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
        <main className="flex flex-col gap-8">{children}</main>
      </div>
    </div>
  );
}
