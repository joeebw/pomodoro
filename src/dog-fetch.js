import { findDogRoute, isDogSpotFree } from './dog-movement.js';
import { TOY_ART } from './dog-art.js';

const names = { bone: 'el hueso', bottle: 'la botella' };
const homeToy = (origin) => ({ x: origin.x + 20, y: origin.y + 32 });
export function planDogFetch(origin, landing, viewport, obstacles) {
  const freeToy = landing.x >= 8 && landing.y >= 8 && landing.x + 44 <= viewport.width - 8 && landing.y + 44 <= viewport.height - 8
    && obstacles.every((r) => landing.x + 48 <= r.left || landing.x - 4 >= r.right || landing.y + 48 <= r.top || landing.y - 4 >= r.bottom);
  const home = homeToy(origin);
  if (!freeToy || !isDogSpotFree(origin, viewport, obstacles) || Math.hypot(landing.x - home.x, landing.y - home.y) < 80) return null;
  for (const [x, facing] of [[landing.x - 40, 1], [landing.x + 8, -1]]) {
    const seat = { x, y: landing.y - 40 };
    const outbound = findDogRoute(origin, seat, viewport, obstacles);
    const inbound = outbound && findDogRoute(seat, origin, viewport, obstacles);
    if (inbound) return { origin: { ...origin }, home, landing, seat, facing, outbound, inbound };
  }
  return null;
}

