/* eslint-disable no-restricted-globals */
import { clientsClaim } from "workbox-core";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

clientsClaim();

// Précache tous les assets générés par le build (injecté par InjectManifest)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Navigation SPA (HashRouter) : toujours servir index.html depuis le cache
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  ({ request, url }) => {
    if (request.mode !== "navigate") return false;
    if (url.pathname.startsWith("/_")) return false;
    return !url.pathname.match(fileExtensionRegexp);
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"),
);

// Images : cache-first avec expiration (logo, icônes, assets statiques)
registerRoute(
  ({ request, url }) =>
    request.destination === "image" && url.origin === self.location.origin,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  }),
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
