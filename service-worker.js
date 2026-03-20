const CACHE_NAME = "skillswap-cache-v8";

const urlsToCache = [
    "/skill/",
    "/skill/signup.html",
    "/skill/index.html",
    "/skill/login.html",
    "/skill/dashboard.html",
    "/skill/style.css",
    "/skill/dashboard.js",
    "/skill/supabase.js",
    "/skill/manifest.json",
    "/skill/logo.png"
];

/***********************
 * INSTALL
 ***********************/
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

/***********************
 * FETCH
 ***********************/
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

/***********************
 * ACTIVATE
 ***********************/
self.addEventListener("activate", event => {
    const whitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(names => {
            return Promise.all(
                names.map(name => {
                    if (!whitelist.includes(name)) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});
