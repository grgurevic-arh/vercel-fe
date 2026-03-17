# Favicon, Dynamic Site Title & Translated Navigation

**Date:** 2026-03-17

## 1. Favicon

- Replace `src/app/favicon.ico` with the user's new `.ico` file
- Remove `apple: "/apple-touch-icon.png"` from root layout metadata (file doesn't exist)
- Keep existing `icon: "/favicon.ico"` reference

## 2. Dynamic Site Title (Browser Tab)

- Create `src/lib/translations.ts` with a static translation map (see Section 3)
- Move locale-dependent metadata from root layout (`src/app/layout.tsx`) to a `generateMetadata()` function in `src/app/[locale]/layout.tsx`
  - Reads locale from route params
  - Sets `title.default` and `title.template` using translated `siteTitle`
  - en: `"Grgurević & Partners"` / hr: `"Grgurević & partneri"`
  - Template: `"%s | ${siteTitle}"`
- Keep non-locale metadata (`metadataBase`, `openGraph`, `robots`, `icons`) in root layout
- Fix `<html lang>` attribute: change from hardcoded `DEFAULT_LOCALE` to dynamic `locale` from route params

## 3. Translated Navigation & Footer Links

### Translation file: `src/lib/translations.ts`

Static map keyed by locale:

```ts
export const translations = {
  en: {
    siteTitle: "Grgurević & Partners",
    nav: { work: "Work", office: "Office", feed: "Feed" },
    secondaryNav: { research: "Research", euProjects: "eu projects", legal: "Legal" },
    footer: { legal: "Legal", research: "Research", euProjects: "eu projects", privacyPolicy: "Privacy policy" },
  },
  hr: {
    siteTitle: "Grgurević & partneri",
    nav: { work: "...", office: "...", feed: "..." },
    secondaryNav: { research: "...", euProjects: "...", legal: "..." },
    footer: { legal: "...", research: "...", euProjects: "...", privacyPolicy: "..." },
  },
} as const;
```

Croatian values to be provided from the user's spreadsheet.

### Header (`src/components/site-header.tsx`)

- Refactor `navLinks` and `secondaryNavLinks` from static arrays to functions/lookups that take `locale` and return translated labels
- Paths stay the same (`/work`, `/office`, `/news`, etc.)
- Logo text "Grgurević & partneri" stays hardcoded (never changes)
- Remove the custom `<span className="tracking-[0.48px]">eu</span>` rendering for "eu projects" — treat as a regular label

### Footer (`src/components/site-footer.tsx`)

- Same pattern: refactor `footerNavLinks` to use translations by locale
- Remove the custom "eu projects" `<span>` rendering
- Copyright line "Grgurević & partneri, 2025" stays hardcoded

## Files Changed

| File | Change |
|------|--------|
| `src/app/favicon.ico` | Replace with new file |
| `src/app/layout.tsx` | Remove `apple` icon, remove locale-dependent metadata, fix `<html lang>` |
| `src/app/[locale]/layout.tsx` | Add `generateMetadata()` with locale-aware title |
| `src/lib/translations.ts` | New file — static translation map |
| `src/components/site-header.tsx` | Use translations for nav labels, remove "eu" special rendering |
| `src/components/site-footer.tsx` | Use translations for footer nav labels, remove "eu" special rendering |

## Out of Scope

- Apple touch icon (removed)
- Translating header logo text (stays "Grgurević & partneri")
- Translating copyright line
- CMS-based translations (using static map instead)
