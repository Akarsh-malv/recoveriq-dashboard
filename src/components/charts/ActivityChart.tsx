import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';

interface ActivityChartProps {
  data: { date: string; value: number }[];
  baseline: number;
}

export function ActivityChart({ data, baseline }: ActivityChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip />
          <ReferenceLine y={baseline} stroke="#9CA3AF" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22C55E"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 1, stroke: '#22C55E', fill: '#fff' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
