import { getDefaultSettings, SettingsState } from '../types/settings';

const SETTINGS_STORAGE_KEY = 'recoveriq:settings:v1';

export function loadSettings(): SettingsState {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return getDefaultSettings();
    }

    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return {
      ...getDefaultSettings(),
      ...parsed,
      profile: { ...getDefaultSettings().profile, ...parsed.profile },
      workspace: { ...getDefaultSettings().workspace, ...parsed.workspace },
      notifications: { ...getDefaultSettings().notifications, ...parsed.notifications },
      integrations: { ...getDefaultSettings().integrations, ...parsed.integrations },
      security: { ...getDefaultSettings().security, ...parsed.security },
      appearance: { ...getDefaultSettings().appearance, ...parsed.appearance },
      privacy: { ...getDefaultSettings().privacy, ...parsed.privacy },
    };
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(state: SettingsState): void {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
}

export function resetSettings(): SettingsState {
  const defaults = getDefaultSettings();
  saveSettings(defaults);
  return defaults;
}
