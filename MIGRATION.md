# Platform Migration Guide

This document outlines the steps needed to migrate from GitHub Pages (static export) to a full-featured hosting platform.

## Current Architecture

- **Framework**: Next.js 14.2.5 with `output: 'export'` (static HTML/CSS/JS)
- **Hosting**: GitHub Pages via `docs/` directory
- **Domain**: `realityanchorsltd.com` (CNAME)
- **CI/CD**: GitHub Actions (build + deploy)
- **Limitations**: No server-side rendering, no API routes, no middleware, no custom response headers

## Recommended Migration Targets

### Option A: Vercel (Recommended)

**Effort**: Low | **Benefits**: Full Next.js support, edge functions, analytics, preview deployments

1. Remove `output: 'export'` from `next.config.mjs`
2. Remove `distDir: 'docs'` and `images: { unoptimized: true }`
3. Connect the GitHub repository to Vercel
4. Move environment variables to Vercel project settings
5. Update DNS to point to Vercel
6. Remove `deploy.yml` workflow (Vercel handles deploys)
7. Enable Next.js Image Optimization (remove `unoptimized: true`)
8. Convert `sendLeadEmail` and `saveLead` to API routes for server-side execution

### Option B: Cloudflare Pages

**Effort**: Medium | **Benefits**: Global CDN, Workers for server logic, generous free tier

1. Same Next.js config changes as Option A
2. Use `@cloudflare/next-on-pages` adapter
3. Move API routes to Cloudflare Workers
4. Update DNS (Cloudflare handles this if already using CF DNS)

### Option C: AWS Amplify

**Effort**: High | **Benefits**: Full AWS ecosystem, custom infrastructure control

1. Same Next.js config changes as Option A
2. Configure Amplify build settings
3. Set up custom domain via Route 53
4. Consider API Gateway + Lambda for server-side logic

## What Changes After Migration

### Now Possible
- **API Routes**: Server-side form handling with rate limiting
- **Middleware**: Auth checks, redirects, A/B testing at the edge
- **Image Optimization**: Automatic WebP/AVIF conversion, responsive sizing
- **ISR/SSR**: Dynamic content without full rebuilds
- **Custom Headers**: Proper CSP, HSTS, and security headers
- **Server-side Analytics**: Privacy-preserving analytics without client-side scripts

### Migration Checklist
- [ ] Remove static export config
- [ ] Convert client-side email/Firebase calls to API routes
- [ ] Add rate limiting middleware for form submissions
- [ ] Enable Next.js Image Optimization
- [ ] Add proper CSP headers via `next.config.mjs`
- [ ] Set up preview deployments for PRs
- [ ] Update CI/CD workflow
- [ ] Verify all routes work with server-side rendering
- [ ] Update DNS and SSL configuration
- [ ] Remove `docs/` from repository
