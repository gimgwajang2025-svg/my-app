// 서비스 워커: 앱 파일을 저장해 두고, 인터넷이 없을 때도 열리게 한다.
// 인터넷이 되면 항상 새 파일을 먼저 받는다(network-first). 안 되면 저장해 둔 파일로 연다.
// ※ 앱 파일을 고치면 아래 숫자(v2 → v3 …)를 올린다.
const CACHE = 'my-app-plant-diary-v7';
const FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './plants-data.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // 기다리지 않고 바로 새 버전 적용
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('my-app-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-store' })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
  );
});
