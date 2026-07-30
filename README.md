# Hero Photo Slide — Copy Centering

One file. `src/styles.css` — overwrite.

## What was wrong

On photo slides 1 and 3, the text sat glued to the viewport left edge. On a 1920px monitor, text was at 80–760px, then ~1160px of dead space between it and the right edge. The photo dominated the right two-thirds and the text felt marooned.

Same root cause as the split-slide fix: no content-column cap, so on wider screens the layout scaled worse instead of feeling more intentional.

## The fix

`.hc-copy-left` now behaves like a proper landing-page content column:

- **Absolutely spans the slide** (`inset: 0`) but capped at `max-width: 1440px` and centered horizontally via `margin: 0 auto`
- **Content left-anchored within that column** (`align-items: flex-start`)
- **Inner text (h1, p, eyebrow) gets `max-width: 620px`** so lines stay readable

## What each viewport gets

- **≥1440px** — content column caps at 1440, text starts at `(viewport - 1440) / 2 + 80px` from left. On 1920 that's 320px. Photo still visible on right, but the text feels intentionally placed instead of edge-clinging.
- **1024–1440px** — column matches viewport width, text at 80px from left (unchanged from before)
- **<1024px** — unchanged (mobile already stacks the copy plate full-width)

## Consistency with slide 5

Slide 5 (`.hc-copy-center`) already uses `text-align: center` with `max-width: 860px` on the h2 and 580px on the p, so it doesn't have this problem — text stays centered regardless of viewport.

Deploy, hard-refresh. Slides 1 and 3 will feel balanced now.
