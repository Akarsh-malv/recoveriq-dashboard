import { RiskTier } from '../types';

interface RiskPillProps {
  tier: RiskTier;
  score?: number;
  size?: 'sm' | 'md';
}

export function RiskPill({ tier, score, size = 'md' }: RiskPillProps) {
  const colors = {
    low: 'bg-success/10 text-success border-success/30',
    medium: 'bg-warning/10 text-warning border-warning/30',
    high: 'bg-danger/10 text-danger border-danger/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${colors[tier]} ${sizeStyles[size]}`}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
      {score !== undefined && <span className="font-semibold text-[0.9em]">RPS {Math.round(score)}</span>}
    </span>
  );
}
