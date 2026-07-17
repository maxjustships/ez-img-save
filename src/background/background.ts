import { createDownloadFilename } from '../shared/filename';
import { isDownloadImageRequest, type DownloadImageResponse } from '../shared/messages';
import type { OutputFormat } from '../shared/settings';
import { resolveOutputFormat } from '../shared/vector';

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  if (!isDownloadImageRequest(message)) {
    return undefined;
  }

  void prepareDownload(message.sourceUrl, message.format, message.preserveVectorGraphics)
    .then(sendResponse)
    .catch((error: unknown) => {
      const response: DownloadImageResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Image conversion failed.',
      };
      sendResponse(response);
    });

  return true;
});

async function prepareDownload(
  sourceUrl: string,
  format: OutputFormat,
  preserveVectorGraphics: boolean,
): Promise<DownloadImageResponse> {
  assertSupportedUrl(sourceUrl);

  const sourceBlob = await fetchImage(sourceUrl);
  const dataUrl = await blobToDataUrl(sourceBlob);
  const outputFormat = resolveOutputFormat(
    format,
    preserveVectorGraphics,
    sourceUrl,
    sourceBlob.type,
  );

  return {
    ok: true,
    dataUrl,
    filename: createDownloadFilename(sourceUrl, outputFormat, sourceBlob.type),
    outputFormat,
  };
}

function assertSupportedUrl(sourceUrl: string): void {
  const protocol = sourceUrl.slice(0, sourceUrl.indexOf(':') + 1).toLowerCase();

  if (!['http:', 'https:', 'data:'].includes(protocol)) {
    throw new Error('This image source cannot be downloaded.');
  }
}

async function fetchImage(sourceUrl: string): Promise<Blob> {
  const response = await fetch(sourceUrl, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`The image server returned ${response.status}.`);
  }

  const blob = await response.blob();

  if (blob.type && !blob.type.startsWith('image/')) {
    throw new Error('The selected resource is not an image.');
  }

  return blob;
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const chunkSize = 0x8000;
  let binary = '';

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return `data:${blob.type || 'application/octet-stream'};base64,${btoa(binary)}`;
}
