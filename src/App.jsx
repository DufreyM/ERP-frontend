import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage('Error al conectar con la API :('));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Frontend React + Vite</h1>
      <p>{message ? message : 'Cargando...'}</p> 
    </div>
  );
}

export default App;
