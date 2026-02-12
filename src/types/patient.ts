export type RiskTier = 'low' | 'medium' | 'high';

export interface Patient {
  id: string;
  name: string;
  age: number;
  dischargeDate: string;
  riskScore: number;
  riskTier: RiskTier;
  lastSync: string;
  drivers: string[];
}

export interface PatientDetail {
  baseline: {
    restingHR: number;
    activityLevel: number;
  };
  recent: {
    restingHR: number;
    activityLevel: number;
  };
  trends: {
    heartRate: { date: string; value: number }[];
    activity: { date: string; value: number }[];
  };
  alerts: {
    id: string;
    timestamp: string;
    message: string;
    severity: RiskTier;
  }[];
}

export interface PatientWithDetail extends Patient {
  detail: PatientDetail;
}
