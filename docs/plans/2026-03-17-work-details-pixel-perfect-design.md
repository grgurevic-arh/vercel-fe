# Work Details Page — Pixel-Perfect Redesign

**Date:** 2026-03-17
**Scope:** Refactor `ProjectDetailContent` in-place + update `ProjectNavigation` to match Figma designs across all 4 breakpoints (320, 768, 1024, 1440).

## Approach

Modify existing components in-place (Approach A). No new files except a new `ProjectHeroCarousel` component to replace `HomepageCarousel` usage on this page.

**Note on left indent values:** The Figma design uses different left padding for this page than the standard content padding (`px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]`). The work detail page has a wider left indent (`xl:248px`, `lg:100px`) that aligns hero, title, description, and composition images. This is intentional per the Figma design and differs from other pages.

## 1. New `ProjectHeroCarousel` Component

Replaces `HomepageCarousel` on the work detail page. The hero is **not full-width** — it's inset from the left edge.

### Hero Image Dimensions

| Breakpoint | Left offset | Width | Height |
|------------|-------------|-------|--------|
| 1440 (xl)  | 248px       | 944px | 608px  |
| 1024 (lg)  | 100px       | 824px | 531px  |
| 768 (md)   | 44px        | 680px | 440px  |
| 320         | 0 (full)    | 320px | 208px  |

**Note:** On mobile (320), the hero is full-bleed (left offset = 0), while title/description below use 12px padding. This is intentional — full-bleed hero on mobile is the design pattern.

### Container Strategy

The hero component sits inside a `content-wrapper` (max-width: 1440px, centered). The left offset is applied via padding/margin within the wrapper. The hero right edge aligns with: 248 + 944 = 1192px on 1440, leaving 248px right margin — symmetrical.

### Caption + Pagination Row

Below the hero image, **same horizontal line** (flexbox row with `justify-between`):
- **Caption** (left-aligned): `text-[16px] leading-[23px]`, same left offset as hero
- **Pagination numbers** (right-aligned): numbered (1, 2, 3, 4), `text-[16px] leading-[23px]`, active slide underlined
- Gap between hero bottom and caption row: ~8-12px
- **Single slide**: pagination hidden, only caption shown (matches existing `HomepageCarousel` behavior)

### Behaviour

- `"use client"` component with `useState` for active slide
- `object-cover` with `overflow-hidden` on the image container
- Same slide data structure as `CarouselSlide`

## 2. Title & Description

### Left Indent

These values match the hero's left offset (except mobile where hero is full-bleed):

| Breakpoint | Left padding |
|------------|-------------|
| 1440 (xl)  | 248px       |
| 1024 (lg)  | 100px       |
| 768 (md)   | 44px        |
| 320         | 12px        |

### Title Typography

| Breakpoint | Font size | Line height |
|------------|-----------|-------------|
| 1440 (xl)  | 28px      | 38px        |
| 1024 (lg)  | 28px      | 38px        |
| 768 (md)   | 28px      | 38px        |
| 320         | 20px      | 28px        |

### Project Code

Retain existing `projectCode` rendering between title and description. No visual changes — keep current styling. Render only if present.

### Description Typography

- **All breakpoints**: `text-[16px] leading-[23px]` with `font-feature-settings: 'onum' 1, 'pnum' 1`
- **Breaking change** from current implementation which scales up to `text-[22px]` on md and `text-[28px]` on lg

### Description Width

| Breakpoint | Width | Notes |
|------------|-------|-------|
| 1440 (xl)  | 864px | 80px narrower than hero (right edge at 1112px vs 1192px) — per Figma |
| 1024 (lg)  | 824px | Same as hero width |
| 768 (md)   | 680px | Same as hero width |
| 320         | 296px | 320 - 12px left - 12px right = 296px |

### Section Spacing

- Top of hero to header bottom: ~152px (xl), ~144px (lg), ~138px (md/320)
- Caption row to title: ~168px (xl), ~103px (lg/md)
- Title to description: ~27px (xl)
- Description to meta table: ~40-56px (existing values preserved)

## 3. Meta Table

### Layout Pattern

**Borders are full-width** (no `content-wrapper`). Inner content uses standard responsive padding. Follows the office page pattern:

```
<div className="border-t border-divider">
  <BorderedSection border="border-b border-divider">
    <div className="pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]">
      <!-- label + value content -->
    </div>
  </BorderedSection>
</div>
```

### Row Dimensions

Two separate concerns:

**Pairs per row** (how many key-value pairs in one row):

| Breakpoint | Pairs per row |
|------------|--------------|
| 1440 (xl)  | 2            |
| 1024 (lg)  | 2            |
| 768 (md)   | 2            |
| 320         | 1            |

