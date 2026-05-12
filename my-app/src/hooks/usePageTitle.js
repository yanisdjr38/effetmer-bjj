import { useEffect } from "react";

/**
 * usePageTitle - Updates document title for page identification
 * Improves accessibility and browser history
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | EFFETMER` : "EFFETMER";

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
