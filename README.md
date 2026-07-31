# Picker Fix + Ask

## What was wrong

Two commits ago (kraft-pilot) I replaced the `icon` field on each entry in `TEMPLATES` with a `preview` shape hint and a `gradient` string. Templates.jsx still rendered `{t.icon}` — which is now undefined — and I never shipped picker CSS for the new shape. That's why every card looks flat and empty in your screenshot: the old CSS was designed around an icon that no longer exists.

## What this delta ships

Three self-contained files. Drop-in only, no globals touched.

```
src/
  pages/Templates.jsx                    # OVERWRITE — uses inline SVG glyphs, imports scoped CSS
  components/
    TemplatePreviewGlyph.jsx             # NEW — inline SVG shapes for each preview kind
    templates-picker.css                 # NEW — scoped .tpl-* styling
```

The picker now renders each card with:
- A colored square containing an inline SVG that visually hints the template layout (lines for recipes, bars for costing, dashed border for care, tag hole for delivery, seal for certificate, etc)
- The template name + wrapped 2-line description
- A gray pill for page size (A4, A5, A7, 1:1) and an amber ALL pill for multi-recipe templates
- A gradient left-edge accent on hover, and the full gradient as a border when selected

No dependency on your global styles.css. No dependency on the `Icon` component (avoids the "no icon" case entirely).

## Deploy

Drop the 3 files in, hard-refresh Recipe Templates. Cards should look like proper picker cards immediately.

---

# The bigger honest ask

You said "I prefer full file and the zip with the repo structure." You're right, and I've been shipping partial because I only have the *files I've written* — I don't have the current source for the files that already exist in your repo. Specifically for the last few deltas I've been blind to:

1. **`src/App.jsx`** — I've been telling you to hand-add routes, which is exactly the anti-pattern in your user memory
2. **`src/components/Sidebar.jsx`** — same problem for nav links
3. **`src/styles.css`** — I've been shipping scoped CSS files as workarounds (rcd-styles.css, templates-picker.css) instead of maintaining the master. This works but drifts over time, and it's a big reason things end up looking half-styled.

If you paste the current contents of those three files as your next reply (or attach the files), the next delta can be a true "unzip and go" with proper full replacements — App.jsx with all routes, Sidebar.jsx with all nav items in the right order, and one consolidated styles.css that absorbs the scoped CSS I've been shipping piecemeal.

Once I have those three, everything future ships in the shape you want.
