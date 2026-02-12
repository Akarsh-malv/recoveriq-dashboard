export type RiskTier = 'low' | 'medium' | 'high';

export type AlertSeverity = 'low' | 'medium' | 'high';

export type UserRole = 'clinician' | 'patient';

export interface Program {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface Clinician {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface Patient {
  id: string;
  user_id?: string;
  full_name: string;
  patient_id: string;
  program_id: string;
  risk_score: number;
  risk_tier: RiskTier;
  last_data_sync: string;
  status: string;
  created_at: string;
  program?: Program;
  alerts?: Alert[];
  metrics?: Metric[];
}

export interface Metric {
  id: string;
  patient_id: string;
  metric_name: string;
  baseline_value: number;
  current_value: number;
  unit: string;
  recorded_at: string;
  created_at: string;
}

export interface Alert {
  id: string;
  patient_id: string;
  severity: AlertSeverity;
  message: string;
  metric_name: string;
  acknowledged: boolean;
  created_at: string;
}

export interface Note {
  id: string;
  patient_id: string;
  clinician_id: string;
  content: string;
  created_at: string;
  clinician?: Clinician;
}

export interface Task {
  id: string;
  patient_id: string;
  clinician_id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  due_date?: string;
  created_at: string;
}
