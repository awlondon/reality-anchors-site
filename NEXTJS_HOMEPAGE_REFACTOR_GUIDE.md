# Reality Anchors — Next.js Homepage Refactor Pack

This guide provides:
1. A production-style **React/Next.js App Router implementation** for an enterprise homepage.
2. A **Codex structured instruction set** to refactor the full site consistently.

---

## 1) File Map (Next.js 13+ App Router)

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  SiteNav.tsx
  Hero.tsx
  TrustBar.tsx
  Features.tsx
  CaseStudies.tsx
  LeadForm.tsx
  SiteFooter.tsx
lib/
  analytics.ts
public/
  media/hero-loop.mp4
  media/hero-loop.webm
  media/hero-poster.jpg
  logos/*.svg
```

---

## 2) Core Implementation

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reality Anchors Limited | Structural Intelligence Platform",
  description:
    "Enterprise structural intelligence workflows for governed optimization, validation, and measurable material efficiency.",
  openGraph: {
    title: "Reality Anchors Limited",
    description:
      "Move from estimation to governed optimization with enterprise-safe AI workflows.",
    images: ["/og-home.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
```

### `app/page.tsx`

```tsx
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import CaseStudies from "@/components/CaseStudies";
import LeadForm from "@/components/LeadForm";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <TrustBar />
      <Features />
      <CaseStudies />
      <LeadForm />
      <SiteFooter />
    </main>
  );
}
```

### `components/SiteNav.tsx`

```tsx
export default function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="font-semibold tracking-tight">Reality Anchors</a>
        <div className="flex gap-6 text-sm text-white/80">
          <a href="#solutions" className="hover:text-white">Solutions</a>
          <a href="#case-studies" className="hover:text-white">Case Studies</a>
          <a href="#lead-form" className="hover:text-white">Contact</a>
        </div>
      </nav>
    </header>
  );
}
```

### `components/Hero.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export default function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const mediaPrefersMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mediaPrefersMotion) {
      const onMove = (e: PointerEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        video.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.06)`;
      };
      container.addEventListener("pointermove", onMove);
      return () => container.removeEventListener("pointermove", onMove);
    }
  }, []);

  return (
    <section id="top" ref={containerRef} className="relative flex min-h-screen items-center overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-poster.jpg"
      >
        <source src="/media/hero-loop.webm" type="video/webm" />
        <source src="/media/hero-loop.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/90" />

      <div className="relative z-10 mx-auto mt-12 w-full max-w-7xl px-6 py-24">
        <p className="mb-4 text-xs tracking-[0.18em] text-cyan-200/85">REALITY ANCHORS LIMITED</p>
        <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-tight md:text-6xl">
          Precision Intelligence for Structural Systems
        </h1>
        <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
          Real-time validation, deterministic optimization, and field-ready AI workflows built for measurable enterprise outcomes.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#lead-form"
            onClick={() => track("cta_click", { location: "hero", cta: "request_demo" })}
            className="rounded-md bg-blue-500 px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-blue-400"
          >
            Request Demo
          </a>
          <a
            href="#case-studies"
            onClick={() => track("cta_click", { location: "hero", cta: "view_case_studies" })}
            className="rounded-md border border-white/35 px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            View Case Studies
          </a>
        </div>
      </div>
    </section>
  );
}
```

### `components/TrustBar.tsx`

```tsx
const logos = ["Precast", "Industrial", "Infrastructure", "Commercial"];

export default function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-slate-900/65">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-7 text-center text-sm text-white/70 md:grid-cols-4">
        {logos.map((logo) => (
          <div key={logo} className="rounded border border-white/10 bg-white/5 px-3 py-2">
            Trusted by {logo} teams
          </div>
        ))}
      </div>
    </section>
  );
}
```

### `components/Features.tsx`

```tsx
const items = [
  {
    title: "Governed Optimization",
    body: "Deterministic guardrails ensure recommendations stay policy-aligned and auditable.",
  },
  {
    title: "Operational Traceability",
    body: "Every decision path is logged for QA, compliance, and post-project analysis.",
  },
  {
    title: "Faster Value Realization",
    body: "Deploy role-specific workflows and see measurable efficiency signals within weeks.",
  },
];

export default function Features() {
  return (
    <section id="solutions" className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Built for high-accountability operations</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/15 bg-white/[0.03] p-6">
            <h3 className="text-xl font-medium">{item.title}</h3>
            <p className="mt-3 text-white/75">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### `components/CaseStudies.tsx`

```tsx
const studies = [
  { name: "Industrial Precast Group", outcome: "17% scrap reduction across two plants in 90 days." },
  { name: "Commercial Rebar Network", outcome: "11% schedule-adherence lift after guided planning rollout." },
  { name: "Independent Fabricators", outcome: "9% cut-list precision improvement in month one." },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-semibold">Proof of measurable outcomes</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {studies.map((s) => (
            <article key={s.name} className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 text-slate-700">{s.outcome}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### `components/LeadForm.tsx`

```tsx
"use client";

import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";

type Errors = { email?: string; message?: string };

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const nextErrors: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Please enter a valid work email.";
    if (message.length < 20) nextErrors.message = "Please provide at least 20 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    track("lead_submit", { form: "homepage_enterprise" });

    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    }).catch(() => {
      // no-op for demo; in production display service error message
    });

    setSubmitted(true);
    form.reset();
  };

  return (
    <section id="lead-form" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 rounded-2xl border border-white/15 bg-slate-900/50 p-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Request a scoped consultation</h2>
          <p className="mt-3 text-white/75">Share your goals and current process constraints. We’ll respond with fit, scope, and timeline.</p>
        </div>
        <div>
          {submitted ? (
            <p className="rounded-md border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-200">Thanks — our team will follow up shortly.</p>
          ) : (
            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
              <label className="sm:col-span-1">
                <span className="mb-1 block text-sm text-white/80">Full name</span>
                <input name="name" required className="w-full rounded-md border border-white/20 bg-slate-950 px-3 py-2" />
              </label>
              <label className="sm:col-span-1">
                <span className="mb-1 block text-sm text-white/80">Work email</span>
                <input name="email" type="email" required className="w-full rounded-md border border-white/20 bg-slate-950 px-3 py-2" />
                {errors.email && <span className="mt-1 block text-sm text-rose-300">{errors.email}</span>}
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1 block text-sm text-white/80">Workflow challenge</span>
                <textarea name="message" required rows={4} className="w-full rounded-md border border-white/20 bg-slate-950 px-3 py-2" />
                {errors.message && <span className="mt-1 block text-sm text-rose-300">{errors.message}</span>}
              </label>
              <button className="sm:col-span-2 rounded-md bg-blue-500 px-5 py-3 font-medium transition hover:bg-blue-400" type="submit">
                Request Demo
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
```

### `components/SiteFooter.tsx`

```tsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-white/65">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Reality Anchors Limited</p>
        <div className="flex gap-4">
          <a href="mailto:hello@realityanchors.example" className="hover:text-white">Contact</a>
          <a href="#top" className="hover:text-white">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
```

### `lib/analytics.ts`

```ts
export function track(event: string, payload: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    // Replace with Segment/GA/PostHog as needed.
    console.log("analytics", event, payload);
  }
}
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3) Codex Structured Instructions (Refactor Entire Homepage)

Use the following instruction block directly with Codex:

```text
Task: Refactor the Reality Anchors homepage into an enterprise SaaS conversion funnel using Next.js App Router + Tailwind.

Objectives:
1) Improve clarity of value proposition, trust, and conversion path.
2) Keep visual hierarchy typography-first with motion used as support.
3) Maintain accessibility, performance, and clean semantics.

Implementation plan:
A. Foundation
- Migrate homepage to app/page.tsx composition model.
- Add metadata in app/layout.tsx (title, description, OG image).
- Ensure global styles include reduced-motion behavior.

B. Navigation
- Create sticky minimal nav with anchors: #solutions, #case-studies, #lead-form.
- Keep top-level actions limited to reduce decision friction.

C. Hero
- Add autoplay muted looping background video with poster fallback.
- Support WebM + MP4 sources.
- Overlay dark gradient for text contrast.
- Primary CTA: Request Demo -> #lead-form.
- Secondary CTA: View Case Studies -> #case-studies.
- Add subtle pointer-based parallax only when reduced motion is not requested.

D. Trust + Proof
- Add trust-bar/logos band under hero.
- Add 3 outcome-oriented case study cards with quantifiable metrics.

E. Features
- Add 3–6 benefit cards focused on operational outcomes.
- Use concise copy (title + one sentence) and consistent iconography.

F. Lead Capture
- Add inline form with full name, work email, challenge text.
- Validate email + minimum message length.
- Show inline field errors and in-place success state (no redirect).
- Post to /api/leads and record analytics event.

G. Analytics
- Add track() utility and instrument hero CTA clicks + form submit.

H. Performance
- Keep hero assets compressed and optimized for web.
- Use preload=metadata on video.
- Avoid large blocking scripts.

I. Accessibility
- Ensure headings are hierarchical.
- Ensure form labels are explicit and keyboard accessible.
- Provide sufficient contrast in overlay and buttons.

J. QA checklist
- Mobile: verify stacking, text wrapping, CTA tap targets.
- Desktop: verify hero readability and motion subtlety.
- Keyboard-only: verify nav links, buttons, form flow.
- Reduced-motion: verify minimized animation.
- Lighthouse: verify no major regressions in performance/accessibility/SEO.

Deliverables:
- Updated app/page.tsx and component files.
- Tailwind-styled sections listed above.
- A commit with summary + QA notes.
```

---

## 4) Notes for rollout

- Keep message discipline: one headline promise, one supporting statement, one primary action.
- Prefer outcome metrics over feature jargon in above-the-fold sections.
- If replacing existing static pages gradually, route homepage first and keep section pages intact until full migration is approved.
