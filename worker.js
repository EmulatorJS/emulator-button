const CACHE_NAME = "offline";
const OFFLINE_URL = "offline.html";

self.addEventListener("install", function(e) {
    event.waitUntil(
        (async function() {
            const cache = await caches.open(CACHE_NAME);
            await cache.add(new Request(OFFLINE_URL, {cache: "reload"}));
        })()
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(e) {
    self.clients.claim();
});

self.addEventListener("fetch", function(e) {
    if (e.request.mode === "navigate") {
        e.respondWith(
            (async function() {
                try {
                    const res = await fetch(e.request);
                    if (!res.status.toString().startsWith('2')) {
                        throw new Error('not ok response code');
                    }
                    return res;
                } catch (e) {
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(OFFLINE_URL);
                    return cachedResponse;
                }
            })()
        );
    }
});
