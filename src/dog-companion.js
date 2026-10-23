import { DOG_ART } from './dog-art.js';
import { createDogAudio } from './dog-audio.js';
import { createDogCare } from './dog-care.js';
import { DOG_SIZE, dogSpots, findDogRoute, isDogSpotFree } from './dog-movement.js';

const randomDelay = (min, max) => min + Math.random() * (max - min);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createDogCompanion() {
  const dog = document.createElement('div');
  dog.className = 'dog-companion'; dog.hidden = true;
  dog.setAttribute('aria-hidden', 'true'); dog.innerHTML = DOG_ART;
  document.body.append(dog);
  const bubble = dog.querySelector('.dog-bubble');
  const audio = createDogAudio();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const care = createDogCare({ planMeal, onMealChange: () => syncEnvironment(true) });
  const poses = ['sniff', 'sit', 'wag', 'stretch', 'play', 'scratch', 'shake', 'yawn', 'lick'];
  let enabled = true, sound = true, sleeping = false;
  let environmentKey = '', lastPose = '';
  let point = { x: 8, y: 8 };
  let positioned = false;
  let timer, frame, heartbeat;
  let lastPulse = 0, awakeTime = 0;
  let nextPant = randomDelay(45000, 90000), nextPoop = randomDelay(180000, 360000);
  let lastPant = -Infinity, lastReaction = -Infinity;
  let approachArmed = true, reactionIndex = 0;
  let obstacles = [], viewport;
  const recent = [];

  function measure() {
    viewport = { width: innerWidth, height: innerHeight };
    obstacles = [...document.querySelectorAll('button, a, input, select, textarea, [role="button"], .timer-content, .daily-quote, .writer-intro')]
      .filter((element) => !element.closest('.max-care') && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
      .map((element) => element.getBoundingClientRect()).filter((rect) => rect.width > 0 && rect.height > 0);
  }
  function rectFree(p, width, height) {
    return p.x >= 8 && p.y >= 8 && p.x + width <= viewport.width - 8 && p.y + height <= viewport.height - 8
      && obstacles.every((r) => p.x + width + 4 <= r.left || p.x - 4 >= r.right || p.y + height + 4 <= r.top || p.y - 4 >= r.bottom);
  }
  function place(next) {
    point = next; positioned = true;
    dog.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
  }
  function pose(action) {
    audio.stop();
    dog.dataset.action = action;
    bubble.textContent = '';
    const effect = action === 'scratch' ? 'scratch' : action === 'poop' ? 'poop'
      : ['lick', 'wag', 'play', 'yawn'].includes(action) ? 'lick' : null;
    if (effect && sound && !sleeping && !blocked()) audio.play(effect, 0, { delay: effect === 'poop' ? .55 : 0 });
  }
  function stopActivity() {
    clearTimeout(timer); cancelAnimationFrame(frame);
    timer = null; frame = null;
  }
  function blocked() { return !enabled || document.hidden || Boolean(document.querySelector('dialog[open]')); }
  function rest() {
    const action = shuffled(poses.filter((entry) => entry !== lastPose))[0];
    lastPose = action; pose(action);
    if (!reducedMotion.matches) timer = setTimeout(wander, action === 'scratch' ? 2400 : randomDelay(1800, 4200));
  }
  function walk(route, arrived = rest, speed = 42) {
    stopActivity();
    if (reducedMotion.matches) { place(route.at(-1)); arrived(); return; }
    pose(speed > 70 ? 'trot' : 'walk');
    let index = 0, previous;
    const step = (now) => {
      if (blocked() || sleeping) { syncEnvironment(); return; }
      const seconds = previous === undefined ? 0 : Math.min((now - previous) / 1000, .05);
      previous = now;
      const target = route[index];
      const length = distance(point, target);
      dog.style.setProperty('--dog-direction', target.x >= point.x ? '1' : '-1');
      if (length <= Math.max(1, speed * seconds)) {
        place(target);
        if (++index === route.length) { arrived(); return; }
      } else {
        const next = { x: point.x + (target.x - point.x) / length * speed * seconds, y: point.y + (target.y - point.y) / length * speed * seconds };
        if (!isDogSpotFree(next, viewport, obstacles)) { syncEnvironment(true); return; }
        place(next);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }
  function wander() {
    if (blocked() || sleeping) return;
    if (care.meal) { goEat(); return; }
    measure();
    if (!isDogSpotFree(point, viewport, obstacles)) { syncEnvironment(true); return; }
    const spots = dogSpots(viewport).filter((candidate) => distance(candidate, point) >= 80
      && recent.every((old) => distance(candidate, old) >= 60) && isDogSpotFree(candidate, viewport, obstacles));
    const interiors = spots.filter((p) => p.x > 24 && p.x < viewport.width - DOG_SIZE.width - 24 && p.y > 24 && p.y < viewport.height - DOG_SIZE.height - 24);
    const candidates = [...shuffled(interiors), ...shuffled(spots.filter((p) => !interiors.includes(p)))];
    for (const target of candidates.slice(0, 8)) {
      const route = findDogRoute(point, target, viewport, obstacles);
      if (route) {
        walk(route, () => { recent.push(target); if (recent.length > 3) recent.shift(); rest(); });
        return;
      }
    }
    rest();
  }
  function planMeal(bowl) {
    measure();
    if (!rectFree(bowl, 44, 44)) return null;
    // Scrolling can change the space around a sleeping dog. Validate the
    // route from where he can safely stand after waking, without moving him.
    const origin = isDogSpotFree(point, viewport, obstacles) ? point
      : dogSpots(viewport).filter((p) => isDogSpotFree(p, viewport, obstacles)).sort((a, b) => distance(a, point) - distance(b, point))[0];
    if (!origin) return null;
    for (const [x, facing] of [[bowl.x - 46, 1], [bowl.x + 19, -1]]) {
      const seat = { x, y: bowl.y - 40 };
      const route = findDogRoute(origin, seat, viewport, obstacles);
      if (route) return { seat, route, facing };
    }
    return null;
  }
  function goEat() {
    const meal = care.meal;
    if (!meal) { rest(); return; }
    if (meal.remaining <= 0) { finishMeal(); return; }
    const plan = planMeal(meal.point);
    if (!plan) { care.clearMeal(false); rest(); return; }
    Object.assign(meal, plan);
    walk(plan.route, () => {
      dog.style.setProperty('--dog-direction', plan.facing);
      pose('eat');
      if (sound) audio.play('eat', (6700 - meal.remaining) / 1000);
    }, 60);
  }
  function finishMeal() {
    audio.stop(); care.updateMeal(); pose('wag');
    stopActivity();
    timer = setTimeout(() => { care.clearMeal(false); rest(); }, 1300);
  }
  function pant() {
    if (performance.now() - lastPant < 10000 || care.meal || sleeping || blocked() || care.placing) return false;
    stopActivity(); lastPant = performance.now(); pose('pant');
    if (sound) audio.play('pant');
    timer = setTimeout(rest, 3800);
    return true;
  }
  function pulse() {
    const now = performance.now();
    const elapsed = Math.min(1000, now - lastPulse); lastPulse = now;
    if (blocked() || sleeping || dog.hidden) return;
    awakeTime += elapsed;
    const meal = care.meal;
    if (meal && dog.dataset.action === 'eat') {
      meal.remaining = Math.max(0, meal.remaining - elapsed); care.updateMeal();
      if (!meal.remaining) finishMeal();
      return;
    }
    if (meal || care.placing) return;
    if (awakeTime >= nextPoop) {
      nextPoop = awakeTime + randomDelay(180000, 360000);
      measure();
      const poopPoint = { x: point.x + 4, y: point.y + 32 };
      if (care.poopCount < 3 && care.canDrop(poopPoint) && rectFree(poopPoint, 44, 44)) {
        stopActivity(); pose('poop');
        timer = setTimeout(() => {
          care.dropPoop(poopPoint);
          timer = setTimeout(rest, 650);
        }, 2550);
        return;
      }
    }
    if (awakeTime >= nextPant && dog.dataset.action !== 'poop') {
      nextPant = awakeTime + randomDelay(45000, 90000);
      pant();
    }
  }
  function syncEnvironment(force = false) {
    const key = `${enabled}:${sleeping}:${document.hidden}:${Boolean(document.querySelector('dialog[open]'))}:${reducedMotion.matches}`;
    if (force !== true && key === environmentKey) return;
    environmentKey = key;
    stopActivity(); clearInterval(heartbeat); heartbeat = null; audio.stop();
    care.setVisible(!blocked());
    if (blocked()) { dog.hidden = true; return; }
    measure();
    care.reconcile((p) => rectFree(p, 44, 44));
    if (sleeping && positioned) {
      // Starting focus must never send Max to another destination.
      const clamped = { x: Math.max(8, Math.min(point.x, viewport.width - DOG_SIZE.width - 8)), y: Math.max(8, Math.min(point.y, viewport.height - DOG_SIZE.height - 8)) };
      if (distance(point, clamped) > 0) place(clamped);
      dog.hidden = false; pose('sleep'); return;
    }
    if (!positioned || !isDogSpotFree(point, viewport, obstacles)) {
      const spots = dogSpots(viewport).filter((p) => isDogSpotFree(p, viewport, obstacles)).sort((a, b) => distance(a, point) - distance(b, point));
      if (!spots.length) { dog.hidden = true; return; }
      place(spots[0]);
    }
    dog.hidden = false;
    if (sleeping) { pose('sleep'); return; }
    lastPulse = performance.now(); heartbeat = setInterval(pulse, 250);
    if (care.placing) { pose('sit'); return; }
    if (care.meal) goEat(); else rest();
  }
  function react(event) {
    if (blocked() || sleeping || dog.hidden || care.meal || care.placing) return;
    if (event.target.closest('button, a, input, select, textarea, [role="button"]')) return;
    const center = { x: point.x + DOG_SIZE.width / 2, y: point.y + DOG_SIZE.height / 2 };
    const proximity = distance({ x: event.clientX, y: event.clientY }, center);
    if (proximity > 150) { approachArmed = true; return; }
    if (proximity > 100 || !approachArmed || performance.now() - lastReaction < 3000 || dog.dataset.action === 'poop') return;
    approachArmed = false; lastReaction = performance.now();
    const reaction = reactionIndex++ % 3;
    if (reaction === 0 && !reducedMotion.matches) {
      measure();
      const away = dogSpots(viewport).filter((p) => distance(p, point) >= 90 && distance(p, point) <= 180
        && distance({ x: p.x + 36, y: p.y + 38 }, { x: event.clientX, y: event.clientY }) > proximity + 30
        && p.x > 16 && p.x < viewport.width - DOG_SIZE.width - 16 && isDogSpotFree(p, viewport, obstacles));
      for (const target of shuffled(away).slice(0, 6)) {
        const route = findDogRoute(point, target, viewport, obstacles);
        if (route) { walk(route, rest, 100); return; }
      }
    }
    if (reaction === 2 && pant()) return;
    stopActivity(); pose(reaction === 1 ? 'play' : 'wag'); timer = setTimeout(rest, 1200);
  }
  document.addEventListener('pointermove', react, { passive: true });
  document.addEventListener('pointerdown', (event) => { if (event.isTrusted && enabled && sound) audio.unlock(); react(event); }, { passive: true });
  document.addEventListener('keydown', (event) => { if (event.isTrusted && enabled && sound) audio.unlock(); });
  document.addEventListener('visibilitychange', () => syncEnvironment());
  new MutationObserver(() => syncEnvironment()).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  document.addEventListener('toggle', () => syncEnvironment(true), true);
  window.addEventListener('resize', () => syncEnvironment(true));
  window.addEventListener('scroll', () => syncEnvironment(true), { passive: true });
  reducedMotion.addEventListener('change', () => syncEnvironment(true));
  return {
    update({ mode, running, enabled: showDog, sound: dogSound }) {
      const wasSleeping = sleeping;
      enabled = showDog; sound = dogSound; sleeping = mode === 'focus' && running;
      care.setEnabled(enabled);
      if (sleeping && !wasSleeping) care.clearPoop();
      if (!sound) audio.stop();
      syncEnvironment();
    },
  };
}
