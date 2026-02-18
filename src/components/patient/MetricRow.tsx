import { LucideIcon } from 'lucide-react';

interface MetricRowProps {
  label: string;
  value: string;
  deltaPercent: number;
  icon: LucideIcon;
}

export function MetricRow({ label, value, deltaPercent, icon: Icon }: MetricRowProps) {
  const signedDelta = `${deltaPercent > 0 ? '+' : ''}${Math.round(deltaPercent)}%`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xl leading-tight font-semibold text-neutral-darkest">{label}</p>
            <p className="mt-0.5 text-sm text-neutral-mid">vs baseline</p>
          </div>
        </div>
        <div className="min-w-[96px] shrink-0 text-right">
          <p className="whitespace-nowrap text-xl font-semibold text-neutral-darkest">{value}</p>
          <p className="mt-0.5 whitespace-nowrap text-sm text-primary">{signedDelta}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-neutral-mid">
        Higher or lower values may reflect normal variation.
      </p>
    </div>
  );
}
