// Mechanical feedback is independent of the clock and saved session state.
let lastKey = 0;

export function prepareWriterMachine() {
  const keys = document.querySelector('#machine-keys');
  if (keys.childElementCount) return;
  ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].forEach((row, index) => {
    [...row].forEach((letter, position) => {
      const x = 320 + (position - (row.length - 1) / 2) * 38;
      const y = 332 + index * 23;
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.classList.add('machine-key');
      const key = document.createElementNS(group.namespaceURI, 'ellipse');
      key.setAttribute('cx', x); key.setAttribute('cy', y); key.setAttribute('rx', 13); key.setAttribute('ry', 8);
      const label = document.createElementNS(group.namespaceURI, 'text');
      label.setAttribute('x', x); label.setAttribute('y', y + 3);
      label.setAttribute('text-anchor', 'middle'); label.setAttribute('fill', '#4b4b3b');
      label.setAttribute('stroke', 'none'); label.setAttribute('font-size', '8'); label.setAttribute('font-family', 'monospace');
      label.textContent = letter;
      group.append(key, label); keys.append(group);
    });
  });
}

export function setWriterMachineRunning(running) {
  document.querySelector('.writer-machine').dataset.running = String(running);
}

export function animateWriterMachine(action) {
  if (document.documentElement.dataset.experience !== 'writer'
    || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const machine = document.querySelector('.writer-machine');
  if (typeof machine.animate !== 'function') return;
  const keys = [...machine.querySelectorAll('.machine-key')];
  const paper = machine.querySelector('.machine-paper');
  const typebar = machine.querySelector('.machine-typebar');
  const timer = document.querySelector('.timer-content');
  [...keys, paper, typebar, timer].forEach((part) => part.getAnimations().forEach((animation) => animation.cancel()));
  const duration = action === 'pause' ? 360 : 800;
  const lift = action === 'complete' ? -12 : action === 'pause' ? 2 : -6;
  const scale = machine.getBoundingClientRect().width / 640;
  const feed = (distance) => [
    { transform: 'translateY(0)' },
    { transform: `translateY(${distance}px)`, offset: .4 },
    { transform: 'translateY(0)' },
  ];
  paper.animate(feed(lift), { duration, easing: 'cubic-bezier(.22,1,.36,1)' });
  timer.animate(feed(lift * scale), { duration, easing: 'cubic-bezier(.22,1,.36,1)' });
  if (action === 'complete') return;
  const count = action === 'start' ? 5 : 1;
  for (let index = 0; index < count; index += 1) {
    const key = keys[(lastKey + index * 5) % keys.length];
    key?.animate([
      { transform: 'translateY(0)' }, { transform: 'translateY(4px)', offset: .4 }, { transform: 'translateY(0)' },
    ], { duration: 180, delay: index * 85, easing: 'ease-in-out' });
  }
  lastKey = (lastKey + count) % keys.length;
  if (action === 'start') {
    typebar.animate([
      { opacity: 0, transform: 'translateY(0)' },
      { opacity: 1, transform: 'translateY(-19px)', offset: .35 },
      { opacity: 0, transform: 'translateY(0)' },
    ], { duration: 180, iterations: 3, easing: 'ease-in-out' });
  }
}
