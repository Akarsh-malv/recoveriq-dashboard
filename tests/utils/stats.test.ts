import { describe, expect, it } from 'vitest';
import { computeMetricStats, getBaseline, getCurrentAverage, getPercentChange } from '../../src/utils/stats';

describe('stats utility', () => {
  it('rounds baseline average to whole number', () => {
    const data = Array.from({ length: 60 }).map((_, index) => 60 + index * 0.5);
    expect(getBaseline(data)).toBe(72);
  });

  it('rounds current 24h average to whole number', () => {
    const data = Array.from({ length: 72 }).map((_, index) => (index < 48 ? 70 : 80.4));
    expect(getCurrentAverage(data)).toBe(80);
  });

  it('computes percent change and rounds to whole number', () => {
    expect(getPercentChange(80, 92)).toBe(15);
    expect(getPercentChange(80, 68)).toBe(-15);
  });

  it('returns zero percent change when baseline is zero', () => {
    expect(getPercentChange(0, 100)).toBe(0);
  });

  it('returns full rounded metric stats object', () => {
    const data = Array.from({ length: 72 }).map((_, index) => (index < 48 ? 100 : 130));
    expect(computeMetricStats(data)).toEqual({
      baseline: 100,
      current: 130,
      percentChange: 30,
    });
  });
});
