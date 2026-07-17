import { describe, expect, it } from 'vitest';
import {
  BUTTON_SIZE,
  calculateButtonPlacement,
  SMALL_IMAGE_THRESHOLD,
} from '../src/shared/placement';

const viewport = { width: 1280, height: 800 };

describe('calculateButtonPlacement', () => {
  it('keeps the button inside a large image', () => {
    const placement = calculateButtonPlacement(
      { top: 100, right: 500, bottom: 400, left: 100, width: 400, height: 300 },
      viewport,
    );

    expect(placement).toEqual({ x: 456, y: 108, mode: 'overlay' });
  });

  it('moves the button to the right of a small image', () => {
    const placement = calculateButtonPlacement(
      {
        top: 100,
        right: 180,
        bottom: 180,
        left: 100,
        width: SMALL_IMAGE_THRESHOLD - 16,
        height: 80,
      },
      viewport,
    );

    expect(placement).toEqual({ x: 188, y: 122, mode: 'right' });
  });

  it('falls back to the left at the right edge', () => {
    const placement = calculateButtonPlacement(
      { top: 40, right: 1275, bottom: 100, left: 1215, width: 60, height: 60 },
      viewport,
    );

    expect(placement).toEqual({ x: 1171, y: 52, mode: 'left' });
  });

  it('places the button below when neither side fits', () => {
    const narrowViewport = { width: BUTTON_SIZE + 8, height: 240 };
    const placement = calculateButtonPlacement(
      { top: 60, right: 42, bottom: 100, left: 2, width: 40, height: 40 },
      narrowViewport,
    );

    expect(placement).toEqual({ x: 4, y: 108, mode: 'below' });
  });

  it('keeps an overlaid button inside the viewport', () => {
    const placement = calculateButtonPlacement(
      { top: -20, right: 120, bottom: 180, left: -80, width: 200, height: 200 },
      viewport,
    );

    expect(placement).toEqual({ x: 76, y: 4, mode: 'overlay' });
  });
});
