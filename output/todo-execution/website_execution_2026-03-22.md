# Website TODO Execution Report — 2026-03-22

## Sources Analyzed
- **Roundtable session**: `ra_agent_roundtable_daily_adversarial_2026_03_22` (today)
  - Read `website-todo.md` (7 items: 4 P1, 3 P2)
  - Read `todo.md` (full roundtable action list for cross-referencing)
- **Huddle sessions (last 3 days)**: None found after `huddle_progressive_anchor_removal_validation_2026_03_16`.
- **Master backlog**: `MASTER_TODO_website.md` from PDCo Business Manager mount
  - 51 items total. 18 previously "verification required" (verified 2026-03-21). 27 open (generic positioning). 6 complete. 3 new from 2026-03-21 roundtable. 6 new from today's roundtable.
- **HITL queue**: `MASTER_TODO_hitl.md` — 6 active pending, 4 expired. No website-related resolutions. Key pending: `HITL-RT-20260322-patent-confirmation-urgency` (HIGH, 12h expiry).
- **Local HITL queue**: `hitl-queue/pushed/` — 2 existing items from 2026-03-21 (HITL-SITE-DEMO-INBOX, HITL-SITE-ONBOARDING-REWRITE).
- **Previous execution report**: `website_execution_2026-03-21.md` — all 18 verification-required items confirmed on main. All actionable work was gated on HITL decisions.

## Completed Items

### 1. CTA Consistency Audit + Fix (P1 — from today's roundtable)

**Audit findings**: 10 CTA inconsistencies found across 8 files on main. CTAs linked to contact forms used 5 different phrasings: "Request Demo", "Start a pilot", "Get started with Pilot", "Schedule a technical review", "Request a technical review", and "Book Technical Review". The roundtable explicitly approved "Join Our Waitlist" as the canonical CTA for all contact-form-linked actions.

**Changes made** (9 files):

| File | Old CTA | New CTA |
|------|---------|---------|
| `lib/constants.ts:12` | "Book Technical Review" | "Join Our Waitlist" |
| `app/personal/page.tsx:213` | "Get started with Pilot" (LeadForm heading) | "Join Our Waitlist" |
| `app/pilot/page.tsx:174` | "Get started with Pilot" (LeadForm heading) | "Join Our Waitlist" |
| `app/pilot/page.tsx:119` | "Start a pilot" (button) | "Join Our Waitlist" |
| `app/pilot/page.tsx:162` | "Start a pilot" (button) | "Join Our Waitlist" |
| `app/commercial/page.tsx:243` | "Start a pilot" (button) | "Join Our Waitlist" |
| `app/production/page.tsx:171` | "Start a pilot" (button) | "Join Our Waitlist" |
| `app/enterprise/page.tsx:214` | "Schedule a technical review" (LeadForm heading) | "Join Our Waitlist" |
| `app/industrial/page.tsx:176` | "Schedule a technical review" (LeadForm heading) | "Join Our Waitlist" |
| `app/platform/page.tsx:299` | "Request a technical review" (LeadForm heading) | "Join Our Waitlist" |
| `components/HeroWebGL.tsx:45` | "Request Demo" (legacy hero) | "Join Our Waitlist" |

LeadForm descriptions also updated to "we'll reach out when a slot opens" phrasing, consistent with waitlist model.

**Not changed** (intentionally):
- `lib/constants.ts:11` — "Get ROI Estimate" links to `/calculator/` (informational, not a form submission)
- `components/Hero.tsx` — "Try It On Your Cut List" and "Will This Save Me Money?" link to `/calculator/` and `/margin-impact/` (informational)
- `app/industries/page.tsx:216` — "Interested in a workcell not yet listed?" (inquiry-specific, not a generic CTA)
- `app/industries/rebar-cut-bend/page.tsx:222` — "See if rebar cut & bend fits your operation" (fit-assessment-specific)
- `components/InlineCapture.tsx:149` — "Get ROI Estimate" (inline calculator form, not a waitlist)

