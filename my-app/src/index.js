import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);

// PWA - Enregistrement du service worker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const shouldReload = window.confirm(
      "Une nouvelle version d'EFFETMER est disponible. Recharger maintenant ?",
    );
    if (shouldReload && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
});