**Internal pair layout** (how label and value are arranged within each pair):

| Breakpoint | Row height | Label/Value layout |
|------------|------------|-------------------|
| 1440 (xl)  | 80px       | Side-by-side (label left, value right on same line) |
| 1024 (lg)  | 90px       | Side-by-side |
| 768 (md)   | 70px       | Stacked (label above value, both left-aligned) |
| 320         | 70px       | Stacked (label above value, both left-aligned) |

### Text Styling

- **Label** (key): `text-[16px] leading-[22px] tracking-[0.48px]` uppercase
- **Value**: `text-[16px] leading-[23px]`
- Both: `font-feature-settings: 'onum', 'pnum'`

### Edge Cases

- If all meta fields are empty, skip the entire section (existing behavior preserved)
- Odd number of pairs: last row has one item instead of two (existing behavior preserved)

## 4. Composition Images (Site Images + Floor Plans)

### Content Area

Images are constrained within the same left/right margins as the hero:

| Breakpoint | Left edge | Right edge | Content width |
|------------|-----------|------------|---------------|
| 1440 (xl)  | 248px     | 1192px     | 944px         |
| 1024 (lg)  | 100px     | 924px      | 824px         |
| 768 (md)   | 44px      | 724px      | 680px         |
| 320         | 0         | 320px      | 320px         |

### Orientation-Aware Sizing

- **Landscape** (`width > height`): full content-area width
- **Portrait** (`height >= width`): 50% of content-area width, sticking to left or right edge of the content area
- **Left/right placement**: existing hash-based `getImageSide()` (deterministic, aesthetic)
- **Mobile (320)**: all images full-width regardless of orientation

### Portrait Image Widths (50% of content area)

| Breakpoint | Portrait width |
|------------|---------------|
| 1440 (xl)  | 472px          |
| 1024 (lg)  | 412px          |
| 768 (md)   | 340px          |
| 320         | 320px (full)   |

### Floor Plans

Follow the same orientation-aware composition rules as site images. The varying sizes seen in Figma (~554px, ~784px) correspond to different image orientations processed through the same logic.

### Captions

- Below each image: `text-[16px] leading-[23px]`
- Vertical spacing between image+caption groups: 90px

### Edge Cases

- Zero site images: skip the site images section entirely
- Zero floor plans: skip the floor plans section entirely

## 5. Project Navigation

Updated to match `ContactInfo` component pattern — full-width with fixed height and absolute positioning.

### Dimensions

| Breakpoint | Height | Text size          |
|------------|--------|--------------------|
| 1440 (xl)  | 544px  | 28px / 38px lh     |
| 1024 (lg)  | 444px  | 28px / 38px lh     |
| 768 (md)   | 240px  | 28px / 38px lh     |
| 320         | 132px  | 20px / 28px lh     |

### Layout

- Full-width `border-t border-b border-divider`
- `content-wrapper` with `relative` inside for absolute positioning
- "Previous project" — left-aligned at standard left padding, not underlined
- "All work" — centered horizontally
- "Next project" — right-aligned at standard right padding, underlined
- On mobile: arrows instead of text labels

### Positioning Per Breakpoint

All links are vertically centered within their container height:

| Breakpoint | Left link | Center link | Right link |
|------------|-----------|-------------|------------|
| 1440 (xl)  | `left-[88px] top-[253px]` | centered, `top-[253px]` | `right-[88px] top-[253px]` |
| 1024 (lg)  | `left-[40px] top-[203px]` | centered, `top-[203px]` | `right-[40px] top-[203px]` |
| 768 (md)   | `left-[44px] top-[101px]` | centered, `top-[101px]` | `right-[44px] top-[101px]` |
| 320         | `left-[12px] top-[52px]` | centered, `top-[52px]` | `right-[12px] top-[52px]` |

(Top values calculated as: `(height - lineHeight) / 2` for vertical centering.)

### i18n

Navigation labels ("Previous project", "All work", "Next project") should be locale-aware. Add Croatian translations: "Prethodni projekt", "Svi radovi", "Sljedeći projekt". The `locale` prop is already passed to this component.

## Edge Cases (Global)

- **Zero hero images**: skip hero carousel entirely (existing behavior)
- **Single hero image**: render hero without pagination numbers (existing behavior)
- **Empty description**: skip description section (existing behavior)

## Files Modified

1. `src/components/project-hero-carousel.tsx` — **NEW** (inset hero carousel)
2. `src/components/project-detail-content.tsx` — refactored (new hero, updated indents, description size, meta table, composition logic)
3. `src/components/project-navigation.tsx` — updated (fixed height, borders, larger text, absolute positioning)
4. `src/app/[locale]/work/[slug]/page.tsx` — updated import for new hero component
