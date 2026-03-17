"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/translations";

interface SiteHeaderProps {
  locale: Locale;
}

const languages = [
  { label: "English", locale: "en" },
  { label: "Croatian", locale: "hr" },
];

export function SiteHeader({ locale }: SiteHeaderProps) {
  const trans = t(locale);

  const navLinks = [
    { label: trans.nav.work, path: "/work" },
    { label: trans.nav.office, path: "/office" },
    { label: trans.nav.feed, path: "/news" },
  ];

  const secondaryNavLinks = [
    { label: trans.secondaryNav.research, path: "/research" },
    { label: trans.secondaryNav.euProjects, path: "/eu-projects" },
    { label: trans.secondaryNav.legal, path: "/legal" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close menu on route change (state-based, avoids effect setState lint error)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (menuOpen) {
      setMenuOpen(false);
    }
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Focus close button when menu opens, return focus to trigger on close
  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerButtonRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [menuOpen]);

  // Apply inert to sibling elements (children, footer) when menu is open
  useEffect(() => {
    const overlay = overlayRef.current;
    const parent = overlay?.parentElement ?? document.querySelector('header')?.parentElement;
    if (!parent) return;
    const siblings = Array.from(parent.children).filter(
      (el) => el.tagName !== 'HEADER' && el !== overlay
    );
    siblings.forEach((el) => {
      if (menuOpen) {
        el.setAttribute('inert', '');
      } else {
        el.removeAttribute('inert');
      }
    });
    return () => {
      siblings.forEach((el) => el.removeAttribute('inert'));
    };
  }, [menuOpen]);

  // Close menu when viewport crosses md breakpoint (prevents trap state on rotate)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = () => { if (mql.matches) setMenuOpen(false); };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Close on Escape key and trap focus within overlay
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  return (
    <>
    <header
      inert={menuOpen || undefined}
      className="
        border-b-[0.5px] border-divider bg-white
        h-[54px] xl:h-[80px]
      "
    >
    <div
      className="
        content-wrapper flex items-center justify-between h-full
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
      "
    >
      <Link
        href={`/${locale}`}
        className="
          text-[16px] leading-[23px] xl:text-[20px] xl:leading-[28px]
          text-text-primary
        "
      >
        Grgurević & partneri
      </Link>

      {/* Desktop nav (768px+) */}
      <nav className="hidden md:flex items-center gap-[16px] lg:gap-[20px] xl:gap-[24px]">
        {navLinks.map(({ label, path }) => (
          <Link
            key={path}
            href={`/${locale}${path}`}
            className="
              text-[16px] leading-[23px] xl:text-[20px] xl:leading-[28px]
              text-text-primary py-[8px]
            "
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu button (< 768px) */}
      <button
        ref={triggerButtonRef}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? trans.nav.closeMenu : trans.nav.openMenu}
        onClick={() => setMenuOpen(!menuOpen)}
        className="
          md:hidden
          text-[16px] leading-[23px] text-text-primary py-[8px]
        "
      >
        {menuOpen ? trans.nav.close : trans.nav.menu}
      </button>
    </div>
    </header>

    {menuOpen && (
      <div ref={overlayRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" className="fixed inset-0 z-50 bg-white md:hidden">
        {/* Header bar */}
        <div
          className="
            flex items-center justify-between
            border-b-[0.5px] border-divider
            h-[54px]
            px-[12px]
          "
        >
          <Link
            href={`/${locale}`}
            className="text-[16px] leading-[23px] text-text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Grgurević & partneri
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={trans.nav.closeMenu}
            onClick={() => setMenuOpen(false)}
            className="text-[16px] leading-[23px] text-text-primary py-[8px]"
          >
            {trans.nav.close}
          </button>
        </div>

        {/* Primary nav */}
        <nav aria-label="Main navigation" className="absolute right-[12px] top-[78px]">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              href={`/${locale}${path}`}
              className={`
                block text-right py-[8px]
                text-[38px] leading-[50px] text-text-primary
                ${isActive(path) ? "underline" : ""}
              `}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Secondary nav */}
        <nav aria-label="Secondary navigation" className="absolute right-[12px] top-1/2 -translate-y-1/2">
          {secondaryNavLinks.map(({ label, path }) => (
            <Link
              key={path}
              href={`/${locale}${path}`}
              className={`
                block text-right py-[8px]
                text-[20px] leading-[28px] text-text-primary
                ${isActive(path) ? "underline" : ""}
              `}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Language switcher */}
        <div className="absolute left-[12px] bottom-[12px]">
          {languages.map(({ label, locale: langLocale }) =>
            langLocale === locale ? (
              <span
                key={langLocale}
                className="
                  block py-[8px]
                  text-[16px] leading-[23px] text-text-primary underline
                "
              >
                {label}
              </span>
            ) : (
              <Link
                key={langLocale}
                href={pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${langLocale}`)}
                className="
                  block py-[8px]
                  text-[16px] leading-[23px] text-text-primary
                "
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>
    )}
    </>
  );
}
