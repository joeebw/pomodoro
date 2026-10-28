import { createMaxPlacement } from './max-placement.js';
import { BOWL_ART, WATER_BOWL_ART, POOP_ART } from './dog-art.js';

export function createDogCare({ planMeal, onMealChange, onServe }) {
  const placement = createMaxPlacement();
  const layer = document.createElement('div');
  layer.className = 'max-care';
  document.body.append(layer);
  let placing = false, placingKind = 'food';
  let enabled = true;
  let meals = 0, sleeping = false, playing = false;
  let meal = null;
  const poops = new Set();
  const poopLocations = new WeakMap();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function cancel(restoreFocus = false, notify = true) {
    const wasPlacing = placing;
    placing = false; placement.stop();
    if (restoreFocus) document.querySelector('#max-open').focus({ preventScroll: true });
    if (wasPlacing && notify) onMealChange();
  }
  function clearMeal(notify = true) {
    if (!meal) return;
    meal.element.remove(); meal = null; placement.stop();
    if (notify) { document.querySelector('#max-open').focus({ preventScroll: true }); onMealChange(); }
  }
  function serve(point) {
    const plan = planMeal(point);
    if (!plan) return;
    if (sleeping || playing || !enabled || meal || (placingKind === 'food' && (!meals || !onServe()))) { cancel(true); return; }
    const element = document.createElement('button');
    element.className = 'max-bowl';
    element.type = 'button';
    element.setAttribute('aria-label', placingKind === 'water' ? 'Retirar el agua de Max' : 'Retirar el plato de Max');
    element.title = 'Retirar el plato de Max';
    element.innerHTML = placingKind === 'water' ? WATER_BOWL_ART : BOWL_ART;
    element.style.transform = `translate(${point.x}px, ${point.y}px)`;
    element.addEventListener('click', () => clearMeal());
    layer.append(element);
    meal = { ...plan, point, element, kind: placingKind, duration: placingKind === 'water' ? 4000 : 6700, remaining: placingKind === 'water' ? 4000 : 6700 };
    placing = false;
    placement.activity(placingKind === 'water' ? 'Max va a beber. Puedes retirar el agua.' : 'Max va a comer. Puedes retirar el plato.', () => clearMeal());
    onMealChange();
  }
  function begin(kind = 'food') {
    if (!['food', 'water'].includes(kind) || !enabled || meal || (kind === 'food' && !meals) || sleeping || playing) return false;
    placingKind = kind;
    placing = true;
    const started = placement.start({ art: kind === 'water' ? WATER_BOWL_ART : BOWL_ART, label: kind === 'water' ? 'Elige dónde servir el agua' : 'Elige dónde servir la comida', validate: planMeal, onConfirm: serve, onCancel: () => cancel(true) });
    if (!started) { placing = false; return false; }
    onMealChange();
    return true;
  }
  function clearPoop() { for (const element of poops) element.remove(); poops.clear(); }
  return {
    begin,
    get meal() { return meal; },
    get placing() { return placing; },
    get poopCount() { return poops.size; },
    clearMeal,
    clearPoop,
    reconcile(canShow) {
      // These decorations are fixed to the viewport; scrolling must never
      // leave an interactive bowl or poop sitting over an application control.
      if (meal) meal.element.hidden = !canShow(meal.point);
      for (const element of poops) element.hidden = !canShow(poopLocations.get(element));
    },
    setPlaying(value) { playing = value; },
    setFeeding({ available, asleep }) {
      meals = available; sleeping = asleep;
      if (sleeping || (meals === 0 && placing && placingKind === 'food')) cancel(false, false);
    },
    setEnabled(value) {
      enabled = value;
      if (!enabled) { cancel(false, false); clearMeal(false); clearPoop(); }
    },
    setVisible(value) {
      layer.hidden = !value;
      if (!value) cancel(false, false);
    },
    updateMeal() {
      if (!meal) return;
      meal.element.style.setProperty('--food-left', Math.max(0, meal.remaining / meal.duration));
      meal.element.classList.toggle('max-bowl-empty', meal.remaining <= 0);
    },
    canDrop(point) {
      return [...poops].every((element) => {
        const p = poopLocations.get(element);
        return point.x + 48 <= p.x || point.x >= p.x + 48 || point.y + 48 <= p.y || point.y >= p.y + 48;
      });
    },
    dropPoop(point) {
      if (poops.size >= 3) return;
      const element = document.createElement('button');
      element.type = 'button'; element.className = 'max-poop';
      element.setAttribute('aria-label', 'Limpiar popó de Max');
      element.innerHTML = POOP_ART;
      element.style.transform = `translate(${point.x}px, ${point.y}px)`;
      element.addEventListener('click', () => {
        if (!poops.delete(element)) return;
        element.disabled = true;
        element.classList.add('max-cleaned');
        if (reducedMotion.matches) element.remove(); else setTimeout(() => element.remove(), 200);
      });
      poops.add(element); poopLocations.set(element, point); layer.append(element);
    },
  };
}
