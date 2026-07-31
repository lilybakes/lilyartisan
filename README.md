# Top-right avatar dropdown menu

Adds a clickable dropdown on the top-right circled portrait with three actions: **Personalize**, **Settings**, and **Log out**. Main win: log out without scrolling to the bottom of the sidebar.

## What ships

Three files. Self-contained. `UserAvatar.jsx` is left untouched.

```
src/
  components/
    UserAvatarMenu.jsx        # NEW — wraps UserAvatar, adds dropdown
    user-menu.css             # NEW — scoped .user-menu-* styles
    Topbar.jsx                # OVERWRITE — swaps <UserAvatar/> → <UserAvatarMenu/>
```

## Behaviour

- Click the avatar → dropdown opens below-right, anchored to the avatar with a small tail pointing up
- Header shows the user's email + role ("System administrator" or "Subscriber")
- Three menu items: Personalize (`/app/personalize`), Settings (`/app/settings`), Log out
- Log out is styled danger-red so it reads as the final action, not just another link
- Closes on: outside click, Escape key, or picking any item
- The old sign-out button at the bottom of the sidebar stays where it is — this is an add, not a replacement

## Deploy

Drop the 3 files in, hard-refresh, click the portrait.

## What if my avatar has different behaviour today?

`UserAvatarMenu` renders `UserAvatar` inside the trigger button, unchanged. Whatever your current avatar looks like (initials, uploaded photo, ring, size) shows exactly the same. The only difference is it's now clickable and opens the popover.
