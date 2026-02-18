import { SeedPatient } from '../mocks/seedPatients';
import { PopulationTrendPoint, RiskDistribution } from '../types/dashboard';

export function getActivePatientCount(patients: SeedPatient[]): number {
  return Math.round(patients.length);
}

export function getHighRiskCount(patients: SeedPatient[]): number {
  return Math.round(patients.filter((patient) => patient.riskTier === 'high').length);
}

export function getNewAlertsCount(patients: SeedPatient[]): number {
  return Math.round(
    patients.filter((patient) => patient.riskTier === 'high' || patient.trend === 'worsening').length
  );
}

export function getAverageRiskScore(patients: SeedPatient[]): number {
  if (patients.length === 0) return 0;
  const totalRisk = patients.reduce((sum, patient) => sum + patient.riskScore, 0);
  return Math.round(totalRisk / patients.length);
}

export function getRiskDistribution(patients: SeedPatient[]): RiskDistribution {
  const distribution = patients.reduce<RiskDistribution>(
    (acc, patient) => {
      acc[patient.riskTier] += 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  return {
    low: Math.round(distribution.low),
    medium: Math.round(distribution.medium),
    high: Math.round(distribution.high),
  };
}

export function getPopulationTrend(patients: SeedPatient[]): PopulationTrendPoint[] {
  const days = 14;
  const averageRisk = getAverageRiskScore(patients);

  return Array.from({ length: days }).map((_, index) => {
    const day = `Day ${index + 1}`;
    const wave = Math.sin(index / 2) * 4;
    const slope = (index - (days - 1) / 2) * 0.35;
    const score = Math.round(averageRisk + wave + slope);

    return {
      day,
      riskScore: score,
    };
  });
}
