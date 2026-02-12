import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';

interface HeartRateChartProps {
  data: { date: string; value: number }[];
  baseline: number;
}

export function HeartRateChart({ data, baseline }: HeartRateChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip />
          <ReferenceLine y={baseline} stroke="#9CA3AF" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 1, stroke: '#ef4444', fill: '#fff' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
