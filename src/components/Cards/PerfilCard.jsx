import React from 'react';
import styles from './PerfilCard.module.css';
import { faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PerfilCard = ({ nombre, puesto, activo, onToggle, onDelete }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3>{nombre}</h3>
        <p>{puesto}</p>
        <p className={activo ? styles.activo : styles.inactivo}>
          {activo ? 'Activo' : 'Inactivo'}
        </p>
      </div>
      <div className={styles.actions}>
        <button onClick={onToggle}>
          <FontAwesomeIcon icon={activo ? faToggleOn : faToggleOff} />
        </button>
        <button onClick={onDelete} className={styles.delete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default PerfilCard;
