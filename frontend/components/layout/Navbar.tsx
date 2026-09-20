'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Globe2, Layers3, Settings2, Activity } from 'lucide-react';
import { WalletConnectButton } from '../wallet/WalletConnectButton';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';
import { SupportedNetwork } from '../../lib/one-am-wallet-adapter';

const navItems = [
  { label: 'Vault', href: '/dashboard', icon: Layers3 },
  { label: 'Send', href: '/send', icon: ArrowUpRight },
  { label: 'Receive', href: '/receive', icon: ArrowDownLeft },
  { label: 'Ledger', href: '/activity', icon: Activity },
];

export function Navbar() {
  const pathname = usePathname();
  const { network, setNetwork } = useMidnightWallet();
  const [scrolled, setScrolled] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const networks: { id: SupportedNetwork; name: string; detail: string }[] = [
    { id: 'preprod', name: 'Preprod', detail: 'Sandbox network' },
    { id: 'preview', name: 'Preview', detail: 'Preview network' },
    { id: 'mainnet', name: 'Mainnet', detail: 'Coming soon' },
  ];

  const currentNet = networks.find((item) => item.id === network) || networks[0];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/[0.12] bg-[#070a0f]/88 shadow-[0_14px_50px_rgba(0,0,0,0.26)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" aria-label="Velum home" className="group flex shrink-0 items-center gap-3 rounded-md">
            <img
              src="/velum-brand-logo.svg"
              alt="Velum"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex min-h-11 items-center gap-2 px-3.5 text-sm transition-colors duration-200 ${
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon aria-hidden="true" className={`h-3.5 w-3.5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 left-3.5 right-3.5 h-px origin-left bg-primary transition-transform duration-200 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              aria-expanded={networkDropdownOpen}
              aria-haspopup="menu"
              onClick={() => setNetworkDropdownOpen((open) => !open)}
              className="flex min-h-11 items-center gap-2 border border-white/[0.12] bg-white/[0.035] px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/45 hover:bg-white/[0.06] rounded-md"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="hidden sm:inline">{currentNet.name}</span>
              <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${networkDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {networkDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden border border-white/[0.14] bg-[#0d131b]/96 p-1.5 shadow-2xl backdrop-blur-xl rounded-md"
                >
                  <div className="px-3 pb-2 pt-2 data-label text-muted-foreground">Network environment</div>
                  {networks.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setNetwork(item.id);
                        setNetworkDropdownOpen(false);
                      }}
                      className="flex min-h-12 w-full items-center justify-between gap-3 px-3 text-left transition-colors hover:bg-white/[0.06] rounded-sm"
                    >
                      <span>
                        <span className="block text-sm text-foreground">{item.name}</span>
                        <span className="block text-[11px] text-muted-foreground">{item.detail}</span>
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full ${network === item.id ? 'bg-primary' : 'bg-white/20'}`} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/settings"
            aria-label="Open settings"
            className="hidden min-h-11 min-w-11 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-foreground rounded-md sm:flex"
          >
            <Settings2 aria-hidden="true" className="h-4 w-4" />
          </Link>

          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
