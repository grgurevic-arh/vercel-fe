# Favicon, i18n Titles & Translated Navigation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new favicon, make the browser tab title locale-aware, and translate navigation/footer link labels by locale.

**Architecture:** A single `src/lib/translations.ts` static map provides all locale-dependent strings. The locale layout gains a `generateMetadata()` for dynamic titles. Header and footer components read translated labels from the map instead of hardcoded English arrays.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/translations.ts` | Create | Static translation map keyed by locale |
| `src/app/layout.tsx` | Modify | Remove apple icon, remove locale-dependent title/OG metadata, dynamic `<html lang>` from params |
| `src/app/[locale]/layout.tsx` | Modify | Add `generateMetadata()` with locale-aware title template |
| `src/app/favicon.ico` | Replace | User provides new file |
| `src/components/site-header.tsx` | Modify | Use translations for nav labels, remove "eu" custom rendering |
| `src/components/site-footer.tsx` | Modify | Use translations for footer nav labels, remove "eu" custom rendering |

---

### Task 1: Create translations file

**Files:**
- Create: `src/lib/translations.ts`

- [ ] **Step 1: Create `src/lib/translations.ts`**

```ts
import type { Locale } from "./i18n";

const translations = {
  en: {
    siteTitle: "Grgurević & Partners",
    nav: {
      work: "Work",
      office: "Office",
      feed: "Feed",
    },
    secondaryNav: {
      research: "Research",
      euProjects: "eu projects",
      legal: "Legal",
    },
    footer: {
      legal: "Legal",
      research: "Research",
      euProjects: "eu projects",
      privacyPolicy: "Privacy policy",
    },
  },
  hr: {
    siteTitle: "Grgurević & partneri",
    nav: {
      work: "Work",       // TODO: replace with Croatian from spreadsheet
      office: "Office",   // TODO: replace with Croatian from spreadsheet
      feed: "Feed",       // TODO: replace with Croatian from spreadsheet
    },
    secondaryNav: {
      research: "Research",     // TODO: replace with Croatian from spreadsheet
      euProjects: "eu projects", // TODO: replace with Croatian from spreadsheet
      legal: "Legal",           // TODO: replace with Croatian from spreadsheet
    },
    footer: {
      legal: "Legal",              // TODO: replace with Croatian from spreadsheet
      research: "Research",        // TODO: replace with Croatian from spreadsheet
      euProjects: "eu projects",   // TODO: replace with Croatian from spreadsheet
      privacyPolicy: "Privacy policy", // TODO: replace with Croatian from spreadsheet
    },
  },
} as const;

