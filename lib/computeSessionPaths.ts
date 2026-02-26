import type { ExecEvent } from '@/lib/execAnalytics';

export function computeSessionPaths(events: ExecEvent[]) {
  const bySession = new Map<string, ExecEvent[]>();

  for (const event of events) {
    if (!event.sessionId) continue;
    if (!bySession.has(event.sessionId)) bySession.set(event.sessionId, []);
    bySession.get(event.sessionId)?.push(event);
  }

  const paths: Array<{ sessionId: string; points: Array<{ x: number; y: number }> }> = [];

  bySession.forEach((sessionEvents, sessionId) => {
    const sorted = [...sessionEvents].sort((a, b) => a.timestamp - b.timestamp);
    const points = sorted
      .filter((e) => e.type === 'scroll_depth')
      .map((e) => ({ x: e.timestamp, y: e.depthPercent }));

    paths.push({ sessionId, points });
  });

  return paths;
}
