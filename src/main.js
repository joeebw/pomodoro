import { DEFAULT_SETTINGS, loadState, saveState } from './storage.js';
import { durationFor, formatTime, getPlantStage, MODES } from './timer.js';
import { getDailyQuote } from './quotes.js';
import './pwa.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const elements = {
  timer: $('#timer'), ring: $('#ring-progress'), label: $('#session-label'), caption: $('#timer-caption'),
  start: $('#start-button'), reset: $('#reset-button'), note: $('#session-note-text'), plant: $('#plant-stage'),
  plantCaption: $('#plant-caption'), plantCount: $('#plant-count'), cycleLabel: $('#cycle-label'),
  dialog: $('#settings-dialog'), form: $('#settings-form'), toast: $('#toast'), focusDurations: $('#focus-durations'),
};
const ringLength = 2 * Math.PI * 147;
const completionAlarm = new Audio(new URL('../assets/audio/session-alarm.mp3', import.meta.url));
completionAlarm.preload = 'auto';
let state = loadState();
let mode = state.timer?.mode || 'focus';
let focusDurationDrafts = [...state.settings.focusDurations];
const sessionIndex = () => state.sessionsToday % state.settings.cycle;
const modeDuration = (targetMode = mode) => durationFor(targetMode, state.settings, sessionIndex());
let activeDuration = state.timer?.duration || modeDuration();
let endsAt = state.timer?.endsAt || null;
let remaining = endsAt ? Math.max(0, endsAt - Date.now()) / 1000 : activeDuration;
let interval = null;
let toastTimeout = null;

function persist() {
  state.timer = interval && endsAt ? { mode, endsAt, duration: activeDuration } : null;
  saveState(state);
}

function updateTimer() {
  elements.timer.textContent = formatTime(remaining);
  elements.ring.style.strokeDasharray = ringLength;
  elements.ring.style.strokeDashoffset = ringLength * (1 - Math.max(0, remaining / activeDuration));
  elements.label.textContent = MODES[mode].label;
  elements.caption.textContent = MODES[mode].caption;
  elements.start.innerHTML = interval
    ? '<span class="pause-icon" aria-hidden="true">Ⅱ</span><span>Pausar sesión</span>'
    : '<span class="play-icon" aria-hidden="true">▶</span><span>Comenzar sesión</span>';
  $$('.mode').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.title = `${formatTime(remaining)} · brota`;
}

function updateGarden() {
  const stage = getPlantStage(state.completed);
  elements.plant.className = `plant-stage stage-${stage}`;
  elements.plant.setAttribute('aria-label', ['Una semilla lista para crecer', 'Un brote tierno', 'Una planta joven', 'Una planta floreciendo', 'Una planta en su máximo esplendor'][stage]);
  elements.plantCaption.textContent = ['Una semilla llena de posibilidades', '¡Un brote nuevo encontró su camino!', 'Tu constancia le da nuevas hojas', 'Mira qué bien está creciendo', 'Una planta feliz, gracias a ti'][stage];
  elements.plantCount.textContent = state.completed;
  elements.cycleLabel.textContent = state.sessionsToday === 0
    ? 'Tu primer ciclo empieza aquí'
    : `${state.sessionsToday} de ${state.settings.cycle} sesiones de hoy`;
  const cycleProgress = state.sessionsToday === 0
    ? 0
    : (state.sessionsToday % state.settings.cycle || state.settings.cycle);
  $('#cycle-dots').innerHTML = Array.from({ length: state.settings.cycle }, (_, index) =>
    `<span class="${index < cycleProgress ? 'done' : ''}"></span>`,
  ).join('');
}

function setMode(nextMode) {
  if (!MODES[nextMode]) return;
  pauseTimer();
  mode = nextMode;
  activeDuration = modeDuration();
  remaining = activeDuration;
  elements.note.textContent = mode === 'focus' ? 'Un paso a la vez. Tu planta te acompaña.' : 'Toma aire. Te lo has ganado.';
  updateTimer();
  persist();
}

function finishSession() {
  if (interval) window.clearInterval(interval);
  interval = null;
  endsAt = null;
  remaining = 0;
  let notificationTitle;
  let notificationBody;
  if (mode === 'focus') {
    state.completed += 1;
    state.sessionsToday += 1;
    mode = state.sessionsToday % state.settings.cycle === 0 ? 'long' : 'short';
    elements.note.textContent = '¡Sesión completa! Tu planta creció contigo.';
    notificationTitle = '¡Sesión completa!';
    notificationBody = `Tu planta creció. Hora de una ${mode === 'long' ? 'pausa larga' : 'pausa corta'}.`;
    showToast(`${notificationTitle} ${notificationBody}`);
  } else {
    mode = 'focus';
    elements.note.textContent = 'Pausa terminada. Cuando quieras, seguimos.';
    notificationTitle = 'Pausa terminada';
    notificationBody = 'Toma aire; una nueva sesión de enfoque te espera.';
    showToast(`${notificationTitle}. ${notificationBody}`);
  }
  if (state.settings.sound) playChime();
  if (state.settings.notifications) sendNotification(notificationTitle, notificationBody);
  activeDuration = modeDuration();
  remaining = activeDuration;
  updateTimer();
  updateGarden();
  persist();
}

