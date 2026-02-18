export type RiskTier = 'low' | 'medium' | 'high';
export type PatientTrend = 'improving' | 'stable' | 'worsening';

export interface MetricStat {
  baseline: number;
  current: number;
  percentChange: number;
}

export interface PatientClinicianStats {
  restingHR: MetricStat;
  steps: MetricStat;
  sleep: MetricStat;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  dischargeDate: string;
  riskScore: number;
  riskTier: RiskTier;
  lastSync: string;
  drivers: string[];
  trend?: PatientTrend;
  stats?: PatientClinicianStats;
  hasRecentAlert?: boolean;
}

export interface PatientDetail {
  baseline: {
    restingHR: number;
    activityLevel: number;
    sleepDuration: number;
  };
  recent: {
    restingHR: number;
    activityLevel: number;
    sleepDuration: number;
  };
  trends: {
    heartRate: { date: string; value: number }[];
    activity: { date: string; value: number }[];
    sleep: { date: string; value: number }[];
  };
  wearable: {
    heartRate: number[];
    steps: number[];
    sleep: number[];
  };
  alerts: {
    id: string;
    timestamp: string;
    message: string;
    severity: RiskTier;
  }[];
}

export interface PatientDetailResponse {
  id: string;
  name: string;
  riskScore: number;
  riskTier: RiskTier;
  lastSync: string;
  stats: PatientClinicianStats;
  detail: PatientDetail;
}

export interface PatientWithDetail extends Patient {
  detail: PatientDetail;
}

export interface PatientMetrics {
  restingHR: number;
  restingHRDelta: number;
  steps: number;
  stepsDelta: number;
  sleepHours: number;
  sleepDelta: number;
  lastSync: string;
  trend7d: { date: string; value: number }[];
  activity7d: { date: string; value: number }[];
}

export interface PatientProfile {
  id: string;
  name: string;
  metrics: PatientMetrics;
}

export interface PatientAppointment {
  id: string;
  type: 'Routine Checkup' | 'Emergency' | 'Follow-Up' | 'Rehab';
  title: string;
  provider: string;
  startAt: string;
  durationMinutes: number;
  status: 'confirmed' | 'upcoming';
  location: string;
}
