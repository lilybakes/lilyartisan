# Inventory save fix

Two things were wrong on the Inventory page:

## 1. Silent upsert failure (root cause)

`useInventory.setStock` was calling `.upsert()` without `onConflict: 'ingredient_id'`. In Supabase, upserts against a table where you match on the primary key still need the conflict target specified explicitly — otherwise the write can silently no-op for new rows. That was almost certainly why nothing was being saved for a fresh ingredient (no existing inventory row for cocoa powder yet).

The fixed hook also **throws** on error instead of just alerting and returning, so the UI can react.

## 2. Uncontrolled input + no feedback

The input was uncontrolled (`defaultValue`), which means even if the save had worked, the UI gave you no signal that anything happened. And if the save failed, the alert would fire but the value would just sit there looking like nothing changed.

The new row is fully controlled with clear states:
- **Dirty** (value differs from what's saved) — violet border + focus ring, a "Save" button appears
- **Saving** — a "Saving…" pill
- **Saved** — a "Saved ✓" pill for 1.6s, then clears
- **Error** — red border + a "Save failed" pill; hover the pill for the error message

Save triggers on **all three** of: pressing Enter, tabbing/clicking away from the input, or clicking the Save button. So no matter how you interact with it, the value gets committed.

## Files

```
src/
  lib/data.js              (useInventory rewritten: onConflict + throws)
  pages/Inventory.jsx      (controlled input, feedback pills, save button)
```

## Apply

Overwrite both files. Netlify auto-deploys. No Supabase changes needed.

## Test

1. Go to Inventory
2. Type `500` in the cocoa powder row (or whichever)
3. You'll see the violet border and a Save button appear as you type
4. Press Enter (or click Save, or tab away)
5. "Saved ✓" pill appears briefly
6. Refresh the page — value persists

If save fails for any reason (network, RLS, whatever), you'll now see "Save failed" with the actual reason on hover, instead of a silent no-op.
