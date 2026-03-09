import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useKpis, useUsageDaily } from '../lib/hooks';
import { KpiCard, Card, PageHeader, Spinner } from '../components/ui';

function formatNum(n: number, decimals = 0): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(decimals);
}

export default function Dashboard() {
  const { kpis, loading: kpiLoading } = useKpis();
  const { data: usage, loading: usageLoading } = useUsageDaily(30);

  const chartData = [...usage].reverse().map((d) => ({
    date: d.date?.slice(5), // MM-DD
    bends: d.totalBends,
    accuracy: d.totalBends > 0 ? ((d.accurateBends / d.totalBends) * 100) : 0,
    scrap: d.totalPieces > 0 ? ((d.scrapPieces / d.totalPieces) * 100) : 0,
  }));

  if (kpiLoading || usageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Last 30 days of production metrics"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard
          label="Total Bends"
          value={kpis ? formatNum(kpis.totalBends) : '—'}
        />
        <KpiCard
          label="Bend Accuracy"
          value={kpis ? kpis.bendAccuracy.toFixed(1) : '—'}
          unit="%"
        />
        <KpiCard
          label="Pieces / Hour"
          value={kpis ? kpis.piecesPerHour.toFixed(1) : '—'}
        />
        <KpiCard
          label="Scrap Rate"
          value={kpis ? kpis.scrapRate.toFixed(1) : '—'}
          unit="%"
        />
        <KpiCard
          label="Active Seats"
          value={kpis?.activeSeats ?? '—'}
        />
        <KpiCard
          label="Operator Hours"
          value={kpis ? formatNum(kpis.operatorHours, 1) : '—'}
          unit="hrs"
        />
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-medium text-muted mb-4">Daily Bends</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis dataKey="date" stroke="#8aa8c8" fontSize={12} />
                <YAxis stroke="#8aa8c8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#111d2c', border: '1px solid #1e3048', borderRadius: 8 }}
                  labelStyle={{ color: '#e4edf8' }}
                />
                <Area
                  type="monotone"
                  dataKey="bends"
                  stroke="#2e7deb"
                  fill="#2e7deb"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-muted mb-4">Accuracy & Scrap Rate</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis dataKey="date" stroke="#8aa8c8" fontSize={12} />
                <YAxis stroke="#8aa8c8" fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ background: '#111d2c', border: '1px solid #1e3048', borderRadius: 8 }}
                  labelStyle={{ color: '#e4edf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Accuracy %"
                />
                <Line
                  type="monotone"
                  dataKey="scrap"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="Scrap %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </>
  );
}
