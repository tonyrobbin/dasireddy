var cacheName = 'e-commerce-v2';
var filesToCache = [
  '/',
  '/index.html',
  '/signup.html',  
  '/ads.html',
  '/add-ads.html',
  '/contact.html',
  '/inbox.html',
  '/description.html',
  '/user-ads.html',
  '/offline-ads.html',
  '/js/auth.js',
  '/js/add-ads.js',
  '/js/ads.js',
  '/js/inbox.js',
  '/js/main.js',
  '/js/message.js',
  '/js/firebase-init.js', 
  '/js/offline.js', 
  '/js/details.js',
  '/js/userAds.js',
  '/css/bootstrap.min.css',
  '/css/style.css',
  '/images/bg.jpg',
  '/images/loader.png',
  '/images/close.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
});
















// Listener for Push Notification
self.addEventListener('push', function (event) {
  console.log('Received a push message', event);
  var notification = event.data.json().notification
  var title = notification.title;
  var body = notification.body;
  var icon = 'images/icons192.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
    })
  );

});

// on Notification Click do whatever you want...
self.addEventListener('notificationclick', function (event) {
  console.log('On notification click: ', event.notification);
  event.notification.close();
});
