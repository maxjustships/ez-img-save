import { readFile } from 'node:fs/promises';

const expectedAssets = new Map([
  ['store-assets/store-icon-128.png', { width: 128, height: 128, alpha: true }],
  ['store-assets/screenshot-01-one-click-1280x800.png', { width: 1280, height: 800 }],
  ['store-assets/screenshot-02-formats-1280x800.png', { width: 1280, height: 800 }],
  ['store-assets/screenshot-03-small-images-1280x800.png', { width: 1280, height: 800 }],
  ['store-assets/screenshot-04-svg-1280x800.png', { width: 1280, height: 800 }],
  ['store-assets/screenshot-05-local-1280x800.png', { width: 1280, height: 800 }],
  ['store-assets/promo-small-440x280.png', { width: 440, height: 280 }],
  ['store-assets/promo-marquee-1400x560.png', { width: 1400, height: 560 }],
]);

for (const [path, expected] of expectedAssets) {
  const bytes = await readFile(path);
  const png = readPngHeader(bytes, path);

  if (png.width !== expected.width || png.height !== expected.height) {
    throw new Error(
      `${path}: expected ${expected.width}x${expected.height}, received ${png.width}x${png.height}`,
    );
  }

  const hasAlpha = png.colorType === 4 || png.colorType === 6;
  if (expected.alpha === true && !hasAlpha) {
    throw new Error(`${path}: the store icon must retain transparency.`);
  }

  if (expected.alpha !== true && hasAlpha) {
    throw new Error(`${path}: CWS screenshots and promotional images must not have alpha.`);
  }

  console.log(`OK ${path} · ${png.width}x${png.height} · PNG color type ${png.colorType}`);
}

const listing = await readFile('docs/STORE_LISTING.md', 'utf8');
const summary = extractListingField(listing, '**Short description**', '**Category**');
const description = extractListingField(listing, '**Detailed description**', '## Single purpose');

if (summary.length > 132) {
  throw new Error(`CWS short description is ${summary.length} characters; maximum is 132.`);
}

if (description.length > 16_000) {
  throw new Error(
    `CWS detailed description is ${description.length} characters; maximum is 16000.`,
  );
}

console.log(`OK CWS short description · ${summary.length}/132 characters`);
console.log(`OK CWS detailed description · ${description.length}/16000 characters`);

function readPngHeader(bytes, path) {
  const signature = '89504e470d0a1a0a';
  if (
    bytes.subarray(0, 8).toString('hex') !== signature ||
    bytes.toString('ascii', 12, 16) !== 'IHDR'
  ) {
    throw new Error(`${path}: expected a PNG file.`);
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    colorType: bytes[25],
  };
}

function extractListingField(markdown, startMarker, endMarker) {
  const start = markdown.indexOf(startMarker);
  const end = markdown.indexOf(endMarker, start + startMarker.length);

  if (start < 0 || end < 0) {
    throw new Error(`Could not find listing field between ${startMarker} and ${endMarker}.`);
  }

  return markdown.slice(start + startMarker.length, end).trim();
}
