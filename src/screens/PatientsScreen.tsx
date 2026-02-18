import { useEffect, useState } from 'react';
import { AlertCircle, ChevronDown, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPatients } from '../services/api';
import { Patient, RiskTier } from '../types/patient';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { PatientSortKey, PatientSortState, PatientTable } from '../components/tables/PatientTable';
import { MomentumFilter } from '../utils/dashboardInsights';

interface PatientsScreenProps {
  onPatientClick: (patientId: string) => void;
  momentumFilter?: MomentumFilter | null;
  onMomentumFilterApplied?: () => void;
}

export function PatientsScreen({ onPatientClick, momentumFilter = null, onMomentumFilterApplied }: PatientsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskTier | 'all'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showRiskDropdown, setShowRiskDropdown] = useState(false);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);
  const [dischargeFilter, setDischargeFilter] = useState<'all' | 'lt7' | '7to14' | '15to30' | 'gt30'>('all');
  const [syncFilter, setSyncFilter] = useState<'all' | 'lt6' | '6to24' | 'gt24'>('all');
  const [cohortFilter, setCohortFilter] = useState<'all' | 'Cardiac' | 'Ortho' | 'Chronic'>('all');
  const [sort, setSort] = useState<PatientSortState>({ key: 'riskScore', direction: 'desc' });
  const [momentumViewFilter, setMomentumViewFilter] = useState<MomentumFilter | null>(null);

  useEffect(() => {
    if (!momentumFilter) {
      return;
    }
    setMomentumViewFilter(momentumFilter);
    setPage(1);
    onMomentumFilterApplied?.();
  }, [momentumFilter, onMomentumFilterApplied]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['patients', 'all'],
    queryFn: () => fetchPatients(1, 200),
    placeholderData: (previousData) => previousData,
  });

  const patients = data?.patients ?? [];

  const getDaysSinceDischarge = (dischargeDate: string): number => {
    const discharge = new Date(dischargeDate);
    const now = new Date();
    return Math.max(0, Math.floor((now.getTime() - discharge.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const getLastSyncAgeHours = (lastSync: string): number => {
    const sync = new Date(lastSync);
    const now = new Date();
    return Math.max(0, (now.getTime() - sync.getTime()) / (1000 * 60 * 60));
  };

  const getCohort = (patient: Patient): 'Cardiac' | 'Ortho' | 'Chronic' => {
    const numericId = Number(patient.id.replace(/\D/g, '')) || 0;
    const cohorts: Array<'Cardiac' | 'Ortho' | 'Chronic'> = ['Cardiac', 'Ortho', 'Chronic'];
    return cohorts[numericId % cohorts.length];
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || patient.riskTier === riskFilter;
    const daysSinceDischarge = getDaysSinceDischarge(patient.dischargeDate);
    const syncAge = getLastSyncAgeHours(patient.lastSync);
    const cohort = getCohort(patient);

    const matchesDischarge =
      dischargeFilter === 'all' ||
      (dischargeFilter === 'lt7' && daysSinceDischarge < 7) ||
      (dischargeFilter === '7to14' && daysSinceDischarge >= 7 && daysSinceDischarge <= 14) ||
      (dischargeFilter === '15to30' && daysSinceDischarge >= 15 && daysSinceDischarge <= 30) ||
      (dischargeFilter === 'gt30' && daysSinceDischarge > 30);

    const matchesSync =
      syncFilter === 'all' ||
      (syncFilter === 'lt6' && syncAge < 6) ||
      (syncFilter === '6to24' && syncAge >= 6 && syncAge <= 24) ||
      (syncFilter === 'gt24' && syncAge > 24);

    const matchesCohort = cohortFilter === 'all' || cohort === cohortFilter;
    const matchesMomentum =
      momentumViewFilter === null ||
      (momentumViewFilter === 'improving' && patient.riskScore <= 35 && patient.trend === 'improving') ||
      (momentumViewFilter === 'stable' && patient.trend === 'stable') ||
      (momentumViewFilter === 'worsening' && (patient.trend === 'worsening' || patient.riskScore >= 75));

    return matchesSearch && matchesRisk && matchesDischarge && matchesSync && matchesCohort && matchesMomentum;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const multiplier = sort.direction === 'asc' ? 1 : -1;
    const aDays = getDaysSinceDischarge(a.dischargeDate);
    const bDays = getDaysSinceDischarge(b.dischargeDate);
    const aHr = a.stats?.restingHR.percentChange ?? 0;
    const bHr = b.stats?.restingHR.percentChange ?? 0;
    const aSteps = a.stats?.steps.percentChange ?? 0;
    const bSteps = b.stats?.steps.percentChange ?? 0;

    switch (sort.key) {
      case 'name':
        return a.name.localeCompare(b.name) * multiplier;
      case 'daysSinceDischarge':
        return (aDays - bDays) * multiplier;
      case 'hrChange':
        return (aHr - bHr) * multiplier;
      case 'stepsChange':
        return (aSteps - bSteps) * multiplier;
      case 'riskScore':
      default:
        return (a.riskScore - b.riskScore) * multiplier;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedPatients.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  const pageStart = (normalizedPage - 1) * pageSize;
  const pagedPatients = sortedPatients.slice(pageStart, pageStart + pageSize);

  const handleSort = (key: PatientSortKey) => {
    setSort((previous) => {
      if (previous.key === key) {
        return { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
    setPage(1);
  };

  const setSortFromFilter = (key: PatientSortKey) => {
    setSort({ key, direction: 'desc' });
    setPage(1);
  };

  const riskLabel = (() => {
    if (riskFilter === 'high') return 'High Priority';
    if (riskFilter === 'medium') return 'Medium Priority';
    if (riskFilter === 'low') return 'Low Priority';
    return 'All Priority Bands';
  })();

  if (isLoading) {
    return <LoadingState message="Loading patients..." />;
  }

  if (isError || !data) {
    return <ErrorState message="Failed to load patients" onRetry={() => refetch()} />;
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="No patients found"
        description="There are no patients in the system yet."
      />
    );
  }

  return (
    <div className="flex h-full bg-neutral-light">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Patient Triage</h1>
          <p className="text-sm text-gray-600">Monitor and prioritize patient recovery status</p>
        </div>

        <div className="bg-white border-b border-gray-200 p-4">
          {momentumViewFilter && (
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700">
                Momentum: {momentumViewFilter}
              </span>
              <button
                type="button"
                className="text-xs text-primary hover:text-primary-dark"
                onClick={() => setMomentumViewFilter(null)}
              >
                Clear
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-3 items-start">
            <div className="relative w-full xl:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="relative">
              <Button
                variant="secondary"
                className="rounded-xl border-gray-300 w-[160px] h-[38px] inline-flex items-center px-3 text-sm"
                onClick={() => {
                  setShowRiskDropdown((value) => !value);
                  setShowFilters(false);
                  setShowPageSizeDropdown(false);
                }}
              >
                <span className="truncate">{riskLabel}</span>
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              </Button>

              {showRiskDropdown && (
                <div className="absolute left-0 mt-2 z-10 w-[220px] bg-white border border-gray-300 rounded-2xl p-2 shadow-sm">
                  {[
                    { value: 'all', label: 'All Priority Bands' },
                    { value: 'high', label: 'High Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'low', label: 'Low Priority' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        riskFilter === option.value
                          ? 'bg-primary-light text-primary'
                          : 'hover:bg-neutral-light text-gray-700'
                      }`}
                      onClick={() => {
                        setRiskFilter(option.value as RiskTier | 'all');
                        setPage(1);
                        setShowRiskDropdown(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="secondary"
                className="rounded-xl border-gray-300 w-[160px] h-[38px] inline-flex items-center px-3 text-sm"
                onClick={() => setShowFilters((value) => !value)}
              >
                <span className="inline-flex items-center gap-2 truncate">
                  <Filter className="w-4 h-4 shrink-0" />
                  <span>Filters</span>
                </span>
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              </Button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-80 z-10 bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Days Since Discharge</p>
                      <select
                        value={dischargeFilter}
                        onChange={(e) => { setDischargeFilter(e.target.value as typeof dischargeFilter); setPage(1); }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="all">All</option>
                        <option value="lt7">&lt; 7</option>
                        <option value="7to14">7-14</option>
                        <option value="15to30">15-30</option>
                        <option value="gt30">&gt; 30</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Last Sync Freshness</p>
                      <div className="space-y-1 text-sm">
                        <label className="flex items-center gap-2"><input type="radio" name="sync" checked={syncFilter === 'lt6'} onChange={() => { setSyncFilter('lt6'); setPage(1); }} />&lt; 6h</label>
                        <label className="flex items-center gap-2"><input type="radio" name="sync" checked={syncFilter === '6to24'} onChange={() => { setSyncFilter('6to24'); setPage(1); }} />6-24h</label>
                        <label className="flex items-center gap-2"><input type="radio" name="sync" checked={syncFilter === 'gt24'} onChange={() => { setSyncFilter('gt24'); setPage(1); }} />&gt; 24h</label>
                        <label className="flex items-center gap-2"><input type="radio" name="sync" checked={syncFilter === 'all'} onChange={() => { setSyncFilter('all'); setPage(1); }} />All</label>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Cohort / Program</p>
                      <select
                        value={cohortFilter}
                        onChange={(e) => { setCohortFilter(e.target.value as typeof cohortFilter); setPage(1); }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="all">All</option>
                        <option value="Cardiac">Cardiac</option>
                        <option value="Ortho">Ortho</option>
                        <option value="Chronic">Chronic</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Sort by</p>
                      <select
                        value={sort.key}
                        onChange={(e) => setSortFromFilter(e.target.value as PatientSortKey)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="riskScore">Recovery Priority Score</option>
                        <option value="daysSinceDischarge">Days Since Discharge</option>
                        <option value="hrChange">HR % Change</option>
                        <option value="stepsChange">Steps % Change</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="secondary"
                className="rounded-xl border-gray-300 w-[160px] h-[38px] inline-flex items-center px-3 text-sm"
                onClick={() => {
                  setShowPageSizeDropdown((value) => !value);
                  setShowFilters(false);
                  setShowRiskDropdown(false);
                }}
              >
                <span className="truncate">Per page: {pageSize}</span>
                <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
              </Button>

              {showPageSizeDropdown && (
                <div className="absolute right-0 mt-2 z-10 w-[130px] bg-white border border-gray-300 rounded-2xl p-2 shadow-sm">
                  {[5, 10, 20, 50].map((size) => (
                    <button
                      key={size}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        pageSize === size
                          ? 'bg-primary-light text-primary'
                          : 'hover:bg-neutral-light text-gray-700'
                      }`}
                      onClick={() => {
                        setPageSize(size);
                        setPage(1);
                        setShowPageSizeDropdown(false);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <PatientTable
            patients={pagedPatients}
            page={normalizedPage}
            pages={totalPages}
            onPageChange={setPage}
            onRowClick={onPatientClick}
            sort={sort}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
}
