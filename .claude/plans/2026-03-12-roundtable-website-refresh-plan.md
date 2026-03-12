# Roundtable Website Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Shift website positioning from process-technical to customer-outcome-forward, update demo path CTAs, and add deployment-first narrative to board strategy — all driven by 2026-03-12 adversarial roundtable insights.

**Architecture:** Copy-level changes across 5 existing components/pages. No new files, routes, or data structures. One new JSX section added to board-strategy page. All changes are text/JSX edits to existing React components.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion. Tests: Vitest + jsdom. Build: `npm run build` (static export).

---

### Task 1: Hero — Rewrite headline, subheadline, and CTAs

**Files:**
- Modify: `components/Hero.tsx:169-206` (headline, subheadline, CTA block)

**Step 1: Edit the headline**

In `components/Hero.tsx`, find:
```tsx
          Every Cut Measured. Every Bend Verified. Every Ton Accounted For.
```
Replace with:
```tsx
          See Exactly What You&apos;ll Save — Before You Cut.
```

**Step 2: Edit the subheadline**

Find:
```tsx
          AI-guided validation that reduces scrap, eliminates rework, and turns material waste into margin. Built for fabrication yards that run on specifications, not guesswork.
```
Replace with:
```tsx
          Load your cut list. Get step-by-step guidance. Watch scrap drop and margin rise. Reality Anchors turns your existing fabrication workflow into a measurable money-saving operation.
```

**Step 3: Edit the primary CTA text**

Find:
```tsx
            See What You Could Save
```
Replace with:
```tsx
            Try It On Your Cut List
```

**Step 4: Edit the secondary CTA text and link**

Find:
```tsx
          <Link
            href="/board-strategy/"
            className="px-7 py-4 rounded-lg border border-white/25 hover:border-white/50 hover:bg-white/6 text-txt font-semibold transition-all hover:-translate-y-0.5"
            onClick={() => trackEvent('hero_cta_secondary')}
          >
            Read the Strategic Case
          </Link>
```
Replace with:
```tsx
          <Link
            href="/margin-impact/"
            className="px-7 py-4 rounded-lg border border-white/25 hover:border-white/50 hover:bg-white/6 text-txt font-semibold transition-all hover:-translate-y-0.5"
            onClick={() => trackEvent('hero_cta_secondary')}
          >
            Will This Save Me Money?
          </Link>
```

**Step 5: Verify build**

Run: `npx next build`
Expected: Build succeeds with no errors.

**Step 6: Commit**

```bash
git add components/Hero.tsx
git commit -m "copy: rewrite hero to customer-outcome-forward positioning

Headline, subheadline, and CTAs now lead with what fabricators
actually ask: 'Will this save me money?' and 'Can I see it on
my cut list?' Driven by 2026-03-12 roundtable insights."
```

---

### Task 2: ValueBridge — Shift card body copy to outcome language

**Files:**
- Modify: `components/ValueBridge.tsx:56-73` (card body text in the `cards` array)

**Step 1: Edit the GUIDE card body**

In `components/ValueBridge.tsx`, find:
```tsx
      body: 'Turn cut lists and schedules into clear, step-by-step workstation actions. Operators know exactly what to do next — no second-guessing drawings or manual look-ups.',
```
Replace with:
```tsx
      body: 'Your operators stop guessing and start following exact steps for every cut and bend. The result: fewer mistakes, less wasted material, and faster job completion.',
```

**Step 2: Edit the VALIDATE card body**

Find:
```tsx
      body: 'Each step is checked against the live job and machine profile. Deviations are caught before they turn into scrap, delay, or rework.',
```
Replace with:
```tsx
      body: 'Every step is verified in real time — before a bad cut becomes scrap. Deviations are caught at the bench, not discovered in the field.',
```

**Step 3: Edit the RECORD card body**

Find:
```tsx
      body: 'Every decision logged and reproducible. Your ERP, detailing, and QA systems get cleaner data on material use, timing, and performance.',
```
Replace with:
```tsx
      body: 'Every cut, every check, every decision — logged automatically. Your ERP gets cleaner data. Your auditors get a complete trail. Your team never reconstructs a job history again.',
```

**Step 4: Verify build**

Run: `npx next build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add components/ValueBridge.tsx
git commit -m "copy: shift value bridge cards to customer-outcome language

GUIDE/VALIDATE/RECORD cards now frame benefits from the
operator's perspective rather than describing system processes."
```

---

### Task 3: HowItWorks — Add outcome anchors and update CTA

**Files:**
- Modify: `components/HowItWorks.tsx:9-59` (steps array) and `components/HowItWorks.tsx:122-128` (bottom CTA)

**Step 1: Add outcome field to each step in the steps array**

In `components/HowItWorks.tsx`, update the `steps` array to add an `outcome` field to each step object:

For step 01 Import, after the `icon` closing paren, add:
```tsx
    outcome: 'This is where your existing cut list becomes a money-saving plan.',
```

For step 02 Guide:
```tsx
    outcome: 'This is where operators stop second-guessing and start saving material.',
```

For step 03 Validate:
```tsx
    outcome: 'This is where you catch the mistake that would have cost you a re-order.',
```

For step 04 Record:
```tsx
    outcome: 'This is where every dollar saved becomes provable.',
```

**Step 2: Render the outcome anchor in the card JSX**

