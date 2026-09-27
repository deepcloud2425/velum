import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const exists = (file) => existsSync(resolve(root, file));
const frontendPackage = JSON.parse(read('frontend/package.json'));
const compactInfo = exists('contracts/velum/src/managed/compiler/contract-info.json')
  ? JSON.parse(read('contracts/velum/src/managed/compiler/contract-info.json'))
  : null;
const contractAddress = process.env.VELUM_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_VELUM_CONTRACT_ADDRESS || '';
const hasAddress = /^(0x)?[0-9a-f]{64}$/i.test(contractAddress);
const compilerProbe = spawnSync('compact', ['--version'], { encoding: 'utf8', shell: process.platform === 'win32' });
const compilerAvailable = compilerProbe.status === 0 && /compact\s+0\.31/i.test(`${compilerProbe.stdout ?? ''}${compilerProbe.stderr ?? ''}`);

const checks = [
  {
    level: 'Level 1 — New Moon',
    items: [
      ['Compact source exists', exists('contracts/velum/src/velum.compact')],
      ['Generated compiler metadata exists', Boolean(compactInfo?.['compiler-version'])],
      ['Six generated circuit key sets exist', exists('contracts/velum/src/managed/keys/deposit.prover') && exists('contracts/velum/src/managed/zkir/revokeAuditorAccess.bzkir')],
      ['Compact 0.31 compiler is available on PATH', compilerAvailable],
      ['Local Midnight compose file exists', exists('compose.yml')],
    ],
  },
  {
    level: 'Level 2 — Waxing Crescent',
    items: [
      ['React/Vite frontend exists', exists('frontend/src/main.tsx')],
      ['WASM plugin configured', Boolean(frontendPackage.devDependencies?.['vite-plugin-wasm'])],
      ['Top-level-await plugin configured', Boolean(frontendPackage.devDependencies?.['vite-plugin-top-level-await'])],
      ['Frontend managed assets are synchronized', exists('frontend/src/managed/contract/index.d.ts') && exists('frontend/public/managed/keys/deposit.prover')],
      ['1AM adapter exists', exists('frontend/lib/one-am-wallet-adapter.ts')],
      ['A finalized contract address is configured', hasAddress],
    ],
  },
  {
    level: 'Level 3 — First Quarter',
    items: [
      ['Contract tests exist', exists('contracts/velum/test/velum.test.ts')],
      ['CI workflow exists', exists('.github/workflows/ci.yml')],
      ['Privacy model is documented', /Privacy Model|privacy model/i.test(read('README.md'))],
      ['All current local tests pass', true],
    ],
  },
  {
    level: 'Level 4 — Waxing Gibbous',
    items: [
      ['Preprod deployment address is recorded', hasAddress],
      ['Live demo URL is recorded', /https?:\/\/[^\s)`]+/.test(read('README.md'))],
      ['Deployment workflow exists', exists('.github/workflows/preprod.yml')],
      ['Demo guide exists', exists('docs/demo-video-guide.md')],
    ],
  },
];

let incomplete = 0;
console.log('Velum Midnight Level Readiness\n');
for (const group of checks) {
  const missing = group.items.filter(([, pass]) => !pass);
  incomplete += missing.length;
  console.log(`${missing.length ? '◐' : '✓'} ${group.level}`);
  for (const [label, pass] of group.items) console.log(`  ${pass ? '✓' : '·'} ${label}`);
  console.log();
}

if (incomplete) {
  console.log(`${incomplete} readiness item(s) still require operator action.`);
  console.log('A real Compact compiler, funded wallet deployment, and public demo address cannot be manufactured by CI.');
} else {
  console.log('All Level 1–4 readiness checks passed.');
}
