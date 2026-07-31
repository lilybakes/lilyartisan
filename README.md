# Logo Variety per Variant

One file: `src/styles.css` — append only.

Adds distinctive logo treatment for every variant across every template's logo class. No JSX changes — pure CSS overrides.

## The 5 logo treatments

| Variant | Full BrandHeader | Compact | Signature |
|---|---|---|---|
| **Clean Modern** | 52×52 | 40×40 | Baseline. No decorative treatment — clean and neutral. |
| **Rustic Kraft** | **64×64** | 46×46 | **Circular dashed brown frame** around the logo — like a hand-stamped mark on kraft paper. Padded so the logo sits inside the ring. |
| **Vintage Letterpress** | **42×42, centered above name** | 32×32 | Small, formal, symmetrical. Header switches to column layout — logo stacks above the centered business name. |
| **Editorial Magazine** | **68×68 with 2px black frame** | 50×50 | Big, prominent, magazine-masthead treatment. Hard black square border with white paper backing — bold visual anchor. |
| **Quiet Minimal** | **34×34, 90% opacity** | 26×26 | Very small, slightly muted. Doesn't fight the recipe name for attention. |

## Also covered

Same treatment logic flows through to the templates that don't use BrandHeader:

- **Social Media Card** logo (`.tpl-social-logo`)
- **Delivery Tag** logo (`.tpl-delivery-logo`)
- **Product Label** logo (`.tpl-label-logo`)
- **Certificate of Craft** logo (`.tpl-cert-logo`)

Every one of these scales, frames, and repositions per variant:

- Kraft wraps them all in dashed circular frames
- Letterpress makes their parent headers column-oriented and centers everything
- Editorial gives them hard black square frames (or white on the dark Social masthead)
- Minimal makes them small and 85–90% opacity

## Layout changes (not just size)

**Rustic Kraft** doesn't change header layout — the ring around the logo is what carries the identity.

**Vintage Letterpress** restructures every header — SocialMediaCard's `.tpl-social-mark`, DeliveryTag's `.tpl-delivery-header`, ProductLabel's `.tpl-label-header`, and the shared BrandHeader — all become `flex-direction: column` with `align-items: center`. Logo sits above centered business name.

**Editorial Magazine** keeps row layout but the black frame around the logo changes the whole visual weight. On the Social card, the frame is white (against the brand-color gradient background) so the mark still reads as a bold lockup.

**Quiet Minimal** keeps default row layout but everything is smaller and lighter — the logo intentionally recedes.

## Deploy

Overwrite `src/styles.css`, push, hard-refresh. Cycle any template through the 5 variants — the logo should look distinctively different each time (dashed circle, centered above, hard black frame, small and muted, or neutral baseline).
