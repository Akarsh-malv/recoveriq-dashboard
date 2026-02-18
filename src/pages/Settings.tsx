import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../components/common/Modal';
import { Toast } from '../components/common/Toast';
import { SettingsActionsBar } from '../components/settings/SettingsActionsBar';
import { SettingsSection } from '../components/settings/SettingsSection';
import { SettingsShell } from '../components/settings/SettingsShell';
import { NumberField } from '../components/settings/fields/NumberField';
import { SelectField } from '../components/settings/fields/SelectField';
import { TextField } from '../components/settings/fields/TextField';
import { ToggleField } from '../components/settings/fields/ToggleField';
import { SettingsSectionId, SettingsState, getDefaultSettings } from '../types/settings';
import { loadSettings, resetSettings, saveSettings } from '../utils/settingsStorage';

interface ValidationErrors {
  workEmail?: string;
  phone?: string;
  workspaceName?: string;
  password?: string;
}

interface PasswordDraft {
  current: string;
  next: string;
  confirm: string;
}

interface SettingsPageProps {
  profile: {
    fullName: string;
    email: string;
    roleLabel: string;
  };
}

const sections: Array<{ id: SettingsSectionId; label: string }> = [
  { id: 'profile', label: 'Profile' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'privacy', label: 'Data & Privacy' },
];

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhoneValid(value: string): boolean {
  return /^[+]?[\d\s\-()]{7,20}$/.test(value);
}

function applyProfileToSettings(state: SettingsState, profile: SettingsPageProps['profile']): SettingsState {
  return {
    ...state,
    profile: {
      ...state.profile,
      fullName: profile.fullName || state.profile.fullName,
      workEmail: profile.email || state.profile.workEmail,
      role: profile.roleLabel || state.profile.role,
    },
  };
}

