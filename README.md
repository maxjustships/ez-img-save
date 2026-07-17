<div align="center">
  <img src="public/icons/icon-128.png" width="96" height="96" alt="EZ IMG SAVE icon" />
  <h1>EZ IMG SAVE</h1>
  <p>Save webpage images as Original, PNG, JPEG, or WebP without opening a context menu.</p>
</div>

> Chrome Web Store publication is being prepared. Until the listing is live, install the unpacked build from this repository.

## What it does

EZ IMG SAVE adds a small download button when you point at an image. Large images keep the button in their top-right corner; images smaller than 96 px in either dimension get the button beside them so the image stays visible.

- Choose **Original**, **PNG**, **JPEG**, or **WebP** in the popup.
- Keep SVG/vector images in their original format by default, even when raster output is selected.
- Hide every save button with one switch.
- Convert locally in Chrome; no image is sent to the developer or a third-party service.
- Preserve transparency in PNG and WebP. JPEG uses a white background at 92% quality.
- Keep animated images intact with Original. Converting an animated image saves its first frame.

## Install locally

Requirements: Node.js 24+ and npm 11+.

```bash
npm ci
npm run build
```

Then open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select the generated `dist` directory.

## Use it

1. Open the extension popup and choose a format. Leave **Preserve SVG/vector images** on to keep SVG files editable and resolution-independent.
2. Point at an image on any regular webpage.
3. Click the download button that appears.

Settings are saved immediately and apply to already-open pages.

## Permissions

| Permission             | Why it is needed                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `storage`              | Saves the enabled state, selected output format, and vector-preservation preference locally in Chrome. |
| Access to all websites | Shows the button beside webpage images and fetches only the image the user explicitly chooses to save. |

The extension has no analytics, accounts, ads, telemetry, or remote configuration. See [PRIVACY.md](PRIVACY.md) for the complete data-handling statement.

## Development

```bash
npm run dev          # development build with extension reload support
npm test             # unit tests
npm run typecheck    # strict TypeScript checks
npm run lint         # ESLint
npm run check        # full local CI gate
npm run package      # Chrome Web Store-ready ZIP in dist-zip/
npm run preview:test # local image gallery for manual browser testing
```

The project is intentionally small:

```text
src/
├── background/  authenticated image fetching
├── content/     hover controls, local conversion, and downloads
├── popup/       extension settings
└── shared/      settings, filenames, messages, and placement logic
```

Vite and CRXJS handle the Manifest V3 build. Vitest covers the pure behavior rules that are easiest to regress: small-image placement, persisted settings, and filenames. The release workflows run the same checks before creating a ZIP or submitting an update.

## Known boundaries

- The button targets `<img>` elements, not CSS background images or canvas content.
- Original preserves the source file. PNG/JPEG/WebP conversion rasterizes the displayed image and therefore saves the first frame of animated formats.
- SVG stays in its original vector format by default. Disable **Preserve SVG/vector images** to rasterize it into the selected format.
- Sites can revoke temporary image URLs or block a second authenticated request. The extension reports the failure instead of silently saving invalid data.

## Releases and Chrome Web Store

The project uses Semantic Versioning. Release Please maintains the changelog and creates versioned GitHub releases. A protected GitHub environment can then upload and submit the matching ZIP through Chrome Web Store API v2.

See [docs/RELEASING.md](docs/RELEASING.md) for initial CWS setup and [docs/STORE_LISTING.md](docs/STORE_LISTING.md) for ready-to-paste listing copy and permission justifications.

## Contributing

Small, focused fixes are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request and report security issues through [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).
