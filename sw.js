/* FitDay Service Worker：每次回源校验（保证最新版），断网时用缓存 */
const CACHE = "fitday-v19";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css?v=18",
  "./js/data-foods.js?v=18",
  "./js/data-exercises.js?v=18",
  "./js/data-courses.js?v=18",
  "./js/data-videos.js?v=18",
  "./js/ex-anim.js?v=18",
  "./js/engine.js?v=18",
  "./js/views.js?v=18",
  "./js/app.js?v=18",
  "./manifest.webmanifest",
  "./icons/icon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  /* cache:no-cache 强制回源校验——用户永远拿到最新版，断网时回落到缓存 */
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
  );
});
