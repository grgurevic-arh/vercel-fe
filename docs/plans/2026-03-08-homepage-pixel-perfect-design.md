# Homepage Pixel-Perfect Fixes

**Date:** 2026-03-08
**Status:** Approved (updated after full 4-breakpoint audit)

## Problem

Comparing the Figma design across all 4 breakpoints (320px, 768px, 1024px, 1440px) against the current implementation reveals layout and spacing discrepancies on the homepage.

## Cross-Breakpoint Audit Results

| Issue | mobile (320) | md (768) | lg (1024) | xl (1440) |
|-------|-------------|----------|-----------|-----------|
| Pagination alignment | LEFT (broken) | LEFT (broken) | LEFT (broken) | LEFT (broken) |
| Pagination step | 46px | 58px | 53px | 80px |
| Feed wrapper mt | ~41 (have 36) | ~111 (have 56) | ~98 (have 50) | ~167 (have 80) |
| Feed space-y | ~47 (have 96!) | OK (56) | needs verify | ~90 (have 78) |
| Feed title→summary gap | 10px OK | 12px OK | 16px (have 12) | 12px OK |

## Fixes

### 1. Carousel pagination alignment (HIGH)

- **File:** `src/components/homepage-carousel.tsx`
- **Issue:** Pagination numbers are right-aligned in a `flex justify-between` layout at ALL breakpoints
- **Figma:** Numbers are always left-aligned at page padding positions
- **Fix:** Remove `justify-between`, place pagination on the left. Use responsive min-widths + gaps to match Figma steps:
  - mobile: natural width + gap-[14px] (step ~46px)
  - md: min-w-[34px] + gap-[24px] (step ~58px)
  - lg: min-w-[39px] + gap-[14px] (step ~53px)
  - xl: min-w-[56px] + gap-[24px] (step 80px)

### 2. Feed section top margin (HIGH)

- **File:** `src/app/[locale]/page.tsx`
- **Issue:** Feed wrapper mt is roughly half of what Figma shows at all breakpoints
- **Current:** `mt-[36px] md:mt-[56px] lg:mt-[50px] xl:mt-[80px]`
- **Fix:** `mt-[41px] md:mt-[111px] lg:mt-[98px] xl:mt-[167px]` (verify visually, adjust as needed)

### 3. Feed item vertical spacing (MEDIUM)

- **File:** `src/components/homepage-feed.tsx`
- **Issue:** Mobile space-y is ~double what it should be; xl is too small
- **Current:** `space-y-[96px] md:space-y-[56px] lg:space-y-[90px] xl:space-y-[78px]`
- **Fix:** `space-y-[47px] md:space-y-[56px] lg:space-y-[90px] xl:space-y-[90px]`

### 4. Feed title-to-summary gap at lg (LOW)

- **File:** `src/components/homepage-feed.tsx`
- **Issue:** At lg, Figma shows 16px gap (title to summary), but md:mt-[12px] cascades
- **Current:** `mt-[10px] md:mt-[12px]`
- **Fix:** `mt-[10px] md:mt-[12px] lg:mt-[16px] xl:mt-[12px]`

## Files Changed

- `src/components/homepage-carousel.tsx`
- `src/components/homepage-feed.tsx`
- `src/app/[locale]/page.tsx`
