import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Patient } from '../../types/patient';
import { RiskPill } from '../ui/RiskPill';
import { Sparkline } from '../charts/Sparkline';
import { Button } from '../Button';

export type PatientSortKey = 'riskScore' | 'name' | 'daysSinceDischarge' | 'hrChange' | 'stepsChange';

export interface PatientSortState {
  key: PatientSortKey;
  direction: 'asc' | 'desc';
}

interface PatientTableProps {
  patients: Patient[];
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
  sort: PatientSortState;
  onSort: (key: PatientSortKey) => void;
}

export function PatientTable({
  patients,
  page,
  pages,
  onPageChange,
  onRowClick,
  sort,
  onSort,
}: PatientTableProps) {
  const getDaysSinceDischarge = (dischargeDate: string): number => {
    const discharge = new Date(dischargeDate);
    const now = new Date();
    const diffMs = now.getTime() - discharge.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const getLastSyncAgeHours = (lastSync: string): number => {
    const sync = new Date(lastSync);
    const now = new Date();
    return Math.max(0, (now.getTime() - sync.getTime()) / (1000 * 60 * 60));
  };

  const getSyncDotColor = (lastSync: string): string => {
    const ageHours = getLastSyncAgeHours(lastSync);
    if (ageHours < 6) return 'bg-green-500';
    if (ageHours <= 24) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDeltaStyle = (change: number, kind: 'hr' | 'steps' | 'sleep') => {
    const magnitude = Math.abs(change);
    if (magnitude < 10) return 'text-gray-600';

    if (kind === 'hr') {
      return change > 0 ? 'text-red-600' : 'text-green-600';
    }

    return change < 0 ? 'text-red-600' : 'text-green-600';
  };

  const formatSignedPercent = (value: number): string => {
    if (value > 0) return `+${Math.round(value)}% vs baseline`;
    if (value < 0) return `${Math.round(value)}% vs baseline`;
    return '0% vs baseline';
  };

  const renderSortIcon = (key: PatientSortKey) => {
    if (sort.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    }
    return sort.direction === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-primary" />
      : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  };

  const SortHeader = ({ label, sortKey, className }: { label: string; sortKey: PatientSortKey; className: string }) => (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 hover:text-gray-900"
      >
        <span>{label}</span>
        {renderSortIcon(sortKey)}
      </button>
    </th>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[980px] xl:min-w-0 table-auto">
        <thead className="bg-neutral-light border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Priority Band</th>
            <SortHeader label="Patient" sortKey="name" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap" />
            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Drivers</th>
            <SortHeader label="Resting HR" sortKey="hrChange" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap" />
            <SortHeader label="Steps" sortKey="stepsChange" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap" />
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Sleep</th>
            <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">Trend</th>
            <SortHeader label="Discharge" sortKey="daysSinceDischarge" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="hover:bg-neutral-light cursor-pointer transition-colors"
              onClick={() => onRowClick(patient.id)}
            >
              <td className="px-4 py-3 align-top">
                <RiskPill tier={patient.riskTier} score={patient.riskScore} size="sm" />
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-2">
                  <p title={patient.name} className="text-sm font-semibold text-gray-900 truncate max-w-[170px]">{patient.name}</p>
                  {patient.hasRecentAlert && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-red-200 bg-red-50 text-red-700">
                      New alert
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span className={`inline-block w-2 h-2 rounded-full ${getSyncDotColor(patient.lastSync)}`} />
                  <span title={new Date(patient.lastSync).toLocaleString()} className="truncate max-w-[180px]">
                    Last sync {new Date(patient.lastSync).toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="hidden lg:table-cell px-4 py-3 align-top">
                <div className="flex flex-wrap gap-1">
                  {patient.drivers.slice(0, 2).map((driver) => (
                    <span
                      key={driver}
                      title={driver}
                      className="max-w-[200px] truncate px-2 py-0.5 text-xs rounded-full bg-primary-light text-primary border border-blue-200"
                    >
                      {driver}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 align-top">
                <div className="text-sm font-semibold text-gray-900">{Math.round(patient.stats?.restingHR.current ?? 0)} bpm</div>
                <div className={`text-xs font-medium ${getDeltaStyle(patient.stats?.restingHR.percentChange ?? 0, 'hr')}`}>
                  {formatSignedPercent(patient.stats?.restingHR.percentChange ?? 0)}
                </div>
              </td>
              <td className="px-4 py-3 align-top">
                <div className="text-sm font-semibold text-gray-900">{Math.round(patient.stats?.steps.current ?? 0).toLocaleString()}</div>
                <div className={`text-xs font-medium ${getDeltaStyle(patient.stats?.steps.percentChange ?? 0, 'steps')}`}>
                  {formatSignedPercent(patient.stats?.steps.percentChange ?? 0)}
                </div>
              </td>
              <td className="hidden md:table-cell px-4 py-3 align-top">
                <div className="text-sm font-semibold text-gray-900">{Math.round(patient.stats?.sleep.current ?? 0)} hrs</div>
                <div className={`text-xs font-medium ${getDeltaStyle(patient.stats?.sleep.percentChange ?? 0, 'sleep')}`}>
                  {formatSignedPercent(patient.stats?.sleep.percentChange ?? 0)}
                </div>
              </td>
              <td className="hidden xl:table-cell px-4 py-3 align-top">
                <Sparkline
                  data={Array.from({ length: 7 }).map((_, index) => ({
                    date: String(index),
                    value: patient.stats?.restingHR.current
                      ? patient.stats.restingHR.current + Math.sin(index) * 2
                      : patient.riskScore + Math.sin(index) * 5,
                  }))}
                  color="#2563EB"
                />
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-700 align-top">D+{getDaysSinceDischarge(patient.dischargeDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-neutral-light">
        <span className="text-xs text-gray-600">
          Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl border-gray-300"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl border-gray-300"
            disabled={page === pages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
