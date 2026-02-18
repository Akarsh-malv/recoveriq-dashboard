import { PatientWithDetail, RiskTier } from '../types/patient';

export type PatientTrend = 'improving' | 'stable' | 'worsening';

interface MetricSnapshot {
  baseline: number;
  current: number;
  percentChange: number;
}

export interface SeedPatient {
  id: string;
  name: string;
  age: number;
  dischargeDate: string;
  riskScore: number;
  riskTier: RiskTier;
  lastSync: string;
  drivers: string[];
  metrics: {
    restingHR: MetricSnapshot;
    steps: MetricSnapshot;
    sleep: MetricSnapshot;
  };
  trend: PatientTrend;
}

const baseSeedPatients: SeedPatient[] = [
  {
    id: 'p-001',
    name: 'Sarah Johnson',
    age: 52,
    dischargeDate: '2026-01-06',
    riskScore: 84,
    riskTier: 'high',
    lastSync: '2026-02-15T10:25:00Z',
    drivers: ['Elevated HR', 'Low activity', 'Poor sleep'],
    metrics: {
      restingHR: { baseline: 68, current: 82, percentChange: 21 },
      steps: { baseline: 5200, current: 3400, percentChange: -35 },
      sleep: { baseline: 7.2, current: 5.1, percentChange: -29 },
    },
    trend: 'worsening',
  },
  {
    id: 'p-002',
    name: 'Michael Chen',
    age: 45,
    dischargeDate: '2026-01-10',
    riskScore: 62,
    riskTier: 'medium',
    lastSync: '2026-02-15T09:40:00Z',
    drivers: ['Elevated HR', 'Sleep decline'],
    metrics: {
      restingHR: { baseline: 66, current: 74, percentChange: 12 },
      steps: { baseline: 5600, current: 4550, percentChange: -19 },
      sleep: { baseline: 7.4, current: 6.3, percentChange: -15 },
    },
    trend: 'stable',
  },
  {
    id: 'p-003',
    name: 'Emily Rodriguez',
    age: 36,
    dischargeDate: '2026-01-04',
    riskScore: 24,
    riskTier: 'low',
    lastSync: '2026-02-15T11:05:00Z',
    drivers: ['Stable metrics'],
    metrics: {
      restingHR: { baseline: 64, current: 63, percentChange: -2 },
      steps: { baseline: 5400, current: 5570, percentChange: 3 },
      sleep: { baseline: 7.6, current: 7.8, percentChange: 3 },
    },
    trend: 'improving',
  },
  {
    id: 'p-004',
    name: 'James Patterson',
    age: 61,
    dischargeDate: '2025-12-28',
    riskScore: 76,
    riskTier: 'high',
    lastSync: '2026-02-15T08:15:00Z',
    drivers: ['Elevated HR', 'Low activity'],
    metrics: {
      restingHR: { baseline: 70, current: 84, percentChange: 20 },
      steps: { baseline: 4800, current: 3050, percentChange: -36 },
      sleep: { baseline: 7.0, current: 5.4, percentChange: -23 },
    },
    trend: 'worsening',
  },
  {
    id: 'p-005',
    name: 'Lisa Martinez',
    age: 48,
    dischargeDate: '2026-01-02',
    riskScore: 44,
    riskTier: 'medium',
    lastSync: '2026-02-15T10:02:00Z',
    drivers: ['Sleep decline', 'Low activity'],
    metrics: {
      restingHR: { baseline: 67, current: 70, percentChange: 4 },
      steps: { baseline: 5100, current: 4200, percentChange: -18 },
      sleep: { baseline: 7.1, current: 6.2, percentChange: -13 },
    },
    trend: 'stable',
  },
  {
    id: 'p-006',
    name: 'Robert Fox',
    age: 55,
    dischargeDate: '2026-01-08',
    riskScore: 67,
    riskTier: 'medium',
    lastSync: '2026-02-15T07:55:00Z',
    drivers: ['Elevated HR', 'Low activity'],
    metrics: {
      restingHR: { baseline: 69, current: 79, percentChange: 14 },
      steps: { baseline: 4700, current: 3450, percentChange: -27 },
      sleep: { baseline: 6.8, current: 6.0, percentChange: -12 },
    },
    trend: 'worsening',
  },
  {
    id: 'p-007',
    name: 'Brooklyn Simmons',
    age: 33,
    dischargeDate: '2026-01-12',
    riskScore: 18,
    riskTier: 'low',
    lastSync: '2026-02-15T11:20:00Z',
    drivers: ['Stable metrics'],
    metrics: {
      restingHR: { baseline: 62, current: 61, percentChange: -2 },
      steps: { baseline: 5900, current: 6030, percentChange: 2 },
      sleep: { baseline: 7.9, current: 8.0, percentChange: 1 },
    },
    trend: 'stable',
  },
  {
    id: 'p-008',
    name: 'Annette Miles',
    age: 64,
    dischargeDate: '2025-12-24',
    riskScore: 79,
    riskTier: 'high',
    lastSync: '2026-02-15T06:50:00Z',
    drivers: ['Elevated HR', 'Poor sleep'],
    metrics: {
      restingHR: { baseline: 71, current: 86, percentChange: 21 },
      steps: { baseline: 4300, current: 2920, percentChange: -32 },
      sleep: { baseline: 6.9, current: 4.9, percentChange: -29 },
    },
    trend: 'worsening',
  },
  {
    id: 'p-009',
    name: 'Chris Fisher',
    age: 58,
    dischargeDate: '2026-01-03',
    riskScore: 53,
    riskTier: 'medium',
    lastSync: '2026-02-15T09:10:00Z',
    drivers: ['Low activity', 'Sleep decline'],
    metrics: {
      restingHR: { baseline: 68, current: 73, percentChange: 7 },
      steps: { baseline: 5000, current: 3950, percentChange: -21 },
      sleep: { baseline: 7.0, current: 6.1, percentChange: -13 },
    },
    trend: 'stable',
  },
  {
    id: 'p-010',
    name: 'Leslie Public',
    age: 42,
    dischargeDate: '2026-01-14',
    riskScore: 29,
    riskTier: 'low',
    lastSync: '2026-02-15T11:32:00Z',
    drivers: ['Stable metrics'],
    metrics: {
      restingHR: { baseline: 65, current: 64, percentChange: -2 },
      steps: { baseline: 5600, current: 5710, percentChange: 2 },
      sleep: { baseline: 7.5, current: 7.6, percentChange: 1 },
    },
    trend: 'improving',
  },
  {
    id: 'p-011',
    name: 'Daniel Cooper',
    age: 50,
    dischargeDate: '2026-01-09',
    riskScore: 71,
    riskTier: 'high',
    lastSync: '2026-02-15T08:45:00Z',
    drivers: ['Elevated HR', 'Low activity', 'Sleep decline'],
    metrics: {
      restingHR: { baseline: 67, current: 79, percentChange: 18 },
      steps: { baseline: 4900, current: 3220, percentChange: -34 },
      sleep: { baseline: 7.3, current: 5.5, percentChange: -25 },
    },
    trend: 'worsening',
  },
  {
    id: 'p-012',
    name: 'Priya Nair',
    age: 39,
    dischargeDate: '2026-01-11',
    riskScore: 37,
    riskTier: 'low',
    lastSync: '2026-02-15T10:48:00Z',
    drivers: ['Stable metrics', 'HR drop'],
    metrics: {
      restingHR: { baseline: 63, current: 60, percentChange: -5 },
      steps: { baseline: 5750, current: 5980, percentChange: 4 },
      sleep: { baseline: 7.2, current: 7.5, percentChange: 4 },
    },
    trend: 'improving',
  },
  {
    id: 'p-013',
    name: 'Marcus Lee',
    age: 47,
    dischargeDate: '2026-01-07',
    riskScore: 58,
    riskTier: 'medium',
    lastSync: '2026-02-15T09:28:00Z',
    drivers: ['Elevated HR', 'Low activity'],
    metrics: {
      restingHR: { baseline: 66, current: 75, percentChange: 14 },
      steps: { baseline: 5300, current: 4320, percentChange: -18 },
      sleep: { baseline: 7.1, current: 6.6, percentChange: -7 },
    },
    trend: 'stable',
  },
  {
    id: 'p-014',
    name: 'Olivia Carter',
    age: 34,
    dischargeDate: '2026-01-13',
    riskScore: 22,
    riskTier: 'low',
    lastSync: '2026-02-15T11:40:00Z',
    drivers: ['Stable metrics'],
    metrics: {
      restingHR: { baseline: 64, current: 62, percentChange: -3 },
      steps: { baseline: 6000, current: 6120, percentChange: 2 },
      sleep: { baseline: 7.8, current: 7.9, percentChange: 1 },
    },
    trend: 'stable',
  },
  {
    id: 'p-015',
    name: 'Harold Bennett',
    age: 63,
    dischargeDate: '2025-12-30',
    riskScore: 46,
    riskTier: 'medium',
    lastSync: '2026-02-15T08:30:00Z',
    drivers: ['Low activity', 'Sleep decline'],
    metrics: {
      restingHR: { baseline: 72, current: 76, percentChange: 6 },
      steps: { baseline: 4100, current: 3300, percentChange: -20 },
      sleep: { baseline: 6.6, current: 5.9, percentChange: -11 },
    },
    trend: 'stable',
  },
];

