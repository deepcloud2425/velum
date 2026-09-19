'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDot,
  EyeOff,
  Fingerprint,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  ShieldCheck,
  WalletCards,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useMidnightWallet } from '../../hooks/useMidnightWallet';

const featureCards = [
  {
    index: '01',
    icon: EyeOff,
    title: 'Private by construction',
    copy: 'Balances, counterparties, and transaction intent stay behind shielded notes. The default state is quiet.',
    accent: 'primary',
  },
  {
    index: '02',
    icon: KeyRound,
    title: 'Proof when it matters',
    copy: 'Create narrow, cryptographic attestations for auditors without opening the rest of your treasury.',
    accent: 'accent',
  },
  {
    index: '03',
    icon: Layers3,
    title: 'One rail, many assets',
    copy: 'Move NIGHT, DUST, and synthetic assets through one settlement surface with predictable finality.',
    accent: 'cyan',
  },
];

const flowSteps = [
  {
    number: '01',
    icon: WalletCards,
    title: 'Fund the veil',
    copy: 'Deposit from the public layer into a private note commitment.',
    status: 'NOTE COMMITTED',
  },
  {
    number: '02',
    icon: Fingerprint,
    title: 'Prove locally',
    copy: 'The witness and zero-knowledge proof are synthesized in your browser.',
    status: 'WITNESS SEALED',
  },
  {
    number: '03',
    icon: Network,
    title: 'Settle quietly',
    copy: 'Publish a valid state transition with no readable balance trail.',
    status: 'STATE FINALIZED',
  },
];

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function MarketingPage() {
  const { isConnected, connect } = useMidnightWallet();

  return (
    <div className="marketing-scene min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="scene-noise absolute inset-0" />
        <div className="absolute -right-64 top-0 h-[42rem] w-[42rem] rounded-full bg-accent/10 blur-[150px]" />
        <div className="absolute -left-72 top-[32%] h-[38rem] w-[38rem] rounded-full bg-primary/[0.07] blur-[150px]" />
        <div className="circuit-grid absolute inset-0 opacity-25" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <section className="mx-auto max-w-[1380px] px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:px-10 lg:pb-28">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.12] pb-4">
            <div className="data-label flex items-center gap-3 text-primary">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Private settlement layer / Midnight preprod
            </div>
            <div className="data-label text-muted-foreground">Protocol status: <span className="text-foreground">operational</span></div>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-[0.91fr_1.09fr] lg:gap-10">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="max-w-2xl">
              <motion.div variants={rise} className="mb-6 inline-flex items-center gap-2 border border-primary/30 bg-primary/[0.06] px-3 py-2 text-xs text-primary rounded-sm">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Zero-knowledge payments for the real world
              </motion.div>

              <motion.h1 variants={rise} className="display-serif text-balance text-[clamp(3.7rem,8vw,7.9rem)] leading-[0.86] text-foreground">
                Move value
                <br />
                <span className="text-primary">through</span> the veil.
              </motion.h1>

              <motion.p variants={rise} className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Velum is a confidential settlement layer built on Midnight. Keep financial relationships private by default, then reveal only the proof a counterpart needs.
              </motion.p>

              <motion.div variants={rise} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Open the vault
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (!isConnected) connect();
                  }}
                >
                  {isConnected ? 'Wallet connected' : 'Connect 1AM wallet'}
                </Button>
              </motion.div>

              <motion.div variants={rise} className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-white/[0.12] pt-5">
                <div>
                  <div className="data-label text-muted-foreground">Disclosure</div>
                  <div className="mt-2 text-lg text-foreground">Opt-in</div>
                </div>
                <div>
                  <div className="data-label text-muted-foreground">Proofs</div>
                  <div className="mt-2 text-lg text-foreground">Local WASM</div>
                </div>
                <div>
                  <div className="data-label text-muted-foreground">Leakage</div>
                  <div className="mt-2 text-lg text-primary">0 bytes</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }} className="hero-orbit relative min-h-[500px] sm:min-h-[610px]">
              <div className="hero-orbit-card marketing-art absolute inset-x-0 top-0 min-h-[500px] overflow-hidden border border-white/[0.18] sm:inset-x-5 sm:min-h-[610px] rounded-lg">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,15,0.06),rgba(7,10,15,0.85))]" />
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-primary/40 opacity-70 orbit-spin" />
                <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-accent/35 opacity-70 orbit-spin-reverse" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#070a0f] via-[#070a0f]/45 to-transparent" />

                <svg aria-hidden="true" viewBox="0 0 760 620" className="absolute inset-0 h-full w-full opacity-90" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flowGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#f3b958" stopOpacity="0" />
                      <stop offset="0.48" stopColor="#f3b958" />
                      <stop offset="1" stopColor="#9583ff" stopOpacity="0.2" />
                    </linearGradient>
                    <filter id="flowGlow"><feGaussianBlur stdDeviation="5" /></filter>
                  </defs>
                  <path d="M-30 430 C120 300 180 500 320 390 S535 168 805 210" stroke="#f3b958" strokeOpacity=".18" strokeWidth="12" fill="none" filter="url(#flowGlow)" />
                  <path d="M-30 430 C120 300 180 500 320 390 S535 168 805 210" stroke="url(#flowGold)" strokeWidth="2" fill="none" strokeDasharray="7 12" />
                  <path d="M85 115 C230 210 225 305 358 300 S530 250 706 415" stroke="#9583ff" strokeOpacity=".62" strokeWidth="1.5" fill="none" strokeDasharray="3 14" />
                  <circle cx="320" cy="390" r="8" fill="#f3b958" />
                  <circle cx="320" cy="390" r="21" fill="none" stroke="#f3b958" strokeOpacity=".35" />
                  <circle cx="552" cy="243" r="5" fill="#9583ff" />
                </svg>

                <div className="absolute left-6 top-6 right-6 flex items-start justify-between gap-3 sm:left-9 sm:right-9 sm:top-9">
                  <div>
                    <div className="data-label text-primary">Velum / core map</div>
                    <div className="mt-2 text-sm text-white/80">A quieter way to settle</div>
                  </div>
                  <div className="data-label border border-white/20 bg-black/20 px-2 py-1 text-white/70 rounded-sm">Live 01</div>
                </div>

                <div className="absolute left-[9%] top-[27%] border border-white/20 bg-[#090e15]/70 p-3 backdrop-blur-md rounded-sm">
                  <div className="data-label text-muted-foreground">Public layer</div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-xs text-white"><CircleDot aria-hidden="true" className="h-3 w-3 text-primary" /> L1 deposit</div>
                </div>

                <div className="absolute left-[35%] top-[56%] z-10 flex h-20 w-20 items-center justify-center rounded-full border border-primary/70 bg-[#111923]/90 shadow-[0_0_45px_rgba(243,185,88,0.28)] sm:h-24 sm:w-24">
                  <div className="text-center">
                    <LockKeyhole aria-hidden="true" className="mx-auto h-5 w-5 text-primary" />
                    <div className="data-label mt-1 text-[9px] text-white/80">Private note</div>
                  </div>
                </div>

                <div className="absolute right-[8%] top-[30%] border border-accent/40 bg-[#0e1020]/75 p-3 backdrop-blur-md rounded-sm">
                  <div className="data-label text-accent">Proof rail</div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-xs text-white"><Zap aria-hidden="true" className="h-3 w-3 text-accent" /> Halo2 / WASM</div>
                </div>

                <div className="absolute bottom-7 left-6 right-6 grid grid-cols-2 gap-2 sm:bottom-9 sm:left-9 sm:right-9 sm:grid-cols-3">
                  <div className="border border-white/15 bg-black/30 p-3 backdrop-blur-md rounded-sm">
                    <div className="data-label text-white/50">Note root</div>
                    <div className="mt-2 truncate font-mono text-xs text-white/90">0x9ae1...c44f</div>
                  </div>
                  <div className="border border-white/15 bg-black/30 p-3 backdrop-blur-md rounded-sm">
                    <div className="data-label text-white/50">Nullifier</div>
                    <div className="mt-2 font-mono text-xs text-primary">UNLINKABLE</div>
                  </div>
                  <div className="col-span-2 border border-white/15 bg-black/30 p-3 backdrop-blur-md rounded-sm sm:col-span-1">
                    <div className="data-label text-white/50">Finality</div>
                    <div className="mt-2 font-mono text-xs text-white/90">12.0 seconds</div>
                  </div>
                </div>
              </div>

              <div className="surface-ink absolute -bottom-1 left-0 flex max-w-[245px] items-start gap-3 border-primary/30 p-4 shadow-2xl sm:-left-2 sm:bottom-5 rounded-md">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary rounded-sm">
                  <Check aria-hidden="true" className="h-4 w-4" />
                </div>
                <div>
                  <div className="data-label text-primary">Proof verified</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">The network sees a valid transition, not your financial life.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-white/[0.1] bg-[#0b1017]/55">
          <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-x divide-y divide-white/[0.1] px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-8 lg:px-10">
            {[
              ['24,180', 'Constraints / proof'],
              ['0.00%', 'Counterparty leakage'],
              ['768 B', 'Compressed payload'],
              ['12.0 s', 'Consensus finality'],
            ].map(([value, label]) => (
              <div key={label} className="px-4 py-6 first:pl-0 sm:px-7 lg:py-8">
                <div className="font-mono text-xl text-foreground sm:text-2xl">{value}</div>
                <div className="data-label mt-2 text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="architecture" className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <div className="data-label text-primary">The operating principle</div>
              <h2 className="display-serif mt-5 text-balance text-5xl leading-[0.95] text-foreground sm:text-6xl">
                Privacy is the surface. Proof is the engine.
              </h2>
              <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">
                Velum replaces the public trail with a small, verifiable state transition. That makes confidentiality a property of the rail, not a setting users have to remember.
              </p>
              <Link href="/docs" className="mt-8 inline-flex min-h-11 items-center gap-2 border-b border-primary/40 pb-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary">
                Read the protocol notes <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                const iconColor = feature.accent === 'primary' ? 'text-primary border-primary/30 bg-primary/10' : feature.accent === 'accent' ? 'text-accent border-accent/30 bg-accent/10' : 'text-cyan-300 border-cyan-300/30 bg-cyan-300/10';
                return (
                  <motion.article key={feature.index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }} className="surface-ink group grid gap-5 p-5 sm:grid-cols-[64px_1fr_auto] sm:items-start sm:p-6 rounded-md">
                    <div className={`flex h-12 w-12 items-center justify-center border rounded-sm ${iconColor}`}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="data-label text-muted-foreground">{feature.index} / capability</div>
                      <h3 className="mt-2 text-lg font-medium text-foreground">{feature.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{feature.copy}</p>
                    </div>
                    <ChevronRight aria-hidden="true" className="hidden h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:block" />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          <div className="surface-raised relative overflow-hidden p-6 sm:p-10 lg:p-14 rounded-md">
            <div className="marketing-art-secondary absolute inset-0 opacity-25" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,19,27,0.98),rgba(14,19,27,0.72),rgba(14,19,27,0.92))]" />
            <div className="relative z-10">
              <div className="flex flex-col justify-between gap-5 border-b border-white/[0.12] pb-7 sm:flex-row sm:items-end">
                <div>
                  <div className="data-label text-primary">Settlement flow / 03 stages</div>
                  <h2 className="display-serif mt-4 max-w-2xl text-4xl leading-none text-foreground sm:text-5xl">A private transfer, explained without the fog.</h2>
                </div>
                <div className="data-label text-muted-foreground">from public input to final state</div>
              </div>

              <div className="mt-9 grid gap-8 md:grid-cols-3 md:gap-4">
                {flowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.number} className="relative">
                      <div className="mb-5 flex items-center gap-3">
                        <span className="data-label text-primary">{step.number}</span>
                        <div className="flow-line hidden flex-1 md:block" />
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center border border-white/20 bg-black/20 text-primary rounded-sm">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-lg text-foreground">{step.title}</h3>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{step.copy}</p>
                      <div className="data-label mt-5 text-white/45">{step.status}</div>
                      {index < flowSteps.length - 1 && <div className="mt-7 h-px bg-white/10 md:hidden" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-5 pb-24 sm:px-8 lg:px-10 lg:pb-36">
          <div className="grid items-end gap-8 border-t border-white/[0.12] pt-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="data-label text-primary">A better default for treasury</div>
              <h2 className="display-serif mt-4 max-w-3xl text-balance text-5xl leading-[0.92] sm:text-7xl">Keep the relationship. Lose the trail.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/dashboard"><Button size="lg" className="group w-full sm:w-auto lg:w-full">Enter Velum <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Button></Link>
              <Link href="/docs" className="flex min-h-11 items-center justify-center gap-2 border border-white/[0.14] px-5 text-sm text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground rounded-md">Explore the docs <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
