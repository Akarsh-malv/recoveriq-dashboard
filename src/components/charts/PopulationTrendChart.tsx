import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PopulationTrendPoint } from '../../types/dashboard';

interface PopulationTrendChartProps {
  trend: PopulationTrendPoint[];
}

export function PopulationTrendChart({ trend }: PopulationTrendChartProps) {
  const roundedTrend = trend.map((point) => ({
    day: point.day,
    riskScore: Math.round(point.riskScore),
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Population Recovery Priority Trend (14 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={roundedTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis allowDecimals={false} stroke="#6b7280" />
            <Tooltip formatter={(value: number) => Math.round(value)} />
            <Line type="monotone" dataKey="riskScore" stroke="#2563EB" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
