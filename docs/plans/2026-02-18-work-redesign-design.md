# Work Page Redesign — Design Document

**Date:** 2026-02-18
**Branch:** `feat/work-redesign` (from `feat/homepage-redesign`)
**Scope:** Work list page + work detail page

---

## Overview

Redesign the work list page and work detail page to match the Figma design, replacing the current development/debug UI with a featured image gallery, tabular project list, hero carousel with captions, composition-based image layout, metadata grid, and prev/next navigation.

## Data Model

### Existing CMS types (no changes needed)

**`ProjectListing`**: title, slug, year, status, location, size, coverImage, program

**`ProjectDetail`** (extends `ProjectListing`): heading, description, completed, grossArea, investor, projectCode, siteArea, investmentValue, heroImages[], siteImages[], floorPlans[]

### Existing queries (reused as-is)

- `getWorkProjects(locale, page, pageSize)` — paginated list, sorted by year:desc
- `getWorkProjectBySlug(locale, slug)` — single project with all nested media

### New query

- `getWorkProjectSlugs(locale)` — lightweight fetch of all project slugs + titles (no pagination), for prev/next navigation on the detail page

---

## Work List Page (`/[locale]/work`)

### Featured Gallery (top section)

- Shows first **4 projects** from the current page with cover images
- **Image-driven layout**: image aspect ratio determines composition
  - Landscape (width/height > 1.2): can pair two side-by-side in a row
  - Portrait/square (ratio <= 1.2): single image per row
- **Mobile (<768px)**: single column, stacked full-width
- **md+**: 2-column grid for landscape pairs; single centered for portraits
- Project title below each image, linked to detail page
- Title typography: `text-[16px] leading-[23px]`

### All Projects Table (below gallery)

Tabular rows with horizontal dividers, same pattern as `NewsList`:

| Breakpoint | Columns |
|---|---|
| xl/lg (1024px+) | Year \| Status (UPPERCASE) \| Title \| Location \| Size (m²) |
| md (768px) | Year \| Status (UPPERCASE) \| Title |
| mobile (<768px) | Year \| Title |

- Typography: `text-[16px] leading-[23px]` with `[font-feature-settings:'onum'_1,'pnum'_1]`
- Each row is a link to the detail page
- Standard horizontal padding: `pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]`

### Pagination

Reuse existing `Pagination` component with `basePath="/work"`.

---

## Work Detail Page (`/[locale]/work/[slug]`)

### Hero Carousel

- Extend `HomepageCarousel` to support an optional `description` per slide
- Caption at bottom-left, numbered pagination at bottom-right (same row)
- Caption typography: `text-[16px] leading-[23px]` with oldstyle nums
- Same full-width image display and responsive heights as homepage

### Title

- Content indent: `pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]`
- Typography: `text-[20px]/[28px]` base, `min-[320px]:text-[28px]/[38px]`, `md:text-[38px]/[50px]`

### Description

- Same indent as title
- Plain text with `whitespace-pre-line`
- Typography: `text-[16px]/[23px]` base, scaling up at breakpoints

### Meta Grid

Label/value pairs from ProjectDetail fields (only shown when non-null):
- Location, Client (=investor), Status, Project (=projectCode), Completed, Site Area, Gross Area, Investment Value

Layout:
- **xl/lg/md**: 2-column grid of pairs (label1 | value1 | label2 | value2), rows separated by horizontal dividers
- **mobile**: stacked single column, each pair as label + value
- Labels: uppercase small text
- Values: standard text below labels

### Site Images — Composition Layout

- One image per row
- Images display at **natural aspect ratio** within a max-width constraint
- Images stick to either **left or right edge** of the content area
- Alignment: deterministic pseudo-random based on hash of (image index + project slug) — looks varied but stable across renders
- Caption below each image: `text-[16px] leading-[23px]`
- Mobile: images closer to full-width with less offset variation

### Floor Plans

Same composition layout as site images, applied to `data.floorPlans`.

### Project Navigation

- Three links: "Previous project" (left) | "All work" (center) | "Next project" (right)
- **Wraps around**: last project's "next" links to first, and vice versa
- Requires `getWorkProjectSlugs` to determine adjacent projects (sorted by year:desc)
- Mobile: `←` | "All work" | `→`
- Typography: `text-[16px] leading-[23px]`

---

## Files Changed

| File | Action |
|---|---|
| `src/components/homepage-carousel.tsx` | Extend with optional caption/description |
| `src/components/project-gallery.tsx` | Restyle — image-driven layout |
| `src/components/project-list.tsx` | Restyle — tabular rows with dividers |
| `src/components/project-detail-content.tsx` | Restyle — composition layout, meta grid |
| `src/components/project-navigation.tsx` | **New** — prev/next/all work links |
| `src/app/[locale]/work/page.tsx` | Restyle — gallery + table + pagination |
| `src/app/[locale]/work/[slug]/page.tsx` | Restyle — full detail page |
| `src/lib/cms.ts` | Add `getWorkProjectSlugs` query |
| `src/components/hero-carousel.tsx` | Remove (replaced by extended HomepageCarousel) |

## Design Decisions

- **Image-driven layout** (not CMS-controlled) for both the list gallery and detail composition — keeps CMS simple, leverages existing media metadata
- **Pseudo-random alignment** for detail images — uses deterministic hash so server renders are stable, but layout feels organic/editorial
- **Extend HomepageCarousel** rather than creating a new carousel — avoids duplication, the core pagination UX is identical
- **Lightweight slugs query** for prev/next — avoids fetching full project data just for navigation links
- **No new CMS types** — all fields already exist in ProjectListing/ProjectDetail
