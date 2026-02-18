import { useEffect, useState } from 'react';
import { OutreachTask, TaskOutcome, TaskStatus } from '../../types/outreach';
import { formatDateTime, fromDateTimeLocalInputValue, toDateTimeLocalInputValue } from '../../utils/date';

interface OutreachTaskDetailProps {
  task: OutreachTask | null;
  onUpdateTask: (taskId: string, patch: Partial<OutreachTask>) => void;
  onMarkComplete: (taskId: string) => void;
  onEscalate: (taskId: string) => void;
  onReschedule: (taskId: string, dueAt: string) => void;
}

const fieldClassName =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-neutral-mid focus:outline-none focus:ring-2 focus:ring-primary';

function getDeltaText(value: number): string {
  return `${value >= 0 ? '+' : ''}${Math.round(value)}%`;
}

function getStatusLabel(status: TaskStatus): string {
  if (status === 'in_progress') return 'In Progress';
  if (status === 'done') return 'Done';
  return 'Todo';
}

export function OutreachTaskDetail({
  task,
  onUpdateTask,
  onMarkComplete,
  onEscalate,
  onReschedule,
}: OutreachTaskDetailProps) {
  const [dueAtDraft, setDueAtDraft] = useState('');

  useEffect(() => {
    if (!task) {
      setDueAtDraft('');
      return;
    }
    setDueAtDraft(toDateTimeLocalInputValue(task.dueAt));
  }, [task]);

  if (!task) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-darkest">Task Detail</h2>
        <p className="mt-6 text-sm text-neutral-mid">Select a task from the queue to review outreach context and update disposition.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-neutral-darkest">Task Detail</h2>
      <div className="mt-4 border-b border-gray-200 pb-4">
        <p className="text-lg font-semibold text-neutral-darkest">{task.patientName}</p>
        <p className="text-xs text-neutral-mid">
          {task.patientId} | D+{task.daysSinceDischarge} | Due {formatDateTime(task.dueAt)}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-mid">Reason</p>
        <p className="mt-1 text-sm text-neutral-mid">{task.reason}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-neutral-mid">Recovery Priority Score (RPS)</p>
          <p className="text-lg font-semibold text-neutral-darkest">{Math.round(task.patientSnapshot.riskScore)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-neutral-mid">Resting HR</p>
          <p className="text-lg font-semibold text-neutral-darkest">
            {Math.round(task.patientSnapshot.restingHRCurrent)} bpm
          </p>
          <p className="text-xs text-neutral-mid">{getDeltaText(task.patientSnapshot.restingHRDelta)} vs baseline</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-neutral-mid">Steps</p>
          <p className="text-lg font-semibold text-neutral-darkest">{Math.round(task.patientSnapshot.stepsCurrent).toLocaleString()}</p>
          <p className="text-xs text-neutral-mid">{getDeltaText(task.patientSnapshot.stepsDelta)} vs baseline</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-neutral-mid">Sleep</p>
          <p className="text-lg font-semibold text-neutral-darkest">{Math.round(task.patientSnapshot.sleepCurrent)} hrs</p>
          <p className="text-xs text-neutral-mid">{getDeltaText(task.patientSnapshot.sleepDelta)} vs baseline</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm text-neutral-mid">
          Status
          <select
            aria-label="Task status"
            className={`${fieldClassName} mt-1`}
            value={task.status}
            onChange={(event) => onUpdateTask(task.id, { status: event.target.value as TaskStatus })}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="text-sm text-neutral-mid">
          Outcome
          <select
            aria-label="Task outcome"
            className={`${fieldClassName} mt-1`}
            value={task.outcome}
            onChange={(event) => onUpdateTask(task.id, { outcome: event.target.value as TaskOutcome })}
          >
            <option value="none">None</option>
            <option value="reached">Reached</option>
            <option value="left_vm">Left VM</option>
            <option value="escalated">Escalated</option>
            <option value="scheduled_followup">Scheduled Follow-up</option>
            <option value="no_answer">No Answer</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block text-sm text-neutral-mid">
        Notes
        <textarea
          aria-label="Task notes"
          className={`${fieldClassName} mt-1 min-h-24 resize-y`}
          value={task.notes}
          onChange={(event) => onUpdateTask(task.id, { notes: event.target.value })}
        />
      </label>

      <label className="mt-3 block text-sm text-neutral-mid">
        Due date/time
        <input
          aria-label="Task due date"
          type="datetime-local"
          className={`${fieldClassName} mt-1`}
          value={dueAtDraft}
          onChange={(event) => setDueAtDraft(event.target.value)}
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          aria-label="Mark outreach task complete"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => onMarkComplete(task.id)}
        >
          Mark Complete
        </button>
        <button
          type="button"
          aria-label="Escalate outreach task to clinician"
          className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          onClick={() => onEscalate(task.id)}
        >
          Escalate to Clinician
        </button>
        <button
          type="button"
          aria-label="Reschedule outreach task"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-neutral-mid hover:bg-neutral-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => onReschedule(task.id, fromDateTimeLocalInputValue(dueAtDraft))}
        >
          Reschedule
        </button>
      </div>

      <p className="mt-3 text-xs text-neutral-mid">Current status: {getStatusLabel(task.status)}</p>
    </div>
  );
}
