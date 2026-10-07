// Incrementa esta versión al cambiar los recursos precargados de la aplicación.
const CACHE_NAME = 'brota-shell-v22';
const APP_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/writer.css',
  '/celebration.css',
  '/champion.css',
  '/invicto.css',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/assets/audio/bells.mp3',
  '/assets/audio/flute.mp3',
  '/assets/audio/melody.mp3',
  '/src/alarms.js',
  '/src/settings-sections.js',
  '/src/theme.js',
  '/src/brand.js',
  '/src/experiences.js',
  '/src/writer-quotes.js',
  '/src/writer-transition.js',
  '/src/writer-machine.js',
  '/src/main.js',
  '/src/pwa.js',
  '/src/storage.js',
  '/src/timer.js',
  '/src/quotes.js',
  '/src/athlete-quotes.js',
  '/src/session-celebration.js',
  '/src/championship.js',
  '/src/champion-art.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES.map((path) => new Request(path, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('brota-shell-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);
  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, { cache: 'no-cache' });
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match('/index.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const appWindow = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (appWindow) {
      await appWindow.focus();
      return;
    }
    await self.clients.openWindow(event.notification.data?.url || '/');
  })());
});
