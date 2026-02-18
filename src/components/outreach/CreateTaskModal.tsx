import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { SeedPatient } from '../../mocks/seedPatients';
import { TaskPriority, TaskType } from '../../types/outreach';

interface CreateTaskModalProps {
  isOpen: boolean;
  patients: SeedPatient[];
  onClose: () => void;
  onCreate: (payload: {
    patientId: string;
    type: TaskType;
    priority: TaskPriority;
    dueAt: string;
    reason: string;
    notes: string;
  }) => void;
}

const defaultDueAt = () => {
  const date = new Date(Date.now() + 6 * 60 * 60 * 1000);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
};

export function CreateTaskModal({ isOpen, patients, onClose, onCreate }: CreateTaskModalProps) {
  const [patientSearch, setPatientSearch] = useState('');
  const [patientId, setPatientId] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('call');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueAtLocal, setDueAtLocal] = useState(defaultDueAt);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const filteredPatients = useMemo(() => {
    const query = patientSearch.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((patient) => patient.name.toLowerCase().includes(query));
  }, [patientSearch, patients]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const firstInput = modalRef.current?.querySelector<HTMLElement>('input,select,textarea,button');
    firstInput?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setPatientSearch('');
      setPatientId('');
      setTaskType('call');
      setPriority('medium');
      setDueAtLocal(defaultDueAt());
      setReason('');
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patientId || !reason.trim()) {
      return;
    }

    onCreate({
      patientId,
      type: taskType,
      priority,
      dueAt: new Date(dueAtLocal).toISOString(),
      reason: reason.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div ref={modalRef} className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-darkest">Create Task</h3>
          <button
            type="button"
            aria-label="Close create task modal"
            className="rounded-md p-1 text-neutral-mid hover:bg-neutral-light"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm text-neutral-mid">
            Search patient
            <input
              aria-label="Search patient list"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={patientSearch}
              onChange={(event) => setPatientSearch(event.target.value)}
              placeholder="Type patient name"
            />
          </label>

          <label className="block text-sm text-neutral-mid">
            Patient
            <select
              aria-label="Select patient"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              required
            >
              <option value="">Select patient</option>
              {filteredPatients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm text-neutral-mid">
              Task type
              <select
                aria-label="Task type"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={taskType}
                onChange={(event) => setTaskType(event.target.value as TaskType)}
              >
                <option value="call">Call</option>
                <option value="follow_up">Follow-up</option>
                <option value="med_review">Medication review</option>
                <option value="symptom_check">Symptom check</option>
              </select>
            </label>

            <label className="block text-sm text-neutral-mid">
              Priority
              <select
                aria-label="Task priority"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-neutral-mid">
            Due date/time
            <input
              aria-label="Task due datetime"
              type="datetime-local"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={dueAtLocal}
              onChange={(event) => setDueAtLocal(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm text-neutral-mid">
            Reason
            <textarea
              aria-label="Task reason"
              className="mt-1 min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Reason for outreach task"
              required
            />
          </label>

          <label className="block text-sm text-neutral-mid">
            Notes
            <textarea
              aria-label="Task notes"
              className="mt-1 min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-neutral-mid hover:bg-neutral-light"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
