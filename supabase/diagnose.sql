-- ============================================================================
-- DIAGNOSTIC — verify personalization is properly deployed
-- ============================================================================
-- Run this in Supabase SQL Editor. It tells you exactly what state you're in.
-- ============================================================================

-- Q1: Do the personalization columns exist on profiles?
--     EXPECT: 3 rows (hero_mode, hero_url, avatar_url)
--     IF EMPTY: the migration didn't run — run delta-personalization.sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('hero_mode', 'hero_url', 'avatar_url');


-- Q2: Does the hero_gallery table exist and have the 3 seeded items?
--     EXPECT: 3 rows (chef-01, baker-01, chef-02) all with active=true
--     IF EMPTY: migration didn't run OR only ran partially
SELECT id, label, image_url, position, active
FROM hero_gallery
ORDER BY position;


-- Q3: Does the update_my_personalization RPC exist?
--     EXPECT: 1 row
--     IF EMPTY: migration didn't run — the Personalize page will error when saving
SELECT proname, prosecdef AS is_security_definer
FROM pg_proc
WHERE proname = 'update_my_personalization';


-- Q4: Do users have their personalization defaults?
--     EXPECT: Both users show hero_mode='default'
SELECT u.email, p.hero_mode, p.hero_url, p.avatar_url
FROM auth.users u
LEFT JOIN profiles p ON p.user_id = u.id
WHERE u.email IN ('anthony2211@gmail.com', 'lily2211@gmail.com')
ORDER BY u.email;
