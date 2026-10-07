import { APP_NAME, experienceName } from './brand.js';
import { DEFAULT_SETTINGS, loadState, saveState } from './storage.js';
import { durationFor, formatTime, MODES } from './timer.js';
import { getExperienceCopy, renderExperience, renderExperienceProgress, unlockWriterExperience } from './experiences.js';
import { ALARMS, playAlarm, stopAlarm } from './alarms.js';
import { createSettingsSections } from './settings-sections.js';
import { applyTheme } from './theme.js';
import { revealWriterDesk } from './writer-transition.js';
import { animateWriterMachine, setWriterMachineRunning } from './writer-machine.js';
import { createSessionCelebration } from './session-celebration.js';
import { beginChampionshipCycle, championshipView, completeChampionshipStep, resetChampionshipCycle } from './championship.js';
import './pwa.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const elements = {
  timer: $('#timer'), ring: $('#ring-progress'), label: $('#session-label'), caption: $('#timer-caption'),
  start: $('#start-button'), reset: $('#reset-button'), note: $('#session-note-text'),
  progressCount: $('#progress-count'), cycleLabel: $('#cycle-label'),
  dialog: $('#settings-dialog'), form: $('#settings-form'), toast: $('#toast'), focusDurations: $('#focus-durations'),
  cycleResetDialog: $('#cycle-reset-dialog'),
};
const ringLength = 2 * Math.PI * 147;
const settingsSections = createSettingsSections(elements.dialog, (section) => {
  if (section.id === 'alarm-section') stopAlarmPreview();
});
let state = loadState();
const experienceCopy = () => getExperienceCopy(state.experience.active);
let mode = state.timer?.mode || 'focus';
let focusDurationDrafts = [...state.settings.focusDurations];
const sessionIndex = () => state.championship.steps;
const modeDuration = (targetMode = mode) => durationFor(targetMode, state.settings, sessionIndex());
let activeDuration = state.timer?.duration || modeDuration();
let endsAt = state.timer?.endsAt || null;
let remaining = endsAt ? Math.max(0, endsAt - Date.now()) / 1000 : activeDuration;
let interval = null;
let toastTimeout = null;
let previewButton = null;
const celebration = createSessionCelebration({
  getExperience: () => state.experience.active,
  onDismiss: () => {
    state.celebration = null;
    stopAlarm();
    persist();
  },
  onRest: () => {
    if (mode === 'short' || mode === 'long') startTimer();
  },
});

function persist() {
  if (refreshToday()) updateGarden();
  state.timer = interval && endsAt ? { mode, endsAt, duration: activeDuration } : null;
  saveState(state);
}

function refreshToday() {
  const today = new Date().toLocaleDateString('en-CA');
  if (state.date === today) return false;
  state.date = today;
  state.sessionsToday = 0;
  return true;
}

function scheduleDayRefresh() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  window.setTimeout(() => {
    refreshToday();
    updateGarden();
    persist();
    scheduleDayRefresh();
  }, midnight.getTime() - now.getTime() + 100);
}

function updateTimer() {
  setWriterMachineRunning(Boolean(interval));
  elements.timer.textContent = formatTime(remaining);
  elements.ring.style.strokeDasharray = ringLength;
  elements.ring.style.strokeDashoffset = ringLength * (1 - Math.max(0, remaining / activeDuration));
  elements.label.textContent = experienceCopy().modes[mode].label;
  elements.caption.textContent = experienceCopy().modes[mode].caption;
  const activity = state.experience.active === 'writer' ? 'sesión' : mode === 'focus' ? 'etapa' : 'descanso';
  const action = interval ? 'Pausar' : remaining < activeDuration ? 'Continuar' : 'Comenzar';
  elements.start.innerHTML = `<span class="${interval ? 'pause-icon' : 'play-icon'}" aria-hidden="true">${interval ? 'Ⅱ' : '▶'}</span><span>${action} ${activity}</span>`;
  $$('.mode').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.title = `${formatTime(remaining)} · ${experienceName(state.experience.active)}`;
}

