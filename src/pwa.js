const installButton = document.querySelector('#install-app');
const installDialog = document.querySelector('#install-dialog');
const installInstructions = document.querySelector('#install-instructions');
let installPrompt = null;
let installedThisPage = false;

function isInstalled() {
  return installedThisPage
    || window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

function updateInstallButton() {
  installButton.hidden = isInstalled();
}

function installationInstructions() {
  const userAgent = window.navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome|CriOS|Edg|OPR|FxiOS/i.test(userAgent);

  if (isIos && isSafari) {
    return 'En Safari, toca Compartir y elige «Añadir a pantalla de inicio» para tener Brota junto a tus apps.';
  }
  if (isIos) {
    return 'Abre esta página en Safari, toca Compartir y elige «Añadir a pantalla de inicio».';
  }
  if (/Macintosh/i.test(userAgent) && isSafari) {
    return 'En Safari, abre el menú Archivo y elige «Añadir al Dock».';
  }
  return 'Abre el menú de tu navegador y elige «Instalar Brota» o «Añadir a pantalla de inicio». Si no aparece, prueba con Chrome o Edge.';
}

async function installApp() {
  if (!installPrompt) {
    installInstructions.textContent = installationInstructions();
    installDialog.showModal();
    return;
  }

  installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice;
  installPrompt = null;
  if (outcome === 'accepted') updateInstallButton();
}

installButton.addEventListener('click', installApp);
document.querySelector('#install-close').addEventListener('click', () => installDialog.close());
document.querySelector('#install-dismiss').addEventListener('click', () => installDialog.close());
installDialog.addEventListener('click', (event) => {
  if (event.target === installDialog) installDialog.close();
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  updateInstallButton();
});
window.addEventListener('appinstalled', () => {
  installedThisPage = true;
  installPrompt = null;
  updateInstallButton();
});
window.matchMedia('(display-mode: standalone)').addEventListener('change', updateInstallButton);
updateInstallButton();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('No se pudo registrar el service worker de Brota:', error);
    });
  });
}
