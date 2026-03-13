# Work Page Pixel-Perfect Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the work listing page pixel-perfect across 320px, 768px, 1024px, and 1440px breakpoints, matching Figma designs exactly.

**Architecture:** Update three components (ProjectGallery, ProjectList, Pagination) with exact measurements from Figma. Apply content-wrapper for >1440px screens. Keep existing data flow and CMS integration unchanged.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4 (arbitrary values)

---

### Task 1: Update ProjectGallery layout and spacing

**Files:**
- Modify: `src/components/project-gallery.tsx`

**Context:** The gallery shows featured project images. Figma shows:
- 320px: full-bleed images stacked vertically, caption at 16px/23px with pl-12px
- 768px: images stacked vertically (NOT paired), centered at 564px width, caption 20px/28px
- 1024px: 2-col grid, images 464px wide, left offset 40px, gap ~16px
- 1440px: 2-col grid, images 464px wide, left offset 248px, gap ~16px

Current code always pairs landscape images at all breakpoints. Figma shows pairing only at lg+ (1024px+).

**Step 1: Update the gallery section and GalleryItem caption**

Replace the entire `ProjectGallery` export and `GalleryItem` caption in `src/components/project-gallery.tsx`:

Gallery section class changes:
```
Old: px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
     pt-[80px] md:pt-[100px] lg:pt-[120px] xl:pt-[140px]
     space-y-[40px] md:space-y-[60px] lg:space-y-[80px]

New: content-wrapper
     px-0 md:px-0 lg:px-[40px] xl:px-[248px]
     pt-[182px] md:pt-[160px] lg:pt-[208px] xl:pt-[208px]
     space-y-[52px] md:space-y-[32px] lg:space-y-[40px]
```

GalleryItem caption class changes:
```
Old: mt-[12px] md:mt-[16px]
     text-[16px] leading-[23px] text-text-primary

New: mt-[12px] md:mt-[16px]
     text-[16px] leading-[23px] md:text-[20px] md:leading-[28px]
     text-text-primary
     [font-feature-settings:'onum'_1,'pnum'_1]
     pl-[12px] md:pl-0
```

Add `pl-[12px] md:pl-0` to caption because at 320px the image is full-bleed but caption has 12px left padding.

**Step 2: Change gallery layout to stack at md, pair at lg+**

At 768px (md), images should be single-column centered at 564px width. At 1024px+ (lg), they pair into 2-col grid.

Change the row rendering logic:
- Pairs: wrap in `hidden lg:grid grid-cols-2 gap-[16px]` — only show grid at lg+
- At md (768px), show all images as single column, centered
- At 320px (default), show full-width

The simplest approach: always render all projects individually in a stacked list for mobile/md, and render the paired grid for lg+. Use responsive visibility classes:

```tsx
// For the section content, render two layouts with responsive visibility:

// Mobile + md layout (stacked, shown below lg)
<div className="lg:hidden space-y-[52px] md:space-y-[32px]">
  {projects.map((project) => (
    <div key={project.slug} className="md:mx-auto md:w-[564px]">
      <GalleryItem project={project} locale={locale} />
    </div>
  ))}
</div>

// lg+ layout (paired grid)
<div className="hidden lg:block space-y-[40px]">
  {rows.map((row, rowIndex) => (
    row.type === "pair" ? (
      <div key={`row-${rowIndex}`} className="grid grid-cols-2 gap-[16px]">
        {row.projects.map((project) => (
          <GalleryItem key={project.slug} project={project} locale={locale} />
        ))}
      </div>
    ) : (
      <div key={`row-${rowIndex}`} className="flex justify-center">
        <div className="w-[464px]">
          <GalleryItem project={row.projects[0]} locale={locale} />
        </div>
      </div>
    )
  ))}
</div>
```

**Step 3: Update Image sizes attribute**

```
Old: sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
New: sizes="(min-width: 1024px) 464px, (min-width: 768px) 564px, 100vw"
```

**Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/components/project-gallery.tsx
git commit -m "fix: update ProjectGallery to match Figma across all breakpoints"
```

---

### Task 2: Update ProjectList row heights and column positions

**Files:**
- Modify: `src/components/project-list.tsx`

**Context:** The project table uses flex layout with gaps. Figma shows fixed row heights and absolute column positions. The current flex approach is close but doesn't match exactly. We'll keep flex but adjust widths and heights to match.

**Figma measurements:**
- Row height: 60px (mobile), 80px (md+)
- Year column: always visible, left-aligned
- Discipline: hidden on mobile, visible at md+, uppercase small-caps
- Title: truncated, specific widths per breakpoint
- Location: hidden below lg
- Size: hidden below lg, right-aligned

**Step 1: Update the Link class inside ProjectList**

Replace the Link className:
```
Old: flex items-baseline gap-x-[24px] md:gap-x-[40px] lg:gap-x-[48px]
     text-[16px] leading-[23px] text-text-primary
     [font-feature-settings:'onum'_1,'pnum'_1]
     py-[12px] md:py-[14px] xl:py-[16px]
     pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
     pr-[12px] md:pr-[44px] lg:pr-[40px] xl:pr-[88px]
     hover:bg-gray-50 transition-colors
     focus-visible:outline focus-visible:outline-2
     focus-visible:outline-offset-2 focus-visible:outline-black

