/**
 * Centralized disclaimer and methodology text for marketing claims.
 * Update these strings when claims are validated (see SWOT Task 5).
 */

export const disclaimers = {
  /** Footnote for Hero KPI row and Metrics "Design Targets" section */
  metrics:
    'Design targets modeled from published industry baselines. Individual results will depend on facility configuration, material mix, and operator conditions.',

  /** Footer text for QuickEstimateCalculator and MarginImpactCalculator */
  calculator:
    'This calculator is a planning tool only. Actual results depend on your baseline metrics, implementation timeline, and operational factors. Reality Anchors does not guarantee specific financial outcomes. Consult with your financial team before making capital investments.',

  /** Compact version for Hero KPI row */
  heroFootnote: 'Modeled design targets based on published industry baselines. Results vary by facility.',

  /** Inline qualifier for any ROI claim (e.g., next to "7.2x ROI") */
  roiQualifier:
    'Results based on modeled financial impact; actual outcomes vary by facility, implementation, and labor market.',

  /** Print PDF footer (already partially present in calculator) */
  printFooter:
    'Results are modeled estimates based on published industry baselines. Individual outcomes depend on shop configuration, material mix, and operator conditions. Not a guarantee of performance.',
} as const;

export type DisclaimerKey = keyof typeof disclaimers;
