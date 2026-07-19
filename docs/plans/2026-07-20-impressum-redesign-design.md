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
  `Array<{ label: string; value: string }>`; drop the flat fields once the
  CMS cleanup ships.
- `getLegalPage` adds populate params for the three component fields.

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

## Deployment order (expand → migrate → contract)

Production must never break. Each step is backward-compatible:

1. **CMS deploy (additive).** New component + three new fields; flat fields
   untouched. Live frontend still reads flat fields — no visible change.
2. **Content entry (production admin).** Fill and publish the three groups for
   HR and EN from the Excel. Old frontend ignores the new fields — still no
   visible change.
3. **Frontend deploy.** New page reads only the component fields. Verify the
   Vercel preview against production CMS (content already published), then
   merge — production flips atomically with real data.
4. **CMS cleanup deploy (contract).** Remove the 15 flat fields, their admin
   metadata labels, and their seed entries. Nothing reads them anymore.

Rollback: until step 4, reverting the frontend deploy fully restores the old
page because the flat fields remain populated.

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
