import { Home, LogOut, MessageSquare, Settings } from 'lucide-react';
import { RecoverIQLogo } from './common/RecoverIQLogo';

interface PatientNavProps {
  currentView: 'home' | 'assistant' | 'settings';
  onNavigate: (view: 'home' | 'assistant' | 'settings') => void;
  onLogout: () => void;
  patientName?: string;
}

export function PatientNav({ currentView, onNavigate, onLogout, patientName }: PatientNavProps) {
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'assistant', label: 'Assistant', icon: MessageSquare },
  ] as const;
  const secondaryNavItems = [{ id: 'settings', label: 'Settings', icon: Settings }] as const;

  return (
    <aside className="w-full border-b border-gray-200 bg-neutral-light md:h-screen md:w-72 md:border-r md:border-b-0">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3">
            <RecoverIQLogo size="sm" />
            <div>
              <h1 className="text-xl font-semibold text-neutral-darkest">RecoverIQ</h1>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-neutral-mid">Patient Workspace</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col p-3 md:p-4">
          <ul className="flex gap-2 overflow-x-auto md:block md:space-y-2">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id} className="shrink-0">
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors md:py-3 ${
                      isActive ? 'bg-primary-light text-primary' : 'text-neutral-darkest hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-neutral-mid'}`} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <ul className="mt-4 border-t border-gray-200 pt-4 md:mt-auto">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-light text-primary' : 'text-neutral-darkest hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-neutral-mid'}`} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden border-t border-gray-200 p-4 md:block">
          <div className="mb-2 rounded-xl border border-gray-200 bg-white p-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-white">
                {(patientName || 'Patient').charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-darkest">{patientName || 'Patient'}</p>
                <p className="text-xs text-neutral-mid">Patient</p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-neutral-darkest hover:bg-neutral-light"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-3 md:hidden">
          <p className="truncate text-sm font-medium text-neutral-darkest">{patientName || 'Patient'}</p>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-neutral-darkest"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
