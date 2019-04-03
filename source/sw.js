var cacheName = 'huangxsu'
var filesToCache = [
  '/',
  '/index.html',
  '/nayo.bundle.js',
  '/nayo.min.css'
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          return caches.delete(key)
        }
      }))
    })
  )
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request)
    })
  )
})