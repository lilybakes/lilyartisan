# Coming Soon Polish

Three changes, three files.

## What changed

**1. No gradient on Coming Soon cards** — plain white with a subtle grey border. Hover adds a soft violet border and shadow lift.

**2. Show/Hide toggle in sysadmin editor** — each Coming Soon item now has a "Hide" button in the row controls. Hidden items:
   - Stay in your editor list (dimmed, marked "Hidden")
   - Are NOT shown to users on their Settings page
   - Can be toggled back with the "Show" button
   - Are NOT deleted — they persist across saves
   
   The header now shows something like `Items (4 visible, 2 hidden)` so you know at a glance.

**3. 3-column grid on the user side** — was 2 columns. Now responsive:
   - Desktop / wide screens: **3 columns**
   - Tablet (< 900px): 2 columns
   - Mobile (< 640px): 1 column

## Files

```
src/
  pages/sysadmin/
    Content.jsx                # OVERWRITE — ComingSoonEditor now has Hide/Show toggle
  components/
    ComingSoonWidget.jsx       # OVERWRITE — filters out items with visible:false
  styles.css                   # OVERWRITE (full file)
```

## Deploy

Push. Wait for Netlify Published. Hard-refresh.

## Data note

Items now optionally have a `visible: boolean` field:

```json
{ "title": "Tax Rate", "description": "...", "visible": true }
```

- Existing items in your DB don't have this field → **treated as visible** (backward-compatible)
- New items you add get `visible: true` automatically
- Clicking Hide sets `visible: false`

No SQL migration needed.

## Test

1. `/app/sysadmin/content` → Coming Soon tab
2. Click **Hide** on 2 of the 6 items → their cards dim, header updates to "4 visible, 2 hidden"
3. Click **Save changes**
4. Log in as Lily → `/app/settings` → Coming Soon → sees only the 4 visible items in a 3-column grid, no gradient
5. Back as Anthony → click **Show** on the hidden ones → Save → Lily sees them again
