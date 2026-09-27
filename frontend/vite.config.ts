import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enableTopLevelAwaitTransform = process.env.VELUM_ENABLE_TOP_LEVEL_AWAIT === '1';

export default defineConfig({
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  // Vite 6/Rollup supports native top-level await for the esnext target. The
  // legacy transform remains opt-in because it crashes on Midnight's generated
  // WASM chunks with `missing field type`.
  plugins: [react(), wasm(), ...(enableTopLevelAwaitTransform ? [topLevelAwait()] : [])],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/link': path.resolve(__dirname, './src/shims/next-link.tsx'),
      'next/navigation': path.resolve(__dirname, './src/shims/next-navigation.ts'),
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    exclude: [
      '@midnight-ntwrk/ledger-v8',
      '@midnight-ntwrk/onchain-runtime-v3',
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    sourcemap: false,
  },
});
