import { isOutputFormat, type OutputFormat } from './settings';

export type DownloadImageRequest = {
  type: 'download-image';
  sourceUrl: string;
  format: OutputFormat;
  preserveVectorGraphics: boolean;
};

export type DownloadImageResponse =
  | {
      ok: true;
      dataUrl: string;
      filename: string;
      outputFormat: OutputFormat;
    }
  | {
      ok: false;
      error: string;
    };

export function isDownloadImageRequest(value: unknown): value is DownloadImageRequest {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<DownloadImageRequest>;
  return (
    candidate.type === 'download-image' &&
    typeof candidate.sourceUrl === 'string' &&
    isOutputFormat(candidate.format) &&
    typeof candidate.preserveVectorGraphics === 'boolean'
  );
}

export function isDownloadImageResponse(value: unknown): value is DownloadImageResponse {
  if (!value || typeof value !== 'object' || typeof (value as { ok?: unknown }).ok !== 'boolean') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.ok === true) {
    return (
      typeof candidate.dataUrl === 'string' &&
      typeof candidate.filename === 'string' &&
      isOutputFormat(candidate.outputFormat)
    );
  }

  return typeof candidate.error === 'string';
}
