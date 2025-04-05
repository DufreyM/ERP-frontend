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
    <main style={{ padding: '2rem' }}>
      <h1>Inicio</h1>
      <p>{message}</p>
    </main>
  );
}
