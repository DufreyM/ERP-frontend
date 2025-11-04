// components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/Auth/useAuth";

export default function ProtectedRoute() {
  const { token, isInitializing } = useAuth();
  const location = useLocation();

  // mientras inicializa (leyendo token) no redirijas
  if (isInitializing) return null; // o un spinner

  // durante desarrollo, deja pasar todo
  if (import.meta.env.MODE === "development") return <Outlet />;

  // evita hacer checks en rutas públicas
  const publicRoutes = ["/", "/register-user", "/reset-password", "/auth/verify-reset", "/reset-password-success", "/visitador"];
  if (publicRoutes.includes(location.pathname)) return <Outlet />;

  if (!token) {
    console.log("🚪 Sesión expirada o sin token. Redirigiendo al login...");
    return <Navigate to="/" replace />;
  }


  // //Control de roles DD
  // const path = location.pathname;

  // if (path.startsWith("/admin") && user?.rol !== "admin") {
  //   console.warn("No tienes permiso para acceder a /admin");
  //   return <Navigate to="/dependienta" replace />;
  // }

  // if (path.startsWith("/dependienta") && user?.rol !== "dependienta") {
  //   console.warn("No tienes permiso para acceder a /dependienta");
  //   return <Navigate to="/admin" replace />;
  // }

  return <Outlet />;
}

