import { createMaxPlacement } from './max-placement.js';
import { findDogRoute, isDogSpotFree } from './dog-movement.js';
import { TOY_ART } from './dog-art.js';

const names = { bone: 'el hueso', bottle: 'la botella', ball: 'la pelota', frisbee: 'el frisbee' };
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
  const placement = createMaxPlacement();
  const layer = document.createElement('div'); layer.className = 'max-fetch';
  layer.innerHTML = `<span class="max-fetch-status visually-hidden" role="status"></span><div class="max-return-marker" hidden aria-hidden="true">Aquí vuelve</div><button class="max-fetch-toy" type="button" hidden></button>`;
  document.body.append(layer);
  const status = layer.querySelector('[role="status"]');
  const marker = layer.querySelector('.max-return-marker');
  const toy = layer.querySelector('.max-fetch-toy');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let phase = 'idle', kind = 'bone', origin, keyboardRound = false, flightTimer, animation;
  let enabled = true, available = true;
  const active = () => !['idle', 'delivered'].includes(phase);
  const position = (e, p) => { e.style.transform = `translate(${p.x}px,${p.y}px)`; };
  function render() { layer.dataset.phase = phase; onChange(active()); }
  function clear(resume = false) {
    const wasActive = active();
    clearTimeout(flightTimer); animation?.cancel(); animation = null;
    placement.stop(); toy.hidden = true; marker.hidden = true;
    phase = 'idle'; render();
    if (resume && wasActive) { onCancel(); document.querySelector('#max-open').focus({ preventScroll: true }); }
  }
  function begin(nextKind) {
    if (!enabled || !available || active() || !TOY_ART[nextKind]) return false;
    clear(); kind = nextKind; origin = getOrigin();
    if (!origin) return false;
    phase = 'aim'; status.textContent = '';
    marker.hidden = false; position(marker, homeToy(origin));
    const started = placement.start({
      art: TOY_ART[kind], label: 'Elige dónde lanzar; Max vuelve al punto marcado', confirm: 'Lanzar',
      validate: (point) => planThrow(origin, point),
      onConfirm: launch, onCancel: () => clear(true),
    });
    if (!started) { clear(); return false; }
    render(); onAim(); return true;
  }
  function launch(landing, keyboard) {
    const plan = planThrow(origin, landing);
    if (!plan) return;
    keyboardRound = keyboard; phase = 'flight'; render();
    toy.innerHTML = TOY_ART[kind]; toy.disabled = true; toy.hidden = false; position(toy, plan.home);
    placement.activity('Max recoge el juguete y vuelve al punto marcado.', () => clear(true));
    const startOutbound = () => { animation?.cancel(); animation = null; phase = 'outbound'; render(); onFetch(plan, kind); };
    const landed = () => {
      animation?.cancel(); animation = null; position(toy, plan.landing);
      if (kind === 'ball' && !reducedMotion.matches) {
        phase = 'landing'; render();
        animation = toy.animate([{ transform: `translate(${plan.landing.x}px,${plan.landing.y}px)` }, { transform: `translate(${plan.landing.x}px,${plan.landing.y - 18}px)` }, { transform: `translate(${plan.landing.x}px,${plan.landing.y}px)` }], { duration: 300, easing: 'ease-out' });
        flightTimer = setTimeout(startOutbound, 300);
      } else startOutbound();
    };
    if (reducedMotion.matches) { landed(); return; }
    animation = toy.animate([
      { transform: `translate(${plan.home.x}px,${plan.home.y}px) rotate(0deg)` },
      { transform: `translate(${(plan.home.x + plan.landing.x) / 2}px,${Math.max(8, Math.min(plan.home.y, plan.landing.y) - 70)}px) rotate(180deg)` },
      { transform: `translate(${plan.landing.x}px,${plan.landing.y}px) rotate(${kind === 'frisbee' ? 1080 : 360}deg)` },
    ], { duration: 500, easing: 'ease-in-out' });
    flightTimer = setTimeout(landed, 500);
  }
  toy.addEventListener('click', () => { if (phase === 'delivered') begin(kind); });
  return {
    begin, clear,
    get active() { return active(); },
    setAvailability({ show, canPlay }) { enabled = show; available = canPlay; if ((!show || !canPlay) && phase !== 'idle') clear(); },
    pickUp() { phase = 'pickup'; render(); },
    carry() { toy.hidden = true; phase = 'return'; render(); },
    deliver() {
      placement.stop(); toy.hidden = false; toy.disabled = false; position(toy, homeToy(origin));
      toy.setAttribute('aria-label', `Volver a lanzar ${names[kind]}`);
      marker.hidden = true; phase = 'delivered'; render(); status.textContent = `Max ha devuelto ${names[kind]}.`;
      if (keyboardRound) toy.focus({ preventScroll: true });
    },
  };
}
