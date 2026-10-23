import { BOWL_ART, POOP_ART } from './dog-art.js';

export function createDogCare({ planMeal, onMealChange }) {
  const feed = document.querySelector('#max-feed');
  const layer = document.createElement('div');
  layer.className = 'max-care';
  layer.innerHTML = `<div class="max-placement" hidden><span role="status">Elige un espacio libre para el plato. También puedes usar las flechas y Enter.</span><button type="button">Cancelar</button></div><div class="max-bowl max-bowl-preview" hidden>${BOWL_ART}</div>`;
  document.body.append(layer);
  const toolbar = layer.querySelector('.max-placement');
  const message = toolbar.querySelector('[role="status"]');
  const preview = layer.querySelector('.max-bowl-preview');
  let placing = false;
  let enabled = true;
  let meal = null;
  let cursor = { x: innerWidth / 2, y: innerHeight / 2 };
  const poops = new Set();
  const poopLocations = new WeakMap();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const bowlPoint = () => ({ x: Math.max(8, Math.min(innerWidth - 52, cursor.x - 22)), y: Math.max(8, Math.min(innerHeight - 52, cursor.y - 18)) });
  function movePreview() {
    const p = bowlPoint();
    preview.style.transform = `translate(${p.x}px, ${p.y}px)`;
  }
  function renderButton() {
    feed.disabled = placing || Boolean(meal);
    feed.hidden = !enabled;
    feed.textContent = meal ? 'Comida servida para Max' : 'Darle de comer';
  }
  function cancel(restoreFocus = false, notify = true) {
    const wasPlacing = placing;
    placing = false;
    toolbar.hidden = true;
    preview.hidden = true;
    renderButton();
    if (restoreFocus) feed.focus({ preventScroll: true });
    if (wasPlacing && notify) onMealChange();
  }
  function clearMeal(notify = true) {
    if (!meal) return;
    meal.element.remove(); meal = null; renderButton();
    if (notify) onMealChange();
  }
  function serve() {
    const point = bowlPoint();
    const plan = planMeal(point);
    if (!plan) {
      message.textContent = 'Max no puede comer ahí. Elige otro espacio libre y accesible.';
      return;
    }
    const element = document.createElement('button');
    element.className = 'max-bowl';
    element.type = 'button';
    element.setAttribute('aria-label', 'Retirar el plato de Max');
    element.title = 'Retirar el plato de Max';
    element.innerHTML = BOWL_ART;
    element.style.transform = `translate(${point.x}px, ${point.y}px)`;
    element.addEventListener('click', () => clearMeal());
    layer.append(element);
    meal = { ...plan, point, element, remaining: 6700 };
    cancel(true, false);
    onMealChange();
  }
  feed.addEventListener('click', () => {
    if (!enabled || meal) return;
    placing = true;
    toolbar.hidden = false; preview.hidden = false;
    message.textContent = 'Elige un espacio libre para el plato. También puedes usar las flechas y Enter.';
    movePreview(); renderButton();
    toolbar.querySelector('button').focus({ preventScroll: true });
    onMealChange();
  });
  toolbar.querySelector('button').addEventListener('click', () => cancel(true));
  document.addEventListener('pointermove', (event) => {
    if (!placing) return;
    cursor = { x: event.clientX, y: event.clientY }; movePreview();
  }, { passive: true });
  document.addEventListener('click', (event) => {
    if (!placing || event.target.closest('.max-placement, #max-feed')) return;
    if (event.target.closest('button, a, input, select, textarea, [role="button"]')) { cancel(); return; }
    cursor = { x: event.clientX, y: event.clientY }; movePreview(); serve();
  });
  document.addEventListener('keydown', (event) => {
    if (!placing) return;
    if (!['Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Escape') { cancel(true); return; }
    if (event.key === 'Enter') { serve(); return; }
    cursor.x += event.key === 'ArrowRight' ? 12 : event.key === 'ArrowLeft' ? -12 : 0;
    cursor.y += event.key === 'ArrowDown' ? 12 : event.key === 'ArrowUp' ? -12 : 0;
    cursor.x = Math.max(30, Math.min(innerWidth - 30, cursor.x));
    cursor.y = Math.max(26, Math.min(innerHeight - 26, cursor.y));
    movePreview();
  });
  function clearPoop() { for (const element of poops) element.remove(); poops.clear(); }
  return {
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
    setEnabled(value) {
      enabled = value;
      if (!enabled) { cancel(false, false); clearMeal(false); clearPoop(); }
      renderButton();
    },
    setVisible(value) {
      layer.hidden = !value;
      if (!value) cancel(false, false);
    },
    updateMeal() {
      if (!meal) return;
      meal.element.style.setProperty('--food-left', Math.max(0, meal.remaining / 6700));
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
