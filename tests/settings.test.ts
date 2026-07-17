import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, normalizeSettings } from '../src/shared/settings';

describe('normalizeSettings', () => {
  it('uses defaults when storage is empty', () => {
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps valid persisted settings', () => {
    expect(
      normalizeSettings({ enabled: false, format: 'webp', preserveVectorGraphics: false }),
    ).toEqual({
      enabled: false,
      format: 'webp',
      preserveVectorGraphics: false,
    });
  });

  it('repairs invalid fields independently', () => {
    expect(normalizeSettings({ enabled: 'yes', format: 'avif' })).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ enabled: false, format: 42 })).toEqual({
      enabled: false,
      format: DEFAULT_SETTINGS.format,
      preserveVectorGraphics: DEFAULT_SETTINGS.preserveVectorGraphics,
    });
  });

  it('enables vector preservation for settings saved before the option existed', () => {
    expect(normalizeSettings({ enabled: true, format: 'jpeg' })).toEqual({
      enabled: true,
      format: 'jpeg',
      preserveVectorGraphics: true,
    });
  });
});
