export const ALARMS = [
  { id: 'bells', name: 'Campanas', description: 'Un tintineo alegre y claro' },
  { id: 'flute', name: 'Flauta', description: 'Una pequeña melodía ascendente' },
  { id: 'melody', name: 'Melodía', description: 'Un aviso musical de varias notas' },
];

export const DEFAULT_ALARM = 'bells';
export const isValidAlarm = (id) => ALARMS.some((alarm) => alarm.id === id);

const players = new Map();
let activePlayer = null;
let onStop = null;
let playbackVersion = 0;

export function stopAlarm() {
  playbackVersion += 1;
  if (activePlayer) {
    activePlayer.onended = null;
    activePlayer.pause();
    activePlayer.currentTime = 0;
    activePlayer = null;
  }
  const callback = onStop;
  onStop = null;
  callback?.();
}

// Preview and completion use the same recording and two repetitions.
export function playAlarm(id, { onEnd, onError } = {}) {
  stopAlarm();
  const selected = isValidAlarm(id) ? id : DEFAULT_ALARM;
  if (!players.has(selected)) {
    const player = new Audio(new URL(`../assets/audio/${selected}.mp3`, import.meta.url));
    player.preload = 'auto';
    players.set(selected, player);
  }
  const player = players.get(selected);
  const version = playbackVersion;
  let repetitions = 2;
  activePlayer = player;
  onStop = onEnd;
  player.volume = 1;
  player.currentTime = 0;

  const play = () => {
    player.play().catch((error) => {
      // Ignore errors from playback cancelled by a new selection or closing settings.
      if (version !== playbackVersion) return;
      stopAlarm();
      onError?.(error);
    });
  };
  player.onended = () => {
    if (version !== playbackVersion) return;
    repetitions -= 1;
    if (repetitions > 0) {
      player.currentTime = 0;
      play();
    } else {
      stopAlarm();
    }
  };
  play();
}
