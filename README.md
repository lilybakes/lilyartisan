# Topbar Icons Fix

One file. Overwrite `src/components/Topbar.jsx`.

## What was wrong

Topbar had a limited inline switch that only knew globe, grid, bell, and help. Any other icon you picked in Settings → Header Links fell through to a default circle.

## Fix

Topbar now uses the same `Icon` component from `src/lib/icons.jsx` that your Settings IconPicker uses to preview and pick icons. Whatever's available in the picker is now available in the topbar — they're pulling from the same source.

## Deploy

Overwrite the file, push, hard-refresh. Test with any icon you picked before — it now renders correctly.
