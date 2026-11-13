const CACHE = "fiado-digital-v1"
const ROOT = new URL("./", self.location).href

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      const response = await fetch(ROOT)
      if (!response.ok)
        throw new Error("Não foi possível preparar o aplicativo offline.")
      const html = await response.clone().text()
      await cache.put(ROOT, response)
      const assets = [
        ...html.matchAll(/(?:src|href)="([^"]*\/assets\/[^\"]+)"/g),
      ].map((match) => new URL(match[1], ROOT).href)
      await cache.addAll([
        ...assets,
        new URL("icon-192.png", ROOT).href,
        new URL("icon-512.png", ROOT).href,
      ])
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("fiado-digital-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

function saveResponse(event, key, response) {
  if (!response.ok) return
  const copy = response.clone()
  event.waitUntil(caches.open(CACHE).then((cache) => cache.put(key, copy)))
}

self.addEventListener("fetch", (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== "GET" || url.origin !== self.location.origin) return
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          saveResponse(event, ROOT, response)
          return response
        })
        .catch(() => caches.match(ROOT)),
    )
  } else if (
    url.pathname.includes("/assets/") ||
    /\.(png|svg|webmanifest)$/.test(url.pathname)
  ) {
    event.respondWith(caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            saveResponse(event, request, response)
            return response
          }),
      ))
  }
})
