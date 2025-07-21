// hooks/useSafeOutletContext.js
import { useOutletContext } from "react-router-dom";

export const useSafeOutletContext = () => {
  try {
    return useOutletContext();
  } catch (error) {
    console.warn("useOutletContext falló:", error);
    return { selectedLocal: 0 }; // valor por defecto
  }
};
