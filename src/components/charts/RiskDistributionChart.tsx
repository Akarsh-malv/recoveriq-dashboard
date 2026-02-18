import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RiskDistribution } from '../../types/dashboard';

interface RiskDistributionChartProps {
  distribution: RiskDistribution;
}

export function RiskDistributionChart({ distribution }: RiskDistributionChartProps) {
  const data = [
    { tier: 'Low', count: Math.round(distribution.low), color: '#22C55E' },
    { tier: 'Medium', count: Math.round(distribution.medium), color: '#F59E0B' },
    { tier: 'High', count: Math.round(distribution.high), color: '#DC2626' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-darkest">Recovery Priority Band Distribution</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-1 text-success">
            <span className="h-2 w-2 rounded-full bg-success" />
            Low
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-1 text-warning">
            <span className="h-2 w-2 rounded-full bg-warning" />
            Medium
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-danger/30 bg-danger/10 px-2 py-1 text-danger">
            <span className="h-2 w-2 rounded-full bg-danger" />
            High
          </span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="tier" stroke="#6b7280" />
            <YAxis allowDecimals={false} stroke="#6b7280" />
            <Tooltip formatter={(value: number) => Math.round(value)} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.tier} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
