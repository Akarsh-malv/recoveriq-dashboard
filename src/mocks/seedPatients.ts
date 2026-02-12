import { Patient, PatientDetail, PatientWithDetail, RiskTier } from '../types/patient';

const makeTrend = (start: number, count: number, variance: number, direction: 'up' | 'down' | 'flat') =>
  Array.from({ length: count }).map((_, idx) => {
    const delta =
      direction === 'flat'
        ? (Math.random() - 0.5) * variance
        : (direction === 'up' ? 1 : -1) * (idx * variance * 0.4) + (Math.random() - 0.5) * variance;
    return { date: new Date(Date.now() - (count - idx) * 86400000).toISOString(), value: Math.max(40, start + delta) };
  });

const basePatients: Patient[] = [
  {
    id: 'p-001',
    name: 'Sarah Johnson',
    age: 52,
    dischargeDate: '2026-01-04',
    riskScore: 82,
    riskTier: 'high',
    lastSync: new Date(Date.now() - 2 * 3600000).toISOString(),
    drivers: ['Low activity', 'Poor sleep'],
  },
  {
    id: 'p-002',
    name: 'Michael Chen',
    age: 45,
    dischargeDate: '2026-01-10',
    riskScore: 58,
    riskTier: 'medium',
    lastSync: new Date(Date.now() - 5 * 3600000).toISOString(),
    drivers: ['Elevated HR'],
  },
  {
    id: 'p-003',
    name: 'Emily Rodriguez',
    age: 36,
    dischargeDate: '2026-01-02',
    riskScore: 24,
    riskTier: 'low',
    lastSync: new Date(Date.now() - 1 * 3600000).toISOString(),
    drivers: ['Stable metrics'],
  },
  {
    id: 'p-004',
    name: 'James Patterson',
    age: 61,
    dischargeDate: '2025-12-21',
    riskScore: 74,
    riskTier: 'high',
    lastSync: new Date(Date.now() - 8 * 3600000).toISOString(),
    drivers: ['HRV drop', 'Low activity'],
  },
  {
    id: 'p-005',
    name: 'Lisa Martinez',
    age: 48,
    dischargeDate: '2025-12-30',
    riskScore: 41,
    riskTier: 'medium',
    lastSync: new Date(Date.now() - 3 * 3600000).toISOString(),
    drivers: ['Sleep decline'],
  },
  {
    id: 'p-006',
    name: 'Robert Fox',
    age: 55,
    dischargeDate: '2026-01-08',
    riskScore: 67,
    riskTier: 'medium',
    lastSync: new Date(Date.now() - 6 * 3600000).toISOString(),
    drivers: ['Reduced steps'],
  },
  {
    id: 'p-007',
    name: 'Brooklyn Simmons',
    age: 33,
    dischargeDate: '2026-01-06',
    riskScore: 29,
    riskTier: 'low',
    lastSync: new Date(Date.now() - 4 * 3600000).toISOString(),
    drivers: ['Stable metrics'],
  },
  {
    id: 'p-008',
    name: 'Annette Miles',
    age: 64,
    dischargeDate: '2025-12-18',
    riskScore: 77,
    riskTier: 'high',
    lastSync: new Date(Date.now() - 9 * 3600000).toISOString(),
    drivers: ['Activity dip', 'HRV drop'],
  },
  {
    id: 'p-009',
    name: 'Chris Fisher',
    age: 58,
    dischargeDate: '2026-01-03',
    riskScore: 54,
    riskTier: 'medium',
    lastSync: new Date(Date.now() - 7 * 3600000).toISOString(),
    drivers: ['Weight gain'],
  },
  {
    id: 'p-010',
    name: 'Leslie Public',
    age: 42,
    dischargeDate: '2026-01-12',
    riskScore: 18,
    riskTier: 'low',
    lastSync: new Date(Date.now() - 30 * 60000).toISOString(),
    drivers: ['Stable metrics'],
  },
];

const detailById: Record<string, PatientDetail> = Object.fromEntries(
  basePatients.map((p) => {
    const heartTrend = makeTrend(70, 14, 4, p.riskTier === 'high' ? 'up' : 'flat');
    const activityTrend = makeTrend(8000, 14, 600, p.riskTier === 'high' ? 'down' : 'flat');
    const detail: PatientDetail = {
      baseline: {
        restingHR: 68,
        activityLevel: 9000,
      },
      recent: {
        restingHR: heartTrend[heartTrend.length - 1].value,
        activityLevel: activityTrend[activityTrend.length - 1].value,
      },
      trends: {
        heartRate: heartTrend,
        activity: activityTrend,
      },
      alerts: [
        {
          id: `${p.id}-a1`,
          timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
          message:
            p.riskTier === 'high'
              ? 'Heart rate trending above baseline for 3 days'
              : 'Minor variation detected',
          severity: p.riskTier,
        },
      ],
    };
    return [p.id, detail];
  })
);

export const seedPatients: PatientWithDetail[] = basePatients.map((p) => ({
  ...p,
  detail: detailById[p.id],
}));

export function getPatientsPage(page: number, pageSize = 5): { data: Patient[]; total: number } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { data: seedPatients.slice(start, end), total: seedPatients.length };
}

export function getPatientDetail(id: string): PatientWithDetail | null {
  return seedPatients.find((p) => p.id === id) ?? null;
}
