# Login brand rename — Baker|Nomics → Bake|Onomics

## What was wrong

Login.jsx has the wordmark **hardcoded** as two spans:

```jsx
<span className="part1">Baker</span><span className="part2">Nomics</span>
```

Unlike Sidebar.jsx, it doesn't read `settings.app_name` — so it never picked up the app-wide rename. Also, on the login page there's no logged-in user yet, so there's no `settings` context to read from anyway; hardcoding is actually correct here, it just needs the correct name.

## The fix

Same shape, correct text:

```jsx
<span className="part1">Bake</span><span className="part2">Onomics</span>
```

"Bake" renders in navy (`part1`), "Onomics" renders in violet (`part2`) — matching the sidebar rendering when a signed-in user's `settings.app_name` is `"Bake|Onomics"`.

## Files

```
src/
  pages/Login.jsx        # OVERWRITE — brand text swapped, everything else identical
```

One file.

## Deploy

Drop it in, push, hard-refresh the login page.

## What about the sidebar for existing users?

If Lily's or Anthony's `settings.app_name` in the database is still `Baker|Nomics`, the sidebar shows the old name for them even after this fix. To update the database default, run in Supabase SQL editor:

```sql
UPDATE settings SET app_name = 'Bake|Onomics' WHERE app_name = 'Baker|Nomics';
```

Or edit it per-user via **Settings → Brand & Identity → App Name (wordmark)**.

Every future signup already gets `Bake|Onomics` if the earlier brand-rename delta was fully applied to the `handle_new_user` trigger. If not, tell me and I'll ship a follow-up that updates the trigger.
