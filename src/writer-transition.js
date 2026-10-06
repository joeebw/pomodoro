// The reveal owns only presentation; the timer continues behind its modal.
import { getDailyWriterEntrance } from './writer-quotes.js';

let finishReveal;

export function revealWriterDesk() {
  finishReveal?.();
  const dialog = document.querySelector('#writer-reveal');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pages = [...dialog.querySelectorAll('.reveal-paper')];
  const pageDuration = 3200;
  const quotes = getDailyWriterEntrance();
  pages.forEach((page, index) => {
    const quote = quotes[index];
    page.querySelector('h3').textContent = quote.text;
    page.querySelector('p').textContent = `— ${quote.author}`;
    const source = page.querySelector('.reveal-signature');
    source.textContent = quote.work;
    source.href = quote.source;
    source.setAttribute('aria-label', `Leer la fuente: ${quote.work}, de ${quote.author}`);
  });
  const exitDuration = reducedMotion ? 0 : 700;
  const timeouts = [];
  let finished = false;
  const showPage = (index) => {
    pages.forEach((page, position) => { page.hidden = position !== index; });
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    timeouts.forEach(clearTimeout);
    dialog.removeEventListener('cancel', cancel);
    document.querySelector('#writer-reveal-skip').removeEventListener('click', finish);
    dialog.removeEventListener('close', finish);
    dialog.close();
    delete dialog.dataset.leaving;
    document.documentElement.classList.remove('writer-arriving');
    finishReveal = null;
    document.querySelector('#start-button').focus({ preventScroll: true });
  };
  const cancel = (event) => { event.preventDefault(); finish(); };
  dialog.addEventListener('cancel', cancel);
  dialog.addEventListener('close', finish);
  document.querySelector('#writer-reveal-skip').addEventListener('click', finish);
  finishReveal = finish;
  delete dialog.dataset.leaving;
  dialog.style.setProperty('--reveal-page-duration', `${pageDuration}ms`);
  showPage(0);
  dialog.showModal();
  pages.slice(1).forEach((_, index) => {
    timeouts.push(setTimeout(() => showPage(index + 1), pageDuration * (index + 1)));
  });
  timeouts.push(setTimeout(() => {
    dialog.dataset.leaving = 'true';
    document.documentElement.classList.add('writer-arriving');
    timeouts.push(setTimeout(finish, exitDuration));
  }, pages.length * pageDuration));
}

export function isWriterRevealOpen() {
  return document.querySelector('#writer-reveal').open;
}
