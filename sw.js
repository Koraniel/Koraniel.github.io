
const CACHE = "portfolio-cache-v1";
const ASSETS = [
  "/", "/index.html", "/ru.html", "/config.json",
  "/assets/css/style.css",
  "/assets/js/app.js",
  "/assets/i18n/en.json", "/assets/i18n/ru.json",
  "/assets/img/avatar.png",
  "/assets/img/favicon-16.png", "/assets/img/favicon-32.png",
  "/assets/img/favicon-192.png", "/assets/img/android-chrome-512x512.png",
  "/assets/img/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE) && caches.delete(k))))
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone();
      if (req.method === "GET" && res.ok) {
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match("/index.html")))
  );
});
