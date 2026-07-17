import contentStyles from './content.css?inline';
import { isDownloadImageResponse, type DownloadImageRequest } from '../shared/messages';
import { calculateButtonPlacement, type Placement } from '../shared/placement';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  type OutputFormat,
  type Settings,
  watchSettings,
} from '../shared/settings';

const ICONS = {
  idle: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 18v2h14v-2" /></svg>`,
  loading: `<svg class="icon spinner" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66" /></svg>`,
  success: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>`,
  error: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>`,
} as const;

const OUTPUT_MIME_TYPES: Record<Exclude<OutputFormat, 'original'>, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

type ButtonState = keyof typeof ICONS;

const host = document.createElement('div');
host.id = 'ez-img-save-root';
host.style.position = 'fixed';
host.style.inset = '0';
host.style.zIndex = '2147483647';
host.style.pointerEvents = 'none';

const shadow = host.attachShadow({ mode: 'open' });
const style = document.createElement('style');
style.textContent = contentStyles;

const overlay = document.createElement('div');
overlay.className = 'overlay';

const button = document.createElement('button');
button.className = 'save-button';
button.type = 'button';
button.dataset.visible = 'false';
button.dataset.state = 'idle';
button.innerHTML = ICONS.idle;

const status = document.createElement('span');
status.className = 'status';
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');

overlay.append(button, status);
shadow.append(style, overlay);
document.documentElement.append(host);

let settings: Settings = DEFAULT_SETTINGS;
let currentImage: HTMLImageElement | null = null;
let imageHovered = false;
let buttonHovered = false;
let busy = false;
let hideTimer: number | undefined;
let feedbackTimer: number | undefined;

const resizeObserver = new ResizeObserver(() => updatePosition());

void loadSettings().then(nextSettings => {
  settings = nextSettings;
  updateButtonLabel();
});

watchSettings(nextSettings => {
  settings = nextSettings;
  updateButtonLabel();

  if (!settings.enabled) {
    hideButton();
  }
});

document.addEventListener('pointerover', handlePointerOver, true);
document.addEventListener('pointerout', handlePointerOut, true);
window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
window.addEventListener('resize', updatePosition, { passive: true });

button.addEventListener('pointerenter', () => {
  buttonHovered = true;
  cancelHide();
});

button.addEventListener('pointerleave', () => {
  buttonHovered = false;
  scheduleHide();
});

button.addEventListener('click', () => void downloadCurrentImage());

function imageFromEvent(event: PointerEvent): HTMLImageElement | null {
  const image = event
    .composedPath()
    .find((target): target is HTMLImageElement => target instanceof HTMLImageElement);
  return image ?? null;
}

function handlePointerOver(event: PointerEvent): void {
  if (!settings.enabled || busy) {
    return;
  }

  const image = imageFromEvent(event);
  if (!image) {
    return;
  }

  imageHovered = true;
  cancelHide();
  setCurrentImage(image);
  showButton();
}

function handlePointerOut(event: PointerEvent): void {
  const image = imageFromEvent(event);
  if (!image || image !== currentImage) {
    return;
  }

  imageHovered = false;
  scheduleHide();
}

function setCurrentImage(image: HTMLImageElement): void {
  if (currentImage === image) {
    updatePosition();
    return;
  }

  if (currentImage) {
    resizeObserver.unobserve(currentImage);
  }

  currentImage = image;
  resizeObserver.observe(image);
  updateButtonLabel();
  updatePosition();
}

function showButton(): void {
  if (!currentImage || !settings.enabled) {
    return;
  }

  updatePosition();
  button.dataset.visible = 'true';
}

function hideButton(): void {
  if (busy) {
    return;
  }

  button.dataset.visible = 'false';
}

function scheduleHide(): void {
  cancelHide();
  hideTimer = window.setTimeout(() => {
    if (!imageHovered && !buttonHovered) {
      hideButton();
    }
  }, 140);
}

function cancelHide(): void {
  if (hideTimer !== undefined) {
    window.clearTimeout(hideTimer);
    hideTimer = undefined;
  }
}

