"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "#solutions", label: "Solutions" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled ? "bg-graphite/95 border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" aria-label="Main navigation">
        <a href="#top" className="font-semibold tracking-tight">Reality Anchors</a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-white/85 hover:text-white">
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => trackEvent("cta_click", { location: "navbar", cta: "request_demo" })}
            className="rounded-md bg-indigoCalm px-4 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Request Demo
          </a>
        </div>

        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-graphite px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-white/90">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