function startTimer() {
  playButtonSound(interval ? 'pause' : 'start');
  if (interval) {
    pauseTimer();
    return;
  }
  endsAt = Date.now() + remaining * 1000;
  interval = window.setInterval(syncTimerFromClock, 1000);
  updateTimer();
  persist();
}

function syncTimerFromClock() {
  if (!interval || !endsAt) return;
  remaining = Math.max(0, (endsAt - Date.now()) / 1000);
  if (remaining <= 0) {
    finishSession();
    return;
  }
  updateTimer();
  persist();
}

function playButtonSound(action) {
  try {
    const context = new AudioContext();
    const now = context.currentTime;
    const noiseLength = .045;
    const noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * noiseLength), context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = (Math.random() * 2 - 1) * (1 - index / noiseData.length);
    }
    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const clickGain = context.createGain();
    noise.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = action === 'start' ? 2100 : 1650;
    filter.Q.value = .8;
    clickGain.gain.setValueAtTime(.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(.34, now + .003);
    clickGain.gain.exponentialRampToValueAtTime(.0001, now + noiseLength);
    noise.connect(filter).connect(clickGain).connect(context.destination);
    noise.start(now);

    const body = context.createOscillator();
    const bodyGain = context.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(action === 'start' ? 330 : 270, now);
    body.frequency.exponentialRampToValueAtTime(145, now + .11);
    bodyGain.gain.setValueAtTime(.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(.22, now + .006);
    bodyGain.gain.exponentialRampToValueAtTime(.0001, now + .13);
    body.connect(bodyGain).connect(context.destination);
    body.start(now);
    body.stop(now + .14);
    window.setTimeout(() => context.close(), 400);
  } catch { /* Audio may be unavailable or blocked by browser settings. */ }
}

function pauseTimer() {
  if (interval && endsAt) {
    remaining = Math.max(0, (endsAt - Date.now()) / 1000);
    if (remaining <= 0) {
      finishSession();
      return;
    }
    window.clearInterval(interval);
  }
  interval = null;
  endsAt = null;
  updateTimer();
  persist();
}

function resetTimer() {
  pauseTimer();
  activeDuration = modeDuration();
  remaining = activeDuration;
  updateTimer();
  elements.note.textContent = 'Temporizador listo cuando tú lo estés.';
  persist();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => elements.toast.classList.remove('visible'), 3200);
}

function playChime() {
  completionAlarm.currentTime = 0;
  completionAlarm.volume = 1;
  completionAlarm.play().catch(() => {
    showToast('El navegador bloqueó el sonido. Toca la pantalla para habilitarlo.');
  });
}

async function sendNotification(title, body) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try {
    const options = {
      body,
      tag: 'brota-session-finished',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 150, 300, 150, 600],
      data: { url: '/' },
    };
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return;
    }
    const notification = new Notification(title, options);
    notification.onclick = () => window.focus();
  } catch {
    showToast('El navegador no pudo mostrar la notificación.');
  }
}

function applyColor(color) {
  document.body.dataset.color = color === 'sage' ? '' : color;
  $$('.color-swatch').forEach((swatch) => {
    const selected = swatch.dataset.color === color;
    swatch.classList.toggle('selected', selected);
    swatch.setAttribute('aria-checked', String(selected));
  });
}

function boundedInput(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback));
}

function readFocusDurationDrafts() {
  const durations = [...focusDurationDrafts];
  $$('#focus-durations [data-session-index]').forEach((input) => {
    const index = Number(input.dataset.sessionIndex);
    durations[index] = boundedInput(input.value, 1, 180, durations[index] || 25);
  });
  return durations;
}

function renderFocusDurationInputs(cycle, durations) {
  focusDurationDrafts = [...durations];
  elements.focusDurations.innerHTML = Array.from({ length: cycle }, (_, index) => `
    <label class="setting-row focus-duration-row" for="focus-duration-${index}">
      <span><strong>Sesión ${index + 1}</strong><small>Tiempo de enfoque</small></span>
      <span class="number-control"><input id="focus-duration-${index}" data-session-index="${index}" type="number" min="1" max="180" value="${durations[index] ?? 25}" /><span>min</span></span>
    </label>
  `).join('');
}

