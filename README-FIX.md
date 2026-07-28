# Hamburger drawer — CRASH FIX

## What went wrong

The `App.jsx` in the previous `hamburger.zip` added `<BrowserRouter>` around the app. If your `main.jsx` (or `index.jsx`) already had a `<BrowserRouter>` in it — which is the standard Vite + React Router setup — nesting two Routers throws a hard error at mount. That's what the minified stack trace was showing.

## The fix — two components, no App.jsx changes

Sidebar and Topbar now coordinate via a tiny window-event pattern:
- Topbar's hamburger dispatches `window.dispatchEvent(new CustomEvent('mobile-nav-open'))`.
- Sidebar listens for that event on `window` and toggles its own local state.
- No shared React state, no props, no context, no App.jsx wiring at all.

Sidebar also closes itself when any nav link is clicked (via `onClick={close}` on the `NavLink`s), on Esc, or when the backdrop is tapped. Body scroll is locked while the drawer is open.

## Apply — do these in order

### 1. Revert `App.jsx` to what it was before the previous hamburger.zip

On GitHub in the browser:
- Navigate to `src/App.jsx`.
- Click **History** in the top-right of the file view.
- Find the commit right before your "hamburger.zip" upload (probably titled something like "Add App.jsx" or the commit before your latest one).
- Click that commit, then click `src/App.jsx` inside it.
- Copy the raw file contents.
- Go back to the current `src/App.jsx`, click **Edit**, paste over everything, commit.

Alternatively, if you're comfortable with git commands and have the repo checked out anywhere: `git revert` the App.jsx commit.

### 2. Overwrite these two files

- `src/components/Sidebar.jsx`
- `src/components/Topbar.jsx`

### 3. Keep the `styles.css` from the previous delta

The CSS is unchanged — the drawer + hamburger styles from `hamburger.zip`'s `styles.css` are still exactly what these components need. Don't touch it.

### 4. Netlify auto-deploys

Hard-refresh once the build finishes. Site should be back up, and the hamburger should work on mobile.

## If it's still broken after these steps

Open browser dev tools → Console → click the red error → look for the actual error message (not just the stack). If it says something like `SyntaxError` or a specific file path, share that and I'll pinpoint. If it says something about a Provider or Router, that gives us the exact clue.

Also share what your `src/main.jsx` looks like (paste the whole file). That tells me if BrowserRouter and SettingsProvider are wrapped there, which affects how App.jsx should be structured.
