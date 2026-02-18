import { SeedPatient } from '../mocks/seedPatients';

export interface RecoveryMomentum {
  improving: number;
  stable: number;
  worsening: number;
}

export type MomentumFilter = keyof RecoveryMomentum;

export interface DriverBreakdownItem {
  driver: string;
  count: number;
}

export function getRecoveryMomentum(patients: SeedPatient[]): RecoveryMomentum {
  const momentum = patients.reduce(
    (acc, patient) => {
      if (patient.riskScore <= 35 && patient.trend === 'improving') {
        acc.improving += 1;
        return acc;
      }

      if (patient.trend === 'stable') {
        acc.stable += 1;
        return acc;
      }

      if (patient.trend === 'worsening' || patient.riskScore >= 75) {
        acc.worsening += 1;
        return acc;
      }

      acc.stable += 1;
      return acc;
    },
    { improving: 0, stable: 0, worsening: 0 }
  );

  return {
    improving: Math.round(momentum.improving),
    stable: Math.round(momentum.stable),
    worsening: Math.round(momentum.worsening),
  };
}

export function getTopDrivers(patients: SeedPatient[]): DriverBreakdownItem[] {
  const counts = new Map<string, number>();

  patients.forEach((patient) => {
    patient.drivers.forEach((driver) => {
      counts.set(driver, (counts.get(driver) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([driver, count]) => ({
      driver,
      count: Math.round(count),
    }))
    .sort((a, b) => b.count - a.count);
}
