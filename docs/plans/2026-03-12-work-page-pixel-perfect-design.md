# Work Page Pixel-Perfect Design

**Goal:** Make the work listing page pixel-perfect across all 4 breakpoints (320px, 768px, 1024px, 1440px), matching the Figma designs exactly. Apply `content-wrapper` for >1440px screens.

**Architecture:** Update `ProjectGallery`, `ProjectList`, and `Pagination` components with exact Figma measurements. Add `content-wrapper` to gallery section.

**Tech Stack:** Next.js, React, Tailwind CSS (arbitrary values)

---

## Components to Update

### 1. ProjectGallery (`src/components/project-gallery.tsx`)

**Layout changes per breakpoint:**

| Breakpoint | Layout | Image container | Side padding | Caption style |
|---|---|---|---|---|
| 320px (default) | 1 col, full-width | full viewport width | 0px (images), 12px (captions) | 16px/23px |
| 768px (md) | 1 col, centered | 564px wide, centered | auto (centered) | 20px/28px |
| 1024px (lg) | 2 col grid | 464px per image | left=40px | 20px/28px |
| 1440px (xl) | 2 col grid | 464px per image | left=248px | 20px/28px |

**Top padding (below header):**
- 320px: ~182px (header 54px + ~128px gap)
- 768px: ~160px (header 54px + ~106px gap)
- 1024px: ~208px (header 54px + ~154px gap)
- 1440px: ~208px (header 80px + ~128px gap)

**Grid gap (lg/xl):** ~16px between columns

**Key changes:**
- At 768px: images stack vertically (1 per row), centered at 564px width
- At 1024px/1440px: 2-col side-by-side layout
- Add `content-wrapper` to the gallery section
- Gallery images at 320px are full-bleed (no side padding on images)

### 2. ProjectList (`src/components/project-list.tsx`)

**Row dimensions:**

| Breakpoint | Row height | Visible columns |
|---|---|---|
| 320px | 60px (fixed) | year, title |
| 768px | 80px (fixed) | year, discipline, title |
| 1024px | 80px (fixed) | year, discipline, title, location, size |
| 1440px | 80px (fixed) | year, discipline, title, location, size |

**Column positions (left offset):**

| Column | 320px | 768px | 1024px | 1440px |
|---|---|---|---|---|
| Year | 12px | 44px | 40px | 88px |
| Discipline | hidden | 102px | 160px | 248px |
| Title | 89px | 276px | 280px | 408px |
| Title width | 219px | — | 344px | 384px |
| Location | hidden | hidden | 640px | 888px |
| Size | hidden | hidden | 880px | 1208px |

**Key changes:**
- Switch from flex layout to absolute/fixed positioning within rows for precise column alignment
- Fixed row heights: h-[60px] default, md:h-[80px]
- Already uses `BorderedSection` for full-width borders — keep as-is

### 3. Pagination (`src/components/pagination.tsx`)

**Container:**

| Breakpoint | Height | Border |
|---|---|---|
| 320px | 210px | border-b |
| 768px | 210px | border-b |
| 1024px | 340px | border-b |
| 1440px | 340px | border-b |

**Number positions:**

| Breakpoint | First number left | Gap between numbers |
|---|---|---|
| 320px | 12px | ~54px |
| 768px | 160px | ~58px |
| 1024px | ~160px | ~60px |
| 1440px | ~248px | ~80px |

**Key changes:**
- Add fixed height container with border-b
- Position numbers within the container (currently just flex with padding)
- Numbers vertically centered near bottom of container
- Add `content-wrapper` to pagination

### 4. Work Listing Page (`src/app/[locale]/work/page.tsx`)

- Add `content-wrapper` to gallery wrapper if not handled by component
- Section spacing between gallery and table: `mt-[100px] lg:mt-[100px] xl:mt-[120px]`

---

## Borders

All table row borders (`border-b`) remain full-viewport-width via `BorderedSection`. The gallery and pagination get `content-wrapper` for >1440px constraint.

## Out of Scope

- Work detail page (`/work/[slug]`) — already has `content-wrapper` on its components
- Header/footer — already updated in previous work
