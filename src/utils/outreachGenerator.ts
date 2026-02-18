import { SeedPatient } from '../mocks/seedPatients';
import { GeneratedAlert } from './alertGenerator';
import { OutreachTask, TaskOutcome, TaskPriority, TaskStatus, TaskType } from '../types/outreach';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

interface RankedPatient {
  patient: SeedPatient;
  relevanceScore: number;
  alert?: GeneratedAlert;
}

function getDaysSinceDischarge(dischargeDate: string): number {
  const delta = Date.now() - new Date(dischargeDate).getTime();
  return Math.max(0, Math.floor(delta / DAY_MS));
}

function getPatientPriority(patient: SeedPatient, alert?: GeneratedAlert): TaskPriority {
  if (patient.riskScore >= 80 || alert?.severity === 'high') {
    return 'high';
  }
  if (patient.riskScore >= 60 || alert?.severity === 'medium') {
    return 'medium';
  }
  return 'low';
}

function getTaskType(patient: SeedPatient): TaskType {
  if (patient.metrics.restingHR.percentChange >= 15) {
    return 'symptom_check';
  }
  if (patient.metrics.steps.percentChange <= -25) {
    return 'follow_up';
  }
  if (patient.metrics.sleep.percentChange <= -20) {
    return 'call';
  }
  return 'med_review';
}

function getReason(patient: SeedPatient, alert?: GeneratedAlert): string {
  if (alert) {
    return alert.metricDelta;
  }

  const hr = Math.round(patient.metrics.restingHR.percentChange);
  const steps = Math.round(patient.metrics.steps.percentChange);
  const sleep = Math.round(patient.metrics.sleep.percentChange);

  if (hr >= 12) {
    return `HR +${hr}% vs baseline sustained over recent sync`;
  }
  if (steps <= -20) {
    return `Steps ${steps}% vs baseline across recent recovery window`;
  }
  if (sleep <= -20) {
    return `Sleep ${sleep}% vs baseline with reduced duration`;
  }
  return `Recovery Priority Score ${Math.round(patient.riskScore)} indicates outreach follow-up is recommended`;
}

function getStatus(index: number): TaskStatus {
  if (index % 6 === 0) {
    return 'done';
  }
  if (index % 3 === 0) {
    return 'in_progress';
  }
  return 'todo';
}

function getOutcome(status: TaskStatus, index: number): TaskOutcome {
  if (status !== 'done') {
    return 'none';
  }

  const doneOutcomes: TaskOutcome[] = ['reached', 'left_vm', 'scheduled_followup', 'no_answer'];
  return doneOutcomes[index % doneOutcomes.length];
}

function getDueAt(priority: TaskPriority, status: TaskStatus, index: number): string {
  const now = Date.now();
  const statusOffset = status === 'done' ? -(2 + (index % 10)) * HOUR_MS : 0;

  if (priority === 'high') {
    return new Date(now + (2 + (index % 5)) * HOUR_MS + statusOffset).toISOString();
  }
  if (priority === 'medium') {
    return new Date(now + (10 + (index % 15)) * HOUR_MS + statusOffset).toISOString();
  }
  return new Date(now + (2 + (index % 2)) * DAY_MS + statusOffset).toISOString();
}

function buildRankedPatients(patients: SeedPatient[], alerts: GeneratedAlert[]): RankedPatient[] {
  const alertsByPatient = new Map<string, GeneratedAlert[]>();
  alerts.forEach((alert) => {
    const current = alertsByPatient.get(alert.patientId) ?? [];
    current.push(alert);
    alertsByPatient.set(alert.patientId, current);
  });

  return patients.map((patient) => {
    const patientAlerts = alertsByPatient.get(patient.id) ?? [];
    const topAlert = patientAlerts.sort((a, b) => {
      const rank = { high: 3, medium: 2, low: 1 };
      return rank[b.severity] - rank[a.severity];
    })[0];

    const score =
      Math.round(patient.riskScore) +
      (patient.trend === 'worsening' ? 20 : patient.trend === 'stable' ? 8 : 0) +
      Math.max(0, Math.round(patient.metrics.restingHR.percentChange)) +
      Math.max(0, Math.round(Math.abs(Math.min(0, patient.metrics.steps.percentChange)))) +
      Math.max(0, Math.round(Math.abs(Math.min(0, patient.metrics.sleep.percentChange)))) +
      patientAlerts.length * 10;

    return { patient, relevanceScore: score, alert: topAlert };
  });
}

export function generateOutreachTasks(patients: SeedPatient[], alerts: GeneratedAlert[] = []): OutreachTask[] {
  const ranked = buildRankedPatients(patients, alerts)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, Math.min(15, Math.max(8, Math.round(patients.length * 0.18))));

  return ranked.map((entry, index) => {
    const status = getStatus(index);
    const priority = getPatientPriority(entry.patient, entry.alert);
    const createdAt = new Date(Date.now() - (index + 2) * HOUR_MS).toISOString();
    const dueAt = getDueAt(priority, status, index);

    return {
      id: `outreach-${entry.patient.id}`,
      patientId: entry.patient.id,
      patientName: entry.patient.name,
      daysSinceDischarge: getDaysSinceDischarge(entry.patient.dischargeDate),
      priority,
      status,
      outcome: getOutcome(status, index),
      type: getTaskType(entry.patient),
      reason: getReason(entry.patient, entry.alert),
      dueAt,
      createdAt,
      lastUpdatedAt: createdAt,
      notes: status === 'done' ? 'Completed outreach cycle and documented response.' : '',
      patientSnapshot: {
        riskScore: Math.round(entry.patient.riskScore),
        restingHRCurrent: Math.round(entry.patient.metrics.restingHR.current),
        restingHRDelta: Math.round(entry.patient.metrics.restingHR.percentChange),
        stepsCurrent: Math.round(entry.patient.metrics.steps.current),
        stepsDelta: Math.round(entry.patient.metrics.steps.percentChange),
        sleepCurrent: Math.round(entry.patient.metrics.sleep.current),
        sleepDelta: Math.round(entry.patient.metrics.sleep.percentChange),
      },
    };
  });
}
