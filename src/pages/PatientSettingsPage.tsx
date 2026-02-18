import { useEffect, useState } from 'react';

interface PatientSettingsPageProps {
  profile: {
    fullName: string;
    email: string;
  };
}

interface PatientSettingsState {
  notifications: boolean;
  reminders: boolean;
  units: 'imperial' | 'metric';
}

const STORAGE_KEY = 'recoveriq_patient_settings';

const defaultSettings: PatientSettingsState = {
  notifications: true,
  reminders: true,
  units: 'imperial',
};

function loadSettings(): PatientSettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

function ToggleField({
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

export function PatientSettingsPage({ profile }: PatientSettingsPageProps) {
  const [settings, setSettings] = useState<PatientSettingsState>(defaultSettings);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <main className="h-full overflow-auto bg-neutral-light">
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <header className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold text-neutral-darkest">Settings</h1>
          <p className="mt-1 text-sm text-neutral-mid">Manage basic patient preferences for your workspace.</p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-darkest">Profile</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-neutral-light p-3">
              <p className="text-xs text-neutral-mid">Name</p>
              <p className="text-sm font-medium text-neutral-darkest">{profile.fullName || 'Patient'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-neutral-light p-3">
              <p className="text-xs text-neutral-mid">Email</p>
              <p className="text-sm font-medium text-neutral-darkest">{profile.email || 'No email on file'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-darkest">Preferences</h2>
          <div className="mt-3 space-y-3">
            <ToggleField
              label="Notifications"
              checked={settings.notifications}
              onChange={(value) => setSettings((previous) => ({ ...previous, notifications: value }))}
            />
            <ToggleField
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
        </section>
      </div>
    </main>
  );
}
