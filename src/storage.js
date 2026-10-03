const STORAGE_KEY = 'brota-pomodoro-v1';

export const DEFAULT_SETTINGS = {
  focusDurations: Array(8).fill(25),
  short: 5,
  long: 15,
  cycle: 4,
  color: 'sage',
  sound: true,
  notifications: false,
};

const DEFAULT_STATE = {
  settings: DEFAULT_SETTINGS,
  completed: 0,
  sessionsToday: 0,
  date: new Date().toLocaleDateString('en-CA'),
  timer: null,
};

function boundedInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback));
}

function migrateSettings(savedSettings = {}) {
  const cycle = boundedInteger(savedSettings.cycle, 2, 8, DEFAULT_SETTINGS.cycle);
  const legacyFocus = boundedInteger(savedSettings.focus, 1, 180, 25);
  const savedDurations = Array.isArray(savedSettings.focusDurations)
    ? savedSettings.focusDurations
    : [];

  const settings = {
    ...DEFAULT_SETTINGS,
    ...savedSettings,
    cycle,
    focusDurations: Array.from({ length: 8 }, (_, index) =>
      boundedInteger(savedDurations[index], 1, 180, legacyFocus),
    ),
  };
  delete settings.focus;
  return settings;
}

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return structuredClone(DEFAULT_STATE);
    const today = new Date().toLocaleDateString('en-CA');
    return {
      ...DEFAULT_STATE,
      ...saved,
      settings: migrateSettings(saved.settings),
      completed: Math.max(0, Number(saved.completed) || 0),
      sessionsToday: saved.date === today ? Math.max(0, Number(saved.sessionsToday) || 0) : 0,
      date: today,
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The timer remains usable when browser storage is unavailable.
  }
}
