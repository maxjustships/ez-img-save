import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const packagePath = resolve(process.argv[2] ?? `dist-zip/ez-img-save-${packageJson.version}.zip`);

const requiredEnvironment = [
  'CWS_CLIENT_ID',
  'CWS_CLIENT_SECRET',
  'CWS_REFRESH_TOKEN',
  'CWS_PUBLISHER_ID',
  'CWS_EXTENSION_ID',
];

for (const name of requiredEnvironment) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const accessToken = await getAccessToken();
const publisherId = encodeURIComponent(process.env.CWS_PUBLISHER_ID);
const extensionId = encodeURIComponent(process.env.CWS_EXTENSION_ID);
const itemName = `publishers/${publisherId}/items/${extensionId}`;
const apiRoot = 'https://chromewebstore.googleapis.com';

const uploadResponse = await fetch(`${apiRoot}/upload/v2/${itemName}:upload`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/zip',
  },
  body: await readFile(packagePath),
});

const uploadResult = await parseResponse(uploadResponse, 'upload');
console.log('Chrome Web Store upload accepted:', uploadResult);

const publishResponse = await fetch(`${apiRoot}/v2/${itemName}:publish`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: '{}',
});

const publishResult = await parseResponse(publishResponse, 'publish');
console.log('Chrome Web Store submission accepted:', publishResult);

async function getAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.CWS_CLIENT_ID,
      client_secret: process.env.CWS_CLIENT_SECRET,
      refresh_token: process.env.CWS_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const result = await parseResponse(response, 'authentication');
  if (!result || typeof result !== 'object' || typeof result.access_token !== 'string') {
    throw new Error('Chrome Web Store authentication returned no access token.');
  }

  return result.access_token;
}

async function parseResponse(response, step) {
  const text = await response.text();
  let result;

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = text;
  }

  if (!response.ok) {
    throw new Error(`Chrome Web Store ${step} failed (${response.status}): ${text}`);
  }

  return result;
}
