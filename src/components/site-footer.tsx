"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/translations";

interface SiteFooterProps {
  locale: Locale;
}

const languages = [
  { label: "Croatian", locale: "hr" },
  { label: "English", locale: "en" },
];

export function SiteFooter({ locale }: SiteFooterProps) {
  const pathname = usePathname();
  const trans = t(locale);

  const footerNavLinks = [
    { label: trans.footer.legal, path: "/legal" },
    { label: trans.footer.research, path: "/research" },
    { label: trans.footer.euProjects, path: "/eu-projects" },
    { label: trans.footer.privacyPolicy, path: "/privacy-policy" },
  ];
  return (
    <footer className="content-wrapper relative bg-white h-[360px] md:h-[240px] xl:h-[300px]">
      {/* Navigation links */}
      <div
        className="
          absolute
          left-[12px] md:left-[450px] lg:left-[700px] xl:left-[968px]
          top-[16px] md:top-[24px]
        "
      >
        <ul className="space-y-[16px]">
          {footerNavLinks.map(({ label, path }) => (
            <li key={label}>
              <Link
                href={`/${locale}${path}`}
                className={`text-[16px] leading-[23px] text-text-primary hover:underline ${pathname === `/${locale}${path}` ? "underline" : ""}`}
              >
                {path === "/eu-projects" ? (
                  <>
                    <span className="lowercase [font-variant-caps:small-caps] tracking-[0.48px]">
                      {label.split(" ")[0]}
                    </span>{" "}
                    {label.split(" ").slice(1).join(" ")}
                  </>
                ) : (
                  label
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Language switcher */}
      <div
        className="
          absolute
          right-[94px] md:right-[44px] lg:right-[40px] xl:right-[92px]
          top-[16px] md:top-[24px]
        "
      >
        <ul className="space-y-[0]">
          {languages.map(({ label, locale: langLocale }) => (
            <li key={langLocale} className="py-[8px]">
              <Link
                href={pathname.replace(
                  new RegExp(`^/${locale}(?=/|$)`),
                  `/${langLocale}`,
                )}
                className={`
                  text-[16px] leading-[23px] text-text-primary text-right
                  ${langLocale === locale ? "underline" : ""}
                `}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Copyright */}
      <p
        className="
          absolute
          left-[12px] md:left-[44px] lg:left-[40px] xl:left-[88px]
          top-[232px] md:top-[32px]
          text-[16px] leading-[23px] text-text-primary
        "
      >
        {trans.footer.copyright}
      </p>

      {/* EU funded badge */}
      <div
        className="
          absolute
          left-[12px] md:left-[44px] lg:left-[40px] xl:left-[88px]
          top-[282px] md:top-[92px] xl:top-[91px]
          h-[36px] w-[193px]
        "
      >
        <Link href={`/${locale}/eu-projects`}>
          <Image
            src="/eu-funded-badge.svg"
            alt={trans.footer.euBadgeAlt}
            width={193}
            height={36}
            className="h-full w-auto object-contain"
          />
        </Link>
      </div>
    </footer>
  );
}
