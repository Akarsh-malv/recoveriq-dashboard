import { z } from 'zod';
import { getPatientsPage, getPatientDetail } from '../mocks/seedPatients';
import { Patient, PatientDetail } from '../types/patient';

const PatientSchema: z.ZodType<Patient> = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  dischargeDate: z.string(),
  riskScore: z.number(),
  riskTier: z.enum(['low', 'medium', 'high']),
  lastSync: z.string(),
  drivers: z.array(z.string()),
});

const PatientDetailSchema: z.ZodType<PatientDetail> = z.object({
  baseline: z.object({
    restingHR: z.number(),
    activityLevel: z.number(),
  }),
  recent: z.object({
    restingHR: z.number(),
    activityLevel: z.number(),
  }),
  trends: z.object({
    heartRate: z.array(z.object({ date: z.string(), value: z.number() })),
    activity: z.array(z.object({ date: z.string(), value: z.number() })),
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

export const PAGE_SIZE = 5;

export async function fetchPatients(page = 1): Promise<{ patients: Patient[]; total: number; pages: number }> {
  const { data, total } = getPatientsPage(page, PAGE_SIZE);
  const parsed = z.array(PatientSchema).safeParse(data);
  if (!parsed.success) {
    throw new Error('Invalid patient data');
  }
  return { patients: parsed.data, total, pages: Math.ceil(total / PAGE_SIZE) };
}

export async function fetchPatientDetail(id: string): Promise<PatientDetail> {
  const detail = getPatientDetail(id)?.detail;
  const parsed = PatientDetailSchema.safeParse(detail);
  if (!parsed.success || !detail) {
    throw new Error('Patient not found');
  }
  return parsed.data;
}
