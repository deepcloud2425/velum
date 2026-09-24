import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MarketingPage from '../app/(marketing)/page';
import DashboardPage from '../app/dashboard/page';
import SendPage from '../app/send/page';
import ReceivePage from '../app/receive/page';
import RequestPage from '../app/request/page';
import ActivityPage from '../app/activity/page';
import DocsPage from '../app/docs/page';
import SettingsPage from '../app/settings/page';
import { WalletProvider } from './contexts/WalletContext';

const AdminPage = lazy(() => import('./pages/AdminPage'));

export function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/send" element={<SendPage />} />
        <Route path="/receive" element={<ReceivePage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Admin Console...</div>}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </WalletProvider>
  );
}

export default App;
