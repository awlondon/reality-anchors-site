/**
 * Calculator context bridge.
 *
 * When a prospect interacts with the Quick Estimate calculator and then
 * submits the lead form, we attach their estimated savings to the submission.
 * This gives the sales team an anchored financial context for the follow-up.
 *
 * Storage: sessionStorage — survives navigation within the tab, cleared on close.
 */

const SESSION_KEY = 'ra_calc_ctx';

export interface CalculatorContext {
  annualTons: number;
  scrapRatePct: number;
  costPerTon: number;
  estimatedEbitda: number;
  estimatedMaterialSavings: number;
  estimatedTonsSaved: number;
  /** Full breakdown — set by both Quick Estimate and full Margin Impact calculator */
  materialDollarsSaved?: number;
  laborDollarsSaved?: number;
  throughputContribution?: number;
  oversightRiskSaved?: number;
}

export function setCalculatorContext(ctx: CalculatorContext): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(ctx));
  } catch {
    // sessionStorage may be unavailable (private browsing, storage quota)
  }
}

export function getCalculatorContext(): CalculatorContext | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CalculatorContext) : null;
  } catch {
    return null;
  }
}
