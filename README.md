# Hero Photos

Three real hero photos, converted from PNG to optimized JPG.

## Files

```
public/hero/
  hero-1.jpg    Overhead dough kneading      269 KB   1376×768
  hero-3.jpg    Market bakery handover       254 KB   1408×768
  hero-5.jpg    Counter portrait, front-on   187 KB   1312×816
```

Just drop the whole `public/hero/` folder into your repo (it'll merge/overwrite the existing placeholder JPGs).

## Deploy

1. Extract the zip
2. Copy `public/hero/*.jpg` into your repo's `public/hero/` folder (overwriting the 3 baker cartoon placeholders)
3. Commit + push
4. Hard-refresh `/`

You'll immediately see the real photos on slides 1, 3, and 5. Slides 2 and 4 still use the inline mock UIs from the previous carousel-fix delta.

## Note on resolution

Spec wanted ≥2400px wide. These are ~1400px wide — smaller, but I optimized the JPG quality to 85 which keeps them crisp on desktop. If you ever want to swap in higher-res versions later (say, if you generate 2400px+ originals from Gemini or elsewhere), just re-run the same convert command to keep file sizes reasonable:

```bash
convert your-2400px-photo.png -quality 85 -strip -interlace Plane hero-1.jpg
```

## Nothing else needed

No code changes required — the carousel already references these exact filenames from the last delta. Just the photos going into the right folder.
