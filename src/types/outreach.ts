export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskOutcome = 'reached' | 'left_vm' | 'escalated' | 'scheduled_followup' | 'no_answer' | 'none';
export type TaskType = 'call' | 'follow_up' | 'med_review' | 'symptom_check';

export interface OutreachTaskSnapshot {
  riskScore: number;
  restingHRCurrent: number;
  restingHRDelta: number;
  stepsCurrent: number;
  stepsDelta: number;
  sleepCurrent: number;
  sleepDelta: number;
}

export interface OutreachTask {
  id: string;
  patientId: string;
  patientName: string;
  daysSinceDischarge: number;
  priority: TaskPriority;
  status: TaskStatus;
  outcome: TaskOutcome;
  type: TaskType;
  reason: string;
  dueAt: string;
  createdAt: string;
  lastUpdatedAt: string;
  notes: string;
  patientSnapshot: OutreachTaskSnapshot;
}
