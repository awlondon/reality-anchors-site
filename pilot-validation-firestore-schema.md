# Pilot Validation Firestore Schema (6-Month Statistical Pilot)

This schema is designed for:
- board-level scrutiny,
- PE/strategic diligence,
- reproducible statistical analysis from raw logs.

## Design Rules
- **Immutable raw events** (`telemetry/events`) — append-only.
- **Clear treatment segmentation** (baseline/control/treated).
- **Validated vs modeled separation** (never mix).
- **Versioned economics outputs** (no destructive overwrite).
- **Confounder logging required** for causal credibility.

## Top-Level Collections

```text
pilotPrograms/
  {pilotId}/
    (document: meta)
    facilities/
    telemetry/
    analysis/
    economics/
    confounders/
    reports/
```

## 1) Pilot Meta
**Path**: `pilotPrograms/{pilotId}`

```json
{
  "name": "Rebar Validation Pilot – Site A + B",
  "status": "baseline",
  "startDate": "2026-03-01",
  "baselineStart": "2026-03-01",
  "baselineEnd": "2026-04-15",
  "deploymentStart": "2026-04-16",
  "stabilityPhaseStart": "2026-07-15",
  "primaryMetrics": ["scrap_rate", "rework_hours", "throughput_per_shift"],
  "statisticalModel": "difference_in_differences",
  "confidenceTarget": 0.95,
  "powerTarget": 0.8
}
```

## 2) Facilities
**Path**: `pilotPrograms/{pilotId}/facilities/{facilityId}`

```json
{
  "name": "Site A",
  "region": "US-West",
  "workstationCount": 5,
  "treatedWorkstations": 3,
  "controlWorkstations": 2,
  "baselineVariance": {
    "scrapRateStdDev": 0.42,
    "reworkHoursStdDev": 1.8
  }
}
```

## 3) Workstation Registry
**Path**: `pilotPrograms/{pilotId}/facilities/{facilityId}/workstations/{stationId}`

```json
{
  "machineType": "Rebar Bender X100",
  "operatorIds": ["op_12", "op_18"],
  "treatmentGroup": true,
  "calibrationProfileId": "cal_2026_04_12",
  "activatedAt": "2026-04-16T09:02:00Z"
}
```

## 4) Immutable Raw Event Log (Authoritative)
**Path**: `pilotPrograms/{pilotId}/telemetry/events/{eventId}`

```json
{
  "timestamp": "2026-05-01T14:22:19Z",
  "facilityId": "siteA",
  "workstationId": "bend_01",
  "operatorId": "op_12",
  "jobId": "job_5543",
  "phase": "treated",
  "eventType": "STEP_CONFIRM",
  "stepId": "bend_step_3",
  "materialLength": 480,
  "targetLength": 500,
  "deltaLength": -20,
  "interventionTriggered": true,
  "overrideUsed": false,
  "executionDurationMs": 4200,
  "createdAt": "2026-05-01T14:22:19Z"
}
```

Allowed `phase`: `baseline | treated | control`  
Allowed `eventType`: `STEP_CONFIRM | STEP_OVERRIDE | ERROR_PREVENTED | ERROR_OCCURRED`

## 5) Daily Scrap Aggregate (derived, traceable)
**Path**: `pilotPrograms/{pilotId}/telemetry/dailyScrap/{date_facility_group}`

```json
{
  "date": "2026-05-01",
  "facilityId": "siteA",
  "treatmentGroup": true,
  "totalMaterialUsedKg": 12000,
  "totalScrapKg": 145,
  "scrapRate": 0.0121,
  "jobCount": 32,
  "eventRefs": ["evt_22", "evt_23"],
  "calculatedFromEvents": true
}
```

## 6) Daily Rework Aggregate
**Path**: `pilotPrograms/{pilotId}/telemetry/dailyRework/{date_facility_group}`

```json
{
  "date": "2026-05-01",
  "facilityId": "siteA",
  "treatmentGroup": true,
  "reworkHours": 6.5,
  "reworkEvents": 4,
  "avgCorrectionCycles": 1.3
}
```

## 7) Daily Throughput Aggregate
**Path**: `pilotPrograms/{pilotId}/telemetry/dailyThroughput/{date_facility}`

```json
{
  "date": "2026-05-01",
  "facilityId": "siteA",
  "unitsCompleted": 28,
  "laborHours": 64,
  "unitsPerLaborHour": 0.4375
}
```

## 8) Adoption Metrics (weekly)
**Path**: `pilotPrograms/{pilotId}/telemetry/adoptionMetrics/{isoWeek}`

```json
{
  "week": "2026-W20",
  "facilityId": "siteA",
  "stepConfirmationRate": 0.92,
  "overrideRate": 0.06,
  "avgTimePerStepMs": 3900,
  "activeOperators": 7
}
```

## 9) Confounder Log
**Path**: `pilotPrograms/{pilotId}/confounders/{entryId}`

```json
{
  "timestamp": "2026-05-10T12:00:00Z",
  "facilityId": "siteA",
  "description": "New material supplier introduced",
  "impactRisk": "moderate"
}
```

## 10) Statistical Artifacts
**Path**: `pilotPrograms/{pilotId}/analysis/didModel/{modelVersion}`

```json
{
  "modelType": "difference_in_differences",
  "dependentVariable": "scrapRate",
  "treatedCoefficient": -0.0128,
  "stdError": 0.0042,
  "pValue": 0.008,
  "confidenceInterval": [-0.0209, -0.0047],
  "rSquared": 0.61,
  "sampleSize": 118,
  "computedAt": "2026-08-15T09:00:00Z"
}
```

## 11) Economic Translation (Validated Only, Versioned)
**Path**: `pilotPrograms/{pilotId}/economics/versions/{versionId}`

```json
{
  "version": "v1",
  "scrapReductionAbsolute": 0.013,
  "scrapReductionCI": [0.008, 0.019],
  "reworkReductionPercent": 0.18,
  "pValue": 0.012,
  "ebitdaImpactAnnualized": 245000,
  "validated": true,
  "validatedAt": "2026-08-15T10:00:00Z",
  "sourceAnalysisRef": "analysis/didModel/v1"
}
```

## 12) Pilot Reports
**Path**: `pilotPrograms/{pilotId}/reports/{reportId}`

```json
{
  "periodStart": "2026-07-01",
  "periodEnd": "2026-07-31",
  "status": "draft",
  "summary": "Treated cohort maintained statistically significant scrap reduction.",
  "validatedMetrics": ["scrap_rate"],
  "generatedAt": "2026-08-01T08:30:00Z"
}
```

## Security + Indexing Requirements
- `telemetry/events` is create-only (no update/delete).
- only analysis service writes to `analysis/*` and `economics/versions/*`.
- composite indexes:
  - `(facilityId, timestamp)`
  - `(workstationId, timestamp)`
  - `(operatorId, timestamp)`
  - `(facilityId, date, treatmentGroup)` for daily scrap/rework.

## Minimum Completeness Checklist
- [ ] 30+ baseline operational days captured
- [ ] control/treated segmentation explicit
- [ ] confounders logged
- [ ] DiD artifact stored with CI and p-value
- [ ] economics version linked to analysis artifact
- [ ] validated vs modeled separated in reporting
