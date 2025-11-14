import React, { useState, useMemo, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./VisitadoresAdmin.module.css";
import SimpleTitle from "../../components/Titles/SimpleTitle";
import { Table } from "../../components/Tables/Table";
import Popup from '../../components/Popup/Popup';
import IconoInput from "../../components/Inputs/InputIcono";
import Filters from "../../components/FIlters/Filters";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders";
import OrderBy from "../../components/OrderBy/OrderBy";
import { useOrderBy } from "../../hooks/useOrderBy";
import { useFetch } from "../../utils/useFetch";
import { getToken } from "../../services/authService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faEnvelope, faCalendar, faPhone, faHouseMedical } from '@fortawesome/free-solid-svg-icons';
import InputSearch from "../../components/Inputs/InputSearch";
import InputDates from "../../components/Inputs/InputDates";
import SelectSearch from "../../components/Inputs/SelectSearch";
import { useCheckToken } from "../../utils/checkToken";
import {jwtDecode} from 'jwt-decode';

// Función para formatear fecha
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'No disponible';
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return 'No disponible';
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}-${mes}-${año}`;
};

const VisitadoresAdmin = () => {
  

  // Mover token y fetch de proveedores dentro del componente (evita duplicados/scope)
  const token = getToken();
  const shouldFetch = Boolean(token);
  const checkToken = useCheckToken();

  const decodedToken = token ? jwtDecode(token) : null; 
  const rolUsuario = decodedToken ? decodedToken.rol_id : null;
  const usuarioIdToken = decodedToken ? decodedToken.id : null;
  const esVisitador = rolUsuario === 3;

  // Obtener proveedores (usa token ya definido)
  const { data: proveedores, loading: loadingProveedores } = useFetch(
    shouldFetch ? `${import.meta.env.VITE_API_URL}/api/proveedor` : null,
    {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }
  );

  // Opciones de proveedores (una sola definición)
  const opcionesProveedores = useMemo(() => {
    if (!Array.isArray(proveedores)) return [];
    return proveedores.map(proveedor => ({
      value: String(proveedor.id),
      label: proveedor.nombre,
      ...proveedor
    }));
  }, [proveedores]);

  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [sortOption, setSortOption] = useState('alfabetico');
  
  // Estados para el panel de filtros
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [isOpendDate, setIsOpendDate] = useState(false);
  const [isOpendRol, setIsOpendRol] = useState(false);
  const [selectedPreDate, setSelectedPreDate] = useState('');
  
  const expandFecha = () => setIsOpendDate(prev => !prev);
  const expandRol = () => setIsOpendRol(prev => !prev);
  
  // Función para resetear filtros
  const resetFiltros = () => {
    setProveedorSeleccionadoId('');
    setFechaInicio(null);
    setFechaFin(null);
    setSelectedPreDate('');
    setBusqueda('');
  };

  // Estados para popups
  const [visitadorAEliminar, setVisitadorAEliminar] = useState(null);
  const [advertencia, setAdvertencia] = useState(false);
  const [visitadorAEditar, setVisitadorAEditar] = useState(null);
  const [editarVisitador, setEditarVisitador] = useState(false);

  // Estados para subir documento (solo visitadores médicos)
  const [documentoFile, setDocumentoFile] = useState(null);
  const [subiendoDocumento, setSubiendoDocumento] = useState(false);
  const [mensajeDocumento, setMensajeDocumento] = useState('');
  const fileInputRef = React.useRef(null);

  // Form state crear/editar
  const [formVisitador, setFormVisitador] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono_fijo: '',
    telefono_fijo_id: '',
    telefono_movil: '',
    telefono_movil_id: '',
    fecha_nacimiento: '',
    proveedor_id: '',
    contrasena: '',
    documento: null
  });

  // Configuración de columnas de la tabla
  const todasLasColumnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'apellido', titulo: 'Apellido' },
    { key: 'email', titulo: 'Correo Electrónico' },
    { key: 'telefono_fijo', titulo: 'Teléfono Fijo' },
    { key: 'telefono_movil', titulo: 'Teléfono Móvil' },
    { key: 'proveedor', titulo: 'Proveedor' },
    { key: 'documento', titulo: 'Documento' },
    { key: 'status', titulo: 'Estado' },
    { key: 'editar', titulo: 'Editar' }
  ];

  // Filtrar columnas según el rol del usuario
  const columnas = useMemo(() => {
    if (esVisitador) {
      // Ocultar 'status' y 'editar' para visitadores médicos
      return todasLasColumnas.filter(col => col.key !== 'status' && col.key !== 'editar');
    }
    return todasLasColumnas;
  }, [esVisitador]);

  // Fetch de visitadores
  const visitadoresUrl = `${import.meta.env.VITE_API_URL}/visitadores`;
  const fetchHeaders = useMemo(() => ({
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  }), [token]);
  

  const { data: visitadoresResponse, loading, error, refetch } = useFetch(
    visitadoresUrl,
    {
      headers: fetchHeaders,
      method: 'GET'
    },
    [visitadoresUrl, fetchHeaders]
  );

  // Procesar datos de visitadores
  // Normaliza datos para la tabla (mantiene fecha_nacimiento y fecha_nacimientoISO)
  const visitadoresData = useMemo(() => {
    if (!visitadoresResponse || !Array.isArray(visitadoresResponse)) return [];
    return visitadoresResponse.map(v => {
      const telFijo = v.telefonos?.find(t => t.tipo === 'fijo');
      const telMovil = v.telefonos?.find(t => t.tipo === 'movil' || t.tipo === 'móvil');
      return {
        id: v.id,
        nombre: v.usuario?.nombre || '',
        apellido: v.usuario?.apellidos || '',
        email: v.usuario?.email || '',
        telefono_fijo: telFijo?.numero || v.usuario?.telefono_fijo || '',
        telefono_fijo_id: telFijo?.id || '',
        telefono_movil: telMovil?.numero || v.usuario?.telefono_movil || '',
        telefono_movil_id: telMovil?.id || '',
        fecha_nacimiento: v.usuario?.fecha_nacimientoISO ? formatearFecha(v.usuario.fecha_nacimientoISO) : 'No disponible',
        fecha_nacimientoISO: v.usuario?.fecha_nacimientoISO || '',
        proveedor: v.proveedor?.nombre || '',
        proveedor_id: v.proveedor_id != null ? String(v.proveedor_id) : '',
        documento: v.documento_url || '',
        status: v.usuario?.status || 'inactivo',
        usuario_id: v.usuario_id
      };
    });
  }, [visitadoresResponse]);

  // Filtrar y ordenar datos
  const filteredData = useMemo(() => {
    let filtered = visitadoresData;

    // Si es visitador médico, mostrar solo sus propios datos
    if (esVisitador && usuarioIdToken) {
      filtered = filtered.filter(item => item.usuario_id === usuarioIdToken);
    }

    if (busqueda) {
      filtered = filtered.filter(item =>
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.email.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (proveedorSeleccionadoId) {
      filtered = filtered.filter(item => String(item.proveedor_id) === proveedorSeleccionadoId);
    }

    if (fechaInicio && fechaFin) {
      filtered = filtered.filter(item => {
        const fechaItem = new Date(item.fecha_nacimiento.split('-').reverse().join('-'));
        return fechaItem >= fechaInicio && fechaItem <= fechaFin;
      });
    }

    return filtered;
  }, [visitadoresData, esVisitador, usuarioIdToken, busqueda, proveedorSeleccionadoId, fechaInicio, fechaFin]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortOption === 'alfabetico') {
        return a.nombre.localeCompare(b.nombre);
      }
      return 0;
    }, [filteredData, sortOption]);
  });

  // Handlers
  const handleBusqueda = (e) => setBusqueda(e.target.value);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rol") {
      setProveedorSeleccionadoId(value || '');
    }
  };

  const openAdvertencia = (visitador) => {
    setVisitadorAEliminar(visitador);
    setAdvertencia(true);
  };

  const closeAdvertencia = () => {
    setVisitadorAEliminar(null);
    setAdvertencia(false);
  };

  const openEditarVisitador = (visitador) => {
    setVisitadorAEditar(visitador);
    setFormVisitador({
      nombre: visitador.nombre,
      apellido: visitador.apellido,
      email: visitador.email,
      telefono_fijo: visitador.telefono_fijo,
      telefono_fijo_id: visitador.telefono_fijo_id || '',
      telefono_movil: visitador.telefono_movil,
      telefono_movil_id: visitador.telefono_movil_id || '',
      fecha_nacimiento: visitador.fecha_nacimientoISO || '',
      proveedor_id: visitador.proveedor_id || '',
      contrasena: 'unchanged',
      documento: visitador.documento
    });
    setEditarVisitador(true);
  };

  const closeEditarVisitador = () => {
    setVisitadorAEditar(null);
    setEditarVisitador(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormVisitador(prev => ({ ...prev, [name]: value }));
  };

  const actualizarVisitador = async () => {
    if (!visitadorAEditar) return;
    try {
      const usuarioPayload = {
        nombre: formVisitador.nombre,
        apellidos: formVisitador.apellido,
        email: formVisitador.email,
        rol_id: 3,
        status: 'activo',
        contrasena: formVisitador.contrasena
      };
      if (formVisitador.fecha_nacimiento) {
        usuarioPayload.fechanacimiento = formVisitador.fecha_nacimiento; // 'YYYY-MM-DD'
      }

      const data = {
        usuario: usuarioPayload,
        proveedor_id: formVisitador.proveedor_id ? Number(formVisitador.proveedor_id) : null,
        telefonos: [
          formVisitador.telefono_fijo
            ? { id: formVisitador.telefono_fijo_id || null, numero: formVisitador.telefono_fijo, tipo: 'fijo' }
            : null,
          formVisitador.telefono_movil
            ? { id: formVisitador.telefono_movil_id || null, numero: formVisitador.telefono_movil, tipo: 'móvil' }
            : null
        ].filter(Boolean)
      };

      console.log('Data to send:', data);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${visitadorAEditar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!checkToken(response)) return;


      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error text:', errorText);
        throw new Error('Error al actualizar');
      }

      await refetch();
      closeEditarVisitador();
      alert('Visitador actualizado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar visitador');
    }
  };

  const eliminarVisitador = async () => {
    if (!visitadorAEliminar) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${visitadorAEliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!checkToken(response)) return;

      if (!response.ok) throw new Error('Error al eliminar');

      await refetch();
      closeAdvertencia();
      alert('Visitador eliminado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al eliminar visitador');
    }
  };

  const onToggleStatus = async (visitador) => {
    try {
      const newStatus = visitador.status === 'activo' ? 'inactivo' : 'activo';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${visitador.id}/${newStatus === 'activo' ? 'activate' : 'deactivate'}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!checkToken(response)) return;
      
      if (!response.ok) throw new Error('Error al cambiar estado');

      await refetch();
    } catch (error) {
      console.error(error);
      alert('Error al cambiar estado');
    }
  };

  // Funciones para subir documento (solo visitadores médicos)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      setMensajeDocumento('Solo se permiten archivos PDF');
      setDocumentoFile(null);
      e.target.value = ''; // Limpiar el input
      return;
    }
    
    // Validar tamaño (10MB = 10 * 1024 * 1024 bytes)
    const maxBytes = 10 * 1024 * 1024;
    const archivoValido = pdfFiles.find(file => file.size <= maxBytes);
    
    if (!archivoValido && pdfFiles.length > 0) {
      setMensajeDocumento('El archivo no debe exceder 10 MB');
      setDocumentoFile(null);
      e.target.value = ''; // Limpiar el input
      return;
    }
    
    const archivoSeleccionado = pdfFiles[0] || null;
    setDocumentoFile(archivoSeleccionado);
    setMensajeDocumento('');
    
    // Si hay un archivo válido, subirlo automáticamente
    if (archivoSeleccionado) {
      await subirDocumentoConArchivo(archivoSeleccionado);
    }
  };

  const handleSubirDocumentoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const subirDocumentoConArchivo = async (file) => {
    if (!file) {
      setMensajeDocumento('Error: Por favor selecciona un archivo');
      return;
    }

    // Obtener el visitador actual (debería ser solo uno en la lista filtrada)
    const visitadorActual = sortedData.length > 0 ? sortedData[0] : null;
    if (!visitadorActual || !visitadorActual.id) {
      setMensajeDocumento('Error: No se encontró el visitador');
      return;
    }

    setSubiendoDocumento(true);
    setMensajeDocumento('');

    try {
      // Obtener los datos actuales del visitador primero
      const visitadorResponse = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${visitadorActual.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!checkToken(visitadorResponse)) return;

      if (!visitadorResponse.ok) {
        throw new Error('Error al obtener datos del visitador');
      }

      const visitadorData = await visitadorResponse.json();
      console.log('Datos del visitador obtenidos:', visitadorData);

      // Preparar los datos para actualizar (mantener estructura existente con todos los campos requeridos)
      const usuarioPayload = {
        nombre: visitadorData.usuario?.nombre || visitadorActual.nombre,
        apellidos: visitadorData.usuario?.apellidos || visitadorActual.apellido,
        email: visitadorData.usuario?.email || visitadorActual.email,
        rol_id: visitadorData.usuario?.rol_id || 3,
        status: visitadorData.usuario?.status || 'activo',
        contrasena: 'unchanged' // Campo requerido para actualización
      };

      // Agregar fechanacimiento si existe (formato YYYY-MM-DD)
      const fechaNac = visitadorData.usuario?.fechanacimiento || 
                       visitadorData.usuario?.fecha_nacimiento || 
                       visitadorData.usuario?.fecha_nacimientoISO ||
                       visitadorActual.fecha_nacimientoISO;
      
      if (fechaNac) {
        // Convertir a formato YYYY-MM-DD si viene en formato ISO
        if (fechaNac.includes('T')) {
          usuarioPayload.fechanacimiento = fechaNac.split('T')[0];
        } else {
          usuarioPayload.fechanacimiento = fechaNac;
        }
      }

      // Validar que el objeto usuario tenga los campos mínimos requeridos
      if (!usuarioPayload.nombre || !usuarioPayload.apellidos || !usuarioPayload.email) {
        throw new Error('Faltan datos obligatorios del usuario');
      }

      const data = {
        usuario: usuarioPayload,
        proveedor_id: visitadorData.proveedor_id ? Number(visitadorData.proveedor_id) : (visitadorActual.proveedor_id ? Number(visitadorActual.proveedor_id) : null),
        telefonos: visitadorData.telefonos || []
      };

      console.log('Datos a enviar:', data);
      console.log('Objeto usuario completo:', JSON.stringify(usuarioPayload, null, 2));
      console.log('Data stringificado:', JSON.stringify(data, null, 2));
      
      // Crear FormData en el mismo orden que Visitadores.jsx: primero data, luego documento
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('documento', file);
      
      // Verificar que el FormData tenga los datos correctos
      console.log('FormData data:', formData.get('data'));
      console.log('FormData documento:', formData.get('documento')?.name);
      
      // Usar PUT para actualizar el visitador con el documento
      // El backend espera FormData con 'data' (JSON stringificado) y 'documento' (archivo)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${visitadorActual.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // NO establecer Content-Type manualmente, el navegador lo hará automáticamente para FormData
        },
        body: formData
      });

      if (!checkToken(response)) return;

      if (!response.ok) {
        // Leer el error de la respuesta
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error('Error completo del servidor:', errorData);
        } catch (e) {
          // Si falla el JSON, usar el status y statusText
          errorText = `Error ${response.status}: ${response.statusText}`;
          console.error('Error al leer respuesta como JSON:', e);
        }
        throw new Error(`Error al subir el documento: ${errorText}`);
      }

      setMensajeDocumento('Documento subido correctamente');
      setDocumentoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Recargar los datos
      await refetch();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMensajeDocumento('');
      }, 3000);
    } catch (error) {
      console.error('Error al subir documento:', error);
      setMensajeDocumento(`Error: ${error.message || 'No se pudo subir el documento'}`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setSubiendoDocumento(false);
    }
  };

  return (
    <div className={styles.contenedorGeneral}>
      <div className={styles.contenedorEncabezado}>
        <div className={styles.contenedorTitle}>
          <SimpleTitle text="Visitadores médicos" />
        </div>

        <div className={styles.buscadorContainer}>
          <InputSearch
            icono={faSearch}
            placeholder="Buscar visitadores..."
            value={busqueda}
            onChange={handleBusqueda}
            type="text"
            name="busqueda"
          />
        </div>

        <div className={styles.filtersContainer}>
        {!esVisitador &&(
        <Filters
          title="Visitadores"
          panelAbierto={panelAbierto}
          setPanelAbierto={setPanelAbierto}
          mostrarRangoFecha={true}
          mostrarRangoPrecio={false}
          mostrarUsuario={true}
          mostrarMedicamento={false}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          isOpendDate={isOpendDate}
          expandFecha={expandFecha}
          selectedPreDate={selectedPreDate}
          setSelectedPreDate={setSelectedPreDate}
          isOpendRol={isOpendRol}
          expandRol={expandRol}
          expandUsuario={expandRol}
          opcionesRoles={opcionesProveedores}
          opcionesUsuarios={[]}
          usuarioSeleccionado=""
          rolSeleccionado={proveedorSeleccionadoId}
          handleChange={handleChange}
          resetFiltros={resetFiltros}
        />
        )}
        </div>

        {!esVisitador &&(
        <OrderBy
          FAbecedario={true}
          FExistencias={false}
          FPrecio={false}
          FFecha={false}
          selectedOption={sortOption}
          onChange={setSortOption}
        />
        )}
        
        {esVisitador &&(
        <>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <ButtonHeaders 
            text={subiendoDocumento ? "Subiendo..." : "Subir nuevo documento"} 
            onClick={handleSubirDocumentoClick}
            disabled={subiendoDocumento}
          />
          {mensajeDocumento && (
            <p style={{ 
              color: mensajeDocumento.includes('Error') ? 'crimson' : '#5a60a5', 
              marginTop: '8px',
              fontSize: '14px'
            }}>
              {mensajeDocumento}
            </p>
          )}
        </>
        )}
      </div>

      <div className={styles.contenedorTabla}>
        {loading && <p style={{ color: '#5a60A5' }}>Cargando...</p>}
        {error && <p style={{ color: 'crimson' }}>Error: {String(error)}</p>}
        <Table
          nameColumns={columnas}
          data={sortedData.map(visitador => {
            const visitadorData = {
              ...visitador,
              documento: visitador.documento ? (
                <a href={visitador.documento} target="_blank" rel="noopener noreferrer" style={{ color: '#5a60a5', textDecoration: 'none' }}>
                  📄 PDF
                </a>
              ) : (
                <span style={{ color: '#888' }}>-</span>
              )
            };
            
            // Solo agregar status si no es visitador
            if (!esVisitador) {
              visitadorData.status = (
                <span
                  className={[
                    styles.estadoChip,
                    (String(visitador.status).toLowerCase() === 'activo') ? styles.estadoActivo : styles.estadoInactivo
                  ].join(' ')}
                  onClick={() => onToggleStatus(visitador)}
                  title="Cambiar estado"
                >
                  {String(visitador.status).toLowerCase() === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              );
            }
            
            return visitadorData;
          })}
          onEliminarClick={esVisitador ? undefined : openAdvertencia}
          onEditarClick={esVisitador ? undefined : openEditarVisitador}
        />
      </div>

      <Popup
        isOpen={advertencia}
        onClose={closeAdvertencia}
        title={`¿Estás seguro de eliminar a "${visitadorAEliminar?.nombre} ${visitadorAEliminar?.apellido}"?`}
        onClick={eliminarVisitador}
      >
        <div className={styles.modalContenido}>
          <p>Esta acción no se puede deshacer.</p>
        </div>
      </Popup>

      <Popup
        isOpen={editarVisitador}
        onClose={closeEditarVisitador}
        title="Editar visitador médico"
        onClick={actualizarVisitador}
      >
        <div className={styles.modalContenido}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', maxWidth: 560, margin: '0 auto', width: '100%' }}>
            <IconoInput
              icono={faUser}
              name="nombre"
              value={formVisitador.nombre}
              onChange={handleFormChange}
              placeholder="Nombre"
              type="text"
              formatoAa={true}
            />
            <IconoInput
              icono={faUser}
              name="apellido"
              value={formVisitador.apellido}
              onChange={handleFormChange}
              placeholder="Apellidos"
              type="text"
              formatoAa={true}
            />
            <IconoInput
              icono={faEnvelope}
              name="email"
              value={formVisitador.email}
              onChange={handleFormChange}
              placeholder="Correo electrónico"
              type="email"
            />
            <IconoInput
              icono={faPhone}
              name="telefono_fijo"
              value={formVisitador.telefono_fijo}
              onChange={handleFormChange}
              placeholder="Teléfono Fijo"
              type="text"
            />
            <IconoInput
              icono={faPhone}
              name="telefono_movil"
              value={formVisitador.telefono_movil}
              onChange={handleFormChange}
              placeholder="Teléfono Móvil"
              type="text"
            />
            <InputDates
              icono={faCalendar}
              placeholder="Fecha de nacimiento"
              selected={formVisitador.fecha_nacimiento ? new Date(formVisitador.fecha_nacimiento) : null}
              onChange={(date) =>
                setFormVisitador(prev => ({
                  ...prev,
                  // backend requiere formato date (YYYY-MM-DD)
                  fecha_nacimiento: date && !isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : ''
                }))
              }
            />
            {/* Proveedor select (edición): icono dentro, sin tocar SelectSearch */}
            <div className={styles.inputWithIcon}>
              <FontAwesomeIcon icon={faHouseMedical} className={styles.inputLeftIcon} />
              <SelectSearch
                icono={faHouseMedical}
                placeholder="Nombre del proveedor"
                value={String(formVisitador.proveedor_id || '')}
                onChange={(value) => setFormVisitador(prev => ({ ...prev, proveedor_id: value ? Number(value) : '' }))}
                options={opcionesProveedores}
                tableStyle={false}
                 // mismo uso que en otras pantallas
              />
            </div>
            {/* fin Proveedor select */}
            {/* Bloque de solo lectura para el documento PDF */}
            <div style={{ marginTop: 8 }}>
              <label style={{ color: '#5a60a5', fontWeight: 500, display: 'block', marginBottom: 6 }}>Documento (PDF)</label>
              {formVisitador.documento ? (
                <a
                  href={formVisitador.documento}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#5a60a5', textDecoration: 'none', fontWeight: 600 }}
                >
                  Ver documento 📄
                </a>
              ) : (
                <span style={{ color: '#888' }}>No hay documento cargado</span>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default VisitadoresAdmin;