const additionalNames = [
  'Avery Morgan', 'Nolan Price', 'Camila Hayes', 'Ethan Foster', 'Naomi Brooks',
  'Julian Reed', 'Maya Simmons', 'Derek Vaughn', 'Isla Griffin', 'Caleb Porter',
  'Jasmine Cole', 'Wyatt Walsh', 'Elena Soto', 'Mason Harper', 'Ruby Franklin',
  'Lucas Boyd', 'Aria Duncan', 'Connor Wells', 'Sofia Patel', 'Adrian Quinn',
  'Leah Moreno', 'Xavier Hunt', 'Zoe Chandler', 'Miles Rios', 'Nadia Kim',
  'Rowan Blake', 'Tessa Gordon', 'Owen Steele', 'Kiara Benson', 'Jude Lawson',
  'Riley Armstrong', 'Noah Freeman', 'Mila Stone', 'Gavin Park', 'Aaliyah Boyd',
  'Cole Whitman', 'Piper Dean', 'Jonah Barrett', 'Ariana Shaw', 'Theo Russo',
  'Sienna Vega', 'Roman Pierce', 'Clara Holt', 'Asher Flynn', 'Lila Rhodes',
  'Finn Mercer', 'Eva Cross', 'Hugo Chan', 'Nina Bennett', 'Eli Warner',
  'Mara Delgado', 'Quentin Hale', 'Bianca Torres', 'Devon Kerr', 'Selena Ortiz',
] as const;

