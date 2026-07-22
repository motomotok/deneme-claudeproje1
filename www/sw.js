const CACHE = 'neon-yorunge-v5';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.webmanifest',
  './ads.js',
  './native-ads-bundle.js',
  './premium.js',
  './season-pass.js',
  './playgames.js',
  './privacy.html',
  './licenses.html',
  './fonts/orbitron.woff2',
  './fonts/rajdhani-500.woff2',
  './fonts/rajdhani-600.woff2',
  './fonts/rajdhani-700.woff2',
  './game/icons.js',
  './game/data.js',
  './game/fx.js',
  './game/engine.js',
  './game/render.js',
  './game/screens.js',
  './game/shop-ui.js',
  './game/battlepass-ui.js',
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

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

// Ağ öncelikli: her zaman en güncel sürümü getirmeye çalışır, sadece
// çevrimdışıyken (veya ağ hatasında) önbelleğe düşer. Eski "önce önbellek"
// stratejisi güncellemelerin bir sürüm geriden gelmesine (kullanıcı hep
// bir önceki deploy'u görüyor) neden oluyordu.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
