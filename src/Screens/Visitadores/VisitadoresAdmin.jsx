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
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1;

  // Mover token y fetch de proveedores dentro del componente (evita duplicados/scope)
  const token = getToken();
  const shouldFetch = Boolean(token);

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

  // Estados para popups
  const [visitadorAEliminar, setVisitadorAEliminar] = useState(null);
  const [advertencia, setAdvertencia] = useState(false);
  const [visitadorAEditar, setVisitadorAEditar] = useState(null);
  const [editarVisitador, setEditarVisitador] = useState(false);

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
  const columnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'apellido', titulo: 'Apellido' },
    { key: 'email', titulo: 'Correo Electrónico' },
    { key: 'telefono_fijo', titulo: 'Teléfono Fijo' },
    { key: 'telefono_movil', titulo: 'Teléfono Móvil' },
    { key: 'fecha_nacimiento', titulo: 'Fecha de Nacimiento' },
    { key: 'proveedor', titulo: 'Proveedor' },
    { key: 'documento', titulo: 'Documento' },
    { key: 'status', titulo: 'Estado' },
    { key: 'editar', titulo: 'Editar' }
  ];

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
        proveedor_id: v.proveedor_id ?? '',
        documento: v.documento_url || '',
        status: v.usuario?.status || 'inactivo',
        usuario_id: v.usuario_id
      };
    });
  }, [visitadoresResponse]);

  // Filtrar y ordenar datos
  const filteredData = useMemo(() => {
    let filtered = visitadoresData;

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
  }, [visitadoresData, busqueda, proveedorSeleccionadoId, fechaInicio, fechaFin]);

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
  const handleChange = (value) => setProveedorSeleccionadoId(value);

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

      if (!response.ok) throw new Error('Error al cambiar estado');

      await refetch();
    } catch (error) {
      console.error(error);
      alert('Error al cambiar estado');
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

        <Filters
          title="Visitadores"
          mostrarRangoFecha={true}
          mostrarRangoPrecio={false}
          mostrarUsuario={false}
          mostrarMedicamento={false}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          opcionesRoles={opcionesProveedores}
          rolSeleccionado={proveedorSeleccionadoId}
          handleChange={handleChange}
        />

        <OrderBy
          FAbecedario={true}
          FExistencias={false}
          FPrecio={false}
          FFecha={false}
          selectedOption={sortOption}
          onChange={setSortOption}
        />
      </div>

      <div className={styles.contenedorTabla}>
        {loading && <p style={{ color: '#5a60A5' }}>Cargando...</p>}
        {error && <p style={{ color: 'crimson' }}>Error: {String(error)}</p>}
        <Table
          nameColumns={columnas}
          data={sortedData.map(visitador => ({
            ...visitador,
            status: (
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
            ),
            documento: visitador.documento ? (
              <a href={visitador.documento} target="_blank" rel="noopener noreferrer" style={{ color: '#5a60a5', textDecoration: 'none' }}>
                📄 PDF
              </a>
            ) : (
              <span style={{ color: '#888' }}>-</span>
            )
          }))}
          onEliminarClick={openAdvertencia}
          onEditarClick={openEditarVisitador}
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
                placeholder="Nombre del proveedor"
                value={String(formVisitador.proveedor_id || '')}
                onChange={(value) => setFormVisitador(prev => ({ ...prev, proveedor_id: value ? Number(value) : '' }))}
                options={opcionesProveedores}
                tableStyle={false}
                popup // mismo uso que en otras pantallas
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