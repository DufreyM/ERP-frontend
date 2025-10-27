/* useFetch
Hook personalizado para realizar peticiones HTTP (GET por defecto) y gestionar el estado asociado (carga, error, datos).
Se utiliza para obtener datos desde el backend de forma sencilla y reactiva.

Atributos:
  - url: string (obligatoria) → la URL del endpoint al que se hace la petición.
  - options: object (opcional) → opciones del fetch como headers, método, etc.
  - dependencies: array (opcional) → dependencias adicionales para volver a hacer la petición cuando cambien.

Retorna:
  - data: respuesta procesada (JSON) del servidor.
  - loading: booleano indicando si la petición está en curso.
  - error: mensaje de error en caso de que falle.
  - refetch: función manual para volver a hacer la petición.

Ejemplo de uso:
  const { data, loading, error, refetch } = useFetch('/api/usuarios', {}, [id]);

Autor: Melisa
Última modificación: 17/08/2025
*/

import { useState, useEffect, useCallback } from "react";
import { getToken } from '../services/authService';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Auth/useAuth";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {logout} = useAuth();

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const headers = {
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const response = await fetch(url, { ...options, headers });

      if (response.status === 401 || response.status === 403) {
        console.warn("⚠️ Token inválido o expirado. Cerrando sesión...");
        logout(); 
        navigate("/", { replace: true }); // manda al login
        return;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [url, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};