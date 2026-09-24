import { Buffer } from 'buffer';

// Polyfill Node.js Buffer and global for Midnight SDK in browser
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import '../app/globals.css';

// Ensure Midnight global network ID is initialized before any wallet or SDK call
try {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('velum_midnight_network') : null;
  setNetworkId(saved || 'preprod');
} catch {}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