function updatePosition(): void {
  if (!currentImage || !currentImage.isConnected) {
    hideButton();
    return;
  }

  const rect = currentImage.getBoundingClientRect();
  if (
    rect.width <= 0 ||
    rect.height <= 0 ||
    rect.bottom < 0 ||
    rect.right < 0 ||
    rect.top > window.innerHeight ||
    rect.left > window.innerWidth
  ) {
    hideButton();
    return;
  }

  applyPlacement(
    calculateButtonPlacement(rect, {
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  );
}

function applyPlacement(placement: Placement): void {
  button.style.setProperty('--ez-x', `${Math.round(placement.x)}px`);
  button.style.setProperty('--ez-y', `${Math.round(placement.y)}px`);
  button.dataset.placement = placement.mode;
}

function updateButtonLabel(): void {
  const format = formatLabel(settings.format);
  const sourceDescription = currentImage?.alt.trim() || 'image';
  const label = `Save ${sourceDescription} as ${format}`;
  button.setAttribute('aria-label', label);
  button.title = label;
}

function formatLabel(format: OutputFormat): string {
  return format === 'original' ? 'original format' : format.toUpperCase();
}

async function downloadCurrentImage(): Promise<void> {
  if (!currentImage || busy) {
    return;
  }

  const rawSource = currentImage.currentSrc || currentImage.src;
  if (!rawSource) {
    setButtonState('error', 'This image has no downloadable source.');
    return;
  }

  const format = settings.format;

  busy = true;
  cancelHide();
  button.disabled = true;
  setButtonState('loading', `Preparing ${formatLabel(format)}…`);

  try {
    const request: DownloadImageRequest = {
      type: 'download-image',
      sourceUrl: await makePortableSource(rawSource),
      format,
      preserveVectorGraphics: settings.preserveVectorGraphics,
    };
    const response: unknown = await chrome.runtime.sendMessage(request);

    if (!isDownloadImageResponse(response)) {
      throw new Error('The extension returned an invalid response.');
    }

    if (!response.ok) {
      throw new Error(response.error);
    }

    triggerDownload(
      await convertImageDataUrl(response.dataUrl, response.outputFormat),
      response.filename,
    );
    setButtonState(
      'success',
      response.outputFormat === 'original' && format !== 'original'
        ? 'Saved in original vector format.'
        : `Saved as ${response.outputFormat === 'jpeg' ? 'JPEG' : response.outputFormat.toUpperCase()}.`,
    );
  } catch (error) {
    setButtonState('error', error instanceof Error ? error.message : 'Image download failed.');
  } finally {
    busy = false;
    button.disabled = false;
    window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      setButtonState('idle', '');
      if (!imageHovered && !buttonHovered) {
        hideButton();
      }
    }, 1100);
  }
}

async function makePortableSource(sourceUrl: string): Promise<string> {
  if (!sourceUrl.startsWith('blob:')) {
    return sourceUrl;
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error('This temporary image is no longer available.');
  }

  return await readBlobAsDataUrl(await response.blob());
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Could not read this image.'));
        }
      },
      { once: true },
    );
    reader.addEventListener('error', () => reject(new Error('Could not read this image.')), {
      once: true,
    });
    reader.readAsDataURL(blob);
  });
}

async function convertImageDataUrl(sourceDataUrl: string, format: OutputFormat): Promise<string> {
  if (format === 'original') {
    return sourceDataUrl;
  }

  const sourceImage = document.createElement('img');
  sourceImage.alt = '';
  sourceImage.style.cssText =
    'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;opacity:0;pointer-events:none';

  const loaded = new Promise<void>((resolve, reject) => {
    sourceImage.addEventListener('load', () => resolve(), { once: true });
    sourceImage.addEventListener(
      'error',
      () => reject(new Error('The source image could not be decoded.')),
      { once: true },
    );
  });

  document.documentElement.append(sourceImage);
  sourceImage.src = sourceDataUrl;

  try {
    await loaded;

    if (sourceImage.naturalWidth <= 0 || sourceImage.naturalHeight <= 0) {
      throw new Error('The source image has invalid dimensions.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Image conversion is unavailable in this browser.');
    }

    if (format === 'jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(sourceImage, 0, 0);

    const outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image conversion failed.'));
          }
        },
        OUTPUT_MIME_TYPES[format],
        format === 'jpeg' ? 0.92 : undefined,
      );
    });

    return await readBlobAsDataUrl(outputBlob);
  } finally {
    sourceImage.remove();
  }
}

function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.style.display = 'none';
  document.documentElement.append(link);
  link.click();
  link.remove();
}

function setButtonState(state: ButtonState, message: string): void {
  button.dataset.state = state;
  button.innerHTML = ICONS[state];
  status.textContent = message;
}
