import { useEffect, useState } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

interface PatientSettingsState {
  notifications: boolean;
  reminders: boolean;
  units: 'imperial' | 'metric';
}

const SETTINGS_STORAGE_KEY = 'recoveriq_patient_settings';

const defaultSettings: PatientSettingsState = {
  notifications: true,
  reminders: true,
  units: 'imperial',
};

function loadSettings(): PatientSettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<PatientSettingsState>;
    return {
      notifications: parsed.notifications ?? defaultSettings.notifications,
      reminders: parsed.reminders ?? defaultSettings.reminders,
      units: parsed.units === 'metric' ? 'metric' : 'imperial',
    };
  } catch {
    return defaultSettings;
  }
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
      <span className="text-sm text-neutral-darkest">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export function PatientSettingsPanel() {
  const { profile, signOut } = useAuth();
  const [settings, setSettings] = useState<PatientSettingsState>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'settings'>('settings');

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <section className="flex h-full min-h-[620px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary-light px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">RecoverIQ</p>
        <p className="truncate text-sm font-medium text-neutral-darkest">{profile?.fullName ?? 'Patient'}</p>
      </div>

      <nav className="space-y-1">
        <button
          type="button"
          aria-label="Open settings"
          onClick={() => setActiveTab('settings')}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            activeTab === 'settings'
              ? 'bg-primary text-white'
              : 'text-neutral-darkest hover:bg-neutral-light'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </nav>

      {activeTab === 'settings' && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-neutral-light p-3">
            <p className="truncate text-xs text-neutral-mid">{profile?.email ?? 'No email on file'}</p>
          </div>

          <ToggleRow
            label="Notifications"
            checked={settings.notifications}
            onChange={(value) => setSettings((previous) => ({ ...previous, notifications: value }))}
          />
          <ToggleRow
            label="Appointment reminders"
            checked={settings.reminders}
            onChange={(value) => setSettings((previous) => ({ ...previous, reminders: value }))}
          />

          <label className="block text-sm text-neutral-mid">
            Units
            <select
              aria-label="Preferred units"
              value={settings.units}
              onChange={(event) =>
                setSettings((previous) => ({
                  ...previous,
                  units: event.target.value === 'metric' ? 'metric' : 'imperial',
                }))
              }
              className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="imperial">Imperial</option>
              <option value="metric">Metric</option>
            </select>
          </label>
        </div>
      )}

      <div className="mt-auto pt-4">
        <Button
          type="button"
          variant="secondary"
          aria-label="Sign out"
          onClick={() => void signOut()}
          className="w-full justify-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </section>
  );
}
