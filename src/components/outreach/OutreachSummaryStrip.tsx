interface OutreachSummaryStripProps {
  dueToday: number;
  overdue: number;
  highPriority: number;
  completed: number;
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-mid">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-darkest">{Math.round(value)}</p>
    </div>
  );
}

export function OutreachSummaryStrip({ dueToday, overdue, highPriority, completed }: OutreachSummaryStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard label="Due Today" value={dueToday} />
      <SummaryCard label="Overdue" value={overdue} />
      <SummaryCard label="High Priority" value={highPriority} />
      <SummaryCard label="Completed" value={completed} />
    </div>
  );
}
