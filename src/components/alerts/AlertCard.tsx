import { Clock3 } from 'lucide-react';
import { GeneratedAlert } from '../../utils/alertGenerator';

interface AlertCardProps {
  alert: GeneratedAlert;
  onReview: (alert: GeneratedAlert) => void;
  onResolve: (alertId: string) => void;
}

const severityStyles: Record<GeneratedAlert['severity'], string> = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-neutral-mid',
};

function getTimeSinceAlert(createdAt: string): string {
  const diffMs = Math.max(0, Date.now() - new Date(createdAt).getTime());
  const hours = Math.round(diffMs / (60 * 60 * 1000));
  if (hours < 1) {
    const minutes = Math.max(1, Math.round(diffMs / (60 * 1000)));
    return `${minutes}m ago`;
  }
  return `${hours}h ago`;
}

export function AlertCard({ alert, onReview, onResolve }: AlertCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex">
        <div className={`w-1.5 ${severityStyles[alert.severity]}`} />
        <div className="flex-1 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-neutral-darkest">{alert.patientName}</h3>
              <p className="text-sm text-neutral-mid">D+{Math.round(alert.daysSinceDischarge)} since discharge</p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-neutral-mid">
              <Clock3 className="h-3.5 w-3.5" />
              <span>{getTimeSinceAlert(alert.createdAt)}</span>
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <p className="font-medium text-neutral-darkest">{alert.type}</p>
            <p className="text-neutral-mid sm:text-right">{alert.metricDelta}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-label={`Review alert for ${alert.patientName}`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-neutral-darkest hover:bg-neutral-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => onReview(alert)}
            >
              Review
            </button>
            {alert.status === 'active' && (
              <button
                type="button"
                aria-label={`Mark resolved alert for ${alert.patientName}`}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => onResolve(alert.id)}
              >
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
