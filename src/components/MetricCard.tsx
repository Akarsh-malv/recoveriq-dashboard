import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  baseline: number;
  current: number;
  unit: string;
  variant?: 'default' | 'compact';
}

export function MetricCard({ label, baseline, current, unit, variant = 'default' }: MetricCardProps) {
  const diff = current - baseline;
  const percentChange = baseline !== 0 ? ((diff / baseline) * 100).toFixed(1) : '0';

  const getTrendIcon = () => {
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {current} {unit}
          </span>
          {getTrendIcon()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold text-gray-900">
            {current} <span className="text-base text-gray-500">{unit}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Baseline: {baseline} {unit}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {diff > 0 ? '+' : ''}{percentChange}%
          </span>
        </div>
      </div>
    </div>
  );
}
