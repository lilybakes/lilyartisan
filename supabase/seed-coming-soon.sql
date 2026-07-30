-- ============================================================================
-- Seed Coming Soon items into content_blocks
-- ============================================================================
-- Only inserts if the row doesn't already exist. Safe to re-run.
-- After running, the 6 items will appear in:
--   /app/sysadmin/content → Coming Soon tab
-- where you can edit / reorder / delete them.
-- ============================================================================

INSERT INTO content_blocks (key, content) VALUES
(
  'coming_soon',
  '[
    { "title": "Tax Rate",             "description": "Add a tax/GST percentage for invoicing." },
    { "title": "Multi-user Access",    "description": "Invite staff with role-based permissions." },
    { "title": "Export / Backup",      "description": "Download all recipes & ingredients as CSV." },
    { "title": "Custom Portrait",      "description": "Replace the hero portrait & top-bar avatar." },
    { "title": "Notification Center",  "description": "Low-stock alerts, price change history, deploy notices." },
    { "title": "Full Navigation Module","description": "Reorderable header links, nav groups, per-page shortcuts." }
  ]'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Verify (should show a row with 6 items in the content array)
SELECT key, jsonb_array_length(content) AS item_count, updated_at
FROM content_blocks
WHERE key = 'coming_soon';
