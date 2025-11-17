import React, { useState, useMemo } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import styles from './Notificaciones.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faCheck, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getToken } from '../../services/authService';
import { useFetch } from '../../utils/useFetch.jsx';
import InputSearch from '../../components/Inputs/InputSearch.jsx';


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


  const { pendientes, completadas } = useMemo(() => {
  const pendientes = [];
  const completadas = [];

  notificacionesOrdenadas.forEach((n) => {
      if (n.estado_id === 3) completadas.push(n);
      else pendientes.push(n);
    });

    return { pendientes, completadas };
  }, [notificacionesOrdenadas]);


  // Dividir por tipo de evento
  const pendientesPorTipo = useMemo(() => {
    const porTipo = { visita_medica: [], notificacion: [], tarea: [] };
    pendientes.forEach(n => {
      if (n.tipo_evento_id === 1) porTipo.visita_medica.push(n);
      else if (n.tipo_evento_id === 2) porTipo.notificacion.push(n);
      else if (n.tipo_evento_id === 3) porTipo.tarea.push(n);
    });
    return porTipo;
  }, [pendientes]);

  const completadasPorTipo = useMemo(() => {
    const porTipo = { visita_medica: [], notificacion: [], tarea: [] };
    completadas.forEach(n => {
      if (n.tipo_evento_id === 1) porTipo.visita_medica.push(n);
      else if (n.tipo_evento_id === 2) porTipo.notificacion.push(n);
      else if (n.tipo_evento_id === 3) porTipo.tarea.push(n);
    });
    return porTipo;
  }, [completadas]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Marcar como completado (estado_id = 3)
  const marcarCompletado = async (id) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/calendario/${id}/marcar-terminado`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
          <div className={styles.contenidonoti}>
          <h3 className={styles.titulo}>{notif.titulo}</h3>
          <p className={styles.detalles}>{notif.detalles}</p>
         </div>

          <div className={styles.botonesContainer}>
             <span className={styles.fecha}>{formatearFecha(notif.fecha)}</span>
            {!esCompletada && (
             

              <button
              className={styles.botonCompletar}
              onClick={() => marcarCompletado(notif.id || notif.codigo)}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            )}

            {esCompletada && (
              <button
                className={styles.botonBorrar}
                onClick={() => marcarEliminado(notif.id || notif.codigo)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
           )}
           
          </div>
         
        </div>
        
       
      </div>
    );
  };

  const renderSeccion = ( notificaciones) => {
    if (notificaciones.length === 0) return null;

    return (
      <div className={styles.seccion}>
  
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
         

          <InputSearch
            icono={faSearch}
            placeholder="Buscar notificación por título..."
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
        <div className={styles.contenidoDosColumnas}>
          {/* COLUMNA PENDIENTES */}
          <div className={styles.columna}>
            <h2 className={styles.tituloColumna}>Pendientes</h2>

            {loading ? (
              <div className={styles.sinNotificaciones}>Cargando notificaciones...</div>
            ) : (
              <>
                {renderSeccion(pendientesPorTipo.visita_medica)}
                {renderSeccion(pendientesPorTipo.notificacion)}
                {renderSeccion(pendientesPorTipo.tarea)}

                {/* Si no hay nada */}
                {pendientes.length === 0 && (
                  <div className={styles.sinNotificaciones}>
                    No hay notificaciones pendientes para mostrar
                  </div>
                )}
              </>
            )}
          </div>

          {/* COLUMNA COMPLETADAS */}
          <div className={styles.columna}>
            <h2 className={styles.tituloColumna}>Completadas</h2>

            {loading ? (
              <div className={styles.sinNotificaciones}>Cargando notificaciones...</div>
            ) : (
              <>
                {renderSeccion(completadasPorTipo.visita_medica)}
                {renderSeccion(completadasPorTipo.notificacion)}
                {renderSeccion(completadasPorTipo.tarea)}

                {/* Si no hay nada */}
                {completadas.length === 0 && (
                  <div className={styles.sinNotificaciones}>
                    No hay notificaciones completadas para mostrar
                  </div>
                )}
              </>
            )}
          </div>
          </div>
          </div>
          
        
      
      </div>
    
  );
};

export default Notificaciones;

