# Velum Midnight Level Readiness

This repository follows the Level 1–4 Midnight development guide. The project uses **pnpm** rather than Yarn because the existing monorepo is already managed by pnpm; the workflow is otherwise equivalent.

## Commands

```powershell
# Install dependencies
pnpm install

# Compile Compact and synchronize generated assets
pnpm compile

# Verify generated assets are present in both frontend locations
pnpm verify:managed

# Start the local Midnight services
pnpm env:up
pnpm env:status

# Stop local services
pnpm env:down

# Run the application
pnpm dev

# Run the existing unit/service suite
pnpm test

# Print Level 1–4 readiness status
pnpm readiness
```

## Artifact policy

`contracts/velum/src/managed/` is compiler output. It must not be edited by hand. After every successful Compact compile, run `pnpm copy:managed`; the generated contract runtime, keys, ZKIR files, and metadata are committed in:

- `contracts/velum/src/managed/`
- `frontend/src/managed/`
- `frontend/public/managed/`

The `pnpm verify:managed` command compares representative generated files by SHA-256 and fails if the frontend copies drift.

## Current completion boundary

The repository contains the Compact source, generated 0.31.1 artifacts, Vite/WASM frontend, 1AM adapter, local Docker definition, CI workflows, privacy documentation, and passing local simulation/service tests.

Two Level 4 actions require operator credentials and cannot be completed safely by source code alone:

1. Install the official Compact compiler and run `pnpm compile` on the operator machine.
2. Use a funded 1AM Preprod wallet to deploy the contract and record the finalized contract address in environment configuration and the README.

Never commit wallet mnemonics, seeds, API keys, or fabricated contract addresses.
