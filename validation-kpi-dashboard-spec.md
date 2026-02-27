# Validation KPI Dashboard Specification

**Product:** Rebar Bending & Cutting App  
**Version:** 1.0 (Field Validation Mode)  
**Purpose:** Prove measurable scrap reduction, rework reduction, and execution-error suppression against baseline operations.

---

## 1) Core Objectives

The dashboard must quantify and compare **Baseline (Pre-App)** vs **App-Enabled (Post-Deployment)** performance for:

1. Scrap reduction
2. Rework reduction
3. Error-class suppression
4. Workflow compliance
5. Economic impact

All KPIs must be reproducible from stored production logs and exportable for contractor/owner review.

---

## 1.1) U.S. Market Denominator & Waste Layer Assumptions

Use these default assumptions in executive views unless a customer-specific denominator is supplied:

- Estimated U.S. rebar cut-and-bend throughput: **~7.5–9.5 million tons/year**
- Practical planning denominator for national models: **~9 million tons/year**

Separate waste into three layers to avoid overstated claims:

1. **Structural/planned scrap** (stock mismatch, geometry, drop limits): typically **~2–4%**
2. **Execution-error scrap** (miscuts, wrong bend/quantity, calibration/process errors): typically **~0.5–2%**
3. **Handling/site loss** (damage, loss, storage issues): typically **~0.5–2%**

For dashboard narrative and go-to-market claims, focus on the controllable layer:

- **Primary addressable waste:** execution-error scrap + preventable rework
- **Do not claim elimination of total scrap**; claim reduction of preventable execution waste

At a 9 million ton denominator:

- 1.0% execution-error scrap ≈ **90,000 tons/year**
- 1.5% execution-error scrap ≈ **135,000 tons/year**

---

## 2) KPI Categories

## A. Material Efficiency KPIs

### KPI 1 — Scrap Percentage (Primary)

**Formula**

```text
scrap_percent = total_scrap_length / total_stock_length_used
```

**Display**

- Current period scrap %
- 30-day rolling scrap %
- Baseline scrap %
- Delta (absolute points + relative reduction)

**Threshold coloring**

- Green: ≤ 4%
- Yellow: 4–6%
- Red: > 6%

### KPI 2 — Scrap Source Breakdown

Stacked view by source:

