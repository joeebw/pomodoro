import { APP_NAME } from './brand.js';

// Shared, local SVG artwork for the preparation card and the victory reveal.
export function beltMarkup(prefix) {
  return `<svg class="belt-art" viewBox="0 0 360 170" aria-hidden="true">
    <defs>
      <linearGradient id="${prefix}-gold" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="var(--metal-highlight, #f6e3a6)"/><stop offset=".32" stop-color="var(--metal, #bc9044)"/><stop offset=".55" stop-color="var(--metal-highlight, #eed48a)"/><stop offset="1" stop-color="var(--metal-shadow, #9c7034)"/>
      </linearGradient>
      <linearGradient id="${prefix}-leather" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#383b3b"/><stop offset="1" stop-color="#12191b"/>
      </linearGradient>
    </defs>
    <ellipse cx="180" cy="149" rx="137" ry="9" fill="#000" opacity=".22"/>
    <path d="M12 59 Q180 41 348 59 L348 123 Q180 141 12 123Z" fill="url(#${prefix}-leather)" stroke="var(--metal-shadow, #6e6451)"/>
    <path d="M20 66 Q180 51 340 66 M20 116 Q180 132 340 116" fill="none" stroke="var(--metal, #a7956a)" stroke-dasharray="2 4" opacity=".55"/>
    <g fill="url(#${prefix}-gold)" stroke="var(--metal-shadow, #8f6c36)">
      <path d="M55 61 96 58 107 87 96 120 55 119 43 91Z"/>
      <path d="M305 61 264 58 253 87 264 120 305 119 317 91Z"/>
      <path d="M136 35 Q180 16 224 35 L239 67 235 120 Q180 153 125 120 L121 67Z"/>
    </g>
    <g fill="none" stroke="var(--metal-highlight, #fff1c4)" opacity=".6">
      <path d="M142 43 Q180 28 218 43 L229 69 225 114 Q180 140 135 114 L131 69Z"/>
      <circle cx="75" cy="89" r="19"/><circle cx="285" cy="89" r="19"/>
    </g>
    <g fill="#252629"><path d="m75 77 3 8 9 0-7 6 2 9-7-5-7 5 2-9-7-6h9Z"/><path d="m285 77 3 8 9 0-7 6 2 9-7-5-7 5 2-9-7-6h9Z"/></g>
    <circle cx="180" cy="81" r="27" fill="var(--metal-highlight, #f5dfa0)" stroke="var(--metal-shadow, #a17a3b)"/>
    <path d="m180 61 5 13 14 1-11 9 4 14-12-8-12 8 4-14-11-9 14-1Z" fill="var(--metal-shadow, #97702e)"/>
    <g fill="#252629" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800">
      <text x="180" y="49" font-size="9" letter-spacing="2">${APP_NAME}</text>
      <text x="180" y="120" font-size="10" letter-spacing="1.8">CAMPEÓN</text>
    </g>
    <g fill="var(--metal, #bfa575)"><circle cx="28" cy="82" r="2"/><circle cx="28" cy="99" r="2"/><circle cx="332" cy="82" r="2"/><circle cx="332" cy="99" r="2"/></g>
  </svg>`;
}

export function renderChampionPath(championship, completed, { step, target, won }) {
  const stage = document.querySelector('#champion-stage');
  if (!stage.querySelector('.belt-art')) stage.querySelector('.champion-belt').innerHTML = beltMarkup('arena');
  const previous = Number(stage.dataset.completed ?? completed);
  stage.dataset.completed = String(completed);
  stage.dataset.won = String(won);
  stage.style.setProperty('--champion-progress', String(step / target));
  stage.setAttribute('aria-label', `${step} de ${target} etapas. ${championship.belts} cinturones conquistados.`);
  document.querySelector('#champion-stage-label').textContent = won ? 'CINTURÓN CONQUISTADO' : 'EL CAMINO DEL CAMPEÓN';
  const path = stage.querySelector('.champion-path');
  path.style.setProperty('--path-progress', `${Math.max(0, step - 1) / (target - 1) * 100}%`);
  path.replaceChildren(...Array.from({ length: target }, (_, index) => {
    const item = document.createElement('li');
    item.className = index < step ? 'done' : '';
    if (!won && index === step) item.classList.add('current');
    item.textContent = String(index + 1);
    item.setAttribute('aria-label', `Etapa ${index + 1}: ${index < step ? 'completada' : 'pendiente'}`);
    return item;
  }));
  document.querySelector('#progress-caption').textContent = won ? 'La constancia tiene recompensa.' : `${step} de ${target} etapas · tu próxima conquista`;
  document.querySelector('#champion-total').textContent = `${completed} sesiones de enfoque completadas`;
  if (completed > previous && !matchMedia('(prefers-reduced-motion: reduce)').matches && stage.animate) {
    stage.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.3)' }, { filter: 'brightness(1)' }], { duration: 900 });
    const metal = getComputedStyle(stage).getPropertyValue('--arena-gold').trim();
    path.children[step - 1]?.animate([
      { transform: 'scale(.7)', boxShadow: '0 0 0 transparent' },
      { transform: 'scale(1.2)', boxShadow: `0 0 22px ${metal}`, offset: .5 },
      { transform: 'scale(1)', boxShadow: `0 0 13px ${metal}` },
    ], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
}
