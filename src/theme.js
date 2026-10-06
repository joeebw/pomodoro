const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preference = 'light';

export function applyTheme(theme) {
  preference = ['light', 'dark', 'system'].includes(theme) ? theme : 'light';
  const dark = preference === 'dark' || (preference === 'system' && systemTheme.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const writer = document.documentElement.dataset.experience === 'writer';
  document.querySelector('meta[name="theme-color"]').content = writer
    ? (dark ? '#211d19' : '#f5f0e6')
    : (dark ? '#151e19' : '#f5f3ed');
}

systemTheme.addEventListener('change', () => {
  if (preference === 'system') applyTheme(preference);
});
