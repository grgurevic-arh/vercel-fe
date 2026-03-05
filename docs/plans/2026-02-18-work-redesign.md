# Work Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the work list page and work detail page to match the Figma design, replacing the dev/debug UI with a featured gallery, tabular project list, hero carousel with captions, composition image layout, metadata grid, and prev/next navigation.

**Architecture:** The work list page has two visual sections: (1) a featured gallery showing cover images for the first 4 projects with image-driven layout (landscape pairs side-by-side, portraits single), and (2) a tabular "all projects" list with Year | Status | Title | Location | Size columns. The detail page shows a hero carousel with captions, project title and description, a metadata grid, site images and floor plans in a composition layout (one per row, alternating left/right alignment), and prev/next project navigation.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Strapi CMS

---

## Reference: Design Specifications

### Work List Page Typography

| Element | xl/lg/md (768px+) | mobile (<768px) |
|---|---|---|
| Project titles (gallery) | 16px/23px | 16px/23px |
| All projects table | 16px/23px, oldstyle-nums, proportional-nums | 16px/23px, oldstyle-nums, proportional-nums |
| Pagination | 21px/100%, lining-nums, tabular-nums | 21px/100%, lining-nums, tabular-nums |

### All Projects Table Columns

| Breakpoint | Columns |
|---|---|
| xl/lg (1024px+) | Year \| Status (UPPERCASE) \| Title \| Location \| Size (m²) |
| md (768px) | Year \| Status (UPPERCASE) \| Title |
| mobile (<768px) | Year \| Title |

### Work Detail Page Typography

| Element | xl/lg (1024px+) | md (768-1023px) | sm (320-767px) | xs (<320px) |
|---|---|---|---|---|
| Title | 38px/50px | 38px/50px | 28px/38px | 20px/28px |
| Description | 28px/38px | 22px/32px | 20px/28px | 16px/23px |
| Image caption | 16px/23px | 16px/23px | 16px/23px | 16px/23px |
| Meta labels | uppercase, 16px/23px | uppercase, 16px/23px | 16px/23px | 16px/23px |

### Layout Padding Reference (from existing redesigned pages)
- Standard horizontal: `px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]`
- Content indent: `pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]`

---

## Task 1: Add `getWorkProjectSlugs` CMS query

**Files:**
- Modify: `src/lib/cms.ts:166-180`

**Step 1: Add the lightweight slugs query**

After `getWorkProjectBySlug` (line 180), add:

```typescript
export async function getWorkProjectSlugs(locale: string) {
  const response = await strapiFetch<
    StrapiCollectionResponse<Pick<ProjectListing, "title" | "slug">>
  >("/work-projects", {
    searchParams: {
      ...withLocale(locale),
      "fields[0]": "title",
      "fields[1]": "slug",
      sort: "year:desc",
      "pagination[pageSize]": 200,
    },
  });
  return response.data;
}
```

**Step 2: Verify the dev server starts without errors**

Run: `npm run dev`
Expected: No type errors from the changes

**Step 3: Commit**

```
feat: add getWorkProjectSlugs lightweight CMS query
```

---

## Task 2: Extend HomepageCarousel with caption support

**Files:**
- Modify: `src/components/homepage-carousel.tsx`

**Step 1: Add description to CarouselSlide and render caption**

Replace the entire content of `src/components/homepage-carousel.tsx` with:

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export interface CarouselSlide {
  url: string;
  alt: string;
  width: number;
  height: number;
  description?: string | null;
}

