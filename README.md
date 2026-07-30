# Default Hero Swap

Replaces the default hero image with the baker-with-bread character.

## What to do

Replace the file at `public/assets/lily-portrait.png` in your repo with the one in this zip.

That's it. Push. Wait for Netlify. Hard-refresh.

## Why this works

`HeroImage.jsx` references `/assets/lily-portrait.png` as its default source. Overwriting the file swaps the default globally — every user whose `hero_mode` is `'default'` (which is all new users, and anyone who clicked "Use default") will now see the baker instead of the previous portrait.

## No code changes, no SQL

- Nothing in `HeroImage.jsx` needs to change
- Nothing in the DB needs to change
- Users who already picked a custom / gallery / blank hero stay on their choice — this only affects "default" mode

## Note about the gallery

The baker image is also in the sysadmin gallery as `/gallery/baker-01.png`. It's still available there as a gallery pick. Now it's both the default AND a gallery option — a user who selects "Use default" and a user who picks the baker from the gallery end up with the same visual, but their DB state differs (`hero_mode='default'` vs `hero_mode='gallery'`). If you'd rather have them be different images, remove the baker gallery item via `/app/sysadmin/gallery` and upload a different one.
