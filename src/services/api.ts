import { z } from 'zod';
import { getPatientsPage, getPatientDetail } from '../mocks/seedPatients';
import { Patient, PatientClinicianStats, PatientDetail, PatientDetailResponse } from '../types/patient';
import { computeMetricStats } from '../utils/stats';

const PatientSchema: z.ZodType<Patient> = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  dischargeDate: z.string(),
  riskScore: z.number(),
  riskTier: z.enum(['low', 'medium', 'high']),
  lastSync: z.string(),
  drivers: z.array(z.string()),
  trend: z.enum(['improving', 'stable', 'worsening']).optional(),
  stats: z
    .object({
      restingHR: z.object({
        baseline: z.number(),
        current: z.number(),
        percentChange: z.number(),
      }),
      steps: z.object({
        baseline: z.number(),
        current: z.number(),
        percentChange: z.number(),
      }),
      sleep: z.object({
        baseline: z.number(),
        current: z.number(),
        percentChange: z.number(),
      }),
    })
    .optional(),
});

const PatientDetailSchema: z.ZodType<PatientDetail> = z.object({
  baseline: z.object({
    restingHR: z.number(),
    activityLevel: z.number(),
    sleepDuration: z.number(),
  }),
  recent: z.object({
    restingHR: z.number(),
    activityLevel: z.number(),
    sleepDuration: z.number(),
  }),
  trends: z.object({
    heartRate: z.array(z.object({ date: z.string(), value: z.number() })),
    activity: z.array(z.object({ date: z.string(), value: z.number() })),
    sleep: z.array(z.object({ date: z.string(), value: z.number() })),
  }),
  wearable: z.object({
    heartRate: z.array(z.number()),
    steps: z.array(z.number()),
    sleep: z.array(z.number()),
  }),
  alerts: z.array(
    z.object({
      id: z.string(),
      timestamp: z.string(),
      message: z.string(),
      severity: z.enum(['low', 'medium', 'high']),
    })
  ),
});

const PatientDetailResponseSchema: z.ZodType<PatientDetailResponse> = z.object({
  id: z.string(),
  name: z.string(),
  riskScore: z.number(),
  riskTier: z.enum(['low', 'medium', 'high']),
  lastSync: z.string(),
  stats: z.object({
    restingHR: z.object({
      baseline: z.number(),
      current: z.number(),
      percentChange: z.number(),
    }),
    steps: z.object({
      baseline: z.number(),
      current: z.number(),
      percentChange: z.number(),
    }),
    sleep: z.object({
      baseline: z.number(),
      current: z.number(),
      percentChange: z.number(),
    }),
  }),
  detail: PatientDetailSchema,
});

export const DEFAULT_PAGE_SIZE = 5;

const computePatientStats = (detail: PatientDetail): PatientClinicianStats => ({
  restingHR: computeMetricStats(detail.wearable.heartRate),
  steps: computeMetricStats(detail.wearable.steps),
  sleep: computeMetricStats(detail.wearable.sleep),
});

const hasRecentAlert = (detail: PatientDetail): boolean => {
  const now = Date.now();
  return detail.alerts.some((alert) => {
    const ageHours = (now - new Date(alert.timestamp).getTime()) / (1000 * 60 * 60);
    return ageHours <= 24;
  });
};

const getDaysSinceDischarge = (dischargeDate: string): number => {
  const discharge = new Date(dischargeDate);
  const now = new Date();
  const diffMs = now.getTime() - discharge.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

const normalizeTriageRisk = (patient: Patient): Patient => {
  const daysSinceDischarge = getDaysSinceDischarge(patient.dischargeDate);
  if (daysSinceDischarge <= 20 || patient.riskTier !== 'high') {
    return patient;
  }

  // In triage view, cap high-risk labels after D+20.
  return {
    ...patient,
    riskTier: 'medium',
    riskScore: Math.min(69, Math.round(patient.riskScore)),
  };
};

export async function fetchPatients(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<{ patients: Patient[]; total: number; pages: number }> {
  const { data, total } = getPatientsPage(page, pageSize);
  const withStats: Patient[] = data.map((patient) =>
    normalizeTriageRisk({
      ...patient,
      stats: computePatientStats(patient.detail),
      hasRecentAlert: hasRecentAlert(patient.detail),
    })
  );

  const parsed = z.array(PatientSchema).safeParse(withStats);
  if (!parsed.success) {
    throw new Error('Invalid patient data');
  }
  return { patients: parsed.data, total, pages: Math.ceil(total / pageSize) };
}

export async function fetchPatientDetail(id: string): Promise<PatientDetailResponse> {
  const patient = getPatientDetail(id);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const response: PatientDetailResponse = {
    id: patient.id,
    name: patient.name,
    riskScore: patient.riskScore,
    riskTier: patient.riskTier,
    lastSync: patient.lastSync,
    stats: computePatientStats(patient.detail),
    detail: patient.detail,
  };

  const parsed = PatientDetailResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error('Invalid patient detail data');
  }

  return parsed.data;
}
