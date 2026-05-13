const CACHE = 'dronewx-v1';
const OFFLINE_ASSETS = [
  './index.html',
  './manifest.json'
];

// Install — cache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - App shell (HTML/manifest) → cache first
// - API calls (open-meteo, noaa, geocoding) → network first, fallback to cache
// - Fonts → cache first
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // App shell — cache first
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
    return;
  }

  // Google Fonts — cache first
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(resp => {
            cache.put(e.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }

  // API calls — network first, cache as fallback (offline shows last data)
  if (
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('geocoding-api.open-meteo.com') ||
    url.hostname.includes('swpc.noaa.gov')
  ) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Default — try network
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
