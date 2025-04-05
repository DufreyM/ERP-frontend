'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(res => res.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <main
      style={{
        padding: '2rem',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
        fontFamily: '"Arial", sans-serif',
        color: '#333',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
          }}
        >
          Bienvenido a la Página de Inicio
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: '#7f8c8d',
          }}
        >
          ¡Lograste conectar tu backend con tu frontend!
        </p>
      </header>

      <section
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            color: '#34495e',
            marginBottom: '1rem',
          }}
        >
          Mensaje del Backend:
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: '#34495e',
            lineHeight: '1.6',
          }}
        >
          {message || 'Cargando...'}
        </p>
      </section>

      <footer
        style={{
          textAlign: 'center',
          marginTop: '3rem',
          color: '#7f8c8d',
        }}
      >
        <p>© Farmacia Econofarma</p>
      </footer>
    </main>
  );
}
