import type { OutputFormat } from './settings';

const MIME_EXTENSIONS: Record<string, string> = {
  'image/apng': 'apng',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/webp': 'webp',
};

const FORMAT_EXTENSIONS: Record<Exclude<OutputFormat, 'original'>, string> = {
  png: 'png',
  jpeg: 'jpg',
  webp: 'webp',
};

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function replaceControlCharacters(value: string): string {
  return [...value].map(character => (character.charCodeAt(0) < 32 ? '-' : character)).join('');
}

function pathNameFromUrl(sourceUrl: string): string {
  if (!sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://')) {
    return '';
  }

  try {
    return new URL(sourceUrl).pathname.split('/').filter(Boolean).at(-1) ?? '';
  } catch {
    return '';
  }
}

function originalExtension(sourceUrl: string, mimeType: string): string {
  const fromMime = MIME_EXTENSIONS[mimeType.toLowerCase()];
  if (fromMime) {
    return fromMime;
  }

  const pathName = pathNameFromUrl(sourceUrl);
  const match = /\.([a-z0-9]{1,8})$/i.exec(pathName);
  return match?.[1]?.toLowerCase() ?? 'img';
}

function fallbackName(now: Date): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  return `image-${stamp}`;
}

export function createDownloadFilename(
  sourceUrl: string,
  format: OutputFormat,
  mimeType: string,
  now = new Date(),
): string {
  const sourceName = safeDecode(pathNameFromUrl(sourceUrl));
  const withoutExtension = sourceName.replace(/\.[a-z0-9]{1,8}$/i, '');
  const sanitized = replaceControlCharacters(withoutExtension)
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[. ]+$/g, '')
    .trim()
    .slice(0, 120);
  const baseName = sanitized || fallbackName(now);
  const extension =
    format === 'original' ? originalExtension(sourceUrl, mimeType) : FORMAT_EXTENSIONS[format];

  return `${baseName}.${extension}`;
}
