export function createSettingsSections(root, onCollapse) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const resets = [];

  root.querySelectorAll('.settings-section').forEach((section) => {
    const summary = section.querySelector('summary');
    const content = section.querySelector('.settings-section-content');
    let expanded = section.open;
    let animation = null;

    function updateExpanded(value) {
      expanded = value;
      section.dataset.expanded = String(value);
      summary.setAttribute('aria-expanded', String(value));
      content.inert = !value;
    }

    function settle() {
      section.open = expanded;
      animation?.cancel();
      animation = null;
      content.style.overflow = '';
    }

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      // Read the visible height before cancelling so rapid clicks reverse smoothly.
      const height = section.open ? content.getBoundingClientRect().height : 0;
      const opacity = section.open ? getComputedStyle(content).opacity : '0';
      animation?.cancel();
      updateExpanded(!expanded);
      if (!expanded) onCollapse?.(section);
      if (reducedMotion.matches || typeof content.animate !== 'function') {
        settle();
        return;
      }

      section.open = true;
      content.style.overflow = 'hidden';
      animation = content.animate([
        { height: `${height}px`, opacity },
        { height: expanded ? `${content.scrollHeight}px` : '0px', opacity: expanded ? 1 : 0 },
      ], {
        duration: expanded ? 340 : 260,
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'both',
      });
      const transition = animation;
      transition.onfinish = () => {
        if (animation === transition) settle();
      };
    });

    updateExpanded(expanded);
    resets.push(() => {
      updateExpanded(false);
      settle();
    });
  });

  return { reset: () => resets.forEach((reset) => reset()) };
}
