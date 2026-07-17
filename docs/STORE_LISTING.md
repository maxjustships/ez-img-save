# Chrome Web Store listing

This document contains ready-to-paste copy for the first EZ IMG SAVE submission. Keep the listing, privacy answers, and actual manifest behavior aligned.

## Listing

**Name**

EZ IMG SAVE

**Short description**

Download and convert webpage images to Original, PNG, JPEG, or WebP in one click, with SVG preservation and local processing.

**Category**

Productivity

**Language**

English

**Detailed description**

Save images from websites in one click—and convert them to the file format you need without leaving the page.

EZ IMG SAVE is a lightweight image downloader and image converter for Chrome. Move your pointer over an image, click the save button, and the file is downloaded using your preferred format. There is no context-menu digging, no separate conversion website, and no repeated setup on every page.

Choose Original, PNG, JPEG, or WebP once in the extension popup. Your preference is saved locally and applies immediately across already-open tabs. Whether you are collecting visual references, saving product photos, downloading illustrations, organizing research, or preparing assets for a document, EZ IMG SAVE keeps the workflow short and predictable.

MAIN FEATURES

- Download webpage images with one explicit click
- Save the original source file without unnecessary conversion
- Convert images to PNG, JPEG/JPG, or WebP directly in Chrome
- Preserve SVG vector graphics by default
- Optionally rasterize SVG files into PNG, JPEG, or WebP
- Keep PNG and WebP transparency when the source supports it
- Give JPEG output a clean white background at 92% quality
- Move the save button beside small images instead of covering them
- Hide all save buttons instantly from the popup
- Keep settings synchronized across open pages
- Process image data locally with no developer-operated server

SUPPORTED OUTPUT FORMATS

Original keeps the source format whenever you want the file exactly as provided by the website. This is the right choice for animated GIF or WebP files because conversion saves only the displayed frame.

PNG creates a lossless image and preserves transparency. It is useful for screenshots, interface assets, logos, diagrams, and images that need further editing.

JPEG creates a broadly compatible JPG file with a white background. It is useful for photographs, presentations, documents, and situations where a smaller file is more convenient than transparency.

WebP provides a modern, compact image while retaining transparency when available. It is useful for websites, design work, and efficient local storage.

SVG files remain vector by default, even when a raster format is selected. This preserves sharp edges, editable paths, and resolution-independent artwork. Turn off “Preserve SVG/vector images” whenever you specifically need a PNG, JPEG, or WebP copy instead.

SMART CONTROLS FOR LARGE AND SMALL IMAGES

On a regular image, the download control appears inside the top-right corner so it is easy to reach. If the image is smaller than 96 pixels in either dimension, the control moves beside it. Tiny icons, thumbnails, badges, and banners remain visible while the save action stays accessible.

PRIVATE BY DESIGN

Image conversion happens locally in your browser. EZ IMG SAVE has no accounts, analytics, ads, telemetry, remote configuration, or developer-operated image service. The extension fetches only the image you explicitly choose to save and keeps the bytes in browser memory only for the time needed to create the download.

Your settings remain in Chrome local storage. Images, image URLs, page URLs, and browsing activity are not sent to the developer or to a third party.

HOW TO USE

1. Open the EZ IMG SAVE popup and choose Original, PNG, JPEG, or WebP.
2. Leave SVG preservation enabled if you want vector files to remain editable and resolution-independent.
3. Point at an image on a regular webpage.
4. Click the download button that appears.

The extension works with standard HTML image elements. It does not extract CSS background images or canvas content, and some websites may prevent a second authenticated request to a protected image. When a source cannot be downloaded, EZ IMG SAVE shows an error instead of silently saving an invalid file.

EZ IMG SAVE is open source under the MIT License. Review the source code, report an issue, or contribute at:
https://github.com/maxjustships/ez-img-save

Privacy policy:
https://github.com/maxjustships/ez-img-save/blob/main/PRIVACY.md

## Single purpose

Allow users to save a webpage image in their chosen file format with one explicit click.

## Permission justifications

### `storage`

Stores only the user's selected output format, whether save buttons are enabled, and whether SVG/vector images should remain in their original format. The values remain in Chrome local storage and are not transmitted.

### Host access: all websites

The extension must run on webpages to find image elements and place a save button beside the image under the pointer. After the user clicks that button, host access lets the background service worker fetch that specific image from its original URL for local conversion. The extension does not read or retain unrelated page content.

## Data-use answers

- No analytics, advertising, authentication, financial, health, personal communication, location, or user account data.
- Website image content is processed locally only after the user clicks the save button.
- No image, image URL, page URL, or browsing activity is sent to the developer or a third party.
- Preferences are stored locally in Chrome.
- Certify compliance with the Chrome Web Store Limited Use requirements.
- Privacy policy URL: `https://github.com/maxjustships/ez-img-save/blob/main/PRIVACY.md`

Review the exact wording of the current dashboard questions during submission. If Google treats local website-content processing as a disclosure category, disclose it and use the explanation above; do not describe it as developer collection.

## Distribution

- Visibility: Public
- Regions: All regions unless a legal or support constraint requires otherwise
- Mature content: No

## Required assets

- Store icon: `store-assets/store-icon-128.png`
- Small promotional image: `store-assets/promo-small-440x280.png`
- Marquee promotional image: `store-assets/promo-marquee-1400x560.png`
- Screenshots, in upload order:
  1. `store-assets/screenshot-01-one-click-1280x800.png`;
  2. `store-assets/screenshot-02-formats-1280x800.png`;
  3. `store-assets/screenshot-03-small-images-1280x800.png`;
  4. `store-assets/screenshot-04-svg-1280x800.png`;
  5. `store-assets/screenshot-05-local-1280x800.png`.

Before uploading, confirm every screenshot depicts the current build and contains no private browser data.
