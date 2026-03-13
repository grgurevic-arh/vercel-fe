# Homepage Pixel-Perfect Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix layout and spacing discrepancies between the Figma design and current homepage implementation across all 4 breakpoints.

**Architecture:** Direct CSS/layout fixes in 3 existing components — no new files, no structural changes.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4

**Worktree:** `.worktrees/homepage-pixel-perfect` (branch `fix/homepage-pixel-perfect`)

---

### Task 1: Fix carousel pagination alignment

**Files:**
- Modify: `src/components/homepage-carousel.tsx:44-91`

**Step 1: Rewrite pagination layout**

Replace the entire `{/* Caption + Number pagination row */}` div (lines 44-91) with pagination on the LEFT. Remove `flex justify-between`. Use responsive min-widths and gaps to match Figma pagination steps:

```tsx
      {/* Pagination + Caption */}
      <div
        className="
          mt-[16px] md:mt-[28px] lg:mt-[28px] xl:mt-[33px]
          px-[12px] md:px-[44px] lg:px-[40px] xl:px-[88px]
        "
      >
        {slides.length > 1 ? (
          <nav
            className="flex gap-[14px] md:gap-[24px] lg:gap-[14px] xl:gap-[24px]"
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
                    text-left md:min-w-[34px] lg:min-w-[39px] xl:min-w-[56px]
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

        {current.description ? (
          <p
            className="
              mt-[12px]
              text-[16px] leading-[23px] text-text-primary
              [font-feature-settings:'onum'_1,'pnum'_1]
            "
          >
            {current.description}
          </p>
        ) : null}
      </div>
```

**Step 2: Verify visually**

Run: `npm run dev` in the worktree. Check pagination at all 4 breakpoints — numbers should be left-aligned below the carousel image.

**Step 3: Commit**

```bash
git add src/components/homepage-carousel.tsx
git commit -m "fix: align carousel pagination to left per Figma design"
```

---

### Task 2: Fix feed section top margin

**Files:**
- Modify: `src/app/[locale]/page.tsx:107`

**Step 1: Update mt values**

On line 107, change:
```
mt-[36px] md:mt-[56px] lg:mt-[50px] xl:mt-[80px]
```
to:
```
mt-[41px] md:mt-[111px] lg:mt-[98px] xl:mt-[167px]
```

**Step 2: Verify visually**

Check at all 4 breakpoints that the gap between carousel pagination and first feed item matches Figma. Fine-tune values if needed — exact pixels may differ slightly due to document flow vs Figma's absolute positioning.

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "fix: increase feed section top margin to match Figma at all breakpoints"
```

---

### Task 3: Fix feed item spacing

**Files:**
- Modify: `src/components/homepage-feed.tsx:23`

**Step 1: Update space-y values**

In the `<ul>` className (line 23), change:
```
space-y-[96px] md:space-y-[56px] lg:space-y-[90px] xl:space-y-[78px]
```
to:
```
space-y-[47px] md:space-y-[56px] lg:space-y-[90px] xl:space-y-[90px]
```

**Step 2: Update title-to-summary gap**

In the summary `<p>` className (around line 46), change:
```
mt-[10px] md:mt-[12px]
```
to:
```
mt-[10px] md:mt-[12px] lg:mt-[16px] xl:mt-[12px]
```

**Step 3: Verify visually**

Check feed item spacing at all 4 breakpoints.

**Step 4: Commit**

```bash
git add src/components/homepage-feed.tsx
git commit -m "fix: adjust feed item spacing and title-summary gap per Figma"
```
