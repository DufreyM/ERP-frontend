// hooks/useApi.js
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function useApi() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        navigate("/", { replace: true });
      }
      return Promise.reject(error);
    }
  );

  return api;
}
