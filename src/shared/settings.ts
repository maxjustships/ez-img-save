export const SETTINGS_KEY = 'ez-img-save-settings';

export const OUTPUT_FORMATS = ['original', 'png', 'jpeg', 'webp'] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export type Settings = {
  enabled: boolean;
  format: OutputFormat;
  preserveVectorGraphics: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  format: 'png',
  preserveVectorGraphics: true,
};

export function isOutputFormat(value: unknown): value is OutputFormat {
  return typeof value === 'string' && OUTPUT_FORMATS.includes(value as OutputFormat);
}

export function normalizeSettings(value: unknown): Settings {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const candidate = value as Partial<Settings>;

  return {
    enabled: typeof candidate.enabled === 'boolean' ? candidate.enabled : DEFAULT_SETTINGS.enabled,
    format: isOutputFormat(candidate.format) ? candidate.format : DEFAULT_SETTINGS.format,
    preserveVectorGraphics:
      typeof candidate.preserveVectorGraphics === 'boolean'
        ? candidate.preserveVectorGraphics
        : DEFAULT_SETTINGS.preserveVectorGraphics,
  };
}

export async function loadSettings(): Promise<Settings> {
  const stored = await chrome.storage.local.get(SETTINGS_KEY);
  return normalizeSettings(stored[SETTINGS_KEY]);
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const settings = normalizeSettings({ ...(await loadSettings()), ...patch });
  await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
  return settings;
}

export function watchSettings(listener: (settings: Settings) => void): () => void {
  const handleChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: chrome.storage.AreaName,
  ) => {
    if (areaName !== 'local' || !changes[SETTINGS_KEY]) {
      return;
    }

    listener(normalizeSettings(changes[SETTINGS_KEY].newValue));
  };

  chrome.storage.onChanged.addListener(handleChange);
  return () => chrome.storage.onChanged.removeListener(handleChange);
}
