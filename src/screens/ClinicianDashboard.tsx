import { useEffect, useState } from 'react';
import { AlertCircle, Activity, AlertTriangle, Users, Gauge } from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { seedPatients } from '../mocks/seedPatients';
import { getActivePatientCount, getAverageRiskScore, getHighRiskCount, getNewAlertsCount, getPopulationTrend, getRiskDistribution } from '../utils/dashboardStats';
import { DashboardOverviewData } from '../types/dashboard';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { PopulationTrendChart } from '../components/charts/PopulationTrendChart';
import { getRecoveryMomentum, MomentumFilter } from '../utils/dashboardInsights';
import { RecoveryMomentumPanel } from '../components/dashboard/RecoveryMomentumPanel';
import { getHighestVulnerabilityWindow, getVulnerabilityWindowData } from '../utils/vulnerability';
import { VulnerabilityWindowChart } from '../components/charts/VulnerabilityWindowChart';

interface ClinicianDashboardProps {
  onMomentumFilterSelect: (filter: MomentumFilter) => void;
}

export function ClinicianDashboard({ onMomentumFilterSelect }: ClinicianDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const patients = await Promise.resolve(seedPatients);

      const summary = {
        activePatients: getActivePatientCount(patients),
        highRiskPatients: getHighRiskCount(patients),
        patientsWorsening: getNewAlertsCount(patients),
        averageRiskScore: getAverageRiskScore(patients),
      };

      const riskDistribution = getRiskDistribution(patients);
      const populationTrend = getPopulationTrend(patients);
      const recoveryMomentum = getRecoveryMomentum(patients);
      const vulnerabilityWindows = getVulnerabilityWindowData(patients);
      const highestVulnerabilityWindow = getHighestVulnerabilityWindow(vulnerabilityWindows);

      setDashboardData({
        patients,
        summary,
        riskDistribution,
        populationTrend,
        recoveryMomentum,
        vulnerabilityWindows,
        highestVulnerabilityWindow,
      });
      setLoading(false);
    };

    void loadDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Loading patients..." />;
  }

  if (!dashboardData || dashboardData.patients.length === 0) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="No patients found"
        description="There are no patients in the system yet."
      />
    );
  }

  const improvingCount = Math.round(
    dashboardData.patients.filter((patient) => patient.trend === 'improving').length
  );

  return (
    <div className="h-full overflow-auto bg-neutral-light">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h1 className="text-3xl font-semibold text-gray-900">Clinician Overview</h1>
          <p className="text-sm text-gray-600 mt-1">System-level post-discharge recovery snapshot.</p>
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-primary bg-primary-light text-primary">
            {improvingCount} patients improving
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard title="Active Patients" value={dashboardData.summary.activePatients} icon={Users} />
          <SummaryCard title="High Risk Patients" value={dashboardData.summary.highRiskPatients} icon={AlertTriangle} tone="danger" />
          <SummaryCard title="Patients Worsening" value={dashboardData.summary.patientsWorsening} icon={Activity} tone="danger" />
          <SummaryCard title="Avg Recovery Priority Score (RPS)" value={dashboardData.summary.averageRiskScore} icon={Gauge} tone="success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RiskDistributionChart distribution={dashboardData.riskDistribution} />
          <PopulationTrendChart trend={dashboardData.populationTrend} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RecoveryMomentumPanel momentum={dashboardData.recoveryMomentum} onSelect={onMomentumFilterSelect} />
          <VulnerabilityWindowChart
            data={dashboardData.vulnerabilityWindows}
            highestWindow={dashboardData.highestVulnerabilityWindow}
          />
        </div>
      </div>
    </div>
  );
}