**Verification**: `npm run typecheck` passed. `npm run build` passed (static export to `docs/` successful).

### 2. Spectral Scan Website Disclosure Audit (P2 — from today's roundtable)

**Audit result**: No spectral scan content exists on the website. Searched all source files in `app/`, `components/`, `data/`, and `lib/` for: spectral, wavelength, infrared, NIR, spectroscopy, alloy detection, material identification, chemical composition, material analysis, material verification.

**Zero matches** in any website-facing code.

**Conclusion**: There is no patent grace period disclosure risk from the website regarding spectral scan features. The provisional patent application's spectral scan scope is not reflected in any public-facing website copy.

## Skipped Items

### From today's roundtable (ra_agent_roundtable_daily_adversarial_2026_03_22)

1. **Designate inbox owner with 24h SLA** (ra-ceo, 15m) — Human decision. Updated existing HITL escalation `HITL-SITE-DEMO-INBOX-20260321` with today's context (4 days unanswered, trade show 6 weeks away).
2. **Deploy auto-responder for waitlist signups** (ra-salesengineer, 30m) — Requires approved email copy and EmailJS template configuration. New HITL escalation created: `HITL-SITE-AUTORESPONDER-20260322`.
3. **Deploy minimal pricing page with tier names + waitlist button** (ra-revenuestrategy, TBD) — Blocked on patent serial number confirmation (`HITL-RT-20260322-patent-confirmation-urgency`, HIGH, 12h expiry). Cannot proceed.
4. **Add progressive rollout footnote to pricing page** — Dependent on pricing page deployment (item 3 above). Blocked.

### Carried forward

1. **27 open generic positioning tasks** — All require human input on specific copy direction. No roundtable session has provided resolved wording. Continuing to accumulate (~3 per session).
2. **Onboarding rewrite** (HITL-SITE-ONBOARDING-REWRITE-20260321) — Still needs list of currently shipping product screens.
3. **Pricing tier update** (HITL-SITE-TODO-20260315-001) — Now 7 days pending. Blocked on Kijona trademark search and patent confirmation.

## HITL Escalations

- **Updated**: `HITL-SITE-DEMO-INBOX-20260321` — Refreshed context with today's roundtable (4 days unanswered, trade show proximity).
- **New**: `HITL-SITE-AUTORESPONDER-20260322` (MEDIUM) — Need approved auto-responder email copy and EmailJS template. Decoupled from inbox owner decision.

## Verification
- `npm run typecheck` — passed
- `npm run build` — passed (static export to `docs/` successful)
- All CTA changes verified in build output

## Remaining Backlog Summary
After this run:
- **6 complete** (unchanged)
- **18 verified** (confirmed 2026-03-21, positioning changes on main)
- **27 open** (generic positioning — all require human copy direction)
- **3 from 2026-03-21 roundtable** (all escalated/skipped)
- **6 from today's roundtable**: 2 completed (CTA audit + fix, spectral scan audit), 2 escalated (inbox owner, auto-responder), 2 blocked (pricing page, footnote)

**Highest priority unblocked**: None remaining. All further actionable website work is gated on HITL decisions (inbox owner, auto-responder copy, patent confirmation, pricing tier).

## Risks and Follow-ups
1. **CTA-to-form mismatch**: CTAs now say "Join Our Waitlist" but form submissions still go to an unmonitored inbox. The CTA language update makes the inbox gap MORE visible to prospects — a waitlist signup with no response is worse than a generic form with no response.
2. **HITL queue still growing**: 3 website-related HITL items now pending locally + master queue at 17 pending. The `HITL-RT-20260322-hitl-queue-reduction-mechanism` decision is pending.
3. **Patent confirmation urgency**: `HITL-RT-20260322-patent-confirmation-urgency` expires ~03:00 UTC 3/23. Pricing page deployment is blocked on this. If serial numbers are not confirmed, competitive visibility risk grows.
4. **Stale worktree branches**: 10+ branches still diverged from main. Recommend cleanup.
5. **No regressions**: Codebase builds and typechecks cleanly. Previous changes intact.
