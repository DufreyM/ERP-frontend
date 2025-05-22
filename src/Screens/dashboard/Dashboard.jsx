import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const location = useLocation();
  const { usuario = "Admin", rol_id = "Administrador" } = location.state || {};

  return (
    <div className={`${styles.container} ${styles[rol_id.toLowerCase()]}`}>
      <h1>Hola, {usuario}</h1>
      <p>Bienvenido al dashboard de {rol_id}</p>
    </div>
  );
};


export default Dashboard;
