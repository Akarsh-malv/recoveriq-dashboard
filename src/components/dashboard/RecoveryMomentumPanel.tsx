import { MomentumFilter, RecoveryMomentum } from '../../utils/dashboardInsights';

interface RecoveryMomentumPanelProps {
  momentum: RecoveryMomentum;
  onSelect: (filter: MomentumFilter) => void;
}

const cardConfig: Array<{
  key: MomentumFilter;
  label: string;
  borderClass: string;
  valueClass: string;
}> = [
  {
    key: 'improving',
    label: 'Improving',
    borderClass: 'border-l-4 border-l-success',
    valueClass: 'text-success',
  },
  {
    key: 'stable',
    label: 'Stable',
    borderClass: 'border-l-4 border-l-gray-400',
    valueClass: 'text-neutral-darkest',
  },
  {
    key: 'worsening',
    label: 'Worsening',
    borderClass: 'border-l-4 border-l-danger',
    valueClass: 'text-danger',
  },
];

export function RecoveryMomentumPanel({ momentum, onSelect }: RecoveryMomentumPanelProps) {
  const total = Math.max(1, Math.round(momentum.improving + momentum.stable + momentum.worsening));
  const highestCohort = cardConfig.reduce((highest, current) =>
    momentum[current.key] > momentum[highest.key] ? current : highest
  );
  const worseningShare = Math.round((momentum.worsening / total) * 100);
  const improvingShare = Math.round((momentum.improving / total) * 100);
  const stableShare = Math.round((momentum.stable / total) * 100);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-neutral-darkest">Recovery Momentum Overview</h3>
      <p className="mt-1 text-xs text-neutral-mid">Click a cohort to open patient triage with that filter.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {cardConfig.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.key)}
            className={`rounded-lg border border-gray-200 bg-white px-4 py-5 text-left transition hover:bg-neutral-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${card.borderClass}`}
          >
            <p className={`text-3xl font-semibold ${card.valueClass}`}>{Math.round(momentum[card.key])}</p>
            <p className="mt-1 text-sm text-neutral-mid">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-mid">Momentum Mix</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="rounded-md border border-success/30 bg-success/10 p-2 text-center">
            <p className="text-lg font-semibold text-success">{improvingShare}%</p>
            <p className="text-xs text-neutral-mid">Improving</p>
          </div>
          <div className="rounded-md border border-gray-300 bg-gray-50 p-2 text-center">
            <p className="text-lg font-semibold text-neutral-darkest">{stableShare}%</p>
            <p className="text-xs text-neutral-mid">Stable</p>
          </div>
          <div className="rounded-md border border-danger/30 bg-danger/10 p-2 text-center">
            <p className="text-lg font-semibold text-danger">{worseningShare}%</p>
            <p className="text-xs text-neutral-mid">Worsening</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-neutral-light px-3 py-2 text-xs text-neutral-mid">
        <span className="font-medium text-neutral-darkest">{Math.round(total)} patients tracked</span>
        {` · Largest cohort: ${highestCohort.label}`}
        {` · ${worseningShare}% currently worsening`}
      </div>
    </div>
  );
}
