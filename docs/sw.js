/**
 * Service Worker for Reality Anchors PWA.
 *
 * Strategy: Network-first with offline fallback cache.
 * Caches static assets (images, fonts, CSS/JS) on first visit.
 * Serves cached content when offline.
 */

const CACHE_NAME = 'ra-v1';
const OFFLINE_URL = '/';

const PRECACHE_URLS = [
  '/',
  '/calculator/',
  '/commercial/',
  '/assets/brand/svg/logo-ra-speed-square-dark.svg',
  '/assets/brand/favicon-dark.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.ok && (event.request.url.match(/\.(js|css|png|jpg|svg|woff2?)$/) || event.request.mode === 'navigate')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, serve the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
