import { updateThemeColor } from './brand.js';

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preference = 'dark';

export function applyTheme(theme) {
  preference = ['light', 'dark', 'system'].includes(theme) ? theme : 'dark';
  const dark = preference === 'dark' || (preference === 'system' && systemTheme.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  updateThemeColor();
}

systemTheme.addEventListener('change', () => {
  if (preference === 'system') applyTheme(preference);
});
