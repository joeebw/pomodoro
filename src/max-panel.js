import { BOWL_ART, TOY_ART } from './dog-art.js';

export function createMaxPanel({ getState, onAction }) {
  const button = document.querySelector('#max-open');
  const dialog = document.createElement('dialog');
  dialog.id = 'max-dialog'; dialog.className = 'max-dialog';
  dialog.setAttribute('aria-labelledby', 'max-panel-title');
  dialog.innerHTML = `<div class="max-panel-header"><div><p>Tu compañero de enfoque</p><h2 id="max-panel-title">Un momento con Max</h2></div><button type="button" class="max-panel-close" aria-label="Cerrar panel de Max">×</button></div><p id="max-panel-status"></p><p id="max-panel-progress"></p><section aria-labelledby="max-care-title"><h3 id="max-care-title">Cuidados</h3><div class="max-panel-grid"><button type="button" data-max-action="food">${BOWL_ART}<span>Comida</span></button></div><p class="max-panel-help" id="max-care-help"></p></section><section aria-labelledby="max-play-title"><h3 id="max-play-title">Juguetes</h3><div class="max-panel-grid">${Object.entries(TOY_ART).map(([kind, art]) => `<button type="button" data-max-action="${kind}">${art}<span>${kind === 'bone' ? 'Hueso' : 'Botella'}</span></button>`).join('')}</div><p class="max-panel-help">Max recoge el juguete y vuelve al punto marcado.</p></section><p class="max-panel-help">Volumen y visibilidad en Ajustes → Max.</p>`;
  document.body.append(dialog);
  let generation = 0;
  function update() {
    const { enabled, sleeping, meals, growth, occupied } = getState();
    button.hidden = !enabled;
    dialog.querySelector('#max-panel-status').textContent = sleeping ? 'Max duerme mientras te concentras.' : occupied ? 'Max tiene un plato servido.' : 'Max está listo para acompañarte.';
    dialog.querySelector('#max-panel-progress').textContent = `${growth.stage} · ${growth.sessions} ${growth.sessions === 1 ? 'sesión' : 'sesiones'} juntos · ${meals} ${meals === 1 ? 'comida disponible' : 'comidas disponibles'}`;
    dialog.querySelector('#max-care-help').textContent = sleeping ? 'Las acciones estarán disponibles al pausar o terminar el enfoque.' : occupied ? 'Retira el plato o espera a que termine antes de otra acción.' : meals ? 'Cada enfoque completado desbloquea una comida.' : 'Completa un enfoque para desbloquear comida. Puedes jugar mientras tanto.';
    dialog.querySelectorAll('[data-max-action]').forEach((action) => {
      action.disabled = !enabled || sleeping || occupied || (action.dataset.maxAction === 'food' && !meals);
      action.setAttribute('aria-describedby', 'max-care-help');
    });
    if (!enabled && dialog.open) dialog.close();
  }
  function close() { generation++; dialog.close(); }
  button.addEventListener('click', () => { update(); dialog.showModal(); });
  dialog.querySelector('.max-panel-close').addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) { close(); return; }
    const action = event.target.closest('[data-max-action]');
    if (!action || action.disabled) return;
    const request = ++generation;
    dialog.close();
    // Native dialog close/toggle handlers must settle before starting a route.
    requestAnimationFrame(() => { if (request === generation) onAction(action.dataset.maxAction); });
  });
  dialog.addEventListener('close', () => button.focus({ preventScroll: true }));
  dialog.addEventListener('cancel', () => { generation++; });
  return { update, error(text) { update(); dialog.showModal(); dialog.querySelector('#max-care-help').textContent = text; } };
}
