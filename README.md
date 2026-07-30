# Coming Soon Sync

Two-part fix so the Coming Soon items you edit in sysadmin actually reach Lily's Settings page.

## What's happening

- Sysadmin **Content editor** reads from `content_blocks` in the DB
- Lily's **Settings page** currently has the 6 items **hardcoded**
- So right now: your edits go nowhere on the user side

## Fix

### Step 1 — Run the SQL (adds the 6 items to the DB)

Supabase SQL Editor → paste `supabase/seed-coming-soon.sql` → Run.

You'll see 1 row returned with `item_count = 6`. That's the marker of success.

Now navigate to `/app/sysadmin/content` → Coming Soon tab → you'll see the 6 items with edit/reorder/delete controls.

### Step 2 — Rewire Lily's Settings page (uses the DB)

Overwrite `src/components/ComingSoonWidget.jsx` with the version in this zip. It's the same widget from Delta 3b, now with configurable `title` / `subtitle` props so it matches your current copy.

Then in `src/pages/Settings.jsx`:

**Add the import at the top:**
```jsx
import ComingSoonWidget from '../components/ComingSoonWidget.jsx'
```

**Find the section that renders the Coming Soon tab** — it'll look something like:

```jsx
{tab === 'coming_soon' && (
  <div className="panel">
    <div className="panel-head">
      <div>
        <h3>Coming Soon</h3>
        <p className="sub">Placeholders for future customization.</p>
      </div>
    </div>
    <div ...>
      {/* Tax Rate card */}
      {/* Multi-user Access card */}
      {/* Export / Backup card */}
      {/* ...etc — the 6 hardcoded cards */}
    </div>
  </div>
)}
```

**Replace that entire block with just:**

```jsx
{tab === 'coming_soon' && <ComingSoonWidget/>}
```

The widget renders its own panel, heading, subtitle, and card grid — so you're removing everything and putting one line back.

Push. Hard-refresh. Log in as Lily — she now sees the 6 items pulled from the DB. Edit one in sysadmin Content editor → save → she sees the change on refresh.

## If step 2 is unclear

Share your current `src/pages/Settings.jsx` in your next message and I'll ship a full replacement so you don't have to touch code.
