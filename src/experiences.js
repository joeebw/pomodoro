import { MODES, getPlantStage } from './timer.js';
import { getDailyQuote } from './quotes.js';
import { getDailyWriterQuote } from './writer-quotes.js';
import { prepareWriterMachine, animateWriterMachine } from './writer-machine.js';

let dailyReadingTimeout;

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
    focusNote: 'Un paso a la vez. Tu planta te acompaña.',
    pauseNote: 'Toma aire. Te lo has ganado.',
    completedNote: '¡Sesión completa! Tu planta creció contigo.',
    completedBody: 'Tu planta creció.',
    breakNote: 'Pausa terminada. Cuando quieras, seguimos.',
    breakBody: 'Toma aire; una nueva sesión de enfoque te espera.',
    readyNote: 'Temporizador listo cuando tú lo estés.',
    stageLabels: ['Una semilla lista para crecer', 'Un brote tierno', 'Una planta joven', 'Una planta floreciendo', 'Una planta en su máximo esplendor'],
    stageCaptions: ['Una semilla llena de posibilidades', '¡Un brote nuevo encontró su camino!', 'Tu constancia le da nuevas hojas', 'Mira qué bien está creciendo', 'Una planta feliz, gracias a ti'],
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
  const dark = document.documentElement.dataset.theme === 'dark';
  document.querySelector('meta[name="theme-color"]').content = writer
    ? (dark ? '#211d19' : '#f5f0e6')
    : (dark ? '#151e19' : '#f5f3ed');
  $('#brand-name').textContent = writer ? 'brota / escritor' : 'brota';
  $('.brand-mark').textContent = writer ? '✒' : '✳';
  $('#progress-label').textContent = writer ? 'sesiones' : 'plantas';
  $('#progress-icon').textContent = writer ? '✎' : '✿';
  document.querySelector('.mode[data-mode="focus"]').textContent = writer ? 'Escritura' : 'Enfoque';
  $('.garden-panel').setAttribute('aria-label', writer ? 'Tu manuscrito' : 'Tu jardín');
  $('#garden-kicker').textContent = writer ? 'TU MANUSCRITO' : 'TU JARDÍN';
  $('#garden-title').textContent = writer ? 'Algo tuyo está tomando forma.' : 'Algo bonito está creciendo.';
  $('.garden-sun').textContent = writer ? '✎' : '☼';
  $('#plant-stage').hidden = writer;
  $('#manuscript-stage').hidden = !writer;
  $('#garden-tip-text').textContent = writer
    ? 'Cada sesión de enfoque suma un nuevo momento a tu manuscrito. Escribe a tu ritmo.'
    : 'Cada minuto de enfoque ayuda a tu planta a crecer. Cuídala a tu ritmo.';
  const quote = writer ? getDailyWriterQuote() : getDailyQuote();
  const figure = $('.daily-quote');
  (writer ? $('#writer-reading-home') : $('#daily-quote-home')).append(figure);
  figure.setAttribute('aria-label', writer ? 'Fragmento literario del día' : 'Frase del día');
  $('#daily-quote-text').textContent = quote.text;
  $('#daily-quote-author').textContent = `— ${quote.author}`;
  $('#daily-quote-work').hidden = !writer;
  $('#daily-quote-work').textContent = quote.work || '';
  $('#daily-quote-source').hidden = !writer;
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

export function renderExperienceProgress(active, completed) {
  const stage = getPlantStage(completed);
  const copy = getExperienceCopy(active);
  const plant = document.querySelector('#plant-stage');
  const manuscript = document.querySelector('#manuscript-stage');
  plant.className = `plant-stage stage-${stage}`;
  manuscript.dataset.stage = String(stage);
  const previous = manuscript.dataset.completed === undefined ? completed : Number(manuscript.dataset.completed);
  manuscript.dataset.completed = String(completed);
  if (active === 'writer' && completed > previous) animateWriterMachine('complete');
  const illustration = active === 'writer' ? manuscript : plant;
  illustration.setAttribute('aria-label', copy.stageLabels[stage]);
  document.querySelector('#plant-caption').textContent = copy.stageCaptions[stage];
}
