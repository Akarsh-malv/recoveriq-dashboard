import { OutreachTask } from '../../types/outreach';
import { formatDateTime } from '../../utils/date';

interface OutreachTaskQueueProps {
  tasks: OutreachTask[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

function getPriorityStyles(priority: OutreachTask['priority']): string {
  if (priority === 'high') return 'bg-danger/10 text-danger border-danger/20';
  if (priority === 'medium') return 'bg-warning/10 text-warning border-warning/20';
  return 'bg-primary-light text-primary border-primary/20';
}

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusLabel(status: OutreachTask['status']): string {
  if (status === 'in_progress') return 'In Progress';
  if (status === 'done') return 'Done';
  return 'Todo';
}

export function OutreachTaskQueue({ tasks, selectedTaskId, onSelectTask }: OutreachTaskQueueProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-neutral-darkest">Task Queue</h2>
        <p className="text-xs text-neutral-mid">{tasks.length} active follow-up items</p>
      </div>
      <div className="max-h-[620px] overflow-y-auto">
        {tasks.map((task) => {
          const selected = selectedTaskId === task.id;
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelectTask(task.id)}
              className={`w-full border-b border-gray-100 px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selected ? 'bg-primary-light' : 'hover:bg-neutral-light'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-neutral-darkest">{task.patientName}</p>
                  <p className="text-xs text-neutral-mid">D+{task.daysSinceDischarge}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityStyles(task.priority)}`}>
                  {toTitleCase(task.priority)}
                </span>
              </div>
              <p className="mt-2 truncate text-sm text-neutral-mid">{task.reason}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-neutral-mid">
                <span>{formatDateTime(task.dueAt)}</span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-600">
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
