const CACHE = 'neon-yorunge-v3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.webmanifest',
  './ads.js',
  './native-ads-bundle.js',
  './privacy.html',
  './licenses.html',
  './game/data.js',
  './game/fx.js',
  './game/engine.js',
  './game/render.js',
  './game/screens.js',
  './game/shop-ui.js',
  './game/input.js',
  './game/main.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