function updateGarden() {
  const view = championshipView(state.championship);
  renderExperienceProgress(state.experience.active, state.completed, state.championship, view);
  elements.progressCount.textContent = state.experience.active === 'writer' ? state.completed : state.championship.belts;
  $('.streak').setAttribute('aria-label', state.experience.active === 'writer'
    ? `${state.completed} sesiones completadas`
    : `${state.championship.belts} cinturones conquistados`);
  elements.cycleLabel.textContent = `${state.sessionsToday} sesiones hoy · ${view.step} de ${view.target} en el ciclo`;
  $('#cycle-dots').innerHTML = Array.from({ length: view.target }, (_, index) =>
    `<span class="${index < view.step ? 'done' : ''}"></span>`,
  ).join('');
}

function setMode(nextMode) {
  if (!MODES[nextMode]) return;
  pauseTimer();
  mode = nextMode;
  activeDuration = modeDuration();
  remaining = activeDuration;
  elements.note.textContent = mode === 'focus' ? experienceCopy().focusNote : experienceCopy().pauseNote;
  updateTimer();
  persist();
}

function finishSession() {
  refreshToday();
  const completedFocus = mode === 'focus';
  const focusedMinutes = Math.round(activeDuration / 60);
  if (interval) window.clearInterval(interval);
  interval = null;
  endsAt = null;
  remaining = 0;
  let notificationTitle;
  let notificationBody;
  if (mode === 'focus') {
    state.completed += 1;
    state.sessionsToday += 1;
    const completion = completeChampionshipStep(state.championship, state.settings.cycle);
    state.championship = completion.championship;
    mode = completion.result.won ? 'long' : 'short';
    if (state.experience.active === 'brota') {
      state.celebration = { completed: state.completed, minutes: focusedMinutes, breakMode: mode, ...completion.result };
    }
    const championWon = state.experience.active === 'brota' && completion.result.won;
    elements.note.textContent = championWon ? '¡Cinturón conquistado! Disfruta tu pausa larga.' : experienceCopy().completedNote;
    notificationTitle = championWon ? '¡Cinturón conquistado!' : '¡Sesión completa!';
    notificationBody = `${experienceCopy().completedBody} Hora de una ${mode === 'long' ? 'pausa larga' : 'pausa corta'}.`;
    showToast(`${notificationTitle} ${notificationBody}`);
  } else {
    mode = 'focus';
    elements.note.textContent = experienceCopy().breakNote;
    notificationTitle = 'Pausa terminada';
    notificationBody = experienceCopy().breakBody;
    showToast(`${notificationTitle}. ${notificationBody}`);
  }
  if (state.settings.sound) playChime();
  if (state.settings.notifications) sendNotification(notificationTitle, notificationBody);
  activeDuration = modeDuration();
  remaining = activeDuration;
  updateTimer();
  updateGarden();
  persist();
  if (completedFocus && state.experience.active === 'brota') celebration.request(state.celebration);
}

function startTimer() {
  playButtonSound(interval ? 'pause' : 'start');
  if (interval) {
    pauseTimer();
    return;
  }
  if (mode === 'focus') {
    state.championship = beginChampionshipCycle(state.championship, state.settings.cycle);
    updateGarden();
  }
  requestNotificationPermission(state.settings.notifications)?.then((permission) => {
    if (permission !== 'granted') {
      showToast('Permite las notificaciones desde los ajustes del navegador para recibir avisos.');
    }
  });
  endsAt = Date.now() + remaining * 1000;
  interval = window.setInterval(syncTimerFromClock, 1000);
  animateWriterMachine('start');
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
  const wasRunning = Boolean(interval);
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
  if (wasRunning) animateWriterMachine('pause');
  updateTimer();
  persist();
}

function resetTimer() {
  pauseTimer();
  activeDuration = modeDuration();
  remaining = activeDuration;
  updateTimer();
  elements.note.textContent = experienceCopy().readyNote;
  persist();
}

function resetCycle() {
  // Discard the running clock directly: resetting must not complete a session.
  if (interval) window.clearInterval(interval);
  interval = null;
  endsAt = null;
  celebration.clear();
  state.celebration = null;
  stopAlarm();
  state.championship = resetChampionshipCycle(state.championship, state.settings.cycle);
  mode = 'focus';
  activeDuration = modeDuration();
  remaining = activeDuration;
  elements.note.textContent = experienceCopy().readyNote;
  updateTimer();
  updateGarden();
  persist();
  elements.cycleResetDialog.close();
  showToast('Ciclo reiniciado. Tu primera sesión está lista.');
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => elements.toast.classList.remove('visible'), 3200);
}

