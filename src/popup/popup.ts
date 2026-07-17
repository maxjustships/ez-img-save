import { loadSettings, saveSettings, type OutputFormat, type Settings } from '../shared/settings';

const enabledInput = query<HTMLInputElement>('#enabled');
const preserveVectorGraphicsInput = query<HTMLInputElement>('#preserve-vector-graphics');
const formatInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="format"]')];
const status = query<HTMLElement>('#status');
const statusText = query<HTMLElement>('#status-text');
const version = query<HTMLElement>('#version');

version.textContent = `v${chrome.runtime.getManifest().version}`;

enabledInput.addEventListener('change', () => {
  void persist({ enabled: enabledInput.checked });
});

preserveVectorGraphicsInput.addEventListener('change', () => {
  void persist({ preserveVectorGraphics: preserveVectorGraphicsInput.checked });
});

for (const input of formatInputs) {
  input.addEventListener('change', () => {
    if (input.checked) {
      void persist({ format: input.value as OutputFormat });
    }
  });
}

void loadSettings()
  .then(settings => {
    render(settings);
    document.documentElement.dataset.ready = 'true';
  })
  .catch(() => setStatus('Settings are unavailable.', 'error'));

async function persist(patch: Partial<Settings>): Promise<void> {
  setControlsDisabled(true);

  try {
    render(await saveSettings(patch));
  } catch {
    setStatus('Could not save this setting.', 'error');
  } finally {
    setControlsDisabled(false);
  }
}

function render(settings: Settings): void {
  enabledInput.checked = settings.enabled;
  preserveVectorGraphicsInput.checked = settings.preserveVectorGraphics;

  for (const input of formatInputs) {
    input.checked = input.value === settings.format;
  }

  if (settings.enabled) {
    const format = settings.format === 'jpeg' ? 'JPEG' : settings.format.toUpperCase();
    setStatus(`Ready · ${format}`, 'active');
  } else {
    setStatus('Buttons hidden', 'hidden');
  }
}

function setControlsDisabled(disabled: boolean): void {
  enabledInput.disabled = disabled;
  preserveVectorGraphicsInput.disabled = disabled;
  for (const input of formatInputs) {
    input.disabled = disabled;
  }
}

function setStatus(message: string, tone: 'active' | 'hidden' | 'error'): void {
  status.dataset.tone = tone;
  statusText.textContent = message;
}

function query<ElementType extends Element>(selector: string): ElementType {
  const element = document.querySelector<ElementType>(selector);
  if (!element) {
    throw new Error(`Missing popup element: ${selector}`);
  }
  return element;
}
