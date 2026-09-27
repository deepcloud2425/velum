import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const source = resolve(root, 'contracts/velum/src/managed');
const frontendSource = resolve(root, 'frontend/src/managed');
const frontendPublic = resolve(root, 'frontend/public/managed');
const required = [
  'compiler/contract-info.json',
  'contract/index.d.ts',
  'contract/index.js',
  'keys/deposit.prover',
  'keys/deposit.verifier',
  'zkir/deposit.bzkir',
];

const digest = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const failures = [];

for (const relative of required) {
  const expected = resolve(source, relative);
  for (const destination of [frontendSource, frontendPublic]) {
    const actual = resolve(destination, relative);
    if (!existsSync(expected) || !existsSync(actual)) {
      failures.push(`Missing managed artifact: ${actual}`);
      continue;
    }
    if (digest(expected) !== digest(actual)) {
      failures.push(`Managed artifact is out of sync: ${actual}`);
    }
  }
}

if (!existsSync(source)) failures.push(`Missing compiler output directory: ${source}`);
if (existsSync(source) && readdirSync(resolve(source, 'zkir')).length < 6) {
  failures.push('Expected six Velum circuit ZKIR files in compiler output.');
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  console.error('\nRun: pnpm copy:managed');
  process.exit(1);
}

console.log('✓ Contract managed artifacts are present and synchronized across the frontend.');
