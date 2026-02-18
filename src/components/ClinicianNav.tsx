import { LayoutDashboard, Users, Bell, Settings, LogOut, PhoneCall } from 'lucide-react';
import { RecoverIQLogo } from './common/RecoverIQLogo';

interface ClinicianNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  clinicianName?: string;
}

export function ClinicianNav({ currentView, onNavigate, onLogout, clinicianName }: ClinicianNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'outreach', label: 'Follow-Ups', icon: PhoneCall },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex w-full flex-col border-b border-gray-200 bg-neutral-light md:h-screen md:w-72 md:border-r md:border-b-0">
      <div className="border-b border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <RecoverIQLogo size="sm" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">RecoverIQ</h1>
            <p className="text-xs uppercase tracking-wide text-gray-500 mt-0.5">Clinical Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 md:p-4">
        <ul className="flex gap-2 overflow-x-auto md:block md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors md:py-3 ${
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-neutral-darkest hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-neutral-mid'}`} />
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
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-semibold">
              {(clinicianName || 'Clinician').charAt(0).toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {clinicianName || 'Clinician'}
            </p>
              <p className="text-xs text-gray-500">Clinical Staff</p>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-neutral-darkest border border-gray-300 hover:bg-neutral-light rounded-xl bg-white"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 p-3 md:hidden">
        <p className="truncate text-sm font-medium text-neutral-darkest">{clinicianName || 'Clinician'}</p>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-neutral-darkest"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
