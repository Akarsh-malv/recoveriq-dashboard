import { SeedPatient } from '../mocks/seedPatients';

export type GeneratedAlertSeverity = 'high' | 'medium' | 'low';
export type GeneratedAlertType = 'HR Elevation' | 'Activity Drop' | 'Sleep Decline' | 'Risk Escalation';
export type GeneratedAlertStatus = 'active' | 'reviewed';

export interface GeneratedAlert {
  id: string;
  patientId: string;
  patientName: string;
  severity: GeneratedAlertSeverity;
  type: GeneratedAlertType;
  metricDelta: string;
  daysSinceDischarge: number;
  createdAt: string;
  status: GeneratedAlertStatus;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const severityRank: Record<GeneratedAlertSeverity, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function getPatientHash(patient: SeedPatient): number {
  return patient.id.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
}

function getDaysSinceDischarge(dischargeDate: string): number {
  const discharge = new Date(dischargeDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - discharge);
  return Math.round(diff / DAY_MS);
}

function getTimestampWithin24Hours(seed: number): string {
  const hoursAgo = seed % 24;
  const minutesAgo = (seed * 13) % 60;
  const timestamp = Date.now() - hoursAgo * HOUR_MS - minutesAgo * 60_000;
  return new Date(timestamp).toISOString();
}

function getStatus(seed: number, severity: GeneratedAlertSeverity): GeneratedAlertStatus {
  if (severity === 'high') {
    return seed % 5 === 0 ? 'reviewed' : 'active';
  }
  return seed % 3 === 0 ? 'reviewed' : 'active';
}

function createAlert(
  patient: SeedPatient,
  type: GeneratedAlertType,
  severity: GeneratedAlertSeverity,
  metricDelta: string,
  index: number
): GeneratedAlert {
  const hash = getPatientHash(patient) + index * 11;
  return {
    id: `${patient.id}-${type.toLowerCase().replace(/\s+/g, '-')}`,
    patientId: patient.id,
    patientName: patient.name,
    severity,
    type,
    metricDelta,
    daysSinceDischarge: getDaysSinceDischarge(patient.dischargeDate),
    createdAt: getTimestampWithin24Hours(hash),
    status: getStatus(hash, severity),
  };
}

export function generateAlertsFromPatients(patients: SeedPatient[]): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];

  patients.forEach((patient) => {
    if (patient.riskTier !== 'high') {
      return;
    }

    const metricSet: Omit<GeneratedAlert, 'id' | 'patientId' | 'patientName' | 'daysSinceDischarge' | 'createdAt' | 'status'>[] = [];

    if (patient.riskScore >= 75) {
      const hrDelta = `${patient.metrics.restingHR.percentChange >= 0 ? '+' : ''}${Math.round(patient.metrics.restingHR.percentChange)}%`;
      const stepsDelta = `${Math.round(patient.metrics.steps.percentChange)}%`;
      const sleepDelta = `${Math.round(patient.metrics.sleep.percentChange)}%`;
      metricSet.push({
        severity: 'high',
        type: 'Risk Escalation',
        metricDelta: `Priority ${Math.round(patient.riskScore)} (baseline deviation). Drivers: HR ${hrDelta}, Steps ${stepsDelta}, Sleep ${sleepDelta}`,
      });
    }

    if (patient.metrics.restingHR.percentChange >= 15) {
      metricSet.push({
        severity: 'medium',
        type: 'HR Elevation',
        metricDelta: `Resting HR +${Math.round(patient.metrics.restingHR.percentChange)}% vs baseline`,
      });
    }

    if (patient.metrics.steps.percentChange <= -20) {
      metricSet.push({
        severity: 'medium',
        type: 'Activity Drop',
        metricDelta: `Daily steps ${Math.round(patient.metrics.steps.percentChange)}% vs baseline`,
      });
    }

    if (patient.metrics.sleep.percentChange <= -20) {
      metricSet.push({
        severity: 'low',
        type: 'Sleep Decline',
        metricDelta: `Sleep duration ${Math.round(patient.metrics.sleep.percentChange)}% vs baseline`,
      });
    }

    metricSet.forEach((metricAlert, index) => {
      alerts.push(createAlert(patient, metricAlert.type, metricAlert.severity, metricAlert.metricDelta, index + 1));
    });
  });

  return alerts.sort((left, right) => {
    const severityDiff = severityRank[right.severity] - severityRank[left.severity];
    if (severityDiff !== 0) {
      return severityDiff;
    }
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
