import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

interface SparklineProps {
  data: { date: string; value: number }[];
  color?: string;
}

export function Sparkline({ data, color = '#0ea5e9' }: SparklineProps) {
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ display: 'none' }}
            formatter={(val: number) => val.toFixed(0)}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#spark)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
