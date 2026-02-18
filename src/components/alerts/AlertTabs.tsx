import { GeneratedAlertStatus } from '../../utils/alertGenerator';

type AlertTab = GeneratedAlertStatus | 'all';

interface AlertTabsProps {
  activeTab: AlertTab;
  counts: Record<AlertTab, number>;
  onChange: (tab: AlertTab) => void;
}

const tabs: { key: AlertTab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'reviewed', label: 'Reviewed' },
  { key: 'all', label: 'All' },
];

export function AlertTabs({ activeTab, counts, onChange }: AlertTabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1" role="tablist" aria-label="Alert filters">
      {tabs.map((tab) => {
        const selected = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`alerts-panel-${tab.key}`}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              selected ? 'bg-primary text-white' : 'text-neutral-mid hover:bg-neutral-light'
            }`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        );
      })}
    </div>
  );
}
