# Work Details Page Pixel-Perfect Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the work detail page (`work/[slug]`) pixel-perfect according to Figma designs across all 4 breakpoints (320, 768, 1024, 1440).

**Architecture:** In-place refactoring of existing components. One new file (`ProjectHeroCarousel`), three modified files. No new dependencies.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4

**Spec:** `docs/plans/2026-03-17-work-details-pixel-perfect-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/project-hero-carousel.tsx` | **Create** | Inset hero carousel with caption + numbered pagination |
| `src/components/project-detail-content.tsx` | **Modify** | Update hero usage, indents, description typography, meta table, composition images |
| `src/components/project-navigation.tsx` | **Modify** | Fixed height, borders, absolute positioning, larger text, i18n |
| `src/app/[locale]/work/[slug]/page.tsx` | **Modify** | Minor — pass `locale` to `ProjectNavigation` if not already |

---

### Task 1: Create `ProjectHeroCarousel` Component

**Files:**
- Create: `src/components/project-hero-carousel.tsx`

**Reference:** Spec Section 1. Also see existing `src/components/homepage-carousel.tsx` for the `CarouselSlide` type and pagination pattern.

- [ ] **Step 1: Create the component file**

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";

import type { CarouselSlide } from "@/components/homepage-carousel";

interface ProjectHeroCarouselProps {
  slides: CarouselSlide[];
}