function playChime() {
  playAlarm(state.settings.alarm, {
    onError: () => showToast('No se pudo reproducir la alarma. Revisa el audio del navegador.'),
  });
}

function stopAlarmPreview() {
  if (previewButton) stopAlarm();
}

function previewAlarm(button) {
  if (previewButton === button) {
    stopAlarmPreview();
    return;
  }
  stopAlarmPreview();
  previewButton = button;
  button.textContent = 'Detener';
  button.setAttribute('aria-label', `Detener ${button.dataset.alarmName}`);
  playAlarm(button.dataset.previewAlarm, {
    onEnd: () => {
      button.textContent = 'Escuchar';
      button.setAttribute('aria-label', `Escuchar ${button.dataset.alarmName}`);
      previewButton = null;
    },
    onError: () => showToast('No se pudo reproducir el audio. Intenta escucharlo de nuevo.'),
  });
}

function requestNotificationPermission(requested) {
  if (!requested || typeof Notification === 'undefined' || Notification.permission !== 'default') return null;
  try {
    return Notification.requestPermission().catch(() => 'denied');
  } catch {
    return Promise.resolve('denied');
  }
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
      await registration.showNotification(`${APP_NAME} · ${title}`, options);
      return;
    }
    const notification = new Notification(`${APP_NAME} · ${title}`, options);
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
  stopAlarmPreview();
  $('#short-length').value = settings.short;
  $('#long-length').value = settings.long;
  $('#cycle-length').value = settings.cycle;
  renderFocusDurationInputs(settings.cycle, settings.focusDurations);
  $('#sound-toggle').checked = settings.sound;
  const selectedAlarm = $(`#alarm-options input[value="${settings.alarm}"]`);
  if (selectedAlarm) selectedAlarm.checked = true;
  $('#notification-toggle').checked = settings.notifications;
  $('#theme-select').value = settings.theme;
  applyTheme(settings.theme);
  applyColor(settings.color);
}

function openSettings() {
  fillSettingsForm();
  settingsSections.reset();
  updateExperienceControls();
  $('#gift-code').value = '';
  $('#gift-code').removeAttribute('aria-invalid');
  $('#gift-feedback').textContent = '';
  elements.dialog.showModal();
}

function updateExperienceControls() {
  $('#experience-setting').hidden = !state.experience.writerUnlocked;
  $('#experience-select').value = state.experience.active;
  $('#gift-section').hidden = state.experience.writerUnlocked;
}

function activateExperience(active) {
  if (!['brota', 'writer'].includes(active) || (active === 'writer' && !state.experience.writerUnlocked)) return;
  const enteringWriter = active === 'writer' && state.experience.active !== 'writer';
  state.experience.active = active;
  renderExperience(active, { animate: !enteringWriter });
  elements.note.textContent = mode === 'focus' ? experienceCopy().focusNote : experienceCopy().pauseNote;
  updateExperienceControls();
  updateTimer();
  updateGarden();
  // Persist only saved state; inputs with unsaved settings remain drafts.
  persist();
  if (enteringWriter) {
    applyTheme(state.settings.theme);
    applyColor(state.settings.color);
    elements.dialog.close();
    revealWriterDesk();
  }
}

function unlockGift() {
  const unlocked = unlockWriterExperience($('#gift-code').value, state.experience);
  if (!unlocked) {
    $('#gift-code').setAttribute('aria-invalid', 'true');
    $('#gift-feedback').textContent = 'Ese código no abre este regalo. Revisa e intenta otra vez.';
    $('#gift-code').focus();
    return;
  }
  state.experience.writerUnlocked = unlocked.writerUnlocked;
  activateExperience('writer');
}

function discardSettings() {
  fillSettingsForm();
  elements.dialog.close();
}

