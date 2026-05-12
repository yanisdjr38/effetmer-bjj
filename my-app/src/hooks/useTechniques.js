/**
 * useTechniques - Hook for BJJ techniques library
 */
import { useLocalStorage } from "./useLocalStorage";

export const useTechniques = () => {
  const [techniques, setTechniques] = useLocalStorage("techniquesList", []);

  return {
    techniques,
    setTechniques,
  };
};
