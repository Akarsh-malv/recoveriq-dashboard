import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendPoint {
  date: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  data: TrendPoint[];
  valueLabel: string;
}

export function TrendChart({ title, data, valueLabel }: TrendChartProps) {
  const chartData = data.map((point) => ({
    date: point.date,
    value: Math.round(point.value),
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
            <Tooltip formatter={(value: number) => [`${Math.round(value)} ${valueLabel}`, valueLabel]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563EB"
              fill="#EFF6FF"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-gray-500">7-day personal trend</p>
    </div>
  );
}
