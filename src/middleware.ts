import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

function getPreferredLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .find((lang) =>
      SUPPORTED_LOCALES.some(
        (locale) => lang === locale || lang.startsWith(`${locale}-`),
      ),
    );

  if (!preferred) return DEFAULT_LOCALE;

  const match = SUPPORTED_LOCALES.find(
    (locale) => preferred === locale || preferred.startsWith(`${locale}-`),
  );
  return match ?? DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path starts with a supported locale
  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  // Redirect to detected locale
  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - api (API routes)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static assets (svg, png, jpg, etc.)
     */
    "/((?!_next|api|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
