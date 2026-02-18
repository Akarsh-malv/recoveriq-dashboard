export interface MetricComputation {
  baseline: number;
  current: number;
  percentChange: number;
}

const BASELINE_WINDOW_HOURS = 48;
const CURRENT_WINDOW_HOURS = 24;

const roundWhole = (value: number): number => Math.round(value);

const average = (values: number[]): number => {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
};

export function getBaseline(data: number[]): number {
  return roundWhole(average(data.slice(0, BASELINE_WINDOW_HOURS)));
}

export function getCurrentAverage(data: number[]): number {
  return roundWhole(average(data.slice(-CURRENT_WINDOW_HOURS)));
}

export function getPercentChange(baseline: number, current: number): number {
  if (baseline === 0) return 0;
  return roundWhole(((current - baseline) / baseline) * 100);
}

export function computeMetricStats(data: number[]): MetricComputation {
  const baseline = getBaseline(data);
  const current = getCurrentAverage(data);
  const percentChange = getPercentChange(baseline, current);

  return {
    baseline,
    current,
    percentChange,
  };
}