const driverPool = {
  hrHigh: ['Elevated HR', 'Sustained tachycardia', 'Resting HR uptrend'],
  hrLow: ['HR drop', 'Improved resting HR', 'Heart rate normalization'],
  activityLow: ['Low activity', 'Reduced daily movement', 'Step decline'],
  activityHigh: ['Activity rebound', 'Consistent activity', 'Improved mobility'],
  sleepLow: ['Poor sleep', 'Sleep decline', 'Interrupted sleep'],
  sleepHigh: ['Sleep improvement', 'Consistent sleep', 'Better sleep duration'],
  stable: ['Stable metrics', 'No major deviations', 'Recovery steady'],
};

const riskCycle: RiskTier[] = [
  'high', 'medium', 'low', 'medium', 'high',
  'low', 'medium', 'high', 'low', 'medium',
];

const trendCycle: PatientTrend[] = [
  'worsening', 'stable', 'improving', 'stable', 'worsening',
  'improving', 'stable', 'worsening', 'improving', 'stable',
];

const MAX_DISCHARGE_DAYS = 31;

const round = (value: number): number => Math.round(value);

const pct = (baseline: number, current: number): number => {
  if (baseline === 0) return 0;
  return round(((current - baseline) / baseline) * 100);
};

const isoDateFromToday = (daysAgo: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

const isoTimestampFromNow = (hoursAgo: number, minutesAgo: number): string => {
  const date = new Date();
  date.setUTCHours(date.getUTCHours() - hoursAgo);
  date.setUTCMinutes(date.getUTCMinutes() - minutesAgo);
  return date.toISOString();
};

const clampDischargeDate = (dischargeDate: string): string => {
  const now = new Date();
  const discharge = new Date(dischargeDate);
  const daysSinceDischarge = Math.floor((now.getTime() - discharge.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceDischarge <= MAX_DISCHARGE_DAYS) {
    return dischargeDate;
  }

  return isoDateFromToday(MAX_DISCHARGE_DAYS);
};

function buildDrivers(
  riskTier: RiskTier,
  trend: PatientTrend,
  hrChange: number,
  stepsChange: number,
  sleepChange: number
): string[] {
  const drivers: string[] = [];

  if (hrChange >= 12) drivers.push(driverPool.hrHigh[hrChange % driverPool.hrHigh.length]);
  if (hrChange <= -8) drivers.push(driverPool.hrLow[Math.abs(hrChange) % driverPool.hrLow.length]);
  if (stepsChange <= -18) drivers.push(driverPool.activityLow[Math.abs(stepsChange) % driverPool.activityLow.length]);
  if (stepsChange >= 10) drivers.push(driverPool.activityHigh[stepsChange % driverPool.activityHigh.length]);
  if (sleepChange <= -12) drivers.push(driverPool.sleepLow[Math.abs(sleepChange) % driverPool.sleepLow.length]);
  if (sleepChange >= 8) drivers.push(driverPool.sleepHigh[sleepChange % driverPool.sleepHigh.length]);

  if (drivers.length === 0) {
    drivers.push(driverPool.stable[(riskTier.length + trend.length) % driverPool.stable.length]);
  }

  return Array.from(new Set(drivers)).slice(0, 3);
}

function generateAdditionalPatients(): SeedPatient[] {
  return additionalNames.map((name, index) => {
    const patientNumber = index + 16;
    const id = `p-${String(patientNumber).padStart(3, '0')}`;
    const age = 29 + ((index * 7) % 44); // 29-72
    const riskTier = riskCycle[index % riskCycle.length];
    const trend = trendCycle[index % trendCycle.length];

    const riskScore =
      riskTier === 'high'
        ? 70 + ((index * 9) % 29) // 70-98
        : riskTier === 'medium'
          ? 40 + ((index * 11) % 30) // 40-69
          : (index * 13) % 40; // 0-39

    const hrBaseline = 60 + ((index * 3) % 16); // 60-75
    const stepsBaseline = 3500 + ((index * 197) % 2501); // 3500-6000
    const sleepBaseline = 6 + (((index * 19) % 21) / 10); // 6.0-8.0

    const hrDelta =
      trend === 'worsening'
        ? 8 + ((index * 5) % 14)
        : trend === 'improving'
          ? -(4 + ((index * 3) % 10))
          : -3 + ((index * 7) % 7);

    const stepsDelta =
      trend === 'worsening'
        ? -(500 + ((index * 131) % 1900))
        : trend === 'improving'
          ? 250 + ((index * 173) % 1400)
          : -300 + ((index * 83) % 650);

    const sleepDelta =
      trend === 'worsening'
        ? -(0.6 + (((index * 7) % 18) / 10))
        : trend === 'improving'
          ? 0.3 + (((index * 5) % 14) / 10)
          : -0.2 + (((index * 11) % 6) / 10);

    const hrCurrent = round(Math.max(52, hrBaseline + hrDelta));
    const stepsCurrent = round(Math.max(1800, stepsBaseline + stepsDelta));
    const sleepCurrent = round(Math.max(4.2, Math.min(9.4, sleepBaseline + sleepDelta)) * 10) / 10;

    const hrChange = pct(hrBaseline, hrCurrent);
    const stepsChange = pct(stepsBaseline, stepsCurrent);
    const sleepChange = pct(sleepBaseline, sleepCurrent);

    const drivers = buildDrivers(riskTier, trend, hrChange, stepsChange, sleepChange);

    return {
      id,
      name,
      age,
      dischargeDate: isoDateFromToday(4 + ((index * 2) % 28)),
      riskScore: round(riskScore),
      riskTier,
      lastSync: isoTimestampFromNow(index % 12, (index * 7) % 50),
      drivers,
      metrics: {
        restingHR: {
          baseline: round(hrBaseline),
          current: round(hrCurrent),
          percentChange: hrChange,
        },
        steps: {
          baseline: round(stepsBaseline),
          current: round(stepsCurrent),
          percentChange: stepsChange,
        },
        sleep: {
          baseline: round(sleepBaseline * 10) / 10,
          current: sleepCurrent,
          percentChange: sleepChange,
        },
      },
      trend,
    };
  });
}

const additionalSeedPatients = generateAdditionalPatients();

export const seedPatients: SeedPatient[] = [...baseSeedPatients, ...additionalSeedPatients].map((patient) => ({
  ...patient,
  dischargeDate: clampDischargeDate(patient.dischargeDate),
}));

function makeTrendSeries(baseline: number, current: number, days = 14) {
  return Array.from({ length: days }).map((_, index) => {
    const ratio = days === 1 ? 1 : index / (days - 1);
    const value = baseline + (current - baseline) * ratio;
    return {
      date: new Date(Date.now() - (days - 1 - index) * 86400000).toISOString(),
      value: Math.round(value),
    };
  });
}

function makeWearableSeries(baseline: number, current: number, hours = 96) {
  return Array.from({ length: hours }).map((_, index) => {
    const ratio = hours === 1 ? 1 : index / (hours - 1);
    const value = baseline + (current - baseline) * ratio;
    return Math.round(value);
  });
}

function toPatientWithDetail(seedPatient: SeedPatient): PatientWithDetail {
  return {
    id: seedPatient.id,
    name: seedPatient.name,
    age: seedPatient.age,
    dischargeDate: seedPatient.dischargeDate,
    riskScore: seedPatient.riskScore,
    riskTier: seedPatient.riskTier,
    lastSync: seedPatient.lastSync,
    drivers: seedPatient.drivers,
    trend: seedPatient.trend,
    detail: {
      baseline: {
        restingHR: Math.round(seedPatient.metrics.restingHR.baseline),
        activityLevel: Math.round(seedPatient.metrics.steps.baseline),
        sleepDuration: Math.round(seedPatient.metrics.sleep.baseline),
      },
      recent: {
        restingHR: Math.round(seedPatient.metrics.restingHR.current),
        activityLevel: Math.round(seedPatient.metrics.steps.current),
        sleepDuration: Math.round(seedPatient.metrics.sleep.current),
      },
      trends: {
        heartRate: makeTrendSeries(seedPatient.metrics.restingHR.baseline, seedPatient.metrics.restingHR.current),
        activity: makeTrendSeries(seedPatient.metrics.steps.baseline, seedPatient.metrics.steps.current),
        sleep: makeTrendSeries(seedPatient.metrics.sleep.baseline, seedPatient.metrics.sleep.current),
      },
      wearable: {
        heartRate: makeWearableSeries(seedPatient.metrics.restingHR.baseline, seedPatient.metrics.restingHR.current),
        steps: makeWearableSeries(seedPatient.metrics.steps.baseline, seedPatient.metrics.steps.current),
        sleep: makeWearableSeries(seedPatient.metrics.sleep.baseline, seedPatient.metrics.sleep.current),
      },
      alerts: seedPatient.drivers.slice(0, 2).map((driver, index) => ({
        id: `${seedPatient.id}-a${index + 1}`,
        timestamp: seedPatient.lastSync,
        message: driver,
        severity: seedPatient.riskTier,
      })),
    },
  };
}

const detailedPatients = seedPatients.map(toPatientWithDetail);

export function getPatientsPage(page: number, pageSize = 5): { data: PatientWithDetail[]; total: number } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { data: detailedPatients.slice(start, end), total: detailedPatients.length };
}

export function getPatientDetail(id: string): PatientWithDetail | null {
  return detailedPatients.find((patient) => patient.id === id) ?? null;
}
