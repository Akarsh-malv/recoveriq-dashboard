import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { PatientClinicianStats } from '../../types/patient';

interface PatientStatsCardProps {
  stats: PatientClinicianStats;
}

type MetricKey = keyof PatientClinicianStats;

const metricConfig: Record<
  MetricKey,
  {
    title: string;
    unit: string;
    worseWhen: 'increase' | 'decrease';
    sentence: (change: number) => string;
  }
> = {
  restingHR: {
    title: 'Resting Heart Rate',
    unit: 'bpm',
    worseWhen: 'increase',
    sentence: (change) =>
      change >= 0
        ? `Resting heart rate is ${Math.abs(change)}% above baseline.`
        : `Resting heart rate is ${Math.abs(change)}% below baseline.`,
  },
  steps: {
    title: 'Step Count',
    unit: 'steps',
    worseWhen: 'decrease',
    sentence: (change) =>
      change >= 0
        ? `Steps are ${Math.abs(change)}% above baseline.`
        : `Steps are ${Math.abs(change)}% below baseline.`,
  },
  sleep: {
    title: 'Sleep Duration',
    unit: 'hrs',
    worseWhen: 'decrease',
    sentence: (change) =>
      change >= 0
        ? `Sleep duration is ${Math.abs(change)}% above baseline.`
        : `Sleep duration is ${Math.abs(change)}% below baseline.`,
  },
};

function getTrendState(change: number, worseWhen: 'increase' | 'decrease') {
  const magnitude = Math.abs(change);
  if (magnitude < 10) {
    return { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Minus, label: 'Stable' };
  }

  const worsening = worseWhen === 'increase' ? change > 0 : change < 0;
  if (worsening) {
    return { color: 'text-red-700 bg-red-50 border-red-200', icon: ArrowUpRight, label: 'Worsening' };
  }

  return { color: 'text-green-700 bg-green-50 border-green-200', icon: ArrowDownRight, label: 'Improving' };
}

export function PatientStatsCard({ stats }: PatientStatsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold text-neutral-darkest">Clinical Change Summary</h3>
      <div className="grid grid-cols-3 gap-4">
        {(Object.keys(metricConfig) as MetricKey[]).map((metricKey) => {
          const metric = stats[metricKey];
          const config = metricConfig[metricKey];
          const trend = getTrendState(metric.percentChange, config.worseWhen);
          const TrendIcon = trend.icon;

          return (
            <div key={metricKey} className="rounded-xl border border-gray-200 bg-neutral-light p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-mid">{config.title}</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-darkest">
                {metric.current} <span className="text-sm text-neutral-mid">{config.unit}</span>
              </p>
              <p className="text-xs text-neutral-mid">Baseline {metric.baseline} {config.unit}</p>
              <div
                className={`mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${trend.color}`}
              >
                <TrendIcon className="w-3.5 h-3.5" />
                <span>{metric.percentChange > 0 ? '+' : ''}{metric.percentChange}%</span>
                <span>{trend.label}</span>
              </div>
              <p className="mt-3 text-xs text-neutral-darkest">{config.sentence(metric.percentChange)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
