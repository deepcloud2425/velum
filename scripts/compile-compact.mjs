import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const contractsDir = resolve(root, 'contracts/velum');
const source = resolve(contractsDir, 'src/velum.compact');
const output = resolve(contractsDir, 'src/managed');

if (!existsSync(source)) {
  throw new Error(`Compact source file not found: ${source}`);
}

const probe = spawnSync('compact', ['--version'], {
  cwd: contractsDir,
  encoding: 'utf8',
  shell: process.platform === 'win32',
});
const versionOutput = `${probe.stdout ?? ''}${probe.stderr ?? ''}`.trim();

if (probe.error || probe.status !== 0 || !/compact\s+0\.31/i.test(versionOutput)) {
  console.error('The Midnight Compact compiler (0.31.x) was not found.');
  console.error('On Windows, the built-in NTFS `compact.exe` command is not the Midnight compiler.');
  console.error('Install compactc from https://github.com/midnightntwrk/compactc/releases and put it first on PATH.');
  console.error(`Detected output: ${versionOutput || '(none)'}`);
  process.exit(1);
}

console.log(`Using ${versionOutput}`);
const result = spawnSync('compact', ['compile', 'src/velum.compact', 'src/managed'], {
  cwd: contractsDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
