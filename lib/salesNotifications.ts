export type SalesAlert = {
  id: string;
  type: 'high_intent' | 'form_submit';
  sessionId: string;
  probability?: number;
  maxScrollDepth?: number;
  totalDwellMs?: number;
  createdAt: number;
  acknowledged?: boolean;
};

const STORAGE_KEY = 'exec_sales_notifications_v1';

export function loadSalesAlerts(): SalesAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SalesAlert[]) : [];
  } catch {
    return [];
  }
}

export function saveSalesAlerts(alerts: SalesAlert[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts.slice(0, 200)));
}

export function upsertSalesAlert(alert: SalesAlert) {
  const existing = loadSalesAlerts();
  const next = [alert, ...existing.filter((a) => a.id !== alert.id)].slice(0, 200);
  saveSalesAlerts(next);
}

export function acknowledgeSalesAlert(id: string) {
  const alerts = loadSalesAlerts().map((a) => (a.id === id ? { ...a, acknowledged: true } : a));
  saveSalesAlerts(alerts);
}