export function t(locale: Locale) {
  return translations[locale];
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit --pretty 2>&1 | grep translations`
Expected: No errors related to `translations.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/translations.ts
git commit -m "feat: add static translations map for i18n support"
```

---

### Task 2: Update root layout — favicon & metadata cleanup

**Files:**
- Modify: `src/app/layout.tsx:32-51` (metadata export)
- Modify: `src/app/layout.tsx:57` (html lang attribute)

- [ ] **Step 1: Remove apple icon and locale-dependent metadata from root layout**

In `src/app/layout.tsx`, update the `metadata` export to keep only non-locale fields:

```ts
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
```

Removed:
- `title` (moves to locale layout)
- `description` (moves to locale layout)
- `openGraph.siteName` (moves to locale layout)
- `icons.apple` (file doesn't exist)

- [ ] **Step 2: Make `<html lang>` dynamic**

The root layout currently hardcodes `lang={DEFAULT_LOCALE}`. To make it dynamic, extract the locale from the URL params. The root layout receives `children` but not `params`, so parse the locale from the first URL segment using `headers()` or pass it through. The simplest correct approach: make the root layout an async server component that reads the locale from the incoming request path.

Update `src/app/layout.tsx` — change the function to accept `params` and read the locale:

```tsx
export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale?: string }> }>) {
  const resolvedParams = await params;
  const lang = resolvedParams?.locale && isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : DEFAULT_LOCALE;

  return (
    <html lang={lang} className={`${untitledSerif.variable} ${untitledSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

Add import: `import { isLocale } from "@/lib/i18n";`

Note: Root layouts in Next.js App Router with `[locale]` dynamic segments do receive the segment params. If this doesn't work at runtime, fallback to keeping `lang={DEFAULT_LOCALE}` and note it as a known limitation.

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix: remove apple-touch-icon ref and move locale metadata to locale layout"
```

---

### Task 3: Add `generateMetadata` to locale layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx:1-6` (imports)
- Modify: `src/app/[locale]/layout.tsx` (add generateMetadata function)

- [ ] **Step 1: Add generateMetadata to locale layout**

Add imports and the `generateMetadata` function to `src/app/[locale]/layout.tsx`:

```ts
import type { Metadata } from "next";

import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { t } from "@/lib/translations";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
```

Add before `generateStaticParams`:

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocaleParam(params);
  const { siteTitle } = t(locale);

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: "Architecture and urban planning studio based in Zagreb.",
    openGraph: {
      siteName: siteTitle,
    },
  };
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat: add locale-aware generateMetadata for dynamic site title"
```

---

### Task 4: Translate header navigation

**Files:**
- Modify: `src/components/site-header.tsx:1-21` (imports and nav arrays)
- Modify: `src/components/site-header.tsx:149-160` (desktop nav rendering)
- Modify: `src/components/site-header.tsx:211-225` (mobile primary nav)
- Modify: `src/components/site-header.tsx:228-249` (mobile secondary nav)

- [ ] **Step 1: Replace static nav arrays with locale-aware functions**

Remove the static `navLinks` and `secondaryNavLinks` arrays (lines 11-21). Add import and locale-aware builder:

```ts
import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";
```

Narrow the `locale` prop type from `string` to `Locale` in the existing `SiteHeaderProps` interface:

```ts
interface SiteHeaderProps {
  locale: Locale;
}
```

Inside the component function, build nav links from translations:

```ts
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
```

- [ ] **Step 2: Remove "eu projects" custom span rendering**

In the mobile secondary nav section, replace the conditional rendering:

```tsx
{label === "eu projects" ? (
  <>
    <span className="tracking-[0.48px]">eu</span>
    {" projects"}
  </>
) : (
  label
)}
```

With just:

```tsx
{label}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/components/site-header.tsx
git commit -m "feat: translate header nav links by locale"
```

---

### Task 5: Translate footer navigation

**Files:**
- Modify: `src/components/site-footer.tsx:1-13` (imports and nav array)
- Modify: `src/components/site-footer.tsx:32-52` (nav link rendering)

- [ ] **Step 1: Replace static footer nav with locale-aware lookup**

Add imports:

```ts
import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";
```

Narrow the `locale` prop type from `string` to `Locale` in the existing `SiteFooterProps` interface:

```ts
interface SiteFooterProps {
  locale: Locale;
}
```

Remove the static `footerNavLinks` array (lines 8-13). Inside the component function, build from translations:

```ts
const trans = t(locale);

const footerNavLinks = [
  { label: trans.footer.legal, path: "/legal" },
  { label: trans.footer.research, path: "/research" },
  { label: trans.footer.euProjects, path: "/eu-projects" },
  { label: trans.footer.privacyPolicy, path: "/privacy-policy" },
];
```

- [ ] **Step 2: Remove "eu projects" custom span rendering**

In the nav link rendering, replace the conditional:

```tsx
{label === "eu projects" ? (
  <>
    <span className="tracking-[0.48px]">eu</span>
    {" projects"}
  </>
) : (
  label
)}
```

With just:

```tsx
{label}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 4: Commit**

```bash
git add src/components/site-footer.tsx
git commit -m "feat: translate footer nav links by locale"
```

---

### Task 6: Replace favicon

**Files:**
- Replace: `src/app/favicon.ico`

- [ ] **Step 1: Replace favicon file**

User provides the new `.ico` file. Copy it to `src/app/favicon.ico`, overwriting the existing one.

- [ ] **Step 2: Verify it loads**

Run: `npm run dev` and check `http://localhost:3000/favicon.ico` in browser.

- [ ] **Step 3: Commit**

```bash
git add src/app/favicon.ico
git commit -m "feat: replace favicon with new icon"
```

---

### Task 7: Manual verification

- [ ] **Step 1: Run dev server and verify**

Run: `npm run dev`

Check the following:
- [ ] Browser tab shows "Grgurević & Partners" on `/en` pages
- [ ] Browser tab shows "Grgurević & partneri" on `/hr` pages
- [ ] Page-specific titles show template format (e.g., "Work | Grgurević & Partners")
- [ ] New favicon appears in browser tab
- [ ] Header nav links show translated labels when switching locale
- [ ] Footer nav links show translated labels when switching locale
- [ ] Mobile menu nav links are translated
- [ ] "eu projects" renders as plain text (no special tracking)
