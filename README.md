# Delta 4 — Public Paid Checkout

The one that turns the platform into a business. Anyone can now go from your Landing page to a paid subscription with three clicks + a bank transfer.

## The full flow

### Customer path
1. **Landing** → click "Subscribe now" on the pricing card
2. **`/checkout`** → fill out name, email, business (optional), address (optional) → click Continue
3. **`/checkout/:orderId`** → sees:
   - Order reference (`ORD-2026-0001`) — must include this in the payment note
   - Amount, name, email
   - Tabs: **DuitNow QR** (your uploaded image) / **Bank Transfer** (Maybank details with copy buttons)
   - Upload proof of payment (screenshot, photo, or PDF)
4. After upload → screen changes to "Payment received — verifying now. Login coming within 24 hours to your email."

### Sysadmin path
1. **`/app/sysadmin/orders`** → new sysadmin nav item, top of the Business subsection
2. Tabs: **To review** (proof uploaded, needs you) / **Awaiting payment** / **Approved** / **Rejected** / **All**
3. Click "Review" on an order → modal shows:
   - Full customer details
   - Payment proof image (click to open full-size)
   - **Approve & activate** button (with confirmation)
   - **Reject** button (asks for optional reason)
4. On approve:
   - Auth user created with the customer's email
   - Profile set to 1-year paid subscription starting today
   - Settings populated with customer name + business
   - Invoice number assigned (uses your Billing invoice numbering config)
   - Order status → approved
   - **Modal shows temp password + "Send reset email" button** — click that, customer gets a Supabase reset email so they set their own password
5. On reject:
   - Order status → rejected
   - Customer's next visit to `/checkout/:orderId` shows "Order couldn't be verified"

Every approval and rejection lands in the **Audit Log** with `approve_order` / `reject_order` actions.

## Files

```
supabase/
  delta-4-checkout.sql              # Migration + all RPCs
src/
  App.jsx                           # OVERWRITE — /checkout + /checkout/:id + /app/sysadmin/orders
  lib/
    checkout-api.js                 # NEW — RPC wrappers
  pages/
    Checkout.jsx                    # NEW — order form
    CheckoutPending.jsx             # NEW — payment instructions + proof upload
    Landing.jsx                     # OVERWRITE — pricing CTA points to /checkout
    sysadmin/
      Orders.jsx                    # NEW — verification queue
  components/
    Sidebar.jsx                     # OVERWRITE — adds "Orders" nav item
  styles.css                        # OVERWRITE (full file)
```

## Deploy steps

### Step 1 — Push code + wait for Netlify

### Step 2 — Run migration

Supabase SQL Editor → paste `supabase/delta-4-checkout.sql` → Run.

Verify:
```sql
SELECT reference FROM orders LIMIT 1;
-- (empty is fine — you just haven't placed an order yet)

SELECT order_next_seq, order_year, order_prefix, annual_price
FROM platform_settings WHERE id = 1;
-- Should return: 1, <current year>, 'ORD-', 149.00
```

### Step 3 — End-to-end test

**Set up your payment details first** (skip if you did this in Delta 3a already):
1. `/app/sysadmin/billing` → **Payment Method** tab → confirm bank details are correct
2. Upload your DuitNow QR image
3. **Business Info** tab → confirm your Swim Revelation Trading info

**Now do a full test order:**
1. **In an incognito window**, go to `/` (Landing) → scroll to Pricing → click "Subscribe now"
2. Fill out with a test email you can access (or use `test+1@yourdomain.com`)
3. Continue → land on the payment page. Check the QR renders + bank details are copy-able.
4. Upload any image as "proof" (a random screenshot works for testing)
5. See "Payment received — verifying now"
6. **In your normal window**, navigate to `/app/sysadmin/orders` → your test order is in the "To review" tab
7. Click **Review** → see the customer info + proof image
8. Click **Approve & activate** → confirmation → **Yes**
9. See the success modal with email + temp password → click **Send password reset email**
10. Check the test email inbox → password reset email arrives → set new password → sign in
11. Back in incognito, refresh `/checkout/:orderId` → now shows "Payment verified!" with a Sign In link

**Test rejection flow:**
Repeat steps 1–5 with a different email. On step 8, click **Reject** instead. Confirm with a reason. Refresh the customer's page → sees "Order couldn't be verified".

**Test the audit log:**
Navigate to `/app/sysadmin/audit` → the approve_order / reject_order events are logged with full details.

## Important config

**Annual price** is in `platform_settings.annual_price` (default 149.00). To change:
```sql
UPDATE platform_settings SET annual_price = 199.00 WHERE id = 1;
```
No frontend change needed — Landing pricing card copy is separate (edit via `/app/sysadmin/content` → Pricing tab).

**Order prefix** is in `platform_settings.order_prefix` (default 'ORD-'). To change:
```sql
UPDATE platform_settings SET order_prefix = 'BN-' WHERE id = 1;
```
Next orders become `BN-2026-0005`, etc.

**Invoice numbering** — the invoice number generated on approval uses your existing `invoice_prefix` + `invoice_next_seq` from `platform_settings` (which you already configured in `/app/sysadmin/billing` → Invoice Numbering tab).

## Duplicate email handling

If someone tries to check out with an email that's already an active user:
- The order form rejects with "An active account with this email already exists. Please sign in instead."
- They're prompted to sign in instead.

If someone tries to check out with an email that had a subscription that ended:
- The order is created normally.
- **But on sysadmin approve**, if the auth user still exists, approval fails with an error. You'd need to delete the old user first (or, in a future delta, we can add "extend existing user" logic).

## Duplicate proof upload

If a customer refreshes the payment page after uploading proof, they see the "verifying now" screen. Upload button is gone.

If they navigate to `/checkout/:orderId` while their order is `approved`, they see the "Payment verified" screen with Sign In link.

If their order is `rejected`, they see the "couldn't be verified" screen.

## What's NOT in this delta

- **Automated email sending** — no email is sent to the customer automatically. You approve manually and click "Send reset email" for each. Once you set up custom SMTP (Supabase Dashboard → Auth → Emails → SMTP), we can wire the invite email template to fire automatically.
- **PDF invoice generation** — invoice number is assigned, but no downloadable PDF yet. Could add a printable invoice view in Delta 5.
- **Order editing** — you can approve or reject, but not edit customer info. If they made a mistake, they need to submit a new order.
- **Refunds** — no refund flow. Refunds happen out-of-band; you'd manually adjust their `subscription_end` if needed.
- **Trial toggle enforcement** — the `trial_enabled` setting in Platform still isn't wired. Both trial and paid signup work simultaneously.

## Rollback

```sql
DROP FUNCTION IF EXISTS create_order(text, text, text, text);
DROP FUNCTION IF EXISTS get_order_public(uuid);
DROP FUNCTION IF EXISTS set_order_proof(uuid, text);
DROP FUNCTION IF EXISTS sysadmin_list_orders(text);
DROP FUNCTION IF EXISTS sysadmin_order_counts();
DROP FUNCTION IF EXISTS sysadmin_approve_order(uuid);
DROP FUNCTION IF EXISTS sysadmin_reject_order(uuid, text);
DROP TABLE IF EXISTS orders;
ALTER TABLE platform_settings
  DROP COLUMN IF EXISTS order_next_seq,
  DROP COLUMN IF EXISTS order_year,
  DROP COLUMN IF EXISTS order_prefix,
  DROP COLUMN IF EXISTS annual_price;
```