function fillSettingsForm(settings = state.settings) {
  $('#short-length').value = settings.short;
  $('#long-length').value = settings.long;
  $('#cycle-length').value = settings.cycle;
  renderFocusDurationInputs(settings.cycle, settings.focusDurations);
  $('#sound-toggle').checked = settings.sound;
  $('#notification-toggle').checked = settings.notifications;
  applyColor(settings.color);
}

function openSettings() {
  fillSettingsForm();
  elements.dialog.showModal();
}

function discardSettings() {
  fillSettingsForm();
  elements.dialog.close();
}

function saveSettings(event) {
  event.preventDefault();
  const notificationsRequested = $('#notification-toggle').checked;
  let permissionRequest = null;
  if (notificationsRequested && typeof Notification !== 'undefined' && Notification.permission === 'default') {
    try {
      permissionRequest = Notification.requestPermission();
    } catch {
      permissionRequest = Promise.resolve('denied');
    }
  }
  const numberValue = (id, min, max, fallback) => boundedInput($(id).value, min, max, fallback);
  const selectedColor = $('.color-swatch.selected')?.dataset.color || 'sage';
  const cycle = numberValue('#cycle-length', 2, 8, DEFAULT_SETTINGS.cycle);
  const focusDurations = readFocusDurationDrafts();
  focusDurationDrafts = focusDurations;
  state.settings = {
    focusDurations,
    short: numberValue('#short-length', 1, 60, DEFAULT_SETTINGS.short),
    long: numberValue('#long-length', 1, 90, DEFAULT_SETTINGS.long),
    cycle,
    sound: $('#sound-toggle').checked,
    notifications: notificationsRequested && typeof Notification !== 'undefined' && Notification.permission === 'granted',
    color: selectedColor,
  };
  if (!interval) {
    activeDuration = modeDuration();
    remaining = activeDuration;
  }
  updateTimer();
  updateGarden();
  persist();
  elements.dialog.close();
  showToast('Ajustes guardados en este dispositivo.');
  if (notificationsRequested && typeof Notification === 'undefined') {
    showToast('Este navegador no admite notificaciones.');
  } else if (notificationsRequested && !permissionRequest && Notification.permission === 'denied') {
    showToast('Permite las notificaciones de este sitio desde los ajustes del navegador.');
  } else if (permissionRequest) {
    permissionRequest.then((permission) => {
      state.settings.notifications = permission === 'granted';
      persist();
      showToast(permission === 'granted'
        ? 'Notificaciones activadas.'
        : 'Permite las notificaciones de este sitio desde los ajustes del navegador.');
    }).catch(() => showToast('No se pudo solicitar permiso para las notificaciones.'));
  }
}

function restoreSettings() {
  fillSettingsForm(DEFAULT_SETTINGS);
}

function recoverRunningTimer() {
  if (!state.timer) return;
  if (remaining <= 0) {
    finishSession();
    return;
  }
  interval = window.setInterval(syncTimerFromClock, 1000);
  updateTimer();
  persist();
}

function updateCycleDurationFields() {
  const cycleField = $('#cycle-length');
  const cycle = boundedInput(cycleField.value, 2, 8, state.settings.cycle);
  const durations = readFocusDurationDrafts();
  cycleField.value = cycle;
  renderFocusDurationInputs(cycle, durations);
}

$('.mode-switch').addEventListener('click', (event) => {
  const button = event.target.closest('[data-mode]');
  if (button) setMode(button.dataset.mode);
});
elements.start.addEventListener('click', startTimer);
elements.reset.addEventListener('click', resetTimer);
$('#settings-open').addEventListener('click', openSettings);
$('#settings-close').addEventListener('click', discardSettings);
elements.form.addEventListener('submit', saveSettings);
$('#reset-settings').addEventListener('click', restoreSettings);
$('#cycle-length').addEventListener('input', updateCycleDurationFields);
$$('.color-swatch').forEach((button) => button.addEventListener('click', () => applyColor(button.dataset.color)));
elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) discardSettings();
});
elements.dialog.addEventListener('cancel', () => applyColor(state.settings.color));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') syncTimerFromClock();
});
window.addEventListener('focus', syncTimerFromClock);
window.addEventListener('pageshow', syncTimerFromClock);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !['INPUT', 'BUTTON'].includes(document.activeElement.tagName) && !elements.dialog.open) {
    event.preventDefault();
    startTimer();
  }
});

applyColor(state.settings.color);
const dailyQuote = getDailyQuote();
$('#daily-quote-text').textContent = dailyQuote.text;
$('#daily-quote-author').textContent = `— ${dailyQuote.author}`;
updateTimer();
updateGarden();
recoverRunningTimer();
