export const MODES = {
  focus: { label: 'TU MOMENTO DE ENFOQUE', caption: 'minutos para concentrarte' },
  short: { label: 'UN RESPIRO PARA TI', caption: 'minutos para descansar' },
  long: { label: 'UNA PAUSA MÁS LARGA', caption: 'minutos para recargar' },
};

export function durationFor(mode, settings, sessionIndex = 0) {
  const minutes = mode === 'focus'
    ? settings.focusDurations?.[sessionIndex] ?? settings.focusDurations?.[0] ?? settings.focus ?? 25
    : settings[mode];
  return minutes * 60;
}

export function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
}
