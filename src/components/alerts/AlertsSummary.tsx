interface AlertsSummaryProps {
  activeCount: number;
  highSeverityCount: number;
  avgTimeSinceAlertHours: number;
}

interface SummaryItem {
  label: string;
  value: string;
}

function SummaryCard({ label, value }: SummaryItem) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-mid">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-darkest">{value}</p>
    </div>
  );
}

export function AlertsSummary({ activeCount, highSeverityCount, avgTimeSinceAlertHours }: AlertsSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard label="Active Alerts" value={String(Math.round(activeCount))} />
      <SummaryCard label="High Severity" value={String(Math.round(highSeverityCount))} />
      <SummaryCard label="Avg Time Since Alert" value={`${Math.round(avgTimeSinceAlertHours)}h`} />
    </div>
  );
}
