export const APP_NAME = 'INVICTO';

export const experienceName = (active) => active === 'writer' ? `${APP_NAME} / Escritor` : APP_NAME;

export const brandMark = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 2h12l8 8v12l-8 8H10l-8-8V10Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 9h8v3h-2v8h2v3h-8v-3h2v-8h-2Z" fill="currentColor"/></svg>`;

export function updateThemeColor() {
  const { theme, experience } = document.documentElement.dataset;
  const dark = theme === 'dark';
  document.querySelector('meta[name="theme-color"]').content = experience === 'writer'
    ? (dark ? '#211d19' : '#f5f0e6')
    : (dark ? '#111417' : '#f5f1e8');
}

export function renderBrand(active) {
  const writer = active === 'writer';
  document.querySelector('#brand-name').textContent = experienceName(active);
  document.querySelector('.brand-mark').innerHTML = writer ? '✒' : brandMark;
  document.querySelector('.brand').setAttribute('aria-label', `${experienceName(active)}, inicio`);
  const labels = writer
    ? { sage: 'Verde salvia', rose: 'Rosa suave', lavender: 'Lavanda', ocean: 'Azul océano' }
    : { sage: 'Oro', rose: 'Cobre', lavender: 'Plata', ocean: 'Azul acero' };
  document.querySelectorAll('.color-swatch').forEach((button) => {
    button.setAttribute('aria-label', labels[button.dataset.color]);
    button.title = labels[button.dataset.color];
  });
  document.querySelector('.footer > span:first-child').textContent = writer
    ? 'Una página a la vez.' : 'La constancia conquista.';
  updateThemeColor();
}
