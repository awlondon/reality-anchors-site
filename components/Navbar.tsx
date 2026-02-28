'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';

const NAV_LINKS = [
  { href: '/personal/', label: 'Personal' },
  { href: '/commercial/', label: 'Commercial' },
  { href: '/industrial/', label: 'Industrial' },
  { href: '/margin-impact/', label: 'Margin Model' },
];

export default function Navbar({ activePath = '' }: { activePath?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? 'bg-bg/95 backdrop-blur border-b border-line shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Reality Anchors home">
          <Image
            src="/assets/brand/svg/logo-ra-speed-square-dark.svg"
            alt="Reality Anchors"
            width={48}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <span className="hidden sm:block text-xs font-semibold tracking-widest uppercase text-txt/80 leading-tight">
            Reality Anchors Ltd.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                activePath === href
                  ? 'text-accent-2 border-b border-accent-2 pb-0.5'
                  : 'text-muted hover:text-txt'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/commercial/#contact"
            className="px-4 py-2 rounded-lg bg-accent hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-px"
            onClick={() => trackEvent('navbar_cta_click')}
          >
            Request Demo
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-muted hover:text-txt p-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-nav" className="md:hidden px-5 pb-4 flex flex-col gap-4 border-t border-line max-h-[80vh] overflow-y-auto" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium py-1 ${
                activePath === href ? 'text-accent-2' : 'text-muted hover:text-txt'
              }`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/commercial/#contact"
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold text-center"
            onClick={() => { setOpen(false); trackEvent('navbar_cta_click_mobile'); }}
          >
            Request Demo
          </Link>
        </nav>
      )}
    </header>
  );
}
