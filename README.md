# Fix: Users dropdown empty on Template Access → Grants

## Root cause

The RPC `sysadmin_users_for_grant()` was returning zero rows even though `auth.users` had two.

The buggy function looked like this:

```sql
RETURNS TABLE(user_id uuid, email text) ...
RETURN QUERY
  SELECT id, email::text FROM auth.users WHERE email IS NOT NULL ORDER BY email;
```

PostgreSQL's name-resolution rules inside a PL/pgSQL function let the OUTPUT-column declarations (`user_id`, `email`) shadow columns of the same name in the query's FROM clause. So `WHERE email IS NOT NULL` resolves `email` to the output-column placeholder (which is NULL for every row before it's populated) instead of `auth.users.email`. The predicate is always false → no rows returned → dropdown empty.

The other sysadmin RPCs in this feature (`sysadmin_list_template_visibility`, `sysadmin_list_template_grants`, `sysadmin_set_template_visibility`, `sysadmin_grant_template`) weren't affected because none of them had a column-name collision between their `RETURNS TABLE` and the queried table.

## Fix

- Rewrite the function with fully-qualified `u.id` / `u.email` aliases so there's nothing to shadow.
- Add `SET search_path = public, auth` so `auth.users` resolves cleanly under `SECURITY DEFINER`.
- Frontend surfaces any RPC error in a red banner at the top of Template Access so silent failures like this can't happen again.

## Files

```
supabase/
  users-for-grant-fix.sql              # NEW — DROP + CREATE the function correctly
src/
  pages/sysadmin/TemplateAccess.jsx    # OVERWRITE — error surfacing + empty-state hint on the user dropdown
```

Two files.

## Deploy

1. **Supabase SQL editor** → paste `supabase/users-for-grant-fix.sql` → Run. Safe to re-run any time.
2. Push the two-file code change, hard-refresh Template Access → Grants. The `lily2211@gmail.com` user should now appear in the User dropdown.

If anything else in the module breaks in the future, the top of the page now surfaces the raw RPC error (function name + Postgres message), so debugging is one step, not five.
