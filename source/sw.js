var cacheName = 'huangxsu'
var filesToCache = [
  '/',
  '/index.html',
  '/nayo.bundle.js',
  '/nayo.min.css'
]

self.addEventListener('install', function (event) {
  event.waitUntil(precache())
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

self.addEventListener('fetch', function (evt) {
  evt.respondWith(fromCache(evt.request))
  if(filesToCache.indexOf(evt.request.url) !== -1){
    evt.waitUntil(update(evt.request))
  }
})

function precache(){
  return caches.open(cacheName).then(function (cache) {
    return cache.addAll(filesToCache)
  })
}

function fromCache(request){
  return caches.open(cacheName).then(function(cache){
    return cache.match(request).then(function(matching){
      return matching || fetch(request)
    })
  })
}

function update(request){
  return caches.open(cacheName).then(function(cache){
    return fetch(request).then(function(response){
      return cache.put(request,response)
    })
  })
}