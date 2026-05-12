const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
  ),
);

export function register(config) {
  if ("serviceWorker" in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      checkValidServiceWorker(swUrl, config);
      navigator.serviceWorker.ready.then(() =>
        console.log("PWA prête en local."),
      );
    } else {
      registerValidSW(swUrl, config);
    }
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      if (registration.waiting && config?.onUpdate)
        config.onUpdate(registration);
    })
    .catch((error) => {
      console.error("Erreur service worker:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl)
    .then((response) => {
      // Check if service worker file is valid JavaScript
      const contentType = response.headers.get("content-type") || "";
      const isValidServiceWorker =
        response.status === 200 &&
        (contentType.includes("javascript") ||
          contentType.includes("text/plain"));

      if (response.status === 404 || !isValidServiceWorker) {
        navigator.serviceWorker.ready.then((registration) =>
          registration.unregister().then(() => {
            console.warn(
              "Service Worker invalide. Désactivation et rechargement.",
            );
            window.location.reload();
          }),
        );
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log("Pas de connexion. PWA utilisable en mode hors ligne.");
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) =>
      registration.unregister(),
    );
  }
}