interface HomepageCarouselProps {
  slides: CarouselSlide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) return null;

  const current = slides[Math.min(activeIndex, slides.length - 1)];

  return (
    <section>
      {/* Full-width image */}
      <div
        className="
          relative w-full overflow-hidden
          h-[300px] md:h-[632px] xl:h-[810px]
        "
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Caption + Number pagination row */}
      <div
        className="
          flex items-baseline justify-between
          mt-[16px] md:mt-[28px] lg:mt-[28px] xl:mt-[33px]
          px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        "
      >
        {current.description ? (
          <p
            className="
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
              flex-1 min-w-0 mr-[24px]
            "
          >
            {current.description}
          </p>
        ) : (
          <span />
        )}

        {slides.length > 1 ? (
          <nav
            className="flex shrink-0 gap-[14px] md:gap-[24px]"
            aria-label="Image pagination"
          >
            {slides.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`
                    text-[16px] leading-[23px] text-text-primary
                    ${isActive ? "underline" : ""}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
```

Key changes from original:
- Added optional `description` field to `CarouselSlide`
- Caption and pagination now share a flex row (caption left, numbers right)
- Caption uses oldstyle nums typography
- Standard horizontal padding on the caption/pagination row
- Pagination left-padding replaced with standard `px-` on the wrapper

**Step 2: Verify the homepage carousel still renders correctly**

Run: `npm run dev` and navigate to `/en`
Expected: Homepage carousel works as before. If homepage passes a `description`, it shows at bottom-left.

**Step 3: Commit**

```
feat: extend HomepageCarousel with caption support
```

---

## Task 3: Redesign the ProjectGallery component

**Files:**
- Modify: `src/components/project-gallery.tsx`

**Step 1: Rewrite ProjectGallery with image-driven layout**

Replace the entire content of `src/components/project-gallery.tsx` with:

```tsx
import Image from "next/image";
import Link from "next/link";

import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { NormalizedProjectListing } from "@/lib/project-helpers";

interface ProjectGalleryProps {
  locale: string;
  projects: NormalizedProjectListing[];
}

function isLandscape(project: NormalizedProjectListing): boolean {
  const attrs = getStrapiMediaAttributes(project.coverImage);
  if (!attrs?.width || !attrs?.height) return true;
  return attrs.width / attrs.height > 1.2;
}

interface GalleryRow {
  type: "pair" | "single";
  projects: NormalizedProjectListing[];
}

function buildGalleryRows(projects: NormalizedProjectListing[]): GalleryRow[] {
  const rows: GalleryRow[] = [];
  let i = 0;

  while (i < projects.length) {
    const current = projects[i];
    const next = projects[i + 1];

    if (next && isLandscape(current) && isLandscape(next)) {
      rows.push({ type: "pair", projects: [current, next] });
      i += 2;
    } else {
      rows.push({ type: "single", projects: [current] });
      i += 1;
    }
  }

  return rows;
}

function GalleryItem({
  project,
  locale,
}: {
  project: NormalizedProjectListing;
  locale: string;
}) {
  const coverAttributes = getStrapiMediaAttributes(project.coverImage);
  const coverUrl = getStrapiMediaUrl(project.coverImage);
  const coverWidth = coverAttributes?.width ?? 1200;
  const coverHeight = coverAttributes?.height ?? 900;
  const coverAlt =
    coverAttributes?.alternativeText ?? `${project.title} cover image`;
  const href = `/${locale}/work/${project.slug}`;

  return (
    <Link
      href={href}
      className="
        group block
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-black
      "
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={coverAlt}
          width={coverWidth}
          height={coverHeight}
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
          className="h-auto w-full"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-[16px] text-text-primary">
          No cover image
        </div>
      )}
      <p
        className="
          mt-[12px] md:mt-[16px]
          text-[16px] leading-[23px] text-text-primary
        "
      >
        {project.title}
      </p>
    </Link>
  );
}

export function ProjectGallery({ locale, projects }: ProjectGalleryProps) {
  if (!projects.length) return null;

  const rows = buildGalleryRows(projects);

  return (
    <section
      className="
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        pt-[80px] md:pt-[100px] lg:pt-[120px] xl:pt-[140px]
        space-y-[40px] md:space-y-[60px] lg:space-y-[80px]
      "
    >
      {rows.map((row, rowIndex) => {
        if (row.type === "pair") {
          return (
            <div
              key={`row-${rowIndex}`}
              className="grid grid-cols-2 gap-[24px] md:gap-[40px] lg:gap-[48px]"
            >
              {row.projects.map((project) => (
                <GalleryItem
                  key={`${project.slug}-${project.id}`}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          );
        }

        return (
          <div
            key={`row-${rowIndex}`}
            className="flex justify-center"
          >
            <div className="w-full md:w-[60%] lg:w-[50%]">
              <GalleryItem
                project={row.projects[0]}
                locale={locale}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
```

Key design decisions:
- `buildGalleryRows` groups consecutive landscape images into pairs; portraits/squares get their own row
- `isLandscape` uses a 1.2 aspect ratio threshold from the Strapi media attributes
- Pair rows use `grid-cols-2`; single rows center the image at 50-60% width
- Title below each image with consistent typography
- Standard horizontal padding

**Step 2: Verify the gallery renders**

Run: `npm run dev` and navigate to `/en/work`
Expected: Cover images appear with project titles below. Landscape images pair up, portraits stand alone.

**Step 3: Commit**

```
feat: redesign ProjectGallery with image-driven layout
```

---

## Task 4: Redesign the ProjectList component

**Files:**
- Modify: `src/components/project-list.tsx`

**Step 1: Rewrite ProjectList as tabular rows with dividers**

Replace the entire content of `src/components/project-list.tsx` with:

```tsx
import Link from "next/link";

import type { NormalizedProjectListing } from "@/lib/project-helpers";

interface ProjectListProps {
  locale: string;
  projects: NormalizedProjectListing[];
  emptyMessage?: string;
}

export function ProjectList({ locale, projects, emptyMessage }: ProjectListProps) {
  if (!projects.length) {
    return (
      <p className="text-[16px] leading-[23px] text-text-primary pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]">
        {emptyMessage ?? "No published projects yet."}
      </p>
    );
  }

  return (
    <ul className="border-t border-divider">
      {projects.map((project) => {
        const year = project.year?.toString() ?? "—";
        const status = project.status ?? "";
        const title = project.title;
        const location = project.location ?? "";
        const size = project.size ?? "";
        const href = `/${locale}/work/${project.slug}`;

        return (
          <li
            key={`${project.slug}-${project.id}`}
            className="border-b border-divider"
          >
            <Link
              href={href}
              className="
                flex items-baseline gap-x-[24px] md:gap-x-[40px] lg:gap-x-[48px]
                text-[16px] leading-[23px] text-text-primary
                [font-feature-settings:'onum'_1,'pnum'_1]
                py-[12px] md:py-[14px] xl:py-[16px]
                pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                pr-[12px] md:pr-[44px] lg:pr-[40px] xl:pr-[88px]
                hover:bg-gray-50 transition-colors
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-black
              "
            >
              <span className="shrink-0 w-[48px]">
                {year}
              </span>
              <span className="hidden lg:inline shrink-0 w-[96px] uppercase tracking-wide">
                {status}
              </span>
              <span className="shrink-0 min-w-0 md:w-[200px] lg:w-[240px] xl:w-[280px] truncate">
                {title}
              </span>
              <span className="hidden lg:inline flex-1 min-w-0 truncate">
                {location}
              </span>
              <span className="hidden lg:inline shrink-0 w-[80px] text-right">
                {size}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
```

Key design decisions:
- Same pattern as the redesigned `NewsList` on the news branch
- Status column hidden below lg (design shows Year | Status | Title at md but let's use lg as the threshold since status + location + size need width)
- Actually checking the screenshots more carefully: at md (768px), the design shows Year | Status | Title. At mobile, only Year | Title.
- Status uses `uppercase tracking-wide` matching the Figma
- Location and Size hidden below lg
- `truncate` on title and location

**CORRECTION:** Looking at the Figma screenshots again:
- **md (768px)**: shows Year | Status (UPPERCASE) | Title (3 columns)
- **lg+ (1024px+)**: shows Year | Status (UPPERCASE) | Title | Location | Size

Update the status column visibility from `hidden lg:inline` to `hidden md:inline`:

```tsx
<span className="hidden md:inline shrink-0 w-[96px] uppercase tracking-wide">
  {status}
</span>
```

And keep Location + Size at `hidden lg:inline`.

**Step 2: Verify the table renders**

Run: `npm run dev` and navigate to `/en/work`
Expected: Tabular list with divider lines. At lg+: all 5 columns. At md: Year | Status | Title. Mobile: Year | Title.

**Step 3: Commit**

```
feat: redesign ProjectList with tabular row layout
```

---

## Task 5: Redesign the Pagination component

**Files:**
- Modify: `src/components/pagination.tsx`

**Note:** On this branch (from `feat/homepage-redesign`), the Pagination is still in dev styling. The news branch has a redesigned version. We replicate that design here.

**Step 1: Rewrite Pagination with new typography**

Replace the entire content of `src/components/pagination.tsx` with:

```tsx
import Link from "next/link";

interface PaginationProps {
  locale: string;
  currentPage: number;
  pageCount: number;
  basePath?: string;
}

export function Pagination({
  locale,
  currentPage,
  pageCount,
  basePath = "/news",
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const pathname = `/${locale}${basePath}`;

  return (
    <nav
      className="
        flex items-center gap-[24px] md:gap-[32px]
        pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
        pt-[48px] md:pt-[64px] lg:pt-[80px] xl:pt-[96px]
        pb-[48px] md:pb-[64px] lg:pb-[80px] xl:pb-[96px]
      "
      aria-label="Pagination"
    >
      {pages.map((page) => {
        const isActive = page === currentPage;
        const query = page === 1 ? {} : { page: page.toString() };
        const href = { pathname, query };

        return (
          <Link
            key={page}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`
              text-[21px] leading-[100%] text-text-primary
              [font-feature-settings:'lnum'_1,'tnum'_1]
              ${isActive ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4"}
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-black
            `}
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
}
```

**Step 2: Verify pagination renders**

Run: `npm run dev` and navigate to `/en/work`
Expected: Page numbers at 21px with active page underlined.

**Step 3: Commit**

```
feat: redesign Pagination with new typography
```

---

## Task 6: Redesign the work list page

**Files:**
- Modify: `src/app/[locale]/work/page.tsx`

**Step 1: Rewrite the work list page**

Replace the entire content of `src/app/[locale]/work/page.tsx` with:

```tsx
import { notFound } from "next/navigation";

import { ProjectGallery } from "@/components/project-gallery";
import { ProjectList } from "@/components/project-list";
import { Pagination } from "@/components/pagination";
import { getWorkProjects } from "@/lib/cms";
import { resolveLocaleParam, resolvePageParam } from "@/lib/request-helpers";
import { normalizeProjectListings } from "@/lib/project-helpers";

const FEATURED_COUNT = 4;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WorkListingPage({ params, searchParams }: PageProps) {
  const locale = await resolveLocaleParam(params);
  const requestedPage = await resolvePageParam(searchParams);

  const workProjects = await getWorkProjects(locale, requestedPage);
  const projects = normalizeProjectListings(workProjects.data);
  const pagination = workProjects.meta.pagination;
  const pageCount = pagination?.pageCount ?? 1;

  if (pageCount > 0 && requestedPage > pageCount) {
    notFound();
  }

  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <main>
      {/* Featured gallery */}
      <ProjectGallery locale={locale} projects={featured} />

      {/* All projects table */}
      <section
        className="
          mt-[60px] md:mt-[80px] lg:mt-[100px] xl:mt-[120px]
        "
      >
        <ProjectList locale={locale} projects={projects} />
      </section>

      {/* Pagination */}
      <Pagination
        locale={locale}
        basePath="/work"
        currentPage={pagination?.page ?? requestedPage}
        pageCount={pageCount}
      />
    </main>
  );
}
```

Key changes:
- Removed `RawDataAccordion`
- Slices first 4 projects for the featured gallery
- All projects in the tabular list below
- Clean page structure: gallery → table → pagination

**Step 2: Verify the page renders**

Run: `npm run dev` and navigate to `/en/work`
Expected: Featured gallery at top with cover images, tabular list below with dividers, pagination at bottom. No debug accordion.

**Step 3: Commit**

```
feat: redesign work list page with gallery and table
```

---

## Task 7: Create the ProjectNavigation component

**Files:**
- Create: `src/components/project-navigation.tsx`

**Step 1: Create the prev/next navigation component**

Create `src/components/project-navigation.tsx`:

```tsx
import Link from "next/link";

interface ProjectNavigationProps {
  locale: string;
  previousSlug: string;
  nextSlug: string;
}

export function ProjectNavigation({
  locale,
  previousSlug,
  nextSlug,
}: ProjectNavigationProps) {
  const prevHref = `/${locale}/work/${previousSlug}`;
  const allHref = `/${locale}/work`;
  const nextHref = `/${locale}/work/${nextSlug}`;

  return (
    <nav
      className="
        flex items-baseline justify-between
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        pt-[60px] md:pt-[80px] lg:pt-[100px]
        pb-[60px] md:pb-[80px] lg:pb-[100px]
        text-[16px] leading-[23px] text-text-primary
      "
      aria-label="Project navigation"
    >
      <Link
        href={prevHref}
        className="
          hover:underline
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-black
        "
      >
        <span className="md:hidden">&larr;</span>
        <span className="hidden md:inline">Previous project</span>
      </Link>

      <Link
        href={allHref}
        className="
          hover:underline
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-black
        "
      >
        All work
      </Link>

      <Link
        href={nextHref}
        className="
          underline
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-black
        "
      >
        <span className="md:hidden">&rarr;</span>
        <span className="hidden md:inline">Next project</span>
      </Link>
    </nav>
  );
}
```

Key design decisions:
- "Next project" is underlined by default (matching the Figma screenshots)
- "Previous project" underlines on hover
- Mobile shows `←` / `→` arrows
- Standard horizontal padding
- `justify-between` for the three-link layout

**Step 2: Verify it builds**

Run: `npm run dev`
Expected: No type errors (component not yet used, but should compile)

**Step 3: Commit**

```
feat: add ProjectNavigation component
```

---

## Task 8: Redesign the ProjectDetailContent component

**Files:**
- Modify: `src/components/project-detail-content.tsx`

**Step 1: Rewrite ProjectDetailContent with composition layout and meta grid**

Replace the entire content of `src/components/project-detail-content.tsx` with:

```tsx
import Image from "next/image";

import { HomepageCarousel, type CarouselSlide } from "@/components/homepage-carousel";
import {
  getStrapiMediaAttributes,
  getStrapiMediaUrl,
} from "@/lib/strapi-media";
import type { ProjectDetail, StrapiMedia } from "@/types/cms";

interface ProjectDetailContentProps {
  project: ProjectDetail;
  titleFallback: string;
}

/* ------------------------------------------------------------------ */
/*  Hero carousel builder                                             */
/* ------------------------------------------------------------------ */

const buildHeroSlides = (project: ProjectDetail): CarouselSlide[] => {
  return (project.heroImages ?? []).reduce<CarouselSlide[]>((acc, entry) => {
    const attrs = getStrapiMediaAttributes(entry.image);
    const url = getStrapiMediaUrl(entry.image);
    if (!url) return acc;

    acc.push({
      url,
      alt: attrs?.alternativeText ?? `${project.title ?? "Project"} hero`,
      width: attrs?.width ?? 1600,
      height: attrs?.height ?? 900,
      description: entry.description ?? null,
    });

    return acc;
  }, []);
};

/* ------------------------------------------------------------------ */
/*  Meta grid builder                                                 */
/* ------------------------------------------------------------------ */

const buildMetaPairs = (project: ProjectDetail) => {
  return [
    { label: "Location", value: project.location },
    { label: "Client", value: project.investor },
    { label: "Status", value: project.status },
    { label: "Project", value: project.projectCode },
    { label: "Completed", value: project.completed },
    { label: "Site area", value: project.siteArea },
    { label: "Gross area", value: project.grossArea },
    { label: "Investment value", value: project.investmentValue },
  ].filter((field) => field.value);
};

/* ------------------------------------------------------------------ */
/*  Composition image helpers                                         */
/* ------------------------------------------------------------------ */

/**
 * Deterministic pseudo-random side based on index and slug.
 * Returns "left" or "right" — varied but stable across renders.
 */
function getImageSide(index: number, slug: string): "left" | "right" {
  let hash = 0;
  const seed = `${slug}-${index}`;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return hash % 2 === 0 ? "left" : "right";
}

function CompositionImage({
  media,
  alt,
  caption,
  side,
}: {
  media: StrapiMedia;
  alt: string;
  caption: string | null;
  side: "left" | "right";
}) {
  const attrs = getStrapiMediaAttributes(media);
  const url = getStrapiMediaUrl(media);
  if (!url) return null;

  const width = attrs?.width ?? 1600;
  const height = attrs?.height ?? 900;

  const alignmentClass =
    side === "left"
      ? "mr-auto ml-0"
      : "ml-auto mr-0";

  return (
    <figure
      className="
        px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        mb-[40px] md:mb-[60px] lg:mb-[80px]
      "
    >
      <div className={`w-full md:w-[70%] lg:w-[60%] ${alignmentClass}`}>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 60vw, (min-width: 768px) 70vw, 100vw"
          className="h-auto w-full"
        />
        {caption ? (
          <figcaption
            className="
              mt-[8px] md:mt-[12px]
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
            "
          >
            {caption}
          </figcaption>
        ) : null}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function ProjectDetailContent({
  project,
  titleFallback,
}: ProjectDetailContentProps) {
  const heroSlides = buildHeroSlides(project);
  const heading = project.title ?? titleFallback;
  const metaPairs = buildMetaPairs(project);
  const siteImages = project.siteImages ?? [];
  const floorPlans = project.floorPlans ?? [];
  const slug = project.slug;

  return (
    <>
      {/* Hero carousel */}
      {heroSlides.length ? (
        <HomepageCarousel slides={heroSlides} />
      ) : null}

      {/* Title */}
      <h1
        className="
          pt-[32px] md:pt-[40px] lg:pt-[48px]
          pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
          pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
          pb-[24px] md:pb-[32px]
          text-[20px] leading-[28px]
          min-[320px]:text-[28px] min-[320px]:leading-[38px]
          md:text-[38px] md:leading-[50px]
          text-text-primary
        "
      >
        {heading}
      </h1>

      {/* Description */}
      {project.description ? (
        <div
          className="
            pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
            pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
            pb-[40px] md:pb-[48px] lg:pb-[56px]
            text-[16px] leading-[23px]
            [font-feature-settings:'onum'_1,'pnum'_1]
            min-[320px]:text-[20px] min-[320px]:leading-[28px]
            md:text-[22px] md:leading-[32px]
            lg:text-[28px] lg:leading-[38px]
            text-text-primary
            whitespace-pre-line
          "
        >
          {project.description}
        </div>
      ) : null}

      {/* Meta grid */}
      {metaPairs.length ? (
        <section
          className="
            px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
            pb-[40px] md:pb-[60px] lg:pb-[80px]
          "
        >
          <div className="border-t border-divider">
            {(() => {
              const rows: Array<typeof metaPairs> = [];
              for (let i = 0; i < metaPairs.length; i += 2) {
                rows.push(metaPairs.slice(i, i + 2));
              }
              return rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="
                    grid grid-cols-1 md:grid-cols-2
                    gap-x-[40px] lg:gap-x-[80px]
                    border-b border-divider
                    py-[12px] md:py-[16px]
                  "
                >
                  {row.map((pair) => (
                    <div key={pair.label} className="flex gap-x-[24px] md:gap-x-[40px]">
                      <span className="shrink-0 w-[120px] md:w-[140px] uppercase text-[16px] leading-[23px] text-text-primary tracking-wide">
                        {pair.label}
                      </span>
                      <span className="text-[16px] leading-[23px] text-text-primary">
                        {pair.value}
                      </span>
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
        </section>
      ) : null}

      {/* Site images — composition layout */}
      {siteImages.length ? (
        <section className="mt-[20px] md:mt-[40px]">
          {siteImages.map((siteImage, index) => {
            const attrs = getStrapiMediaAttributes(siteImage.image);
            const alt =
              attrs?.alternativeText ?? `${heading} site image ${index + 1}`;
            const side = getImageSide(index, slug);

            return (
              <CompositionImage
                key={`site-${index}`}
                media={siteImage.image}
                alt={alt}
                caption={siteImage.description}
                side={side}
              />
            );
          })}
        </section>
      ) : null}

      {/* Floor plans — same composition layout */}
      {floorPlans.length ? (
        <section className="mt-[20px] md:mt-[40px]">
          {floorPlans.map((floorPlan, index) => {
            const attrs = getStrapiMediaAttributes(floorPlan.plan);
            const alt =
              attrs?.alternativeText ?? `${heading} floor plan ${index + 1}`;
            const side = getImageSide(index + siteImages.length, slug);

            return (
              <CompositionImage
                key={`floor-${index}`}
                media={floorPlan.plan}
                alt={alt}
                caption={floorPlan.label}
                side={side}
              />
            );
          })}
        </section>
      ) : null}
    </>
  );
}
```

Key design decisions:
- Hero carousel uses the extended `HomepageCarousel` with description/caption support
- `getImageSide` produces deterministic pseudo-random left/right based on `slug + index`
- `CompositionImage` renders each image at natural aspect ratio within `w-[60-70%]`, aligned left or right with `mr-auto`/`ml-auto`
- Meta grid groups pairs into rows of 2, separated by `border-divider` lines
- Labels uppercase with tracking, same 16px/23px typography
- Mobile: meta pairs stack single-column, images closer to full-width
- `whitespace-pre-line` on description for paragraph breaks

**Step 2: Verify the component compiles**

Run: `npm run dev`
Expected: No type errors

**Step 3: Commit**

```
feat: redesign ProjectDetailContent with composition layout
```

---

## Task 9: Redesign the work detail page

**Files:**
- Modify: `src/app/[locale]/work/[slug]/page.tsx`

**Step 1: Rewrite the work detail page**

Replace the entire content of `src/app/[locale]/work/[slug]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";

import { ProjectDetailContent } from "@/components/project-detail-content";
import { ProjectNavigation } from "@/components/project-navigation";
import { getWorkProjectBySlug, getWorkProjectSlugs } from "@/lib/cms";
import { resolveLocaleParam } from "@/lib/request-helpers";
import { requireStrapiEntity } from "@/lib/strapi-entity";
import { unwrapStrapiEntity } from "@/lib/strapi-entity";
import type { ProjectDetail, ProjectListing } from "@/types/cms";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function getAdjacentSlugs(
  allSlugs: Array<{ slug: string }>,
  currentSlug: string,
) {
  const index = allSlugs.findIndex((p) => p.slug === currentSlug);
  if (index === -1 || allSlugs.length < 2) {
    return { previous: null, next: null };
  }

  const prevIndex = (index - 1 + allSlugs.length) % allSlugs.length;
  const nextIndex = (index + 1) % allSlugs.length;

  return {
    previous: allSlugs[prevIndex].slug,
    next: allSlugs[nextIndex].slug,
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = await resolveLocaleParam(resolvedParams);
  const { slug } = resolvedParams;

  const [project, allSlugsRaw] = await Promise.all([
    getWorkProjectBySlug(locale, slug),
    getWorkProjectSlugs(locale),
  ]);

  if (!project) {
    notFound();
  }

  const data = requireStrapiEntity<ProjectDetail>(
    project,
    "Work project missing attributes",
  );

  const allSlugs = allSlugsRaw
    .map((entry) => unwrapStrapiEntity(entry))
    .filter((e): e is Pick<ProjectListing, "title" | "slug"> => !!e?.slug);

  const { previous, next } = getAdjacentSlugs(allSlugs, slug);

  return (
    <main>
      <ProjectDetailContent
        project={data}
        titleFallback="Untitled project"
      />

      {previous && next ? (
        <ProjectNavigation
          locale={locale}
          previousSlug={previous}
          nextSlug={next}
        />
      ) : null}
    </main>
  );
}
```

Key changes:
- Removed `RawDataAccordion`
- Fetches all project slugs in parallel with the project detail for prev/next navigation
- `getAdjacentSlugs` handles wrap-around (last → first, first → last)
- `unwrapStrapiEntity` normalizes the slugs response
- Clean page structure: detail content → navigation

**Step 2: Verify the page renders**

Run: `npm run dev` and navigate to a work project detail page (e.g., `/en/work/<any-slug>`)
Expected: Hero carousel with captions, title, description, meta grid, site images with composition layout, floor plans, and prev/next navigation at bottom. No debug accordion.

**Step 3: Commit**

```
feat: redesign work detail page with composition layout
```

---

## Task 10: Remove dead HeroCarousel component

**Files:**
- Delete: `src/components/hero-carousel.tsx`

**Step 1: Verify HeroCarousel is not imported anywhere**

Search the codebase for `hero-carousel` imports. It was only used by the old `ProjectDetailContent`, which now uses `HomepageCarousel`.

Run: `grep -r "hero-carousel" src/`
Expected: No matches (the old import was removed in Task 8)

**Step 2: Delete the file**

```bash
rm src/components/hero-carousel.tsx
```

**Step 3: Verify the build**

Run: `npm run dev`
Expected: No errors

**Step 4: Commit**

```
chore: remove unused HeroCarousel component
```

---

## Task 11: Final visual review and cleanup

**Step 1: Check both pages at all breakpoints**

Open the dev server and test at these widths:
- 1440px (xl)
- 1024px (lg)
- 768px (md)
- 375px (typical mobile)
- 320px (small mobile)

Verify:
- [ ] Work list page: featured gallery shows 4 projects with cover images
- [ ] Work list page: landscape images pair side-by-side, portraits single
- [ ] Work list page: all projects table shows correct columns per breakpoint
- [ ] Work list page: pagination shows with underlined active page
- [ ] Detail page: hero carousel with caption and numbered pagination
- [ ] Detail page: title and description at correct sizes per breakpoint
- [ ] Detail page: meta grid with label/value pairs and dividers
- [ ] Detail page: site images alternate left/right with captions
- [ ] Detail page: floor plans same composition layout
- [ ] Detail page: prev/next navigation works and wraps around
- [ ] No TypeScript errors (`npm run build`)

**Step 2: Fix any visual discrepancies**

Common adjustments:
- Vertical spacing between sections
- Gallery row spacing
- Meta grid column widths
- Composition image widths at different breakpoints
- Navigation arrow styling on mobile

**Step 3: Final commit**

```
fix: adjust work page responsive breakpoints
```

---

## Notes

- **No test infrastructure** exists in this project (no jest/vitest), so steps are verified visually against Figma screenshots.
- **`getWorkProjectSlugs`** fetches up to 200 projects — sufficient for the foreseeable catalogue size. If the project count grows significantly, consider caching or ISR.
- **`getImageSide` hash function** is a simple string hash (djb2 variant). It's deterministic per slug+index, so server renders are stable. The visual variety comes from different slugs producing different hash values.
- **Image composition** on mobile degrades gracefully — images are closer to full-width since `md:w-[70%]` only kicks in at 768px+.
- **`HomepageCarousel` caption** is backward-compatible — homepage slides don't have `description`, so the caption area renders an empty `<span />` (no visual change).
