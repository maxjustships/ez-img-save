import { ZipArchive } from 'archiver';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const outputDirectory = resolve('dist-zip');
const outputPath = resolve(outputDirectory, `ez-img-save-${packageJson.version}.zip`);

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await new Promise((resolveArchive, rejectArchive) => {
  const output = createWriteStream(outputPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  output.on('close', resolveArchive);
  output.on('error', rejectArchive);
  archive.on('error', rejectArchive);
  archive.pipe(output);
  archive.directory('dist', false);
  void archive.finalize();
});

console.log(outputPath);
