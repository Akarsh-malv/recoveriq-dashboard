import { TaskPriority, TaskStatus } from '../../types/outreach';

export type DueFilter = 'all' | 'due_today' | 'overdue' | 'upcoming';

interface OutreachFilterBarProps {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  due: DueFilter;
  onStatusChange: (value: TaskStatus | 'all') => void;
  onPriorityChange: (value: TaskPriority | 'all') => void;
  onDueChange: (value: DueFilter) => void;
}

const selectClassName =
  'h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-neutral-mid focus:outline-none focus:ring-2 focus:ring-primary';

export function OutreachFilterBar({
  status,
  priority,
  due,
  onStatusChange,
  onPriorityChange,
  onDueChange,
}: OutreachFilterBarProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-3">

        <select
          aria-label="Filter by status"
          className={selectClassName}
          value={status}
          onChange={(event) => onStatusChange(event.target.value as TaskStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          aria-label="Filter by priority"
          className={selectClassName}
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as TaskPriority | 'all')}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          aria-label="Filter by due date"
          className={selectClassName}
          value={due}
          onChange={(event) => onDueChange(event.target.value as DueFilter)}
        >
          <option value="all">All Due</option>
          <option value="due_today">Due Today</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );
}
