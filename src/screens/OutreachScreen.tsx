import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { seedPatients } from '../mocks/seedPatients';
import { generateAlertsFromPatients } from '../utils/alertGenerator';
import { generateOutreachTasks } from '../utils/outreachGenerator';
import { OutreachTask, TaskPriority, TaskStatus, TaskType } from '../types/outreach';
import { isDueToday, isOverdue } from '../utils/date';
import { OutreachSummaryStrip } from '../components/outreach/OutreachSummaryStrip';
import { DueFilter, OutreachFilterBar } from '../components/outreach/OutreachFilterBar';
import { OutreachTaskQueue } from '../components/outreach/OutreachTaskQueue';
import { OutreachTaskDetail } from '../components/outreach/OutreachTaskDetail';
import { CreateTaskModal } from '../components/outreach/CreateTaskModal';

export function OutreachScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [dueFilter, setDueFilter] = useState<DueFilter>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [tasks, setTasks] = useState<OutreachTask[]>(() =>
    generateOutreachTasks(seedPatients, generateAlertsFromPatients(seedPatients))
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const summary = useMemo(
    () => ({
      dueToday: Math.round(tasks.filter((task) => task.status !== 'done' && isDueToday(task.dueAt)).length),
      overdue: Math.round(tasks.filter((task) => task.status !== 'done' && isOverdue(task.dueAt)).length),
      highPriority: Math.round(tasks.filter((task) => task.priority === 'high').length),
      completed: Math.round(tasks.filter((task) => task.status === 'done').length),
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = task.patientName.toLowerCase().includes(search.trim().toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesDue =
          dueFilter === 'all' ||
          (dueFilter === 'due_today' && task.status !== 'done' && isDueToday(task.dueAt)) ||
          (dueFilter === 'overdue' && task.status !== 'done' && isOverdue(task.dueAt)) ||
          (dueFilter === 'upcoming' && !isOverdue(task.dueAt) && !isDueToday(task.dueAt));

        return matchesSearch && matchesStatus && matchesPriority && matchesDue;
      })
      .sort((a, b) => {
        const priorityRank: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
        const byPriority = priorityRank[b.priority] - priorityRank[a.priority];
        if (byPriority !== 0) return byPriority;
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      });
  }, [tasks, search, statusFilter, priorityFilter, dueFilter]);

  useEffect(() => {
    if (selectedTaskId && !filteredTasks.some((task) => task.id === selectedTaskId)) {
      setSelectedTaskId(null);
    }
  }, [filteredTasks, selectedTaskId]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId((current) => (current === taskId ? null : taskId));
  };

  const updateTask = (taskId: string, patch: Partial<OutreachTask>) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, ...patch, lastUpdatedAt: new Date().toISOString() } : task
      )
    );
  };

  const handleMarkComplete = (taskId: string) => {
    updateTask(taskId, { status: 'done', outcome: 'reached' });
    setSelectedTaskId(null);
  };

  const handleEscalate = (taskId: string) => {
    const task = tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    const updatedNotes = task.notes ? `[Escalated] ${task.notes}` : '[Escalated] Requires clinician review.';
    updateTask(taskId, { status: 'in_progress', outcome: 'escalated', notes: updatedNotes });
  };

  const handleReschedule = (taskId: string, dueAt: string) => {
    updateTask(taskId, { dueAt });
  };

  const handleCreateTask = (payload: {
    patientId: string;
    type: TaskType;
    priority: TaskPriority;
    dueAt: string;
    reason: string;
    notes: string;
  }) => {
    const patient = seedPatients.find((entry) => entry.id === payload.patientId);
    if (!patient) return;

    const daysSinceDischarge = Math.max(
      0,
      Math.floor((Date.now() - new Date(patient.dischargeDate).getTime()) / (1000 * 60 * 60 * 24))
    );

    const newTask: OutreachTask = {
      id: `outreach-${crypto.randomUUID()}`,
      patientId: patient.id,
      patientName: patient.name,
      daysSinceDischarge,
      priority: payload.priority,
      status: 'todo',
      outcome: 'none',
      type: payload.type,
      reason: payload.reason,
      dueAt: payload.dueAt,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      notes: payload.notes,
      patientSnapshot: {
        riskScore: Math.round(patient.riskScore),
        restingHRCurrent: Math.round(patient.metrics.restingHR.current),
        restingHRDelta: Math.round(patient.metrics.restingHR.percentChange),
        stepsCurrent: Math.round(patient.metrics.steps.current),
        stepsDelta: Math.round(patient.metrics.steps.percentChange),
        sleepCurrent: Math.round(patient.metrics.sleep.current),
        sleepDelta: Math.round(patient.metrics.sleep.percentChange),
      },
    };

    setTasks((current) => [newTask, ...current]);
    setSelectedTaskId(newTask.id);
  };

  return (
    <div className="h-full overflow-auto bg-neutral-light">
      <div className="mx-auto max-w-7xl space-y-4 p-6">
        <header className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-neutral-mid">What follow-up are you working on?</p>
              <h1 className="text-2xl font-semibold text-neutral-darkest">Follow-Ups</h1>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-mid" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search patient..."
                  className="h-10 w-60 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create Task
              </button>
            </div>
          </div>
        </header>

        <OutreachSummaryStrip
          dueToday={summary.dueToday}
          overdue={summary.overdue}
          highPriority={summary.highPriority}
          completed={summary.completed}
        />

        <OutreachFilterBar
          status={statusFilter}
          priority={priorityFilter}
          due={dueFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onDueChange={setDueFilter}
        />

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-darkest">No outreach tasks yet</h2>
            <p className="mt-2 text-sm text-neutral-mid">Tip: Create tasks from Alerts or prioritize D+0-7 patients.</p>
            <button
              type="button"
              className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              onClick={() => setCreateOpen(true)}
            >
              Create first task
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-darkest">No tasks match these filters.</h2>
          </div>
        ) : selectedTask ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_1fr]">
            <OutreachTaskQueue
              tasks={filteredTasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={handleSelectTask}
            />
            <OutreachTaskDetail
              task={selectedTask}
              onUpdateTask={updateTask}
              onMarkComplete={handleMarkComplete}
              onEscalate={handleEscalate}
              onReschedule={handleReschedule}
            />
          </div>
        ) : (
          <OutreachTaskQueue
            tasks={filteredTasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={handleSelectTask}
          />
        )}
      </div>

      <CreateTaskModal
        isOpen={createOpen}
        patients={seedPatients}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}