- Structural/bin-packing scrap
- Miscut scrap
- Under-length scrap (<18")
- Machine calibration drift scrap

**Narrative intent:** show miscut and drift suppression over time.

### KPI 3 — Usable Offcut Recovery Rate

**Formula**

```text
offcut_recovery_rate = usable_offcuts_reused / total_usable_offcuts_generated
```

Shows leftover reuse and batching discipline.

## B. Rework KPIs

### KPI 4 — Rework Rate per Piece

**Formula**

```text
rework_rate = reworked_pieces / total_pieces_fabricated
```

**Display**

- Baseline %
- Current %
- 7-day trend

**Target:** `< 0.7%` steady-state.

### KPI 5 — Rework Cause Code Distribution

Every rework event must be tagged to exactly one cause code:

- Length miscalculation
- Wrong bend angle
- Wrong quantity
- Sequence error
- OCR misread
- Machine drift
- Operator override misuse

**Display**

- Top 3 causes (baseline vs current)
- Relative change by cause (%)

**Narrative intent:** prove elimination of habitual errors (e.g., math mistakes, angle misreads, quantity overshoot).

## C. Workflow Discipline KPIs

### KPI 6 — Quantity Overshoot Rate

**Formula**

```text
overshoot_rate = overshoot_pieces / total_pieces
```

Manual shops often overcut “just in case”; target trend is toward zero.

### KPI 7 — Manual Override Frequency

Count and rate of operator overrides per run/shift/day.

Interpretation:

- High: training/process trust issue
- Low: stable system adoption

### KPI 8 — Batch Optimization Compliance

**Formula**

```text
batch_compliance = bars_cut_to_recommended_plan / total_bars_cut
```

Shows adherence to optimization recommendations.

## D. Productivity KPIs

### KPI 9 — Pieces per Labor Hour

**Formula**

```text
pieces_per_labor_hour = pieces_completed / total_logged_operator_hours
```

Compare baseline vs app periods.

### KPI 10 — Bend Accuracy (Angle Deviation)

If angle telemetry exists:

```text
angle_deviation = abs(target_angle - achieved_angle)
```

Display mean and standard deviation.

### KPI 11 — Cut Accuracy (Length Deviation)

If sampled/tape verified:

```text
length_deviation = abs(target_length - actual_length)
```

Tracks precision gains and drift risk.

## E. Economic KPIs

### KPI 12 — Material Savings

```text
material_savings = (baseline_scrap_percent - current_scrap_percent) × total_material_cost
```

### KPI 13 — Rework Labor Savings

```text
rework_savings = (baseline_rework_rate - current_rework_rate) × total_pieces × avg_cost_per_rework
```

### KPI 14 — Net Monthly Value

```text
net_monthly_value = material_savings + rework_savings - subscription_cost
```

This should anchor executive buying decisions.

---

## 3) Validation Protocol Layer

The dashboard must provide mode toggles:

- **Baseline Mode**
- **App Mode**

### Baseline Mode requirements

- Manual entry/import support
- Minimum 30 operational days
- Same project type mix tracked

### App Mode requirements

- Auto-ingested from production engine
- Real-time and rolling-window calculations

Purpose: maintain apples-to-apples comparability.

---

## 4) Executive Summary Panel (Top of Dashboard)

Display a printable/exportable “Since Deployment” summary, for example:

- Scrap: `8.1% → 3.9%` (**52% reduction**)
- Rework: `1.6% → 0.5%` (**69% reduction**)
- Quantity overshoot: `-84%`
- Estimated monthly savings: `$7,840`
- System compliance: `93%`

This panel should be available in PDF/CSV export outputs.

---

## 5) Habit Exposure Section

Add a “Habits Eliminated” module tied directly to metrics:

- Math-derived miscuts reduced
- Angle memory errors reduced
- Overcut buffer behavior reduced
- Leftover tracking improved
- Cross-project batching increased

Positioning: this is behavioral correction infrastructure, not just a calculator.

---

## 6) Data Requirements

## Per piece (event-level)

- Job ID
- Shape ID
- Bar size
- Target length
- Achieved length (if verified)
- Target angle
- Achieved angle (if available)
- Operator ID
- Timestamp
- Reworked (Y/N)
- Rework cause code

## Per stock bar

- Stock length
- Piece IDs cut from bar
- Scrap length
- Leftover reused (Y/N)

Without this data, KPI claims are not defensible.

---

## 7) Visualization Plan (Flutter)

## Tabs

1. Executive Summary
2. Material Efficiency
3. Rework & Errors
4. Productivity
5. Economic Impact
6. Data Export

## Charts

- Line charts: scrap and rework trends
- Bar charts: cause code breakdown
- Gauges: current vs target scrap/rework
- Cumulative savings chart
- Operator/facility heatmaps

UX requirements:

- High contrast
- Low-clutter layout
- Readable in daylight/yard conditions

---

## 8) Market Positioning Outcome

This dashboard reframes the offer from **“rebar app”** to **“execution error suppression + material optimization platform.”**

Buyer outcome language should emphasize:

- Reduced scrap
- Reduced rework
- Reduced schedule stress
- Increased margin confidence

---

## 9) Validation Gating (Critical)

To support defensible ROI claims:

1. Run a 30-day baseline audit
2. Run a 60-day app-enabled trial
3. Keep project mix and procurement context comparable
4. Publish signed case-study outputs with exported KPI evidence

Without baseline-first measurement, claims are weak.

---

## 10) Acceptance Criteria

A dashboard release is considered validation-ready only if it can:

- [ ] Reproduce all KPI values from raw logs
- [ ] Compare baseline vs app in the same date selector
- [ ] Break down rework by cause code
- [ ] Show workflow-compliance metrics (overrides, overshoot, batch compliance)
- [ ] Generate exportable executive summary artifacts (PDF/CSV)
- [ ] Show net monthly value with transparent formulas
