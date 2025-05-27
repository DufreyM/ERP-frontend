import React, { useState } from "react";
import PerfilCard from "../../components/Cards/PerfilCard";
import styles from "./AdminPerfiles.module.css";
import Titulo from "../../components/Titles/PerfilHeader";

const AdminPerfiles = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "María Pérez", puesto: "Visitador Médico", activo: true },
    { id: 2, nombre: "Juan López", puesto: "Contador", activo: false },
    { id: 3, nombre: "Laura Méndez", puesto: "Dependienta", activo: true },
  ]);

  const toggleActivo = (id) => {
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, activo: !user.activo } : user
      )
    );
  };

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsuarios((prev) => prev.filter((user) => user.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Gestión de Perfiles</h2>
<p className={styles.subtitulo}>Activa, desactiva o elimina usuarios.</p>


      {usuarios.map((usuario) => (
        <PerfilCard
          key={usuario.id}
          nombre={usuario.nombre}
          puesto={usuario.puesto}
          activo={usuario.activo}
          onToggle={() => toggleActivo(usuario.id)}
          onDelete={() => eliminarUsuario(usuario.id)}
        />
      ))}
    </div>
  );
};

export default AdminPerfiles;
