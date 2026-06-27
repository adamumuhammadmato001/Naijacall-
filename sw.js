const cacheName = 'naijacall-pi-v1';
const staticAssets = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', async el => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', el => {
  self.clients.claim();
});

self.addEventListener('fetch', async el => {
  const req = el.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    el.respondWith(cacheFirst(req));
  } else {
    el.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
