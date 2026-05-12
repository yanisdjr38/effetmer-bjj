import { useEffect, useState } from "react";

/**
 * useIOSDetection - Detects iOS Safari and standalone mode
 * Helps show appropriate install guidance for iOS users
 */
export const useIOSDetection = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSStandalone, setIsIOSStandalone] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Detect iOS
    const iosMatch = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosMatch);

    // Detect Android
    const androidMatch = userAgent.includes("android");
    setIsAndroid(androidMatch);

    // Detect Safari (check for Safari in UA and absence of Chrome)
    const isSafariMatch =
      /safari/.test(userAgent) &&
      !/chrome|crios|edg/.test(userAgent) &&
      !/ucbrowser|opera/.test(userAgent);
    setIsSafari(isSafariMatch);

    // Detect iOS standalone mode (installed as PWA)
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIsIOSStandalone(isStandalone);
  }, []);

  return {
    isIOS,
    isIOSStandalone,
    isSafari,
    isAndroid,
    isIOSSafari: isIOS && isSafari,
    needsIOSGuide: isIOS && isSafari && !isIOSStandalone,
  };
};
