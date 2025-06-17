import React, { useEffect, useState } from "react";
import "../styles.css";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Bloque le prompt auto
      setDeferredPrompt(e);
      setShow(true); // Affiche notre UI
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShow(false);
    });
  };

  if (!show) return null;

  return (
    <div className="install-banner">
      <p>Ajouter Effetmer BJJ à votre écran d’accueil ?</p>
      <button onClick={handleInstallClick}>📲 Ajouter</button>
      <button onClick={() => setShow(false)}>❌</button>
    </div>
  );
};

export default InstallPrompt;
