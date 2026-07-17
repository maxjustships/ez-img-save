import { describe, expect, it } from 'vitest';
import { createDownloadFilename } from '../src/shared/filename';

describe('createDownloadFilename', () => {
  it('keeps a readable source name and applies the selected extension', () => {
    expect(
      createDownloadFilename(
        'https://cdn.example.com/assets/summer%20photo.avif?width=1200',
        'png',
        'image/png',
      ),
    ).toBe('summer photo.png');
  });

  it('uses the source MIME type for original files', () => {
    expect(
      createDownloadFilename('https://example.com/render?id=7', 'original', 'image/webp'),
    ).toBe('render.webp');
  });

  it('sanitizes characters that are invalid on Windows', () => {
    expect(
      createDownloadFilename('https://example.com/a%3Cb%3Ec%3Ad.png', 'jpeg', 'image/jpeg'),
    ).toBe('a-b-c-d.jpg');
  });

  it('creates a stable fallback for inline images', () => {
    expect(
      createDownloadFilename(
        'data:image/png;base64,AAAA',
        'png',
        'image/png',
        new Date('2026-07-17T12:34:56.000Z'),
      ),
    ).toBe('image-20260717-123456.png');
  });
});