Find (in the map render, around line 108):
```tsx
              <p className="text-sm text-muted leading-relaxed flex-1">
                {step.description}
              </p>
```
Replace with:
```tsx
              <p className="text-sm text-muted leading-relaxed flex-1">
                {step.description}
              </p>
              <p className="text-xs text-accent/80 italic mt-1">
                {step.outcome}
              </p>
```

**Step 3: Update the bottom CTA text**

Find:
```tsx
            Try the Quick Estimate →
```
Replace with:
```tsx
            See It Work On Your Cut List →
```

**Step 4: Verify build**

Run: `npx next build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add components/HowItWorks.tsx
git commit -m "copy: add outcome anchors to HowItWorks steps and update CTA

Each step now includes a customer-outcome line showing the value
delivered at that stage. Bottom CTA reworded to match roundtable
language."
```

---

### Task 4: Metrics — Add trust signal line

**Files:**
- Modify: `components/Metrics.tsx:41-49` (section header area)

**Step 1: Add the trust signal line**

In `components/Metrics.tsx`, find:
```tsx
          className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-12 text-center"
        >
          Measured Outcomes
        </motion.p>
```
Replace with:
```tsx
          className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-3 text-center"
        >
          Measured Outcomes
        </motion.p>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-sm text-muted mb-12 text-center"
        >
          Every metric verified against actual production data — not projections.
        </motion.p>
```

Note: Changed `mb-12` to `mb-3` on the header to tighten spacing before the new line.

**Step 2: Verify build**

Run: `npx next build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add components/Metrics.tsx
git commit -m "copy: add trust signal to metrics section

New line below header: 'Every metric verified against actual
production data — not projections.' References telemetry
feedback loop as trust signal per roundtable."
```

---

### Task 5: Board Strategy — Add Field Evidence section and update conclusion

**Files:**
- Modify: `app/board-strategy/page.tsx:56-68` (after "Why Execution Control Is Inevitable" section) and `app/board-strategy/page.tsx:181-189` (conclusion)

**Step 1: Add the "Field Evidence" section**

In `app/board-strategy/page.tsx`, find the closing `</section>` tag of the "Why Execution Control Is Inevitable" section (around line 68). After it, insert a new section:

```tsx
        <section className="border border-line bg-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-txt mb-4">From Theory to Field Evidence</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Execution validation claims become defensible the moment a real customer runs real jobs and measures actual waste. This is not an algorithm problem — it is a deployment problem.
          </p>
          <p className="text-sm text-muted leading-relaxed mb-4">
            The data collection infrastructure already exists: every checklist step, every operator confirmation, and every deviation is captured as a telemetry event. Scrap predictions are continuously verified against actual production outcomes — not self-reported estimates.
          </p>
          <ul className="flex flex-col gap-2.5 text-sm text-muted">
            {[
              'One facility running real jobs produces more defensible evidence than any theoretical proof.',
              'Actual-vs-predicted scrap ratios are computed from existing production telemetry — no additional instrumentation required.',
              'Each facility that goes live compounds the evidence base and tightens prediction accuracy.',
              'Field data replaces projections: fabricators see their own numbers, not industry averages.',
            ].map((item) => (
              <li key={item} className="flex gap-3"><span className="text-accent">›</span>{item}</li>
            ))}
          </ul>
        </section>
```

**Step 2: Update the Board-Level Conclusion**

Find:
```tsx
          <h2 className="text-xl font-semibold text-txt mb-4">Board-Level Conclusion</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Execution validation is margin-expansion infrastructure, not optional tooling. It improves cost structure, throughput predictability, compliance traceability, and planning accuracy simultaneously.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            The strategic question is not whether execution digitizes. It is who owns the execution layer that anchors the rest of the fabrication stack.
          </p>
```
Replace with:
```tsx
          <h2 className="text-xl font-semibold text-txt mb-4">Board-Level Conclusion</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Execution validation is margin-expansion infrastructure, not optional tooling. It improves cost structure, throughput predictability, compliance traceability, and planning accuracy simultaneously.
          </p>
          <p className="text-sm text-muted leading-relaxed mb-4">
            The remaining gap is not algorithmic — it is deployment. The telemetry infrastructure, validation logic, and feedback loops already exist. Value compounds with each facility that goes live, each job that generates field evidence, and each scrap prediction verified against actual outcomes.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            The strategic question is not whether execution digitizes. It is who owns the execution layer that anchors the rest of the fabrication stack — and who has the field evidence to prove it works.
          </p>
```

**Step 3: Verify build**

Run: `npx next build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add app/board-strategy/page.tsx
git commit -m "copy: add field evidence section and update conclusion on board strategy

New 'From Theory to Field Evidence' section frames the
deployment-first narrative. Conclusion updated with deployment
framing and telemetry verification language."
```

---

### Task 6: Final verification — build and visual check

**Step 1: Full build**

Run: `npx next build`
Expected: Build completes with 0 errors.

**Step 2: Run existing tests**

Run: `npx vitest run`
Expected: All existing tests pass (no component tests directly affected, but LeadForm test exercises shared imports).

**Step 3: Visual spot-check (if dev server available)**

Run: `npx next dev`
Check pages:
- `/` — Hero headline, subheadline, CTAs, ValueBridge cards, HowItWorks outcome anchors, Metrics trust line
- `/board-strategy/` — New Field Evidence section, updated conclusion

**Step 4: Final commit (if any lint/build fixes needed)**

Only if previous steps revealed issues.
