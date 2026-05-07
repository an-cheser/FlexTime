const CACHE_NAME = 'flextime-v3.5';
const urlsToCache = [
    '/',
    '/index.html',
    '/icon.png',
    '/favicon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).catch(() => {
                // Если нет сети и нет кеша – можно вернуть офлайн-страницу
                return caches.match('/index.html');
            });
        })
    );
});