function saveSettings(event) {
  event.preventDefault();
  const notificationsRequested = $('#notification-toggle').checked;
  const permissionRequest = requestNotificationPermission(notificationsRequested);
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
    alarm: $('#alarm-options input:checked')?.value || DEFAULT_SETTINGS.alarm,
    notifications: notificationsRequested,
    color: selectedColor,
    theme: $('#theme-select').value,
  };
  if (!interval) {
    activeDuration = modeDuration();
    remaining = activeDuration;
  }
  updateTimer();
  updateGarden();
  persist();
  elements.dialog.close();
  showToast(state.settings.cycle !== state.championship.target
    ? 'Ajustes guardados. El nuevo tamaño se aplicará al siguiente ciclo.'
    : 'Ajustes guardados en este dispositivo.');
  if (notificationsRequested && typeof Notification === 'undefined') {
    showToast('Este navegador no admite notificaciones.');
  } else if (notificationsRequested && !permissionRequest && Notification.permission === 'denied') {
    showToast('Permite las notificaciones de este sitio desde los ajustes del navegador.');
  } else if (permissionRequest) {
    permissionRequest.then((permission) => {
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
$('#cycle-reset-open').addEventListener('click', () => elements.cycleResetDialog.showModal());
$('#cycle-reset-confirm').addEventListener('click', resetCycle);
$('#cycle-reset-cancel').addEventListener('click', () => elements.cycleResetDialog.close());
$('#cycle-reset-close').addEventListener('click', () => elements.cycleResetDialog.close());
elements.cycleResetDialog.addEventListener('click', (event) => {
  if (event.target === elements.cycleResetDialog) elements.cycleResetDialog.close();
});
$('#settings-open').addEventListener('click', openSettings);
$('#settings-close').addEventListener('click', discardSettings);
elements.form.addEventListener('submit', saveSettings);
$('#reset-settings').addEventListener('click', restoreSettings);
$('#cycle-length').addEventListener('input', updateCycleDurationFields);
$$('.color-swatch').forEach((button) => button.addEventListener('click', () => applyColor(button.dataset.color)));
elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) discardSettings();
});
elements.dialog.addEventListener('cancel', () => {
  applyColor(state.settings.color);
  applyTheme(state.settings.theme);
});
$('#theme-select').addEventListener('change', (event) => applyTheme(event.target.value));
$('#experience-select').addEventListener('change', (event) => activateExperience(event.target.value));
$('#gift-unlock').addEventListener('click', unlockGift);
$('#gift-code').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    unlockGift();
  }
});
$('#gift-code').addEventListener('input', () => {
  $('#gift-code').removeAttribute('aria-invalid');
  $('#gift-feedback').textContent = '';
});
elements.dialog.addEventListener('close', stopAlarmPreview);
$('#alarm-options').innerHTML = ALARMS.map((alarm) => `
  <div class="alarm-option">
    <label class="alarm-label">
      <input type="radio" name="alarm" value="${alarm.id}" />
      <span><strong>${alarm.name}</strong><small>${alarm.description}</small></span>
    </label>
    <button type="button" class="alarm-preview" data-preview-alarm="${alarm.id}" data-alarm-name="${alarm.name}" aria-label="Escuchar ${alarm.name}">Escuchar</button>
  </div>
`).join('');
$('#alarm-options').addEventListener('click', (event) => {
  const button = event.target.closest('[data-preview-alarm]');
  if (button) previewAlarm(button);
});
$('#alarm-options').addEventListener('change', stopAlarmPreview);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (refreshToday()) { updateGarden(); persist(); }
    syncTimerFromClock();
    renderExperience(state.experience.active);
  }
});
window.addEventListener('focus', syncTimerFromClock);
window.addEventListener('pageshow', syncTimerFromClock);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !['INPUT', 'BUTTON', 'A'].includes(document.activeElement.tagName) && !document.querySelector('dialog[open]')) {
    event.preventDefault();
    startTimer();
  }
});

applyColor(state.settings.color);
applyTheme(state.settings.theme);
renderExperience(state.experience.active);
updateExperienceControls();
elements.note.textContent = mode === 'focus' ? experienceCopy().focusNote : experienceCopy().pauseNote;
updateTimer();
updateGarden();
recoverRunningTimer();
if (state.celebration) celebration.request(state.celebration);
if (state.experience.active === 'writer') revealWriterDesk();
scheduleDayRefresh();
