const controlSelector = 'button, a, input, select, textarea, [role="button"], .timer-content, .dog-companion';
export function suggestedPlacement(width, height, validate) {
  const xs = [...new Set([8, width - 52, ...Array.from({ length: Math.max(0, Math.floor((width - 60) / 24)) }, (_, i) => 8 + i * 24)])];
  const ys = [...new Set([8, height - 52, ...Array.from({ length: Math.max(0, Math.floor((height - 60) / 24)) }, (_, i) => 8 + i * 24)])];
  for (const x of xs) for (const y of ys) {
    const point = { x, y };
    if (validate(point)) return point;
  }
  return null;
}

export function createMaxPlacement() {
  const root = document.createElement('div');
  root.className = 'max-placement-root';
  root.innerHTML = `<div class="max-placement" hidden><p role="status" aria-live="polite"></p><div><button type="button" data-place="suggest">Sugerir lugar</button><button type="button" data-place="confirm">Colocar</button><button type="button" data-place="cancel">Cancelar</button></div></div><div class="max-placement-preview" aria-hidden="true" hidden></div>`;
  document.body.append(root);
  const bar = root.querySelector('.max-placement');
  const message = root.querySelector('[role="status"]');
  const preview = root.querySelector('.max-placement-preview');
  const suggest = root.querySelector('[data-place="suggest"]');
  const confirm = root.querySelector('[data-place="confirm"]');
  const cancel = root.querySelector('[data-place="cancel"]');
  let options, point, mode = 'idle', frame;
  function stop() {
    mode = 'idle'; options = null;
    cancelAnimationFrame(frame); frame = null;
    bar.hidden = true; preview.hidden = true;
  }
  function abort() { const callback = options?.onCancel; stop(); callback?.(); }
  function placeBar() {
    const rect = bar.getBoundingClientRect();
    const left = Math.max(8, (innerWidth - rect.width) / 2);
    const controls = [...document.querySelectorAll(controlSelector)].filter((e) => !e.closest('.max-placement-root, .max-care, .max-fetch, dialog') && e.getClientRects().length).map((e) => e.getBoundingClientRect());
    const candidates = [innerHeight - rect.height - 12, ...Array.from({ length: Math.max(0, Math.floor((innerHeight - rect.height - 16) / 12)) }, (_, i) => 8 + i * 12)];
    const top = candidates.find((y) => y >= 8 && controls.every((r) => left + rect.width + 4 <= r.left || left - 4 >= r.right || y + rect.height + 4 <= r.top || y - 4 >= r.bottom));
    if (top === undefined) return false;
    bar.style.left = `${left}px`; bar.style.top = `${top}px`;
    return true;
  }
  function update() {
    if (mode !== 'aim') return;
    preview.style.transform = `translate(${point.x}px,${point.y}px)`;
    const valid = Boolean(options.validate(point));
    root.dataset.valid = String(valid); confirm.disabled = !valid;
    const text = valid ? `${options.label}. Lugar válido. Puedes confirmar o elegir otro.` : `${options.label}. Elige un espacio libre y alcanzable; también puedes usar «Sugerir lugar».`;
    if (message.textContent !== text) message.textContent = text;
  }
  function move(x, y) {
    point = { x: Math.max(8, Math.min(innerWidth - 52, x - 22)), y: Math.max(8, Math.min(innerHeight - 52, y - 22)) };
    update();
  }
  function accept(keyboard = false) {
    if (mode !== 'aim' || !options.validate(point)) return;
    options.onConfirm({ ...point }, keyboard);
  }
  suggest.addEventListener('click', () => {
    const next = suggestedPlacement(innerWidth, innerHeight, options.validate);
    if (next) { point = next; update(); }
    else message.textContent = 'No encontramos un lugar accesible en esta vista. Cancela y prueba otra zona de la página.';
  });
  confirm.addEventListener('click', (event) => accept(event.detail === 0));
  cancel.addEventListener('click', abort);
  document.addEventListener('pointermove', (event) => {
    if (mode !== 'aim' || event.target.closest('.max-placement-root, button, a, input, select')) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => move(event.clientX, event.clientY));
  }, { passive: true });
  document.addEventListener('click', (event) => {
    if (mode !== 'aim' || event.target.closest('.max-placement-root, #max-open, dialog')) return;
    if (event.target.closest('button, a, input, select, textarea, [role="button"]')) { abort(); return; }
    move(event.clientX, event.clientY); accept();
  });
  document.addEventListener('keydown', (event) => {
    if (mode === 'idle') return;
    if (event.key === 'Escape') { event.preventDefault(); abort(); return; }
    if (mode !== 'aim') return;
    if (event.target.closest('button, a, input, select, textarea') && !event.target.closest('.max-placement-root')) return;
    if (!['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    // Let the suggest/cancel buttons retain their native Enter behavior.
    if (event.key === 'Enter' && [suggest, cancel].includes(event.target)) return;
    event.preventDefault();
    if (event.key === 'Enter') { accept(true); return; }
    move(point.x + 22 + (event.key === 'ArrowRight' ? 16 : event.key === 'ArrowLeft' ? -16 : 0), point.y + 22 + (event.key === 'ArrowDown' ? 16 : event.key === 'ArrowUp' ? -16 : 0));
  });
  return {
    get active() { return mode !== 'idle'; },
    start(config) {
      stop(); options = config; mode = 'aim';
      preview.innerHTML = config.art; preview.hidden = false; bar.hidden = false;
      suggest.hidden = false; confirm.hidden = false; confirm.textContent = config.confirm || 'Colocar'; cancel.textContent = 'Cancelar';
      message.textContent = config.label;
      if (!placeBar()) { stop(); return false; }
      move(innerWidth / 2, innerHeight / 2);
      suggest.focus({ preventScroll: true });
      return true;
    },
    activity(text, onCancel) {
      mode = 'activity'; options = { onCancel };
      preview.hidden = true; suggest.hidden = true; confirm.hidden = true;
      message.textContent = text; cancel.textContent = 'Cancelar';
      bar.hidden = false; placeBar();
    },
    stop,
  };
}
