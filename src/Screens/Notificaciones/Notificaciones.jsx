import React, { useState, useMemo } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import styles from './Notificaciones.module.css';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getToken } from '../../services/authService';
import { useFetch } from '../../utils/useFetch.jsx';

const Notificaciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const token = getToken();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

  const { data: notificacionesData, loading, error, refetch } = useFetch(
    `${API_BASE_URL}/api/calendario/notificaciones`,
    {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }
  );

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}-${mes}-${año} ${horas}:${minutos}`;
  };

  // Ordenar y filtrar notificaciones
  const notificacionesOrdenadas = useMemo(() => {
    if (!Array.isArray(notificacionesData)) return [];
    
    // Ordenar de más reciente a más antigua
    const ordenadas = [...notificacionesData].sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaB - fechaA; // Más reciente primero
    });

    // Filtrar por búsqueda si hay término
    if (searchTerm.trim()) {
      return ordenadas.filter(notif => 
        notif.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return ordenadas;
  }, [notificacionesData, searchTerm]);

  // Dividir por tipo de evento
  const notificacionesPorTipo = useMemo(() => {
    const porTipo = {
      visita_medica: [],
      notificacion: [],
      tarea: []
    };

    notificacionesOrdenadas.forEach(notif => {
      if (notif.tipo_evento_id === 1) {
        porTipo.visita_medica.push(notif);
      } else if (notif.tipo_evento_id === 2) {
        porTipo.notificacion.push(notif);
      } else if (notif.tipo_evento_id === 3) {
        porTipo.tarea.push(notif);
      }
    });

    return porTipo;
  }, [notificacionesOrdenadas]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Marcar como completado (estado_id = 3)
  const marcarCompletado = async (id) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/calendario/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado_id: 3 })
      });

      if (!resp.ok) {
        throw new Error('Error al marcar como completado');
      }

      await refetch();
    } catch (err) {
      console.error(err);
      alert('No se pudo marcar como completado');
    }
  };

  // Marcar como eliminado
  const marcarEliminado = async (id) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/calendario/${id}/marcar-eliminado`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!resp.ok) {
        throw new Error('Error al eliminar');
      }

      await refetch();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la notificación');
    }
  };

  const renderNotificacion = (notif) => {
    const esCompletada = notif.estado_id === 3; // Terminado
    const className = esCompletada ? styles.notificacionCompletada : styles.notificacionPendiente;

    return (
      <div key={notif.id || notif.codigo} className={className}>
        <div className={styles.notificacionHeader}>
          <h3 className={styles.titulo}>{notif.titulo}</h3>
          <span className={styles.fecha}>{formatearFecha(notif.fecha)}</span>
        </div>
        <p className={styles.detalles}>{notif.detalles}</p>
        <div className={styles.notificacionFooter}>
          <div className={styles.botonesContainer}>
            <ButtonForm
              text="Completar"
              onClick={() => marcarCompletado(notif.id || notif.codigo)}
              disabled={esCompletada}
            />
            <button
              className={styles.botonBorrar}
              onClick={() => marcarEliminado(notif.id || notif.codigo)}
            >
              <FontAwesomeIcon icon={faTrash} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSeccion = (titulo, notificaciones) => {
    if (notificaciones.length === 0) return null;

    return (
      <div className={styles.seccion}>
        <h2 className={styles.tituloSeccion}>{titulo}</h2>
        <div className={styles.listaNotificaciones}>
          {notificaciones.map(renderNotificacion)}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.notificacionesContainer}>
      <SimpleTitle text="Notificaciones" />
      
      <div className={styles.buscadorContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '400px' }}>
          <label style={{ color: '#5a60a5', fontWeight: 500, marginBottom: 4 }}>Buscar notificación</label>
          <IconoInput
            icono={faSearch}
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            type="text"
            name="busqueda"
          />
        </div>
      </div>

      {loading && <div className={styles.loading}>Cargando notificaciones...</div>}
      {error && <div className={styles.error}>Error: {String(error)}</div>}

      <div className={styles.contenido}>
        {renderSeccion('Visita Médica', notificacionesPorTipo.visita_medica)}
        {renderSeccion('Notificaciones Generales', notificacionesPorTipo.notificacion)}
        {renderSeccion('Tareas Pendientes', notificacionesPorTipo.tarea)}
        
        {!loading && 
         notificacionesPorTipo.visita_medica.length === 0 &&
         notificacionesPorTipo.notificacion.length === 0 &&
         notificacionesPorTipo.tarea.length === 0 && (
          <div className={styles.sinNotificaciones}>
            {searchTerm ? 'No se encontraron notificaciones con ese título' : 'No hay notificaciones'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificaciones;

