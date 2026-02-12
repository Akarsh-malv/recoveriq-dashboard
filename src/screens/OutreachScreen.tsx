import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../components/Button';

type TaskStatus = 'new' | 'in_progress' | 'completed';

interface Task {
  id: string;
  title: string;
  patient: string;
  status: TaskStatus;
}

export function OutreachScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ title: string; patient: string; status: TaskStatus }>({
    title: '',
    patient: '',
    status: 'new',
  });

  const addTask = () => {
    if (!form.title || !form.patient) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
    setForm({ title: '', patient: '', status: 'new' });
    setOpen(false);
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Outreach</h1>
          <p className="text-sm text-gray-600">Create and manage outreach tasks</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create task
        </Button>
      </div>

      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Task</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-600" colSpan={3}>
                    No outreach tasks yet
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{task.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{task.patient}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full border bg-gray-50 text-gray-700">
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create outreach task</h3>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Schedule follow-up call"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Patient</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.patient}
                  onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))}
                  placeholder="Sarah Johnson"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={addTask}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
