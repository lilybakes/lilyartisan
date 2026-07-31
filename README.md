# Fix: "column reference 'user_id' is ambiguous" on Invite New User

## What you're seeing

`sysadmin_invite_user()` is declared with:

```sql
RETURNS TABLE (user_id uuid, email text, temp_password text)
```

so `user_id` becomes a name in scope inside the function body. Then near the end it runs:

```sql
UPDATE profiles SET ...
WHERE user_id = v_user_id;   -- ambiguous
```

PostgreSQL sees two things called `user_id` (the RETURNS TABLE output column and `profiles.user_id`) and refuses to guess which one you meant. The whole invite aborts and Supabase surfaces the raw error in the modal.

Exactly the same class of bug as the `sysadmin_users_for_grant` empty-dropdown one from earlier today — a name collision between a `RETURNS TABLE` column and a real table column.

## Two fixes in this delta, not just one

`sysadmin_approve_order()` (the checkout-order approval RPC in Delta 4) has the identical shape:

```sql
RETURNS TABLE (user_id uuid, email text, temp_password text, invoice_number text)
...
UPDATE profiles SET ... WHERE user_id = v_user_id;
```

It hasn't fired yet because you haven't approved a real order through the queue. It would blow up the first time you tried. Fixing it now in the same file so you don't hit this again.

## The fix

Both `UPDATE profiles ... WHERE user_id = v_user_id` clauses become:

```sql
UPDATE profiles AS p SET ...
WHERE p.user_id = v_user_id;
```

Now `p.user_id` is unambiguously the table column. Also added `SET search_path = public, auth` to both functions for consistency with the earlier fix.

Everything else about both functions — the auth.users insert, the auth.identities insert, the invoice numbering, the audit log — is unchanged.

## Files

```
supabase/
  invite-and-approve-fix.sql     # NEW — drops and re-creates both RPCs
```

One file. Safe to re-run.

## Deploy

Supabase SQL editor → paste `supabase/invite-and-approve-fix.sql` → Run. Then retry Invite New User with `anthony2211+test@gmail.com` — should succeed and show you the temp password.