export function createDogFetch({ getOrigin, planThrow, onAim, onFetch, onCancel, onChange }) {
  const button = document.querySelector('#max-play');
  const menu = document.querySelector('#max-toys');
  const layer = document.createElement('div');
  layer.className = 'max-fetch';
  layer.innerHTML = `<span class="max-fetch-status visually-hidden" role="status" aria-live="polite"></span><div class="max-return-marker" hidden aria-hidden="true">Aquí vuelve</div><button class="max-fetch-toy" type="button" hidden></button><div class="max-placement" hidden><span role="status">Elige un espacio libre para lanzar. Max volverá al punto marcado. Puedes usar las flechas y Enter.</span><button type="button">Cancelar</button></div>`;
  document.body.append(layer);
  const status = layer.querySelector('.max-fetch-status');
  const marker = layer.querySelector('.max-return-marker');
  const toy = layer.querySelector('.max-fetch-toy');
  const toolbar = layer.querySelector('.max-placement');
  const message = toolbar.querySelector('[role="status"]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let phase = 'idle', kind = 'bone', origin, cursor;
  let enabled = true, available = true, keyboardRound = false, flightTimer, animation;
  const active = () => !['idle', 'delivered'].includes(phase);
  const position = (element, p) => { element.style.transform = `translate(${p.x}px, ${p.y}px)`; };
  const landing = () => ({ x: Math.max(8, Math.min(innerWidth - 52, cursor.x - 22)), y: Math.max(8, Math.min(innerHeight - 52, cursor.y - 22)) });
  function render() {
    layer.dataset.phase = phase;
    button.hidden = !enabled;
    button.disabled = !available || active();
    const label = !available ? 'Max no puede jugar mientras duerme o come' : 'Jugar con Max';
    button.title = label; button.setAttribute('aria-label', label);
    onChange(active());
  }
  function clear(resume = false) {
    const wasActive = active();
    clearTimeout(flightTimer); animation?.cancel(); animation = null;
    toy.hidden = true; marker.hidden = true; toolbar.hidden = true;
    phase = 'idle'; render();
    if (resume && wasActive) { onCancel(); button.focus({ preventScroll: true }); }
  }
  function begin(nextKind) {
    if (!enabled || !available || active()) return;
    menu.hidePopover();
    clear(); kind = nextKind; origin = getOrigin();
    if (!origin) return;
    status.textContent = '';
    phase = 'aim'; cursor = { x: innerWidth / 2, y: innerHeight / 2 };
    marker.hidden = false; position(marker, homeToy(origin));
    toy.innerHTML = TOY_ART[kind]; toy.disabled = true; toy.hidden = false; position(toy, landing());
    toolbar.hidden = false;
    message.textContent = 'Elige un espacio libre para lanzar. Max volverá al punto marcado. Puedes usar las flechas y Enter.';
    render(); onAim(); toolbar.querySelector('button').focus({ preventScroll: true });
  }
  function launch(fromKeyboard = false) {
    const plan = planThrow(origin, landing());
    if (!plan) { message.textContent = 'Elige otro lugar: debe quedar más lejos y Max necesita espacio para ir y volver.'; return; }
    keyboardRound = fromKeyboard;
    phase = 'flight'; toolbar.hidden = true; render(); position(toy, plan.home);
    const landed = () => {
      animation?.cancel(); animation = null;
      position(toy, plan.landing); phase = 'outbound'; render(); onFetch(plan, kind);
    };
    if (reducedMotion.matches) { landed(); return; }
    const mid = { x: (plan.home.x + plan.landing.x) / 2, y: Math.max(8, Math.min(plan.home.y, plan.landing.y) - 70) };
    animation = toy.animate([
      { transform: `translate(${plan.home.x}px,${plan.home.y}px) rotate(0deg)` },
      { transform: `translate(${mid.x}px,${mid.y}px) rotate(180deg)` },
      { transform: `translate(${plan.landing.x}px,${plan.landing.y}px) rotate(360deg)` },
    ], { duration: 500, easing: 'ease-in-out' });
    flightTimer = setTimeout(landed, 500);
  }
  menu.addEventListener('toggle', () => {
    if (!menu.matches(':popover-open')) return;
    const r = button.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(innerWidth - 224, r.right - 216))}px`;
    menu.style.top = `${r.bottom + 8}px`;
  });
  menu.querySelectorAll('[data-max-toy]').forEach((choice) => choice.addEventListener('click', () => begin(choice.dataset.maxToy)));
  toy.addEventListener('click', () => { if (phase === 'delivered') begin(kind); });
  toolbar.querySelector('button').addEventListener('click', () => clear(true));
  document.addEventListener('pointermove', (event) => {
    if (phase !== 'aim') return;
    cursor = { x: event.clientX, y: event.clientY }; position(toy, landing());
  }, { passive: true });
  document.addEventListener('click', (event) => {
    if (phase !== 'aim' || event.target.closest('.max-fetch, #max-play, #max-toys')) return;
    if (event.target.closest('button, a, input, select, textarea, [role="button"]')) { clear(true); return; }
    cursor = { x: event.clientX, y: event.clientY }; launch();
  });
  document.addEventListener('keydown', (event) => {
    if (!active()) return;
    if (event.key === 'Escape') { event.preventDefault(); clear(true); return; }
    if (phase === 'aim' && event.target.closest('button, a, input, select, textarea') && !event.target.closest('.max-fetch')) {
      if (event.key === 'Enter' || event.key === ' ') { clear(); onCancel(); }
      return;
    }
    if (phase !== 'aim' || !['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Enter') { launch(true); return; }
    cursor.x = Math.max(30, Math.min(innerWidth - 30, cursor.x + (event.key === 'ArrowRight' ? 16 : event.key === 'ArrowLeft' ? -16 : 0)));
    cursor.y = Math.max(30, Math.min(innerHeight - 30, cursor.y + (event.key === 'ArrowDown' ? 16 : event.key === 'ArrowUp' ? -16 : 0)));
    position(toy, landing());
  });
  return {
    get active() { return active(); },
    clear,
    setAvailability({ show, canPlay }) {
      enabled = show; available = canPlay;
      if ((!show || !canPlay) && phase !== 'idle') clear();
      if (!show || !canPlay) menu.hidePopover();
      render();
    },
    pickUp() { phase = 'pickup'; render(); },
    carry() { toy.hidden = true; phase = 'return'; render(); },
    deliver() {
      toy.hidden = false; toy.disabled = false; position(toy, homeToy(origin));
      toy.setAttribute('aria-label', `Volver a lanzar ${names[kind]}`); toy.title = 'Volver a lanzar';
      marker.hidden = true; phase = 'delivered'; render();
      status.textContent = `Max ha devuelto ${names[kind]}.`;
      if (keyboardRound) toy.focus({ preventScroll: true });
    },
  };
}
