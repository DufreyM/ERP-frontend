// PerfilHeader.jsx
import React from "react";
import styles from "./PerfilHeader.module.css";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PerfilHeader = ({ nombre, puesto, descripcion, onDescripcionChange }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.fotoContainer}>
        <img
          src="/default-user.png" // o cualquier imagen por defecto
          alt="Foto de perfil"
          className={styles.fotoPerfil}
        />
        <div className={styles.iconOverlay}>
          <FontAwesomeIcon icon={faCamera} />
        </div>
      </div>
      <h2 className={styles.nombre}>{nombre || "Nombre de usuario"}</h2>
      <p className={styles.puesto}>{puesto}</p>

      <textarea
        className={styles.descripcion}
        placeholder="Agrega una breve descripción..."
        value={descripcion}
        onChange={(e) => onDescripcionChange(e.target.value)}
      />

      <button className={styles.btnGuardar}>Guardar descripción</button>
    </div>
  );
};

export default PerfilHeader;
