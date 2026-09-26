import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const source = resolve(root, 'contracts/velum/src/managed');
const destinations = [
  resolve(root, 'frontend/src/managed'),
  resolve(root, 'frontend/public/managed'),
];

if (!existsSync(source)) {
  throw new Error(`Managed Compact artifacts were not found at ${source}. Run the Compact compiler first.`);
}

for (const destination of destinations) {
  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true });
  console.log(`Copied managed artifacts → ${destination}`);
}
