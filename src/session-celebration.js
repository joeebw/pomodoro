import { getCompletionQuote } from './quotes.js';
import { beltMarkup } from './champion-art.js';

// Presentation waits for a visible page and for other dialogs to close.
export function createSessionCelebration({ getExperience, onDismiss, onRest }) {
  const dialog = document.querySelector('#session-celebration');
  const particles = dialog.querySelector('.celebration-particles');
  let pending = null;
  let shown = false;

  const flush = () => {
    if (!pending || shown || document.visibilityState !== 'visible' || document.querySelector('dialog[open]')) return;
    if (getExperience() !== 'brota') {
      pending = null;
      onDismiss();
      return;
    }
    const citation = getCompletionQuote(pending.completed);
    const won = pending.won === true;
    dialog.dataset.victory = String(won);
    dialog.querySelector('.celebration-emblem').innerHTML = beltMarkup('celebration');
    dialog.querySelector('#celebration-title').textContent = won ? 'Cinturón conquistado.' : 'Etapa conquistada.';
    dialog.querySelector('#celebration-award').textContent = won ? `CAMPEONATO Nº ${pending.belts || 1}` : 'TU CONSTANCIA MARCA LA DIFERENCIA';
    dialog.querySelector('.section-kicker').textContent = won ? 'EL TRABAJO SE CONVIERTE EN VICTORIA' : 'UNA SESIÓN. UNA ETAPA MÁS.';
    dialog.querySelector('.celebration-next').textContent = won
      ? 'Has completado tu preparación. Disfruta tu pausa larga: tu próximo campeonato te espera.'
      : 'Tu preparación avanza. Recupera energía y vuelve por la siguiente etapa.';
    const target = Math.min(8, Math.max(2, Math.floor(pending.target || 4)));
    const step = Math.min(target, Math.max(1, Math.floor(pending.step || 1)));
    const path = dialog.querySelector('.celebration-path');
    path.style.setProperty('--path-progress', `${Math.max(0, step - 1) / (target - 1) * 100}%`);
    path.replaceChildren(...Array.from({ length: target }, (_, index) => {
      const item = document.createElement('li');
      item.textContent = String(index + 1);
      item.className = index < step ? 'done' : '';
      item.setAttribute('aria-label', `Etapa ${index + 1}: ${index < step ? 'completada' : 'pendiente'}`);
      return item;
    }));
    dialog.querySelector('#celebration-quote').textContent = citation.text;
    dialog.querySelector('#celebration-author').textContent = `— ${citation.author}`;
    const source = dialog.querySelector('#celebration-source');
    source.href = citation.source;
    source.textContent = citation.work;
    dialog.querySelector('#celebration-progress').textContent = `${pending.minutes} minutos de enfoque · etapa ${step} de ${target}`;
    dialog.querySelector('#celebration-rest').textContent = pending.breakMode === 'long' ? 'Disfrutar mi pausa larga' : 'Disfrutar mi descanso';
    particles.replaceChildren();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let index = 0; index < (won ? 48 : 24); index += 1) {
        const spark = document.createElement('i');
        const angle = (index / (won ? 48 : 24)) * Math.PI * 2;
        const distance = 140 + (index % 5) * 34;
        spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        spark.style.setProperty('--spark-turn', `${index * 47}deg`);
        spark.style.setProperty('--spark-delay', `${(index % 8) * 45}ms`);
        particles.append(spark);
      }
    }
    shown = true;
    dialog.showModal();
  };

  const dismiss = () => {
    if (!shown) return;
    pending = null;
    shown = false;
    particles.replaceChildren();
    onDismiss();
  };
  dialog.addEventListener('close', dismiss);
  dialog.querySelector('#celebration-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('#celebration-rest').addEventListener('click', () => {
    // Clear the pending celebration synchronously before starting the break.
    dismiss();
    dialog.close();
    onRest();
  });
  document.addEventListener('visibilitychange', flush);
  document.addEventListener('close', flush, true);
  window.addEventListener('pageshow', flush);

  return {
    request(data) {
      if (!data || !Number.isFinite(data.completed) || data.completed < 1 || !Number.isFinite(data.minutes)) return;
      pending = data;
      flush();
    },
    isOpen: () => dialog.open,
  };
}
