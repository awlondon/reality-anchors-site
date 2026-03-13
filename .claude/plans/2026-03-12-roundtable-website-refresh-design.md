# Roundtable Website Refresh Design

**Date**: 2026-03-12
**Source**: Adversarial Roundtable 2026-03-12
**Approach**: Copy pass + demo path rework + board strategy update (Approach 2)

## Roundtable Signals

Three insights drive this refresh:

1. **Field data > theoretical proofs** — Fabricators ask "Will this save me money?" and "Can I see it work on my actual cut list?" — not about LP relaxation bounds.
2. **Telemetry feedback loop exists** — `usage_events` in Firestore and `tel_streams` with hash-chained events already collect the data. Computing actual-vs-predicted scrap ratios is a Cloud Function, not a 4-week project.
3. **Deployment > algorithm** — Claims become defensible the moment one real customer runs real jobs and measures actual waste. This is a deployment problem, not an algorithm problem.

## Changes by Component

### 1. Hero (`components/Hero.tsx`)

**Headline**: "Every Cut Measured. Every Bend Verified. Every Ton Accounted For."
**New headline**: "See Exactly What You'll Save — Before You Cut."

**Subheadline**: "AI-guided validation that reduces scrap, eliminates rework..."
**New subheadline**: "Load your cut list. Get step-by-step guidance. Watch scrap drop and margin rise. Reality Anchors turns your existing fabrication workflow into a measurable money-saving operation."

**CTAs**:
- Primary: "See What You Could Save" -> "Try It On Your Cut List" (still `/calculator/`)
- Secondary: "Read the Strategic Case" -> "Will This Save Me Money?" (now `/margin-impact/`)

Hero KPIs unchanged.

### 2. ValueBridge (`components/ValueBridge.tsx`)

Card body copy shifts to customer-outcome language. Structure, icons, metrics unchanged.

| Card | New body |
|------|----------|
| GUIDE | "Your operators stop guessing and start following exact steps for every cut and bend. The result: fewer mistakes, less wasted material, and faster job completion." |
| VALIDATE | "Every step is verified in real time — before a bad cut becomes scrap. Deviations are caught at the bench, not discovered in the field." |
| RECORD | "Every cut, every check, every decision — logged automatically. Your ERP gets cleaner data. Your auditors get a complete trail. Your team never reconstructs a job history again." |

### 3. HowItWorks (`components/HowItWorks.tsx`)

Add outcome anchor line to each step card:

| Step | Outcome anchor |
|------|---------------|
| 01 Import | "This is where your existing cut list becomes a money-saving plan." |
| 02 Guide | "This is where operators stop second-guessing and start saving material." |
| 03 Validate | "This is where you catch the mistake that would have cost you a re-order." |
| 04 Record | "This is where every dollar saved becomes provable." |

Bottom CTA: "Try the Quick Estimate ->" -> "See It Work On Your Cut List ->"

### 4. Metrics (`components/Metrics.tsx`)

Add trust signal line below "Measured Outcomes" header:
"Every metric verified against actual production data — not projections."

### 5. Board Strategy (`app/board-strategy/page.tsx`)

**A. New "Field Evidence" section** after "Why Execution Control Is Inevitable":
- Title: "From Theory to Field Evidence"
- Frames deployment-first narrative
- Mentions continuous verification of predictions against actual production telemetry
- Positions as operational maturity

**B. Update "Board-Level Conclusion"**:
- Add deployment framing: the gap isn't algorithmic, it's deployment
- The infrastructure exists; value compounds with each facility that goes live

### 6. CTA Rewiring Summary

| Location | Old | New | Link |
|----------|-----|-----|------|
| Hero primary | See What You Could Save | Try It On Your Cut List | /calculator/ |
| Hero secondary | Read the Strategic Case | Will This Save Me Money? | /margin-impact/ |
| HowItWorks | Try the Quick Estimate -> | See It Work On Your Cut List -> | /calculator/ |

## Files Modified

- `components/Hero.tsx` — headline, subheadline, CTAs
- `components/ValueBridge.tsx` — card body copy
- `components/HowItWorks.tsx` — outcome anchors, bottom CTA
- `components/Metrics.tsx` — trust signal line
- `app/board-strategy/page.tsx` — new section + conclusion update

## What Does Not Change

- Data files (`metrics.json`, `testimonials.ts`, `regimes.json`)
- Page structure, routing, analytics events
- Styling, animations, layout
- Calculator, margin-impact, commercial, industrial pages
