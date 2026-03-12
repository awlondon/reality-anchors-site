/**
 * Centralized disclaimer and methodology text for marketing claims.
 * Update these strings when claims are validated (see SWOT Task 5).
 */

export const disclaimers = {
  /** Footnote for Hero KPI row and Metrics "Measured Outcomes" section */
  metrics:
    'Metrics reflect observed deployment performance across fabrication sites. Individual results depend on facility configuration, material mix, and operator conditions.',

  /** Footer text for QuickEstimateCalculator and MarginImpactCalculator */
  calculator:
    'This calculator is a planning tool only. Actual results depend on your baseline metrics, implementation timeline, and operational factors. Reality Anchors does not guarantee specific financial outcomes. Consult with your financial team before making capital investments.',

  /** Compact version for Hero KPI row */
  heroFootnote:
    'Observed deployment metrics. Results vary by facility.',

  /** Inline qualifier for any ROI claim (e.g., next to "7.2x ROI") */
  roiQualifier:
    'Results based on modeled financial impact; actual outcomes vary by facility, implementation, and labor market.',

  /** Print PDF footer (already partially present in calculator) */
  printFooter:
    'Results are estimates based on observed customer data. Individual outcomes depend on shop configuration, material mix, and operator conditions. Not a guarantee of performance.',
} as const;

export type DisclaimerKey = keyof typeof disclaimers;
