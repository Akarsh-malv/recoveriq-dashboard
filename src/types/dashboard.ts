import { SeedPatient } from '../mocks/seedPatients';
import { RecoveryMomentum } from '../utils/dashboardInsights';
import { VulnerabilityWindowDatum } from '../utils/vulnerability';

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

export interface PopulationTrendPoint {
  day: string;
  riskScore: number;
}

export interface DashboardSummary {
  activePatients: number;
  highRiskPatients: number;
  patientsWorsening: number;
  averageRiskScore: number;
}

export interface DashboardOverviewData {
  patients: SeedPatient[];
  summary: DashboardSummary;
  riskDistribution: RiskDistribution;
  populationTrend: PopulationTrendPoint[];
  recoveryMomentum: RecoveryMomentum;
  vulnerabilityWindows: VulnerabilityWindowDatum[];
  highestVulnerabilityWindow: VulnerabilityWindowDatum | null;
}
