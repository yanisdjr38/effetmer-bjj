import { useEffect, useState } from "react";
import "./offline-indicator.scss";

/**
 * OfflineIndicator - Shows when app is offline
 * Appears only when user has no network connection
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-indicator" role="status" aria-live="polite">
      <div className="offline-content">
        <span className="offline-icon">📡</span>
        <span className="offline-text">Mode hors ligne</span>
        <span className="offline-hint">
          Les données sont synchronisées localement
        </span>
      </div>
    </div>
  );
}
