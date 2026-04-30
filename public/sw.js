const CACHE_NAME = "nnm-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // 古いバージョンのキャッシュを全削除
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Next.js静的アセット（/_next/static/）はキャッシュ優先
  // ファイル名にコンテンツハッシュが入るので古くならない
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // HTMLやAPIは常にネットワーク優先（オフライン時のみキャッシュ）
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
