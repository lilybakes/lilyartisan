# Dashboard Coming Soon Strip

Small one-line strip at the bottom of the user dashboard showing up to 4 upcoming features. Reads from the same sysadmin-editable `content_blocks` list used by the Settings page — no new data model, no new admin UI.

## Files

```
src/
  components/ComingSoonStrip.jsx    # NEW — compact widget
  pages/Dashboard.jsx               # OVERWRITE — imports + renders strip at bottom
  styles.css                        # OVERWRITE (full file) — strip styles appended
```

## What it looks like

```
┌────────────────────────────────────────────────────────────────────┐
│  🕐 ON THE ROADMAP    Multi-user teams   SST invoices   Backups   │
└────────────────────────────────────────────────────────────────────┘
```

One row. Soft violet-tinted background. Small uppercase label with a mini clock icon. Pill items with hover tooltip showing the full description from the DB.

Design decisions to keep it non-intrusive:
- Placed at the very bottom of the dashboard, after the Recipe Overview panel
- Only 4 items max (slice), even if sysadmin adds more — the full list still shows on the Settings page
- If no items exist or all are hidden, the strip renders `null` — takes zero space
- Font size 11–12px, padding tight
- Muted violet accent — matches app brand, doesn't compete with the four stat cards above

## Data source

Same as the existing `<ComingSoonWidget/>` on Settings — reads `content_blocks` row where `key = 'coming_soon'`. Sysadmin manages the list at **Sysadmin → Content & Design → Content**. No schema changes.

Each item shows its `title` as the pill label and its `description` as the hover tooltip. Hidden items (visible=false) are filtered out.

## Deploy

Overwrite the 3 files, push, hard-refresh. Load `/app/dashboard` — strip appears at the bottom.

To hide it entirely for a user: sysadmin toggles all Coming Soon items to hidden (or deletes them).
