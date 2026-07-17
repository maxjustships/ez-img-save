import { describe, expect, it } from 'vitest';
import { isVectorImageSource, resolveOutputFormat } from '../src/shared/vector';

describe('vector image handling', () => {
  it('recognizes SVG from MIME type, URL, and data URLs', () => {
    expect(isVectorImageSource('https://example.com/image', 'image/svg+xml')).toBe(true);
    expect(isVectorImageSource('https://example.com/image.svg?size=large', '')).toBe(true);
    expect(isVectorImageSource('data:image/svg+xml,%3Csvg%3E', '')).toBe(true);
    expect(isVectorImageSource('https://example.com/image.png', 'image/png')).toBe(false);
  });

  it('keeps vector sources original when preservation is enabled', () => {
    expect(
      resolveOutputFormat('jpeg', true, 'https://example.com/image.svg', 'image/svg+xml'),
    ).toBe('original');
    expect(
      resolveOutputFormat('jpeg', false, 'https://example.com/image.svg', 'image/svg+xml'),
    ).toBe('jpeg');
  });
});
