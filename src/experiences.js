import { renderBrand } from './brand.js';
import { MODES } from './timer.js';
import { getDailyQuote } from './quotes.js';
import { getDailyWriterQuote } from './writer-quotes.js';
import { prepareWriterMachine, animateWriterMachine } from './writer-machine.js';
import { renderChampionPath } from './champion-art.js';

let dailyReadingTimeout;
const getManuscriptStage = (completed) => completed === 0 ? 0 : ((completed - 1) % 4) + 1;

export function normalizeExperience(saved) {
  const writerUnlocked = saved?.writerUnlocked === true;
  return { writerUnlocked, active: writerUnlocked && saved?.active === 'writer' ? 'writer' : 'brota' };
}

export function unlockWriterExperience(code, current) {
  if (typeof code !== 'string' || code.trim().toUpperCase() !== 'COBAYA') return null;
  return { ...normalizeExperience(current), writerUnlocked: true, active: 'writer' };
}

const EXPERIENCES = {
  brota: {
    modes: MODES,
    focusNote: 'Entrena tu enfoque. Construye tu próxima victoria.',
    pauseNote: 'Toma aire. Te lo has ganado.',
    completedNote: '¡Etapa completada! Estás más cerca del cinturón.',
    completedBody: 'Una etapa más en tu camino al campeonato.',
    breakNote: 'Pausa terminada. Cuando quieras, seguimos.',
    breakBody: 'Toma aire; una nueva sesión de enfoque te espera.',
    readyNote: 'Temporizador listo cuando tú lo estés.',
  },
  writer: {
    modes: {
      focus: { label: 'TU MOMENTO DE ESCRITURA', caption: 'minutos para escribir' },
      short: { label: 'UN RESPIRO ENTRE LÍNEAS', caption: 'minutos para tomar aire' },
      long: { label: 'DEJA REPOSAR TU HISTORIA', caption: 'minutos para volver con otra mirada' },
    },
    focusNote: 'Una frase a la vez. Tu historia te espera.',
    pauseNote: 'Deja reposar las palabras. Te has ganado esta pausa.',
    completedNote: '¡Sesión completa! Tu manuscrito tiene un nuevo comienzo.',
    completedBody: 'Tu manuscrito sigue creciendo.',
    breakNote: 'Pausa terminada. Volvemos a la página cuando quieras.',
    breakBody: 'Una nueva sesión de escritura te espera.',
    readyNote: 'La página está lista cuando tú lo estés.',
    stageLabels: ['Una hoja en blanco', 'Las primeras líneas de un borrador', 'Una página escrita', 'Varias hojas de un manuscrito', 'Un manuscrito completo'],
    stageCaptions: ['Toda historia empieza con un espacio', 'Las primeras líneas ya tienen un lugar', 'Una página empieza a encontrar su voz', 'Tu constancia reúne nuevas páginas', 'Un manuscrito hecho de pequeños momentos'],
  },
};

export const getExperienceCopy = (active) => EXPERIENCES[active] || EXPERIENCES.brota;

export function renderExperience(active, { animate = false } = {}) {
  const writer = active === 'writer';
  const $ = (selector) => document.querySelector(selector);
  document.documentElement.dataset.experience = writer ? 'writer' : 'brota';
  renderBrand(active);
  $('#progress-label').textContent = writer ? 'sesiones' : 'cinturones';
  $('#progress-icon').textContent = writer ? '✎' : '★';
  document.querySelector('.mode[data-mode="focus"]').textContent = writer ? 'Escritura' : 'Enfoque';
  $('.garden-panel').setAttribute('aria-label', writer ? 'Tu manuscrito' : 'El camino del campeón');
  $('#garden-kicker').textContent = writer ? 'TU MANUSCRITO' : 'TU PREPARACIÓN';
  $('#garden-title').textContent = writer ? 'Algo tuyo está tomando forma.' : 'El campeonato empieza contigo.';
  $('.garden-sun').textContent = writer ? '✎' : '★';
  $('#champion-stage').hidden = writer;
  $('#champion-total').hidden = writer;
  $('#manuscript-stage').hidden = !writer;
  $('#garden-tip-text').textContent = writer
    ? 'Cada sesión de enfoque suma un nuevo momento a tu manuscrito. Escribe a tu ritmo.'
    : 'Una sesión, una etapa. Completa tu preparación y conquista el cinturón. Descansar también es entrenar.';
  const quote = writer ? getDailyWriterQuote() : getDailyQuote();
  const figure = $('.daily-quote');
  (writer ? $('#writer-reading-home') : $('#daily-quote-home')).append(figure);
  figure.setAttribute('aria-label', writer ? 'Fragmento literario del día' : 'Frase del día');
  $('#daily-quote-text').textContent = quote.text;
  $('#daily-quote-author').textContent = `— ${quote.author}`;
  $('#daily-quote-work').hidden = !quote.work;
  $('#daily-quote-work').textContent = quote.work || '';
  $('#daily-quote-source').hidden = !quote.source;
  $('#daily-quote-source').textContent = writer ? 'Leer la obra ↗' : 'Ver la fuente ↗';
  if (quote.source) $('#daily-quote-source').href = quote.source;
  const today = new Date();
  $('#reading-date').textContent = today.toLocaleDateString('es', { day: 'numeric', month: 'long' });
  $('#reading-date').dateTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  prepareWriterMachine();
  clearTimeout(dailyReadingTimeout);
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  dailyReadingTimeout = setTimeout(() => renderExperience(active), midnight.getTime() - today.getTime() + 100);

  if (animate) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.focus-panel, .garden-panel').forEach((panel) => {
      panel.getAnimations().forEach((animation) => animation.cancel());
      if (reducedMotion || typeof panel.animate !== 'function') return;
      panel.animate([{ opacity: .35, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration: 450, easing: 'cubic-bezier(.22,1,.36,1)',
      });
    });
  }
}

export function renderExperienceProgress(active, completed, championship, view) {
  const stage = getManuscriptStage(completed);
  const copy = getExperienceCopy(active);
  const manuscript = document.querySelector('#manuscript-stage');
  manuscript.dataset.stage = String(stage);
  const previous = manuscript.dataset.completed === undefined ? completed : Number(manuscript.dataset.completed);
  manuscript.dataset.completed = String(completed);
  if (active === 'writer' && completed > previous) animateWriterMachine('complete');
  if (active === 'writer') {
    manuscript.setAttribute('aria-label', copy.stageLabels[stage]);
    document.querySelector('#progress-caption').textContent = copy.stageCaptions[stage];
  } else {
    renderChampionPath(championship, completed, view);
  }
}
