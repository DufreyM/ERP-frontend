import { useState, useEffect, useCallback } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

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
    

    
  }, [url, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