New: flex items-center h-[60px] md:h-[80px]
     text-[16px] leading-[23px] text-text-primary
     [font-feature-settings:'onum'_1,'pnum'_1]
     pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
     pr-[12px] md:pr-[44px] lg:pr-[40px] xl:pr-[88px]
     hover:bg-gray-50 transition-colors
     focus-visible:outline focus-visible:outline-2
     focus-visible:outline-offset-2 focus-visible:outline-black
```

Key changes:
- `items-baseline` → `items-center` (vertically center in fixed row)
- Remove `gap-x-*` (we'll use fixed widths instead)
- Remove `py-*` (height is fixed now)
- Add `h-[60px] md:h-[80px]`

**Step 2: Update column span widths**

Year span:
```
Old: shrink-0 w-[48px]
New: shrink-0 w-[77px] md:w-[58px] lg:w-[120px] xl:w-[160px]
```

Discipline span:
```
Old: hidden md:inline shrink-0 w-[96px] uppercase tracking-wide
New: hidden md:inline shrink-0 w-[174px] lg:w-[120px] xl:w-[160px] uppercase tracking-[0.48px]
```

Title span:
```
Old: shrink-0 min-w-0 md:w-[200px] lg:w-[240px] xl:w-[280px] truncate
New: shrink-0 min-w-0 flex-1 md:flex-none md:w-[220px] lg:w-[344px] xl:w-[384px] truncate
```

Location span:
```
Old: hidden lg:inline flex-1 min-w-0 truncate
New: hidden lg:inline shrink-0 w-[224px] xl:w-[304px] truncate
```

Size span:
```
Old: hidden lg:inline shrink-0 w-[80px] text-right
New: hidden lg:inline shrink-0 w-[104px] xl:w-[144px] text-right
```

**Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/project-list.tsx
git commit -m "fix: update ProjectList row heights and column widths to match Figma"
```

---

### Task 3: Update Pagination layout

**Files:**
- Modify: `src/components/pagination.tsx`

**Context:** Figma shows pagination inside a bordered container with specific height. Numbers are positioned near the bottom. Current code uses simple flex with padding.

**Figma measurements:**
- Container: h-[210px] md:h-[210px] lg:h-[340px] xl:h-[340px] with border-b
- Numbers positioned at bottom area of container
- Number left padding: 12px / 160px / 160px / 248px
- Number gap: ~54px / ~58px / ~60px / ~80px

**Step 1: Update the nav element**

Replace the nav className:
```
Old: flex items-center gap-[24px] md:gap-[32px]
     pl-[12px] md:pl-[44px] lg:pl-[40px] xl:pl-[88px]
     pt-[48px] md:pt-[64px] lg:pt-[80px] xl:pt-[96px]
     pb-[48px] md:pb-[64px] lg:pb-[80px] xl:pb-[96px]

New: content-wrapper
     flex items-end
     h-[210px] lg:h-[340px]
     border-b border-divider
     pl-[12px] md:pl-[160px] lg:pl-[160px] xl:pl-[248px]
     pb-[89px] md:pb-[89px] lg:pb-[89px] xl:pb-[89px]
     gap-[54px] md:gap-[58px] lg:gap-[60px] xl:gap-[80px]
```

Key changes:
- Add `content-wrapper` for >1440px constraint
- Fixed height container with `border-b border-divider`
- `items-end` to align numbers near bottom
- Specific padding-bottom to position numbers correctly
- Updated gaps per breakpoint

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/pagination.tsx
git commit -m "fix: update Pagination to match Figma container and number positions"
```

---

### Task 4: Update work page spacing

**Files:**
- Modify: `src/app/[locale]/work/page.tsx`

**Context:** The spacing between gallery and table needs to match Figma. Gallery top padding is handled by the gallery component itself now.

**Step 1: Update the section spacing**

The `mt-*` on the table section wrapper:
```
Old: mt-[60px] md:mt-[80px] lg:mt-[100px] xl:mt-[120px]
New: mt-[100px] md:mt-[100px] lg:mt-[100px] xl:mt-[120px]
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add "src/app/\[locale\]/work/page.tsx"
git commit -m "fix: update work page section spacing to match Figma"
```

---

### Task 5: Visual verification

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Check all 4 breakpoints**

Open `http://localhost:3000/en/work` and verify at:
- 320px: Full-bleed stacked gallery images, 60px table rows with year+title, pagination at bottom
- 768px: Centered 564px gallery images (stacked), 80px rows with year+discipline+title, pagination
- 1024px: 2-col gallery grid (464px images), 80px rows with all columns, tall pagination
- 1440px: 2-col gallery grid (464px, left offset 248px), 80px rows with all columns
- >1440px: Content constrained, borders full-width

**Step 3: Commit any final tweaks**

```bash
git add -A
git commit -m "fix: final pixel-perfect adjustments for work page"
```
