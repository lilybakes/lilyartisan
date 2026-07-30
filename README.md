# Templates Page Fix

Blank page = the `/app/templates` route wasn't registered in `App.jsx`. React Router had nothing to render for that path, so it fell through to empty.

## Files

```
src/
  App.jsx                # OVERWRITE — imports Templates + registers the /app/templates route
  pages/
    Templates.jsx        # OVERWRITE — null-safe destructure on useSettings() so it never crashes if the context is late
```

## Deploy

Overwrite both files, push, hard-refresh, navigate to **Templates** in the sidebar. You should see the recipe picker + template grid + preview.

## If the page is still blank after this

Open browser DevTools → Console — look for a red error. Most likely one of:

1. **"Cannot find module '../components/templates/index.js'"** → the `src/components/templates/` folder wasn't pushed. Check that `index.js`, `parts.jsx`, `ClassicRecipeCard.jsx`, `CostBreakdown.jsx`, `CareCard.jsx`, `ProductLabel.jsx` are all in the repo.

2. **"Cannot read properties of undefined (reading 'from')"** → the Supabase client isn't loaded. Very unlikely if other pages work.

3. **"useSettings is not a function"** → `src/lib/settings.jsx` isn't wired in the app tree. Also very unlikely if other pages work.

Screenshot the console error and I'll target the fix.
