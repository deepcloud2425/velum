import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { Contract } from './managed/contract/index.js';

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceManagedDirectory = path.resolve(moduleDirectory, 'managed');
const compiledManagedDirectory = path.resolve(moduleDirectory, '../../src/managed');

/**
 * The generated Compact contract binding used by Midnight.js deployment code.
 *
 * The compiler output is deliberately kept in src/managed and copied into the
 * frontend by `pnpm copy:managed`; this module only binds it and never edits it.
 */
export const zkConfigPath = existsSync(sourceManagedDirectory)
  ? sourceManagedDirectory
  : compiledManagedDirectory;

export const CompiledVelumContract = (CompiledContract.make as any)('VelumContract', Contract).pipe(
  (CompiledContract.withWitnesses as any)({
    get_input_note_value: () => 0n,
    get_output_note_value: () => 0n,
    get_change_note_value: () => 0n,
  }),
  (CompiledContract.withCompiledFileAssets as any)(zkConfigPath),
);

export { Contract, ledger, pureCircuits } from './managed/contract/index.js';
