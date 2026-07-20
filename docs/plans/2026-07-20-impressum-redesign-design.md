# Impressum Page Redesign — Design Spec

Date: 2026-07-20
Repos affected: `grgurevic/vercel-fe` only (no CMS code changes)

## Goal

Rebuild the `/[locale]/legal` (Impressum) page to match the new design: a
single metadata section with three visually separated groups of label/value
rows. Keep the current architecture — labels defined and grouped in the
frontend, values supplied by the existing `legal-page` flat fields in Strapi.

## Content source of truth

The client-provided Excel table is the source of truth for labels and values.
Labels are used verbatim (including the `SWIFT/BIC:` trailing colon from the
Excel).

Row → CMS field mapping (all fields already exist on `legal-page`; the three
that differ per locale — `name`, `mbs`, `shareCapital` — are already marked
localized in the schema, so no Strapi changes are needed):

| # | Group | EN label | HR label | CMS field |
|---|---|---|---|---|
| 1 | company | Registered name | Tvrtka | `name` |
| 2 | company | Registered office | Sjedište/adresa | `location` |
| 3 | company | Tel. | Tel. | `tel` |
| 4 | company | E-mail | E-mail | `email` |
| 5 | company | Identification no. (OIB) | OIB | `oib` |
| 6 | company | Board | Uprava | `board` |
| 7 | company | Court register no. (MBS) | Sudski registar | `mbs` |
| 8 | company | Legacy ID (MB) | Matični broj | `mb` |
| 9 | banking | Share capital | Temeljni kapital | `shareCapital` |
| 10 | banking | Bank | Banka | `bank` |
| 11 | banking | IBAN | IBAN | `iban` |
| 12 | banking | SWIFT/BIC: | SWIFT/BIC: | `swift` |
| 13 | banking | VAT ID | PDV ID | `vatId` |
| 14 | credits | Website | Website | `website` |
| 15 | credits | Photos | Fotografije | `foto` |

Values per the Excel (admin content edits, no deploy):

- `name` (localized): EN "Grgurević & Partners LTD for Planning and Design",
  HR "Grgurević & partneri d.o.o. za planiranje i projektiranje"
- `mbs` (localized): EN "80100816, Zagreb Commercial Court",
  HR "MBS 80100816, Trgovački sud u Zagrebu"
- `shareCapital` (localized): EN "2,667.73 EUR (fully paid)",
  HR "2.667,73 EUR (uplaćen u cijelosti)"
- `tel` (shared): "+385 1 4843168" (currently "+385 (0)1 4843168")
- All other shared fields already match the Excel.

Page title stays in frontend translations (`pages.legal`: "Impressum" /
"Impresum").

## CMS (strapi-cms)

**No code or schema changes.** All 15 fields exist, localization flags already
match which values differ per locale, and flat fields need no populate params.
The only CMS-side work is editing the values above in the production admin and
publishing both locales — pure content, deployable any time before or after
the FE change.

The dev seed (`demoContent.ts`) may optionally be updated to the Excel values
so local dev matches production content, but this is not required for the
redesign.

## Frontend (vercel-fe)

### Labels

Add the 15 localized labels to `src/lib/translations.ts` for both locales
(e.g. under an `impressum` key), replacing the English-only labels hardcoded
in `CompanyMetadata` today. This also fixes the existing bug where the HR page
shows English labels.

### Page & components

- `legal/page.tsx`: keeps the heading section, passes all 15 values from the
  legal-page data (it already receives `name`, `location`, `tel`, `email` —
  currently unused), and **removes the `ContactInfo` section and the
  `getFooter` call** — tel/email are now ordinary rows.
- `CompanyMetadata` is rebuilt (or replaced by `ImpressumDetails`) to render
  the three groups in the design's order:
  - company: rows 1–8, banking: rows 9–13, credits: rows 14–15
- Rows with an empty/null value are skipped (current `hasValue` behavior);
  groups with no rows are skipped.
- No data-layer changes: `getLegalPage` and the `LegalPage` type already cover
  every field.

### Layout per breakpoint (from Figma)

- **xl / lg / md**: one bordered section (top hairline divider, as today).
  Each row is `label | value`: small-caps label in a fixed-width left column,
  value in the right column. Groups separated by one blank line of vertical
  space. No dividers between rows. On md the whole block shifts right with the
  tablet indentation scale used elsewhere in the app.
- **mobile (<md)**: single column; each row stacks the small-caps label above
  its value; groups separated by larger vertical spacing. **No bordered rows**
  (departure from the current mobile treatment).
- Small-caps rendering: labels use the existing
  `[font-variant-caps:small-caps]` pattern; values reuse the existing
  uppercase-abbreviation splitting (as in `ContactInfo`) so tokens like `LTD`,
  `HR-10000`, `EUR` render as small caps per the design.
- Exact paddings/column widths are matched to the Figma during implementation,
  following the app's per-breakpoint arbitrary-value Tailwind convention.

## Deployment

Only two independent actions, safe in either order:

1. **Frontend deploy** — the new layout renders whatever values the CMS holds;
   until content is edited, current production values display in the new
   design.
2. **Admin content edits** — update the values listed above and publish both
   locales; the fetch layer is `cache: "no-store"`, so changes appear
   immediately.

Rollback: revert the FE deploy; no CMS state depends on it.

## Trade-off accepted

Renaming a label or adding/reordering rows requires a frontend deploy (labels
live in `translations.ts`). Chosen deliberately to keep the current
architecture and avoid a CMS schema migration.

## Testing

- `vercel-fe`: lint + typecheck; render verification of `/en/legal` and
  `/hr/legal` against local Strapi at all four breakpoints.

## Out of scope

- Strapi code/schema changes.
- Footer content/links (unchanged).
- Privacy policy, participation, EU projects pages.
- Page title/i18n route naming.
