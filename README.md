# Settings Rewire

Two files. Overwrite both, push, done.

## What changed in `Settings.jsx`

**Coming Soon tab** — was hardcoded 6 cards, now renders `<ComingSoonWidget/>` which fetches the items from `content_blocks` in the DB. Whatever you edit in `/app/sysadmin/content` → Coming Soon tab now shows up in Lily's Settings.

**General tab cleanup** — removed the "App Name" field and the whole Logo upload panel. Both were dead code after brand-swap (their values are ignored by the Sidebar / Landing / everywhere). Kept:
- Owner Name
- Business Name
- Currency
- Default Target Food Cost %

**Header Links tab** — unchanged.

## What's in `ComingSoonWidget.jsx`

Same widget I shipped in Delta 3b, with configurable `title` / `subtitle` props (defaults match your existing copy: "Coming Soon" / "Placeholders for future customization."). Included here so you don't have to hunt for the right version — just overwrite it.

## Deploy

Push both files. Wait for Netlify Published. Hard-refresh.

## Test the end-to-end sync

1. Log in as Anthony
2. `/app/sysadmin/content` → Coming Soon tab → edit one of the 6 items (e.g., change "Tax Rate" description) → Save
3. Log out, log in as Lily
4. `/app/settings` → Coming Soon tab → see the edit

Or just add a new item, delete one, whatever — Lily's page reflects it after refresh.

## Note about your dead fields

If your DB still has values in `settings.app_name` and `settings.logo_data_url`, they'll stay there — the UI just doesn't expose them anymore. No cleanup needed. If you ever want to clear them:

```sql
UPDATE settings SET app_name = NULL, logo_data_url = NULL;
```

Optional. Zero effect either way.
