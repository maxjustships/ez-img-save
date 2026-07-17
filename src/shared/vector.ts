import type { OutputFormat } from './settings';

const VECTOR_MIME_TYPES = new Set(['image/svg+xml']);

export function isVectorImageSource(sourceUrl: string, mimeType: string): boolean {
  const normalizedMimeType = mimeType.split(';', 1)[0]?.trim().toLowerCase() ?? '';
  if (VECTOR_MIME_TYPES.has(normalizedMimeType)) {
    return true;
  }

  if (sourceUrl.toLowerCase().startsWith('data:image/svg+xml')) {
    return true;
  }

  try {
    return /\.svg$/i.test(new URL(sourceUrl).pathname);
  } catch {
    return false;
  }
}

export function resolveOutputFormat(
  selectedFormat: OutputFormat,
  preserveVectorGraphics: boolean,
  sourceUrl: string,
  mimeType: string,
): OutputFormat {
  return preserveVectorGraphics && isVectorImageSource(sourceUrl, mimeType)
    ? 'original'
    : selectedFormat;
}