export function ProjectHeroCarousel({ slides }: ProjectHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) return null;

  const current = slides[Math.min(activeIndex, slides.length - 1)];

  return (
    <section className="content-wrapper">
      {/* Hero image — inset from left, NOT full-width */}
      <div
        className="
          relative overflow-hidden
          w-full md:w-[680px] lg:w-[824px] xl:w-[944px]
          h-[208px] md:h-[440px] lg:h-[531px] xl:h-[608px]
          ml-0 md:ml-[44px] lg:ml-[100px] xl:ml-[248px]
        "
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="(min-width: 1440px) 944px, (min-width: 1024px) 824px, (min-width: 768px) 680px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Caption + Pagination row */}
      <div
        className="
          flex justify-between items-baseline
          mt-[8px] md:mt-[12px]
          pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
          pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
        "
      >
        {/* Caption */}
        {current.description ? (
          <p
            className="
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
            "
          >
            {current.description}
          </p>
        ) : <span />}

        {/* Pagination numbers */}
        {slides.length > 1 ? (
          <nav
            className="flex gap-[24px]"
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
                    [font-feature-settings:'onum'_1,'pnum'_1]
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

- [ ] **Step 2: Verify the component renders**

Run: `npm run dev`
Navigate to any work detail page and verify the hero renders (it won't be wired up yet — this is just a type check).

- [ ] **Step 3: Commit**

```bash
git add src/components/project-hero-carousel.tsx
git commit -m "feat: add ProjectHeroCarousel component for inset work detail hero"
```

---

### Task 2: Update Title, Description & Hero in `ProjectDetailContent`

**Files:**
- Modify: `src/components/project-detail-content.tsx`

**Reference:** Spec Sections 1 and 2. The key changes:
- Replace `HomepageCarousel` with `ProjectHeroCarousel`
- Update left indent from `pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]` to `pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]`
- Description typography: remove responsive scaling, fix at `text-[16px] leading-[23px]`
- Description max-width: `max-w-[296px] md:max-w-[680px] lg:max-w-[824px] xl:max-w-[864px]`

- [ ] **Step 1: Replace hero import and usage**

In `project-detail-content.tsx`:
- Replace the `HomepageCarousel` import with `ProjectHeroCarousel`, keeping the `CarouselSlide` type import:
  ```tsx
  // Before:
  import { HomepageCarousel, type CarouselSlide } from "@/components/homepage-carousel";
  // After:
  import type { CarouselSlide } from "@/components/homepage-carousel";
  import { ProjectHeroCarousel } from "@/components/project-hero-carousel";
  ```
- Replace `<HomepageCarousel slides={heroSlides} />` with `<ProjectHeroCarousel slides={heroSlides} />`

- [ ] **Step 2: Update title left indent**

Change the `<h1>` className from:
```
pl-[12px] md:pl-[159px] lg:pl-[220px] xl:pl-[408px]
pr-[12px] md:pr-[103px] lg:pr-[160px] xl:pr-[248px]
```
To:
```
pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
```

Also update title font sizes from current responsive scaling to:
```
text-[20px] leading-[28px]
md:text-[28px] md:leading-[38px]
```
(Remove the `min-[320px]` override — it's replaced by the md breakpoint.)

- [ ] **Step 3: Update projectCode left indent**

Same indent change for the `projectCode` `<p>`:
```
pl-[12px] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
pr-[12px] md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
```

- [ ] **Step 4: Update description typography and indent**

Change description `<div>` className:
- Same left/right indent as title
- Remove responsive text scaling (`min-[320px]:text-[20px]`, `md:text-[22px]`, `lg:text-[28px]`)
- Add max-width constraint: `max-w-[296px] md:max-w-[680px] lg:max-w-[824px] xl:max-w-[864px]`
- The `BlocksRenderer` className should be: `text-[16px] leading-[23px] [font-feature-settings:'onum'_1,'pnum'_1] text-text-primary [&>p]:mb-[16px] [&>p:last-child]:mb-0`

- [ ] **Step 5: Verify visually**

Run: `npm run dev`
Check work detail page at all breakpoints (320, 768, 1024, 1440). Verify:
- Hero is inset, not full-width
- Title aligns with hero left edge
- Description is 16px at all breakpoints
- Description width matches spec

- [ ] **Step 6: Commit**

```bash
git add src/components/project-detail-content.tsx
git commit -m "feat: update work detail hero, title, and description to match Figma"
```

---

### Task 3: Update Meta Table to Full-Width Borders

**Files:**
- Modify: `src/components/project-detail-content.tsx`

**Reference:** Spec Section 3 and `src/app/[locale]/office/page.tsx` lines 117-145 for the full-width border pattern.

The key change: borders must span full viewport width. Currently the meta section wraps everything in `content-wrapper` with padding — this prevents borders from reaching the edges. Note: the meta table uses **standard padding** (`xl:pl-[88px]`), NOT the wider work-detail indent (`xl:pl-[248px]`) used by hero/title/description/images — this is intentional per the Figma design.

- [ ] **Step 1: Restructure the meta grid**

Replace the current meta section (lines ~212-249 in `project-detail-content.tsx`) with the office page pattern:

```tsx
{metaPairs.length ? (
  <section className="pb-[40px] md:pb-[60px] lg:pb-[80px]">
    <div className="border-t border-divider">
      {(() => {
        const rows: Array<typeof metaPairs> = [];
        for (let i = 0; i < metaPairs.length; i += 2) {
          rows.push(metaPairs.slice(i, i + 2));
        }
        return rows.map((row, rowIndex) => (
          <BorderedSection
            key={rowIndex}
            border="border-b border-divider"
            className={`
              grid grid-cols-1 min-[321px]:grid-cols-2
              h-[70px] lg:h-[90px] xl:h-[80px]
            `}
          >
            {row.map((pair, i) => (
              <div
                key={pair.label}
                className={`
                  flex flex-col lg:flex-row lg:items-center
                  py-[12px] md:py-[12px] lg:py-0 xl:py-0
                  pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
                  pr-[12px] md:pr-[20px]
                  ${i === 0 && row.length > 1 ? "border-b border-divider min-[321px]:border-b-0" : ""}
                `}
              >
                <span
                  className="
                    shrink-0 uppercase
                    text-[16px] leading-[22px] tracking-[0.48px]
                    text-text-primary
                    [font-feature-settings:'onum'_1,'pnum'_1]
                    lg:w-[130px] xl:w-[150px]
                  "
                >
                  {pair.label}
                </span>
                <span
                  className="
                    text-[16px] leading-[23px] text-text-primary
                    [font-feature-settings:'onum'_1,'pnum'_1]
                  "
                >
                  {pair.value}
                </span>
              </div>
            ))}
          </BorderedSection>
        ));
      })()}
    </div>
  </section>
) : null}
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`
Check at all breakpoints:
- Borders span full width (no gap at edges)
- Content is properly indented inside
- Row heights match spec (70px on md/mobile, 90px on lg, 80px on xl)
- Labels stacked above values on md/mobile, side-by-side on lg/xl

- [ ] **Step 3: Commit**

```bash
git add src/components/project-detail-content.tsx
git commit -m "feat: update meta table with full-width borders matching office page pattern"
```

---

### Task 4: Update Composition Images to Be Orientation-Aware

**Files:**
- Modify: `src/components/project-detail-content.tsx`

**Reference:** Spec Section 4. Key changes:
- Detect orientation from Strapi image dimensions (`width > height` = landscape)
- Landscape: full content-area width
- Portrait: 50% content-area width, sticking to left or right edge
- Content area uses same indent as hero: `pl-[0] md:pl-[44px] lg:pl-[100px] xl:pl-[248px]`
- Mobile: all full-width

- [ ] **Step 1: Update `CompositionImage` component**

Replace the existing `CompositionImage` component with orientation-aware logic:

```tsx
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
  const isPortrait = height >= width;

  // Portrait images are 50% of content area, landscape are full width
  const widthClass = isPortrait
    ? "w-full md:w-[340px] lg:w-[412px] xl:w-[472px]"
    : "w-full md:w-[680px] lg:w-[824px] xl:w-[944px]";

  // Portrait images stick to left or right edge of the content area
  const alignmentClass = isPortrait
    ? side === "left"
      ? ""
      : "md:ml-auto"
    : "";

  return (
    <figure
      className="
        content-wrapper
        pl-0 md:pl-[44px] lg:pl-[100px] xl:pl-[248px]
        pr-0 md:pr-[44px] lg:pr-[100px] xl:pr-[248px]
        mb-[90px]
      "
    >
      <div className={`${widthClass} ${alignmentClass}`}>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          sizes={
            isPortrait
              ? "(min-width: 1440px) 472px, (min-width: 1024px) 412px, (min-width: 768px) 340px, 100vw"
              : "(min-width: 1440px) 944px, (min-width: 1024px) 824px, (min-width: 768px) 680px, 100vw"
          }
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
```

- [ ] **Step 2: Update site images and floor plans sections**

Update the padding/margin on the `<section>` wrappers for site images and floor plans to remove the old `mt-[20px]` values, since spacing is now handled by `mb-[90px]` on each `CompositionImage`. Note: the fixed `mb-[90px]` deliberately replaces the current responsive spacing (`mb-[40px] md:mb-[60px] lg:mb-[80px]`) per the Figma design.

- [ ] **Step 3: Verify visually**

Run: `npm run dev`
Check at all breakpoints:
- Landscape images span full content width
- Portrait images are ~50% width, stuck to left or right edge
- Mobile: all images are full-width
- Captions appear below each image
- Floor plans follow same rules

- [ ] **Step 4: Commit**

```bash
git add src/components/project-detail-content.tsx
git commit -m "feat: update composition images with orientation-aware sizing"
```

---

### Task 5: Update `ProjectNavigation` Component

**Files:**
- Modify: `src/components/project-navigation.tsx`

**Reference:** Spec Section 5 and `src/components/contact-info.tsx` for the absolute positioning pattern with fixed height.

- [ ] **Step 1: Rewrite the navigation component**

Replace the entire component with the ContactInfo-style pattern:

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
  const hr = locale === "hr";
  const prevHref = `/${locale}/work/${previousSlug}`;
  const allHref = `/${locale}/work`;
  const nextHref = `/${locale}/work/${nextSlug}`;

  const prevLabel = hr ? "Prethodni projekt" : "Previous project";
  const allLabel = hr ? "Svi radovi" : "All work";
  const nextLabel = hr ? "Sljedeći projekt" : "Next project";

  return (
    <nav
      className="border-t border-b border-divider"
      aria-label="Project navigation"
    >
      <div
        className="
          content-wrapper relative
          h-[132px] md:h-[240px] lg:h-[444px] xl:h-[544px]
        "
      >
        {/* Previous project */}
        <Link
          href={prevHref}
          className="
            absolute
            left-[12px] md:left-[44px] lg:left-[40px] xl:left-[88px]
            top-[52px] md:top-[101px] lg:top-[203px] xl:top-[253px]
            text-[20px] leading-[28px]
            md:text-[28px] md:leading-[38px]
            text-text-primary
            [font-feature-settings:'onum'_1,'pnum'_1]
            hover:underline
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-black
          "
        >
          <span className="md:hidden">&larr;</span>
          <span className="hidden md:inline">{prevLabel}</span>
        </Link>

        {/* All work */}
        <Link
          href={allHref}
          className="
            absolute
            left-1/2 -translate-x-1/2
            top-[52px] md:top-[101px] lg:top-[203px] xl:top-[253px]
            text-[20px] leading-[28px]
            md:text-[28px] md:leading-[38px]
            text-text-primary
            [font-feature-settings:'onum'_1,'pnum'_1]
            hover:underline
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-black
          "
        >
          {allLabel}
        </Link>

        {/* Next project */}
        <Link
          href={nextHref}
          className="
            absolute
            right-[12px] md:right-[44px] lg:right-[40px] xl:right-[88px]
            top-[52px] md:top-[101px] lg:top-[203px] xl:top-[253px]
            text-[20px] leading-[28px]
            md:text-[28px] md:leading-[38px]
            text-text-primary
            [font-feature-settings:'onum'_1,'pnum'_1]
            underline
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-black
          "
        >
          <span className="md:hidden">&rarr;</span>
          <span className="hidden md:inline">{nextLabel}</span>
        </Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`
Check at all breakpoints:
- Top and bottom borders span full width
- Fixed height per breakpoint
- Text is 28px on md+ and 20px on mobile
- "Next project" is underlined, "Previous project" is not
- Links are vertically centered
- Croatian labels shown when locale is "hr"

- [ ] **Step 3: Commit**

```bash
git add src/components/project-navigation.tsx
git commit -m "feat: redesign ProjectNavigation with fixed height, borders, and i18n"
```

---

### Task 6: Final Integration & Visual Verification

**Files:**
- Verify: `src/app/[locale]/work/[slug]/page.tsx` (may need minor updates)

- [ ] **Step 1: Verify page.tsx imports are correct**

Check that `page.tsx` imports `ProjectHeroCarousel` if the hero was moved out of `ProjectDetailContent`. If the hero is still rendered inside `ProjectDetailContent` (which it is per our approach), no changes needed to `page.tsx`.

- [ ] **Step 2: Full visual verification at all breakpoints**

Run: `npm run dev`

Check each breakpoint (320, 768, 1024, 1440) for:
- Hero: inset, correct dimensions, caption + pagination on same row
- Title: correct indent, 28px on md+, 20px on mobile
- Description: 16px at all sizes, correct max-width
- Meta table: full-width borders, correct row heights, stacked on md/mobile
- Composition images: orientation-aware sizing, portraits ~50% width stuck to edge
- Floor plans: same composition rules
- Project navigation: fixed height, borders, large text, underlined "Next project"

- [ ] **Step 3: Run build to check for TypeScript errors**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Commit any remaining fixes**

```bash
git add src/components/project-detail-content.tsx src/components/project-hero-carousel.tsx src/components/project-navigation.tsx src/app/\[locale\]/work/\[slug\]/page.tsx
git commit -m "fix: final adjustments for work detail pixel-perfect redesign"
```
