import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DriverBreakdownItem } from '../../utils/dashboardInsights';

interface DriversBreakdownChartProps {
  drivers: DriverBreakdownItem[];
}

export function DriversBreakdownChart({ drivers }: DriversBreakdownChartProps) {
  const data = drivers.slice(0, 8).map((item) => ({
    driver: item.driver,
    count: Math.round(item.count),
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-neutral-darkest">Top Recovery Drivers (Last 7 Days)</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 36 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="driver"
              angle={-18}
              textAnchor="end"
              interval={0}
              height={56}
              tick={{ fill: '#6B7280', fontSize: 11 }}
            />
            <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip formatter={(value: number) => Math.round(value)} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
