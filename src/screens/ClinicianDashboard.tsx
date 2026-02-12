import { useState } from 'react';
import { Filter, Search, AlertCircle } from 'lucide-react';
import { RiskTier } from '../types/patient';
import { Button } from '../components/Button';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useQuery } from '../lib/queryShim';
import { fetchPatients } from '../services/api';
import { PatientTable } from '../components/tables/PatientTable';

interface ClinicianDashboardProps {
  onPatientClick: (patientId: string) => void;
}

export function ClinicianDashboard({ onPatientClick }: ClinicianDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskTier | 'all'>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['patients', page],
    queryFn: () => fetchPatients(page),
    keepPreviousData: true,
  });

  const patients = data?.patients ?? [];
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || patient.riskTier === riskFilter;
    return matchesSearch && matchesRisk;
  });

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
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Patient Triage</h1>
          <p className="text-sm text-gray-600">Monitor and prioritize patient recovery status</p>
        </div>

        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskTier | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <PatientTable
            patients={filteredPatients}
            page={page}
            pages={data.pages}
            onPageChange={setPage}
            onRowClick={onPatientClick}
          />
        </div>
      </div>
    </div>
  );
}
