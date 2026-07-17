# Store assets

Committed Chrome Web Store assets live here so the listing can be reproduced and reviewed alongside the code.

Upload-ready files:

- `store-icon-128.png` — 128×128 store icon with a 96×96 mark and transparent padding;
- `promo-small-440x280.png` — required small promotional image;
- `promo-marquee-1400x560.png` — optional marquee promotional image;
- `screenshot-01-one-click-1280x800.png` — large-image interaction;
- `screenshot-02-formats-1280x800.png` — popup and output choices;
- `screenshot-03-small-images-1280x800.png` — side placement for a small image;
- `screenshot-04-svg-1280x800.png` — SVG preservation setting;
- `screenshot-05-local-1280x800.png` — local-processing explanation.

`source/showcase.html` is the deterministic visual source. `source/popup-current.png` is captured from the current production build before the listing images are rendered.

Screenshots use square corners and full-bleed opaque 24-bit PNG. They contain no personal tabs, bookmarks, accounts, downloads, or browsing data.

Run `npm run verify:store-assets` before uploading. It verifies every required filename, pixel size, PNG format, and alpha-channel rule.
