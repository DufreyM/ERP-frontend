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

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);         //almacna la data que responde la API
  const [loading, setLoading] = useState(false);  //indica si la petición está en curso
  const [error, setError] = useState(null);       //almacena un posible error

  //Función principal, realiza la petición. Se guarda con useCallback para evitar bucles
  const fetchData = useCallback(async () => {
      if (!url) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    
  }, [url, ...dependencies]); // Se vuelve a crear la función si cambia la URL o alguna dependencia

  // Se llama a la función fetchData cuando se monta el componente o cambian las dependencias.
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // Se expone la función fetchData como `refetch` para poder llamar manualmente a la petición si es necesario.
  return { data, loading, error, refetch: fetchData };
}

