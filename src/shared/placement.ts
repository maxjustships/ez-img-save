export type RectLike = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type Viewport = {
  width: number;
  height: number;
};

export type Placement = {
  x: number;
  y: number;
  mode: 'overlay' | 'right' | 'left' | 'below' | 'above';
};

export const SMALL_IMAGE_THRESHOLD = 96;
export const BUTTON_SIZE = 36;
export const BUTTON_GAP = 8;
const VIEWPORT_GUTTER = 4;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function calculateButtonPlacement(
  image: RectLike,
  viewport: Viewport,
  buttonSize = BUTTON_SIZE,
  gap = BUTTON_GAP,
): Placement {
  const maxX = viewport.width - buttonSize - VIEWPORT_GUTTER;
  const maxY = viewport.height - buttonSize - VIEWPORT_GUTTER;
  const centeredY = clamp(image.top + (image.height - buttonSize) / 2, VIEWPORT_GUTTER, maxY);
  const isSmall = image.width < SMALL_IMAGE_THRESHOLD || image.height < SMALL_IMAGE_THRESHOLD;

  if (!isSmall) {
    return {
      x: clamp(image.right - buttonSize - gap, VIEWPORT_GUTTER, maxX),
      y: clamp(image.top + gap, VIEWPORT_GUTTER, maxY),
      mode: 'overlay',
    };
  }

  if (image.right + gap + buttonSize <= viewport.width - VIEWPORT_GUTTER) {
    return { x: image.right + gap, y: centeredY, mode: 'right' };
  }

  if (image.left - gap - buttonSize >= VIEWPORT_GUTTER) {
    return { x: image.left - gap - buttonSize, y: centeredY, mode: 'left' };
  }

  const centeredX = clamp(image.left + (image.width - buttonSize) / 2, VIEWPORT_GUTTER, maxX);

  if (image.bottom + gap + buttonSize <= viewport.height - VIEWPORT_GUTTER) {
    return { x: centeredX, y: image.bottom + gap, mode: 'below' };
  }

  return {
    x: centeredX,
    y: clamp(image.top - gap - buttonSize, VIEWPORT_GUTTER, maxY),
    mode: 'above',
  };
}
