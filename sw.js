/* 몬스타엑스 응원법 모음 - 오프라인 캐시 서비스 워커
   GitHub Pages 하위 경로(/monbebe-cheer-guide/)에서 동작하도록 모든 경로는 상대 경로. */
const CACHE_NAME = 'monbebe-cheer-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './assets/index-DFcjvak6.js',
  './assets/index-BMwyjUyZ.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }
  // 같은 origin 요청만 처리 (외부 리소스는 브라우저 기본 동작)
  if (url.origin !== self.location.origin) return;

  // 페이지 이동(navigation): 캐시된 index.html을 우선 사용해 오프라인에서도 열리게 하고,
  // 네트워크가 되면 조용히 최신 index.html로 갱신한다.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached =
          (await cache.match('./index.html', { ignoreSearch: true })) ||
          (await cache.match('./', { ignoreSearch: true }));

        const fresh = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              cache.put('./index.html', response.clone());
            }
            return response;
          })
          .catch(() => null);

        if (cached) {
          event.waitUntil(fresh);
          return cached;
        }

        const network = await fresh;
        if (network) return network;
        const fallback = await cache.match('./index.html', { ignoreSearch: true });
        return fallback || Response.error();
      })()
    );
    return;
  }

  // 정적 GET: cache-first, 없으면 네트워크 요청 후 캐시에 저장
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (response && response.ok && response.type === 'basic') {
          cache.put(request, response.clone());
        }
        return response;
      } catch (e) {
        const fallback = await cache.match('./index.html', { ignoreSearch: true });
        if (fallback) return fallback;
        throw e;
      }
    })()
  );
});
