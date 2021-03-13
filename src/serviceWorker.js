const CACHE_NAME = 'TotalTimeline-v1.0.3';
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
    caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event=>{
  event.respondWith(
    caches.match(event.request).then(resp=>{
      return resp || fetch(event.request).then(response=>{
        return caches.open(CACHE_NAME).then(cache=>{
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});