# Website TODO Execution Report - 2026-03-20

## Sources Analyzed
- Canonical roundtable: `ra_agent_roundtable_daily_adversarial_2026_03_20`
  - Read `website-todo.md`
  - Read `master-todo-sync.md`
  - Read `master-todo-sync.json`
- Huddles from the last 3 days in the canonical mount:
  - `huddle_ceo_ankaa_state_repo_alignment_2026_03_20` - no `website-todo.md` or `master-todo-sync` artifact present
  - `huddle_cto_bar_identification_architecture_2026_03_19` - read `website-todo.md` and `master-todo-sync.md`
  - `huddle_patent_filing_prep_2026_03_19` - read `website-todo.md`, `master-todo-sync.md`, and `master-todo-sync.json`
  - `huddle_patent_new_ideas_2026_03_19` - read `website-todo.md`, `master-todo-sync.md`, and `master-todo-sync.json`
- Canonical backlogs:
  - Mounted `MASTER_TODO_website.md`
  - Mounted `MASTER_TODO_hitl.md`
- Resolved HITL context checked:
  - `HITL-RT-20260319-pricing-page-language.json` - resolved to use `included in [Plan]` language
  - `HITL-RT-20260318-feature-gate-descope.json` - resolved to descope full gate enforcement from the immediate MVP path
  - Existing waitlist-owner/demo-owner queue artifacts were present, but no resolved decision unblocked the waitlist CTA go-live

## Completed Items
- Update product messaging to reflect bar-ID-by-detection
  - Updated homepage and platform/rebar product copy to say the system determines bar size and scale from measured reality anchors rather than relying on user declaration alone.
  - Changed files: `components/Hero.tsx`, `components/HowItWorks.tsx`, `components/ValueBridge.tsx`, `app/platform/page.tsx`, `app/industries/rebar-cut-bend/page.tsx`
  - Verification: build passed; homepage, platform, and rebar pages visually checked in browser.
- Add "Reality Anchor" concept to product explainer
  - Added explicit explainer copy that a known object in frame becomes the ruler for everything else the system validates.
  - Changed files: `components/Hero.tsx`, `components/HowItWorks.tsx`, `app/platform/page.tsx`, `app/industries/rebar-cut-bend/page.tsx`
  - Verification: build passed; platform and rebar pages visually checked in browser.
- Audit full site copy for waitlist language consistency TODAY
  - Audit findings:
    - Active live copy still includes `Get started with Pilot` in `app/personal/page.tsx` and `app/pilot/page.tsx`
    - Legacy unused components still contain demo language: `components/HeroWebGL.tsx`, `components/CTASection.tsx`, `components/ScrollStory.tsx`, `components/RegimeExamples.tsx`
    - Current shared CTA constants are already non-demo (`Get ROI Estimate`, `Book Technical Review`)
  - No deploy-time CTA wording was changed because the go-live owner/SLA decision remains unresolved in HITL.
- Draft pricing page with `included in Production` tier language
  - Updated tier narrative, FAQ, homepage pricing copy, and the pricing methodology page to use `included in [Plan]` language.
  - Added a pricing table section documenting module inclusion plus enforcement status so public copy does not imply fully wired gates where rollout is still in progress.
  - Changed files: `data/pricing.ts`, `components/Tiers.tsx`, `components/FeatureMatrix.tsx`, `data/faq.ts`, `app/pricing-methodology/page.tsx`
  - Verification: build passed; pricing methodology page visually checked in browser.

## Skipped Items
- Deploy `join our waitlist` CTA with auto-responder
  - Skipped because the mounted HITL backlog still shows the required inbox-owner / 48-hour SLA decision as unresolved.
  - Existing queue artifacts for demo/waitlist ownership already exist in `hitl-queue/pushed/`; no duplicate escalation was created.
- Validate `included in` language with 3 unfamiliar prospects
  - Skipped because this requires external prospect research and human outreach, not repository work.

## HITL Escalations
- No new HITL item pushed.
- Reason: the waitlist go-live blocker already has existing queue coverage, and duplicating that decision request would create queue noise rather than unblock work.

## Remaining Backlog Summary
- Canonical website backlog items completed this run:
  - `Update product messaging to reflect bar-ID-by-detection`
  - `Add "Reality Anchor" concept to product explainer`
  - `Audit full site copy for waitlist language consistency TODAY`
  - `Draft pricing page with 'included in Production' tier language`
- Highest-priority website items still open after this run:
  - `Deploy 'join our waitlist' CTA with auto-responder`
  - `Validate 'included in' language with 3 unfamiliar prospects`
  - Older open website positioning / demo-flow / executive-summary carryovers not touched in this pass

## Risks and Follow-ups
- Waitlist deployment remains blocked until a human explicitly owns the inbox and response SLA.
- The waitlist audit found live `Get started` copy on active pages; if the waitlist decision is confirmed, those pages should be updated in the next pass before any CTA go-live.
- The pricing draft is intentionally explicit about progressive enforcement because the latest roundtable still flagged bait-and-switch risk. Prospect validation remains necessary before treating the wording as settled.
- Browser console still shows expected local-env warnings during static preview:
  - missing Firebase client env vars
  - missing EmailJS env vars
  - local static-preview X-Frame-Options meta warning
- Verification completed this run:
  - `npm run build`
  - `npm run typecheck`
  - Browser spot-checks on `/`, `/pricing-methodology/`, `/platform/`, `/industries/rebar-cut-bend/`
  - Exported internal link targets confirmed present in `docs/`
