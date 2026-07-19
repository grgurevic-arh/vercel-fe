# Impressum Page Redesign — Design Spec

Date: 2026-07-20
Repos affected: `grgurevic/vercel-fe` (frontend), `grgurevic/strapi-cms` (CMS)

## Goal

Rebuild the `/[locale]/legal` (Impressum) page to match the new design: a single
metadata section with three visually separated groups of label/value rows, with
**all labels and values managed in the CMS** so editors can change wording,
order, and row count without a code deploy.

## Content source of truth

The client-provided Excel table is the source of truth for both locales.
Content is used verbatim (including the `SWIFT/BIC:` label with trailing colon,
which appears as-is in the Excel; since labels are CMS-editable this can be
adjusted in the admin at any time).

| EN label | EN value |
|---|---|
| Registered name | Grgurević & Partners LTD for Planning and Design |
| Registered office | Gjure Čanića 6, HR-10000 Zagreb |
| Tel. | +385 1 4843168 |
| E-mail | mail@grgurevic.com |
| Identification no. (OIB) | 38971455962 |
| Board | Ivona Jerković, Hrvoje Vidović |
| Court register no. (MBS) | 80100816, Zagreb Commercial Court |
| Legacy ID (MB) | 3659186 |
| Share capital | 2,667.73 EUR (fully paid) |
| Bank | Erste & Steiermärkische Bank d.d., Rijeka |
| IBAN | HR9024020061101162293 |
| SWIFT/BIC: | ESBCHR22 |
| VAT ID | HR 38971455962 |
| Website | Mihovil Vargović, Tomislav Katalenić |
| Photos | Ivan Dorotić, Maja Bosnić, Marko Jakelić |

| HR label | HR value |
|---|---|
| Tvrtka | Grgurević & partneri d.o.o. za planiranje i projektiranje |
| Sjedište/adresa | Gjure Čanića 6, HR-10000 Zagreb |
| Tel. | +385 1 4843168 |
| E-mail | mail@grgurevic.com |
| OIB | 38971455962 |
| Uprava | Ivona Jerković, Hrvoje Vidović |
| Sudski registar | MBS 80100816, Trgovački sud u Zagrebu |
| Matični broj | 3659186 |
| Temeljni kapital | 2.667,73 EUR (uplaćen u cijelosti) |
| Banka | Erste & Steiermärkische Bank d.d., Rijeka |
| IBAN | HR9024020061101162293 |
| SWIFT/BIC: | ESBCHR22 |
| PDV ID | HR 38971455962 |
| Website | Mihovil Vargović, Tomislav Katalenić |
| Fotografije | Ivan Dorotić, Maja Bosnić, Marko Jakelić |

Page title stays in frontend translations (`pages.legal`: "Impressum" /
"Impresum") — it is the route heading, not row content.

## CMS model (strapi-cms)

New shared component `shared.labelled-value`:

- `label` — string, required
- `value` — text, required

(No existing component fits: the closest, `eu.useful-link`, is `label` + `url`
and is consumed by the EU projects page for real hyperlinks. Repeatable rows in
Strapi require a component definition; this one follows the same pattern as
`useful-link`.)

`legal-page` single type gains three **localized repeatable** component fields
(`shared.labelled-value`):

- `companyDetails` — rows 1–8 (Registered name → Legacy ID (MB))
- `bankingDetails` — rows 9–13 (Share capital → VAT ID)
- `credits` — rows 14–15 (Website, Photos)

The existing 15 flat fields (`name`, `location`, `tel`, `email`, `oib`,
`board`, `mbs`, `mb`, `shareCapital`, `bank`, `iban`, `swift`, `vatId`,
`foto`, `website`) are **kept during rollout** and removed in a final cleanup
deploy (see Deployment order).

Dev seed (`demoContent.ts`) is updated to fill the three groups from the Excel
content for both locales. Seeding is dev-only and never overwrites published
entries, so it cannot affect production.

## Frontend (vercel-fe)

### Data layer

- `LegalPage` type: add `companyDetails`, `bankingDetails`, `credits` as
  optional `Array<{ label: string; value: string }>` alongside the existing
  flat fields; the flat fields are dropped in the cleanup phase.
- `getLegalPage` uses `populate=*` — NOT explicit
  `populate[companyDetails]`-style params, because Strapi returns a 400
  ValidationError when explicitly populating a field that does not exist in the
  schema yet. `populate=*` succeeds both before and after the CMS deploy
  (legal-page has no media, so it stays cheap).
- **Fallback assembly:** if the three arrays are absent or empty, the page
  builds the same three groups from the flat fields, using temporary
  hardcoded HR/EN labels (from the Excel) in `translations.ts`. When the CMS
  starts returning non-empty arrays, they take precedence — no FE change
  needed at switchover. The fetch layer uses `cache: "no-store"`, so published
  content appears immediately.

### Page & components

- `legal/page.tsx`: keeps the heading section (`t(locale).pages.legal`),
  passes the three groups to a rebuilt metadata component, and **removes the
  `ContactInfo` section and the `getFooter` call** — tel/email are now ordinary
  rows.
- `CompanyMetadata` is replaced by an `ImpressumDetails` component that renders
  the three groups in order. Rows with an empty label **and** empty value are
  skipped; groups with no rows are skipped.

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

## Deployment order (FE-first, works out of the box at switchover)

Production must never break. Each step is backward-compatible:

1. **Frontend deploy.** New design ships immediately, rendered from the
   existing flat fields via the fallback assembly (temporary FE labels).
   Verified on the Vercel preview against production CMS before merge.
   `populate=*` keeps the request valid against the current schema.
2. **CMS deploy (additive).** New component + three new fields; flat fields
   untouched. Arrays are empty, so the frontend keeps using the fallback —
   no visible change.
3. **Content entry (production admin).** Fill and publish the three groups for
   HR and EN from the Excel. Because the fetch is `no-store`, the frontend
   picks up the arrays on the next request and switches automatically —
   no deploy involved.
4. **Cleanup (contract).** CMS: remove the 15 flat fields, their admin
   metadata labels, and their seed entries. FE: remove the fallback assembly,
   temporary labels, and flat fields from the `LegalPage` type. Either order;
   FE cleanup can simply accompany the next regular release.

Rollback: before step 3, reverting the frontend deploy restores the old page
(flat fields untouched). After step 3, the old page would also still work
since flat fields remain populated until step 4.

## Testing

- `strapi-cms`: existing unit-test suite must pass (`pnpm test`); schema/seed
  changes verified by booting dev Strapi and checking the API response shape
  for `/api/legal-page?populate=...` in both locales.
- `vercel-fe`: lint + typecheck; render verification of `/en/legal` and
  `/hr/legal` against local Strapi at all four breakpoints.

## Out of scope

- Footer content/links (unchanged).
- Privacy policy, participation, EU projects pages.
- Page title/i18n route naming.