export function SettingsPage({ profile }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('profile');
  const [settings, setSettings] = useState<SettingsState>(getDefaultSettings());
  const [lastSavedSettings, setLastSavedSettings] = useState<SettingsState>(getDefaultSettings());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [savedToastOpen, setSavedToastOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState<PasswordDraft>({
    current: '',
    next: '',
    confirm: '',
  });

  useEffect(() => {
    const loaded = loadSettings();
    const next = applyProfileToSettings(loaded, profile);
    setSettings(next);
    setLastSavedSettings(next);
  }, [profile]);

  const dirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(lastSavedSettings), [settings, lastSavedSettings]);
  const timeZoneOptions = useMemo(
    () =>
      Array.from(
        new Set([
          settings.profile.timeZone,
          'America/New_York',
          'America/Chicago',
          'America/Denver',
          'America/Los_Angeles',
          'UTC',
        ])
      ).map((value) => ({ value, label: value })),
    [settings.profile.timeZone]
  );

  const validate = (section?: SettingsSectionId): ValidationErrors => {
    const nextErrors: ValidationErrors = {};

    if (!section || section === 'profile') {
      if (!isEmailValid(settings.profile.workEmail)) {
        nextErrors.workEmail = 'Enter a valid work email address.';
      }
      if (settings.profile.phone.trim() && !isPhoneValid(settings.profile.phone.trim())) {
        nextErrors.phone = 'Phone number format is invalid.';
      }
    }

    if (!section || section === 'workspace') {
      if (!settings.workspace.workspaceName.trim()) {
        nextErrors.workspaceName = 'Workspace name is required.';
      }
    }

    return nextErrors;
  };

  const saveCurrentSettings = (section?: SettingsSectionId) => {
    const validationErrors = validate(section);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    saveSettings(settings);
    setLastSavedSettings(settings);
    setSavedToastOpen(true);
    window.setTimeout(() => setSavedToastOpen(false), 1500);
  };

  const cancelCurrentChanges = () => {
    setSettings(lastSavedSettings);
    setErrors({});
  };

  const validatePasswordChange = (): boolean => {
    if (!passwordDraft.current && !passwordDraft.next && !passwordDraft.confirm) {
      return true;
    }
    if (passwordDraft.next.length < 8) {
      setErrors((previous) => ({ ...previous, password: 'New password must be at least 8 characters.' }));
      return false;
    }
    if (passwordDraft.next !== passwordDraft.confirm) {
      setErrors((previous) => ({ ...previous, password: 'Password confirmation does not match.' }));
      return false;
    }

    setErrors((previous) => ({ ...previous, password: undefined }));
    setPasswordDraft({ current: '', next: '', confirm: '' });
    setSavedToastOpen(true);
    window.setTimeout(() => setSavedToastOpen(false), 1500);
    return true;
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'recoveriq-settings.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-auto bg-neutral-light">
      <Toast open={savedToastOpen} message="Saved" />
      <div className="mx-auto max-w-7xl space-y-4 p-6">
        <header className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-neutral-darkest">Settings</h1>
          <p className="mt-1 text-sm text-neutral-mid">Manage your workspace, notifications, and security preferences.</p>
        </header>

        <SettingsShell activeSection={activeSection} sections={sections} onSectionChange={setActiveSection}>
          {activeSection === 'profile' && (
            <SettingsSection id="profile" title="Profile" description="Clinician identity and default note template.">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <TextField
                  label="Full Name"
                  value={settings.profile.fullName}
                  onChange={(value) => setSettings((previous) => ({ ...previous, profile: { ...previous.profile, fullName: value } }))}
                />
                <TextField label="Role" value={settings.profile.role} onChange={() => undefined} readOnly />
                <TextField
                  label="Work Email"
                  type="email"
                  value={settings.profile.workEmail}
                  error={errors.workEmail}
                  onChange={(value) => setSettings((previous) => ({ ...previous, profile: { ...previous.profile, workEmail: value } }))}
                />
                <TextField
                  label="Phone (Optional)"
                  type="tel"
                  value={settings.profile.phone}
                  error={errors.phone}
                  onChange={(value) => setSettings((previous) => ({ ...previous, profile: { ...previous.profile, phone: value } }))}
                />
              </div>
              <SelectField
                label="Time Zone"
                value={settings.profile.timeZone}
                options={timeZoneOptions}
                onChange={(value) => setSettings((previous) => ({ ...previous, profile: { ...previous.profile, timeZone: value } }))}
              />
            </SettingsSection>
          )}

          {activeSection === 'workspace' && (
            <SettingsSection id="workspace" title="Workspace" description="Default views and operational risk bands.">
              <TextField
                label="Workspace Name"
                value={settings.workspace.workspaceName}
                error={errors.workspaceName}
                onChange={(value) => setSettings((previous) => ({ ...previous, workspace: { ...previous.workspace, workspaceName: value } }))}
              />
              <SelectField
                label="Default Patient List View"
                value={settings.workspace.defaultPatientListView}
                options={[
                  { value: 'triage', label: 'Triage' },
                  { value: 'all_patients', label: 'All Patients' },
                ]}
                onChange={(value) =>
                  setSettings((previous) => ({ ...previous, workspace: { ...previous.workspace, defaultPatientListView: value } }))
                }
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <NumberField
                  label="High Risk Minimum"
                  value={settings.workspace.highRiskMin}
                  min={0}
                  max={100}
                  helperText="Used for visual categorization only."
                  onChange={(value) => setSettings((previous) => ({ ...previous, workspace: { ...previous.workspace, highRiskMin: value } }))}
                />
                <NumberField
                  label="Medium Risk Minimum"
                  value={settings.workspace.mediumRiskMin}
                  min={0}
                  max={100}
                  helperText="Used for visual categorization only."
                  onChange={(value) =>
                    setSettings((previous) => ({ ...previous, workspace: { ...previous.workspace, mediumRiskMin: value } }))
                  }
                />
              </div>
            </SettingsSection>
          )}

          {activeSection === 'notifications' && (
            <SettingsSection id="notifications" title="Notifications" description="Alert delivery and quiet-hour controls.">
              <ToggleField
                label="Email Alerts"
                checked={settings.notifications.emailAlerts}
                onChange={(checked) =>
                  setSettings((previous) => ({ ...previous, notifications: { ...previous.notifications, emailAlerts: checked } }))
                }
              />
              <ToggleField
                label="In-App Alerts"
                checked={settings.notifications.inAppAlerts}
                onChange={(checked) =>
                  setSettings((previous) => ({ ...previous, notifications: { ...previous.notifications, inAppAlerts: checked } }))
                }
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <SelectField
                  label="Notify On"
                  value={settings.notifications.notifyOn}
                  options={[
                    { value: 'high_only', label: 'High Risk Only' },
                    { value: 'high_medium', label: 'High + Medium' },
                  ]}
                  onChange={(value) =>
                    setSettings((previous) => ({ ...previous, notifications: { ...previous.notifications, notifyOn: value } }))
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <TextField
                  label="Quiet Hours Start"
                  type="time"
                  value={settings.notifications.quietHoursStart}
                  onChange={(value) =>
                    setSettings((previous) => ({ ...previous, notifications: { ...previous.notifications, quietHoursStart: value } }))
                  }
                />
                <TextField
                  label="Quiet Hours End"
                  type="time"
                  value={settings.notifications.quietHoursEnd}
                  onChange={(value) =>
                    setSettings((previous) => ({ ...previous, notifications: { ...previous.notifications, quietHoursEnd: value } }))
                  }
                />
              </div>
            </SettingsSection>
          )}

          {activeSection === 'security' && (
            <SettingsSection id="security" title="Security" description="Credentials, 2FA, and session controls.">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <TextField
                  label="Current Password"
                  type="password"
                  value={passwordDraft.current}
                  onChange={(value) => setPasswordDraft((previous) => ({ ...previous, current: value }))}
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={passwordDraft.next}
                  onChange={(value) => setPasswordDraft((previous) => ({ ...previous, next: value }))}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={passwordDraft.confirm}
                  onChange={(value) => setPasswordDraft((previous) => ({ ...previous, confirm: value }))}
                  error={errors.password}
                />
              </div>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-neutral-mid hover:bg-neutral-light"
                onClick={validatePasswordChange}
              >
                Update Password
              </button>
              <ToggleField
                label="Two-Factor Authentication"
                checked={settings.security.twoFactorEnabled}
                onChange={(checked) =>
                  setSettings((previous) => ({ ...previous, security: { ...previous.security, twoFactorEnabled: checked } }))
                }
              />
              <SelectField
                label="Session Timeout"
                value={settings.security.sessionTimeout}
                options={[
                  { value: '15m', label: '15m' },
                  { value: '30m', label: '30m' },
                  { value: '1h', label: '1h' },
                  { value: '4h', label: '4h' },
                ]}
                onChange={(value) =>
                  setSettings((previous) => ({ ...previous, security: { ...previous.security, sessionTimeout: value } }))
                }
              />
              <button
                type="button"
                className="rounded-md border border-danger/40 px-3 py-2 text-sm text-danger hover:bg-danger/10"
                onClick={() => setShowSignOutModal(true)}
              >
                Sign Out of All Sessions
              </button>
            </SettingsSection>
          )}


          {activeSection === 'privacy' && (
            <SettingsSection id="privacy" title="Data & Privacy" description="Retention, export, and workspace reset controls.">
              <SelectField
                label="Data Retention"
                value={settings.privacy.dataRetention}
                helperText="Longer retention improves trend context but keeps data longer."
                options={[
                  { value: '30d', label: '30d' },
                  { value: '90d', label: '90d' },
                  { value: '180d', label: '180d' },
                  { value: '1y', label: '1y' },
                ]}
                onChange={(value) => setSettings((previous) => ({ ...previous, privacy: { ...previous.privacy, dataRetention: value } }))}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-neutral-mid hover:bg-neutral-light"
                  onClick={exportSettings}
                >
                  Export My Settings
                </button>
                <button
                  type="button"
                  className="rounded-md border border-danger/40 px-3 py-2 text-sm text-danger hover:bg-danger/10"
                  onClick={() => setShowResetModal(true)}
                >
                  Reset to Defaults
                </button>
              </div>
              <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-neutral-darkest">
                This application provides trend-based decision support and does not diagnose medical conditions.
              </div>
            </SettingsSection>
          )}
        </SettingsShell>

        <SettingsActionsBar dirty={dirty} saved={savedToastOpen} onCancel={cancelCurrentChanges} onSave={() => saveCurrentSettings()} />
      </div>

      <Modal
        open={showSignOutModal}
        title="Sign out of all sessions?"
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false);
          setSavedToastOpen(true);
          window.setTimeout(() => setSavedToastOpen(false), 1500);
        }}
        confirmLabel="Sign Out"
      >
        This is a simulated action. You will remain signed in on this device in demo mode.
      </Modal>

      <Modal
        open={showResetModal}
        title="Reset settings to defaults?"
        tone="danger"
        onClose={() => setShowResetModal(false)}
        onConfirm={() => {
          const defaults = resetSettings();
          setSettings(defaults);
          setLastSavedSettings(defaults);
          setShowResetModal(false);
          setSavedToastOpen(true);
          window.setTimeout(() => setSavedToastOpen(false), 1500);
        }}
        confirmLabel="Reset"
      >
        This will overwrite current preferences with the default workspace configuration.
      </Modal>
    </div>
  );
}
