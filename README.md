# Templates Module — Picker Redesign (v3)

Reverts the aggressive template design overhaul from the last delta and instead redesigns just the picker page to match your screenshot.

## What changed

### Reverted
- All 10 template designs go back to the **clean simple purple** aesthetic (Plus Jakarta Sans, purple accents, minimal ornament — exactly as they were in the `brand-coverage` delta).
- The `ornaments.jsx` file, all the Google Font imports, and every Kraft/Chalkboard/Editorial variant are gone.

### Redesigned
- The **Templates picker page** now matches your screenshot precisely: 5-column card grid with large gradient preview thumbnails, size badges in the corner, purple ring on the active card, status counter, redesigned print button with icon.

## Files

```
src/
  pages/
    Templates.jsx                                # OVERWRITE — picker matches screenshot
  components/templates/
    index.js                                     # OVERWRITE — 4 ready + 6 soon, gradient per template
    parts.jsx                                    # OVERWRITE — clean version (brand-coverage improvements kept)
    ClassicRecipeCard.jsx                        # OVERWRITE — clean purple
    CostBreakdown.jsx                            # OVERWRITE — clean purple
    CareCard.jsx                                 # OVERWRITE — clean purple
    ProductLabel.jsx                             # OVERWRITE — clean purple + brand-coverage improvements
    MenuInsert.jsx                               # OVERWRITE — clean purple (file present, hidden from picker)
    WholesalePriceList.jsx                       # OVERWRITE — clean purple (file present, hidden from picker)
    DeliveryTag.jsx                              # OVERWRITE — clean purple (file present, hidden from picker)
    SocialMediaCard.jsx                          # OVERWRITE — clean purple (file present, hidden from picker)
    RecipeBinderPage.jsx                         # OVERWRITE — clean purple (file present, hidden from picker)
    CertificateOfCraft.jsx                       # OVERWRITE — clean purple (file present, hidden from picker)
  styles.css                                     # OVERWRITE (full file)
```

**Delete after push:** the file `src/components/templates/ornaments.jsx` from the previous v2 delta — no longer used. You can leave it and it'll just sit unused, but tidier to delete.

## The 4 ready templates + 6 "in the works"

Marked as ready (colored gradient thumbnails, clickable):

| # | Template | Gradient | Size |
|---|---|---|---|
| 1 | Classic Recipe Card | violet | A5 |
| 2 | Cost Breakdown Sheet | orange | A4 |
| 3 | Care & Storage Card | teal | A6 |
| 4 | Product Label | green | A7 |

Marked as "SOON" (grey placeholder, disabled):

5. Menu Insert — A5
6. Wholesale Price Sheet — A4
7. Delivery Tag — A7
8. Social Media Card — 1:1
9. Recipe Binder Page — A4
10. Certificate of Care — A4

The 6 "soon" template files are still in the folder and fully working — they just don't appear in the picker until you flip their `ready: false` to `ready: true` in `src/components/templates/index.js`. One-line change per template.

## Picker design details

Matches your screenshot:

- **5-column grid** of large cards; each card has a **preview thumbnail** at the top (colored gradient with a white abstract UI shape hinting at layout)
- **Size badge** in the top-right corner of the preview (A5, A4, A6, A7)
- **Active card** gets a 2px purple border and a soft purple glow shadow
- **Status counter** row: "4 templates ready" (green pill with dot) · "6 in the works" (muted)
- **Nudge card** at top with a filled purple checkmark badge instead of a generic emoji
- **Print button** has a proper printer SVG icon and a solid purple background matching the accent color
- **Responsive**: 5 → 4 → 3 → 2 → 1 columns as viewport shrinks

## Preview thumbnails

Every ready template gets a distinct gradient background matching its category:

- Classic Recipe Card: violet — full recipe with title + body lines
- Cost Breakdown: orange — chart-bars illustration
- Care & Storage: teal — bulleted-list illustration
- Product Label: green — card with highlighted product name

Soon templates all use a grey placeholder with a generic card-lines illustration.

The abstract shape inside each preview is inline SVG (no images to load), so previews render instantly and scale cleanly on any DPI.

## Deploy

Overwrite the 13 files, push, hard-refresh. Templates page will show the redesigned picker. Only the 4 ready templates are clickable — the other 6 are visible but disabled.

## To bring back one of the 6 hidden templates

Open `src/components/templates/index.js`, find the template you want, change:

```js
ready: false,
```

to:

```js
ready: true,
gradient: 'linear-gradient(135deg, #YOURCOLOR1 0%, #YOURCOLOR2 100%)',
```

Pick two hex colors ~15% apart in lightness for the gradient. That template is now live.
