# Reality Anchors — Project Guide

## What This Is
B2B SaaS marketing site for an AI-guided execution validation platform targeting industrial fabrication teams. Built with Next.js 15 (App Router), React 19, Tailwind CSS, and static-exported to GitHub Pages.

## Tech Stack
- **Framework**: Next.js 15.5 with `output: 'export'` (static site → `/docs`)
- **Styling**: Tailwind CSS 3.4 + CSS variables (dark theme only)
- **Animation**: Framer Motion 12 + Three.js (WebGL hero background)
- **Backend**: Firebase Firestore (lead storage) + EmailJS (transactional email)
- **Analytics**: GA4, GTM, Google Ads conversion tracking
- **Testing**: Vitest (unit) + Playwright (E2E) + Lighthouse CI
- **Hosting**: GitHub Pages via GitHub Actions

## Key Architecture Decisions
- **Static export**: No API routes, no middleware, no ISR. All client-side.
- **CMS abstraction**: `lib/cms/index.ts` provides swappable content provider. Currently reads from `data/*.ts|json`.
- **A/B testing**: `ExperimentProvider` wraps app. Config in `lib/experiments/config.ts`. Cookie-based variant assignment.
- **Env vars**: All `NEXT_PUBLIC_*` (client-side). No server secrets.

## Directory Map
```
app/              → Pages (App Router). Each folder = route.
components/       → 45+ React components. Charts in components/charts/.
lib/              → Business logic, hooks, analytics, API wrappers.
  api/            → Email (EmailJS) and lead (Firebase) abstractions.
  cms/            → Content provider interface + local implementation.
  experiments/    → A/B test config, types, assignment logic.
  hooks/          → Custom hooks (scroll, funnel, intent tracking).
data/             → Static content: regimes.json, faq.ts, testimonials.ts, workcells.ts.
types/            → TypeScript type definitions.
__tests__/        → Vitest unit tests.
e2e/              → Playwright E2E tests.
scripts/          → Image optimization, asset export.
public/           → Static assets (brand SVGs, images, videos, manifest, sw.js).
```

## Commands
```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Static export to docs/
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (unit)
npm run test:watch   # Vitest (watch mode)
npm run test:e2e     # Playwright (headless)
npm run test:e2e:ui  # Playwright (interactive)
npm run analyze      # Bundle analysis (ANALYZE=true)
```

## Design Tokens
All colors defined as CSS variables in `globals.css` and mirrored in `tailwind.config.ts`:
- `--bg` (#070b12), `--bg-2` (#0d1520), `--card` (#111d2c)
- `--line` (#1e3048), `--txt` (#e4edf8), `--muted` (#8aa8c8)
- `--accent` (#2e7deb), `--accent-2` (#6fb0ff)

Fonts: Inter (body via `--font-inter`), IBM Plex Mono (code via `--font-mono`).

## Conventions
- Components: PascalCase files in `components/`. One component per file.
- Pages: `app/<route>/page.tsx`. Metadata exported as named `metadata` const.
- Styling: Tailwind utilities only — no CSS modules, no CSS-in-JS.
- Motion: Framer Motion presets in `lib/motion.ts` (`fadeUp`, `stagger`, `fadeIn`, `slideLeft`, `scaleIn`).
- Analytics: Use `trackEvent(name, data)` from `lib/analytics.ts`. Events push to both GTM dataLayer and GA4 gtag.
- Content: Add to `data/` files, not inline in components.
- Images: SVG for vectors, JPG for photos. Use `next/image` with `loading="lazy"` for non-critical images.
- Accessibility: Always add `aria-label` on icon buttons, `aria-describedby` on form errors, respect `prefers-reduced-motion`.

## Known Constraints
- Static export means no server-side features (API routes, middleware, ISR).
- `images: { unoptimized: true }` — Next.js image optimization disabled.
- ESLint disabled during build (`ignoreDuringBuilds: true`) — runs in CI separately.
- Three.js loaded via dynamic import with `ssr: false` to avoid server rendering.

## Environment Variables
All prefixed `NEXT_PUBLIC_*` — see `.env.example` for full list. Key ones:
- `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GTM_ID` — Analytics
- `NEXT_PUBLIC_FIREBASE_*` — Firestore config (6 vars)
- `NEXT_PUBLIC_EMAILJS_*` — Email service (4 vars)
- `NEXT_PUBLIC_EXEC_ACCESS_CODE` — Executive dashboard gate (not a security boundary)
