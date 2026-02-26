export type FunnelStage =
  | 'landing_view'
  | 'regime_enter'
  | 'regime_exit'
  | 'regime_kpi_reveal'
  | 'cta_click'
  | 'lead_form_view'
  | 'lead_form_submit'
  | 'demo_request'
  | 'scroll_depth';

export type FunnelEvent = {
  stage: FunnelStage;
  regimeId?: string;
  dwellTimeMs?: number;
  scrollDepth?: number;
  kpiIndex?: number;
  timestamp: number;
  [key: string]: string | number | boolean | undefined;
};
