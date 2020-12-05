
const cacheName = 'hello-pwa'
const filesToCache = ['index.html']

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', event => {
	console.log('service worker installing')
	event.waitUntil(
		caches.open(cacheName).then( cache => cache.addAll(filesToCache))
	)
})

/* Serve cached content when offline */
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then( response => response || fetch(event.request))
	)
})

self.addEventListener('activate', function(event) {

  var cacheAllowlist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
