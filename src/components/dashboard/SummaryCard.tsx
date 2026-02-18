import { LucideIcon } from 'lucide-react';

type SummaryTone = 'neutral' | 'danger' | 'success';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone?: SummaryTone;
}

const toneStyles: Record<SummaryTone, string> = {
  neutral: 'border-primary/30 bg-primary-light text-primary',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  success: 'border-success/30 bg-success/10 text-success',
};

export function SummaryCard({ title, value, icon: Icon, tone = 'neutral' }: SummaryCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-mid">{title}</p>
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${toneStyles[tone]}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-darkest">{Math.round(value)}</p>
    </div>
  );
}
