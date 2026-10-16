export function createDailySessionControls({ onOpen, onAdjust }) {
  const trigger = document.querySelector('#daily-sessions');
  const panel = document.querySelector('#daily-sessions-panel');
  const decrease = document.querySelector('#daily-sessions-decrease');
  const increase = document.querySelector('#daily-sessions-increase');
  const value = document.querySelector('#daily-sessions-value');

  function positionPanel(opening = false) {
    if (opening !== true && !panel.matches(':popover-open')) return;
    const anchor = trigger.getBoundingClientRect();
    const width = opening === true ? Math.min(310, window.innerWidth - 24) : panel.offsetWidth;
    const height = opening === true ? 0 : panel.offsetHeight;
    const left = Math.max(12, Math.min(anchor.right - width, window.innerWidth - width - 12));
    const top = Math.max(12, Math.min(anchor.bottom + 8, window.innerHeight - height - 12));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  panel.addEventListener('beforetoggle', (event) => {
    if (event.newState === 'open') {
      onOpen();
      positionPanel(true);
    }
    trigger.setAttribute('aria-expanded', String(event.newState === 'open'));
  });
  panel.addEventListener('toggle', (event) => {
    if (event.newState === 'open') {
      positionPanel();
      (decrease.disabled ? increase : decrease).focus({ preventScroll: true });
    }
  });
  decrease.addEventListener('click', () => onAdjust(-1));
  increase.addEventListener('click', () => onAdjust(1));
  window.addEventListener('resize', positionPanel);
  window.addEventListener('scroll', positionPanel, { passive: true });

  return {
    render(sessionsToday) {
      value.textContent = `${sessionsToday} ${sessionsToday === 1 ? 'sesión' : 'sesiones'} hoy`;
      decrease.disabled = sessionsToday === 0;
      trigger.setAttribute('aria-label', `Ajustar ${value.textContent}`);
      if (decrease.disabled && document.activeElement === decrease) increase.focus({ preventScroll: true });
      positionPanel();
    },
  };
}
