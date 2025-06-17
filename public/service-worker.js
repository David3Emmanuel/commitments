// service-worker.js
// This is the service worker script that will be registered by the Vite PWA plugin
// The actual implementation will be injected by the plugin

// You can customize the caching strategies here if needed
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
