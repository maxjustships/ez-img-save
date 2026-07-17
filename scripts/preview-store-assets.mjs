import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const host = '127.0.0.1';
const port = 4175;

const routes = new Map([
  ['/', resolve('store-assets/source/showcase.html')],
  ['/showcase.html', resolve('store-assets/source/showcase.html')],
  ['/popup-current.png', resolve('store-assets/source/popup-current.png')],
  ['/icon.svg', resolve('assets/icon.svg')],
  ['/large.svg', resolve('tests/fixtures/large.svg')],
  ['/tiny.svg', resolve('tests/fixtures/tiny.svg')],
  ['/wide.svg', resolve('tests/fixtures/wide.svg')],
]);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const requestPath = new URL(request.url ?? '/', `http://${host}:${port}`).pathname;
  const filePath = routes.get(requestPath);

  if (!filePath) {
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`EZ IMG SAVE store asset preview: http://${host}:${port}`);
});
