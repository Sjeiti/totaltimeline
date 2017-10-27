const CACHE_NAME = 'TotalTimeline-v0.1.62';
const urlsToCache = [
  '/',
  '/fonts/icomoon.eot',
  '/fonts/icomoon.svg',
  '/fonts/icomoon.ttf',
  '/fonts/icomoon.woff',
  '/js/index.js',
  '/static/Epica-tpt-co2.csv',
  '/static/eras.json',
  '/static/events.json',
  '/static/Hyde-3.1-population.csv',
  '/static/icon.png',
  '/style/noise.png',
  '/style/screen.css'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request)
      .then(response=>{
        if (response) return response;
        return fetch(e.request.clone())
          .then(response=>{
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            caches.open(CACHE_NAME)
              .then(cache=>{
                cache.put(e.request, response.clone());
              });
            return response;
          }
        );
      })
    );
});