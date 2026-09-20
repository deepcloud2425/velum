'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.1] bg-[#070a0f]/80 px-5 pb-10 pt-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <div className="mb-3 flex items-center gap-3">
            <img src="/velum-brand-logo.svg" alt="Velum" className="h-8 w-auto" />
            <span className="data-label border border-primary/30 px-2 py-1 text-primary rounded-sm">Preprod</span>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Private settlement rails for a world that needs both discretion and proof.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <Link href="/docs" className="transition-colors hover:text-foreground">Docs</Link>
          <a href="https://preprod.midnightexplorer.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
            Explorer <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
          <Link href="/admin" className="transition-colors hover:text-foreground">Developer</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Velum on GitHub" className="flex min-h-11 min-w-11 items-center justify-center border border-transparent transition-colors hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-foreground rounded-md">
            <Github aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground md:justify-end">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
          <span>Shielded by zero-knowledge proofs</span>
        </div>
      </div>
    </footer>
  );
}
