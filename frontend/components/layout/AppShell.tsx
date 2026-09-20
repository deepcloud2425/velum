'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ArrowDownLeft, ArrowUpRight, Layers3, QrCode, Settings2 } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const mobileNav = [
  { label: 'Vault', href: '/dashboard', icon: Layers3 },
  { label: 'Send', href: '/send', icon: ArrowUpRight },
  { label: 'Receive', href: '/receive', icon: ArrowDownLeft },
  { label: 'Request', href: '/request', icon: QrCode },
  { label: 'Ledger', href: '/activity', icon: Activity },
  { label: 'Config', href: '/settings', icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-scene min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="scene-noise absolute inset-0" />
        <div className="absolute -right-44 top-16 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[130px]" />
        <div className="absolute -left-52 top-[38%] h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-[120px]" />
        <div className="circuit-grid absolute inset-0 opacity-30" />
        <div className="floor-grid-3d" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-28 pt-24 sm:px-6 lg:px-10 lg:pb-10 lg:pt-28">
        {children}
      </main>

      <Footer />

      <nav aria-label="Mobile navigation" className="safe-bottom fixed inset-x-3 bottom-3 z-50 lg:hidden">
        <div className="surface-ink grid grid-cols-6 gap-1 p-1.5 shadow-2xl rounded-lg">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex min-h-12 flex-col items-center justify-center gap-1 text-[9px] font-medium uppercase tracking-[0.08em] transition-colors rounded-md ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 -z-10 border border-primary/30 bg-primary/10 rounded-md"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
