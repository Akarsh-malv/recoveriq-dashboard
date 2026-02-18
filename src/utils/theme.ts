export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'recoveriq_theme';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function getStoredTheme(): ThemeMode | null {
  const raw = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(raw) ? raw : null;
}

export function resolveInitialTheme(): ThemeMode {
  const stored = getStoredTheme();
  if (stored) return stored;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(mode: ThemeMode): void {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem(THEME_STORAGE_KEY, mode);
}

export function initializeTheme(): ThemeMode {
  const mode = resolveInitialTheme();
  applyTheme(mode);
  return mode;
}

