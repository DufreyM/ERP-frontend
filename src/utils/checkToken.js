import { useAuth } from "../hooks/Auth/useAuth";
import { useNavigate } from "react-router-dom";

export const useCheckToken = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const checkToken = (response) => {
    if (response.status === 401 || response.status === 403) {
      console.warn("⚠️ Token inválido o expirado. Cerrando sesión...");
      logout();
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 0);

      return false;
    }
    return true;
  };

  return checkToken;
};
