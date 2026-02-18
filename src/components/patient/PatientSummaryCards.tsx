interface PatientSummaryCardsProps {
  status: 'Stable' | 'Watch' | 'Check-in Recommended';
  trendLabel: 'Improving' | 'Stable' | 'Worsening';
  lastSyncLabel: string;
}

function SummaryCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-neutral-mid">{title}</p>
      <p className="mt-2 text-xl font-semibold text-neutral-darkest">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-neutral-mid">{subtitle}</p>}
    </div>
  );
}

export function PatientSummaryCards({ status, trendLabel, lastSyncLabel }: PatientSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <SummaryCard title="Current Recovery Status" value={status} />
      <SummaryCard title="7-Day Trend" value={trendLabel} />
      <SummaryCard title="Last Sync" value={lastSyncLabel} />
    </div>
  );
}
