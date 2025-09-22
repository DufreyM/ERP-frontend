import React, { useState, useMemo, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./EmpleadosClientes.module.css";
import SimpleTitle from "../../components/Titles/SimpleTitle";
import { Table } from "../../components/Tables/Table";
import Popup from '../../components/Popup/Popup';
import IconoInput from "../../components/Inputs/InputIcono";
import Filters from "../../components/FIlters/Filters";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders";
import OrderBy from "../../components/OrderBy/OrderBy";
import { useOrderBy } from "../../hooks/useOrderBy";
import { useFiltroGeneral } from "../../hooks/useFiltroGeneral";
import { useFetch } from "../../utils/useFetch";
import { getToken } from "../../services/authService";
import { faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

const EmpleadosClientes = () => {
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1;

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Filtros de API
  const [statusSeleccionado, setStatusSeleccionado] = useState(""); // 'activo' | 'inactivo' | ""
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = new URLSearchParams();
  params.set('id_local', String(localSeleccionado));
  if (rolSeleccionado) params.set('rol_id', String(rolSeleccionado));
  if (statusSeleccionado) params.set('status', statusSeleccionado);
  if (page) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));

  const token = getToken();
  const shouldFetch = Boolean(token);
  const empleadosUrl = shouldFetch ? `http://localhost:3000/api/empleados?${params.toString()}` : null;
  const { data: empleadosResponse, loading, error, refetch } = useFetch(
    empleadosUrl,
    {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'GET'
    },
    [localSeleccionado, rolSeleccionado, statusSeleccionado, page, limit]
  );

  

  // Estados para popups
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [advertencia, setAdvertencia] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);
  const [editarEmpleado, setEditarEmpleado] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState(false);

  // Form state crear/editar
  const estadosPosibles = ['activo', 'inactivo'];
  const [formEmpleado, setFormEmpleado] = useState({
    nombre: '',
    apellidos: '',
    rol_id: 2,
    email: '',
    status: 'activo',
    id_local: localSeleccionado,
    contrasena: '',
    fechanacimiento: ''
  });

  // Opciones de roles para filtros
  const opcionesRoles = [
    { id: 1, nombre: "Administradora" },
    { id: 2, nombre: "Dependiente" }
  ];

  // Configuración de columnas de la tabla
  const columnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'apellidos', titulo: 'Apellidos' },
    { key: 'email', titulo: 'Correo Electrónico' },
    { key: 'fechanacimiento', titulo: 'Fecha de Nacimiento' },
    { key: 'rol', titulo: 'Tipo de Rol' },
    { key: 'status', titulo: 'Estado' },
    { key: 'editar', titulo: 'Editar' }
  ];

  // Función para manejar búsqueda
  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  // Función para manejar cambio de rol
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rol") {
      const numValue = parseInt(value);
      setRolSeleccionado(isNaN(numValue) ? "" : numValue);
    }
  };

  // Función para abrir popup de eliminar
  const openAdvertencia = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setAdvertencia(true);
  };

  const closeAdvertencia = () => {
    setAdvertencia(false);
    setEmpleadoAEliminar(null);
  };

  // Función para abrir popup de editar
  const openEditarEmpleado = (empleado) => {
    const base = (empleado && empleadosData?.find?.((e) => e.id === empleado.id)) || empleado;
    setEmpleadoAEditar(base);
    setEditarEmpleado(true);
  };

  const closeEditarEmpleado = () => {
    setEditarEmpleado(false);
    setEmpleadoAEditar(null);
  };

  // Función para abrir popup de nuevo empleado
  const openNuevoEmpleado = () => {
    setFormEmpleado({
      nombre: '',
      apellidos: '',
      rol_id: 2,
      email: '',
      status: 'activo',
      id_local: localSeleccionado,
      contrasena: '',
      fechanacimiento: ''
    });
    setNuevoEmpleado(true);
  };
  const closeNuevoEmpleado = () => setNuevoEmpleado(false);

  // Cargar datos al formulario al abrir editar
  useEffect(() => {
    if (empleadoAEditar) {
      setFormEmpleado({
        nombre: empleadoAEditar.nombre || '',
        apellidos: empleadoAEditar.apellidos || empleadoAEditar.apellido || '',
        rol_id: empleadoAEditar.rol_id || 2,
        email: empleadoAEditar.email || '',
        status: (empleadoAEditar.status || 'activo'),
        id_local: empleadoAEditar.id_local || localSeleccionado,
        contrasena: '',
        fechanacimiento: empleadoAEditar.fechanacimientoISO ? empleadoAEditar.fechanacimientoISO.slice(0,10) : ''
      });
    } else {
      // Reset al cerrar
      setFormEmpleado(prev => ({
        ...prev,
        id_local: localSeleccionado
      }));
    }
  }, [empleadoAEditar, localSeleccionado]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormEmpleado(prev => ({ ...prev, [name]: name === 'rol_id' || name === 'id_local' ? Number(value) : value }));
  };

  // Crear empleado
  const crearEmpleado = async () => {
    // Validaciones mínimas en frontend
    if (!getToken()) {
      alert('No autorizado. Inicie sesión para continuar.');
      return;
    }
    if (!formEmpleado.nombre || !formEmpleado.apellidos || !formEmpleado.email || !formEmpleado.contrasena || !formEmpleado.fechanacimiento) {
      alert('Complete nombre, apellidos, email, contraseña y fecha de nacimiento.');
      return;
    }
    try {
      const resp = await fetch('http://localhost:3000/api/empleados', {
        method: 'POST',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formEmpleado.nombre,
          apellidos: formEmpleado.apellidos,
          rol_id: formEmpleado.rol_id,
          email: formEmpleado.email,
          status: formEmpleado.status,
          id_local: formEmpleado.id_local,
          contrasena: formEmpleado.contrasena,
          fechanacimiento: formEmpleado.fechanacimiento,
        })
      });
      if (!resp.ok) {
        let serverMsg = '';
        try { serverMsg = (await resp.json())?.error || (await resp.json())?.message || ''; } catch {}
        throw new Error(serverMsg || `Error al crear empleado (HTTP ${resp.status})`);
      }
      await refetch();
      closeNuevoEmpleado();
    } catch (e) {
      console.error(e);
      alert(`No se pudo crear el empleado. ${e.message || ''}`);
    }
  };

  // Actualizar empleado
  const actualizarEmpleado = async () => {
    if (!empleadoAEditar) return;
    try {
      // Solo campos permitidos y no vacíos
      const camposPermitidos = ['nombre', 'apellidos', 'rol_id', 'email', 'status', 'id_local', 'fechanacimiento'];
      const payload = camposPermitidos.reduce((acc, key) => {
        const val = formEmpleado[key];
        if (val !== undefined && val !== null && String(val) !== '') acc[key] = val;
        return acc;
      }, {});
      const resp = await fetch(`http://localhost:3000/api/empleados/${empleadoAEditar.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) {
        let serverMsg = '';
        try { serverMsg = (await resp.json())?.error || (await resp.json())?.message || ''; } catch {}
        throw new Error(serverMsg || `Error al actualizar empleado (HTTP ${resp.status})`);
      }
      await refetch();
      closeEditarEmpleado();
    } catch (e) {
      console.error(e);
      alert(`No se pudo actualizar el empleado. ${e.message || ''}`);
    }
  };

  // Eliminar empleado (marcar inactivo)
  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    try {
      const resp = await fetch(`http://localhost:3000/api/empleados/${empleadoAEliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
        }
      });
      if (!resp.ok) throw new Error('Error al eliminar');
      await refetch();
      closeAdvertencia();
    } catch (e) {
      console.error(e);
      alert('No se pudo eliminar el empleado');
    }
  };

  // Toggle status activo/inactivo
  const onToggleStatus = async (empleado) => {
    const original = empleadosData?.find?.((e) => e.id === empleado.id) || empleado;
    const nuevoStatus = (String(original.status).toLowerCase() === 'activo' || original.status === true) ? 'inactivo' : 'activo';
    try {
      const resp = await fetch(`http://localhost:3000/api/empleados/${original.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nuevoStatus })
      });
      if (!resp.ok) throw new Error('Error al cambiar estado');
      await refetch();
    } catch (e) {
      console.error(e);
      alert('No se pudo cambiar el estado');
    }
  };

  // Configuración de filtros
  const filterKeyMap = {
    RANGO_FECHA: "fechaNacimiento",
    ROL: "rol_id"
  };

  // Normalizar respuesta y aplicar filtros
  const empleadosData = useMemo(() => {
    if (empleadosResponse) {
      try { console.debug('Empleados GET response:', empleadosResponse); } catch {}
    }
    const maybeArrays = [
      empleadosResponse?.data?.items,
      empleadosResponse?.data?.rows,
      empleadosResponse?.data,
      empleadosResponse?.items,
      empleadosResponse?.rows,
      empleadosResponse?.empleados,
      empleadosResponse?.results,
      empleadosResponse,
    ];
    const lista = maybeArrays.find(arr => Array.isArray(arr)) || [];
    return lista.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      apellidos: e.apellidos || e.apellido,
      email: e.email,
      fechanacimiento: e.fechanacimiento ? formatearFecha(e.fechanacimiento) : '',
      fechanacimientoISO: e.fechanacimiento || '',
      rol_id: e.rol_id,
      rol: e.rol_id === 1 ? 'Administradora' : 'Dependiente',
      status: (
        typeof e.status === 'string' ? e.status : (e.status ? 'activo' : 'inactivo')
      ),
      id_local: e.id_local,
    }));
  }, [empleadosResponse]);

  const { dataFiltrada: dataConFiltros } = useFiltroGeneral({
    data: empleadosData,
    filterKeyMap: filterKeyMap,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    rolId: rolSeleccionado
  });

  // Aplicar búsqueda
  const dataFiltrada = useMemo(() => {
    if (!busqueda) return dataConFiltros;
    
    return dataConFiltros.filter(empleado => {
      const camposBusqueda = ['nombre', 'apellidos', 'email', 'rol'];
      return camposBusqueda.some(campo => 
        empleado[campo]?.toLowerCase().includes(busqueda.toLowerCase())
      );
    });
  }, [dataConFiltros, busqueda]);

  // Configuración de ordenamiento
  const sortKeyMap = {
    AZ: "nombre",
    ZA: "nombre",
  };

  const { sortedData, sortOption, setSortOption } = useOrderBy({
    data: dataFiltrada,
    sortKeyMap
  });


  return (
    <div className={styles.contenedorGeneral}>
      <div className={styles.contenedorEncabezado}>
        <div className={styles.contenedorTitle}>
          <SimpleTitle text="Empleados y Clientes" />
        </div>

        {/* Buscador */}
        <div className={styles.buscadorContainer}>
          <IconoInput
            icono={faSearch}
            placeholder="Buscar empleados..."
            value={busqueda}
            onChange={handleBusqueda}
            type="text"
            name="busqueda"
          />
        </div>

        {/* Filtros */}
        <Filters
          title="Empleados"
          mostrarRangoFecha={true}
          mostrarRangoPrecio={false}
          mostrarUsuario={false}
          mostrarMedicamento={false}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          opcionesRoles={opcionesRoles}
          rolSeleccionado={rolSeleccionado}
          handleChange={handleChange}
        />

        {/* Ordenar */}
        <OrderBy
          FAbecedario={true}
          FExistencias={false}
          FPrecio={false}
          FFecha={false}
          selectedOption={sortOption}
          onChange={setSortOption}
        />

        {/* Botón agregar nuevo empleado */}
        <ButtonHeaders 
          text="Agregar +"
          onClick={openNuevoEmpleado}
        />
      </div>

      <div className={styles.contenedorTabla}>
        {loading && <p style={{color:'#5a60A5'}}>Cargando...</p>}
        {error && <p style={{color:'crimson'}}>Error: {String(error)}</p>}
        <Table
          nameColumns={columnas}
          data={sortedData.map(emp => ({
            ...emp,
            status: (
              <span
                className={[
                  styles.estadoChip,
                  (String(emp.status).toLowerCase() === 'activo') ? styles.estadoActivo : styles.estadoInactivo
                ].join(' ')}
                onClick={() => onToggleStatus(emp)}
                title="Cambiar estado"
              >
                {String(emp.status).toLowerCase() === 'activo' ? 'Activo' : 'Inactivo'}
              </span>
            )
          }))}
          onEliminarClick={openAdvertencia}
          onEditarClick={openEditarEmpleado}
        />
      </div>

      {/* Popup para eliminar empleado */}
      <Popup 
        isOpen={advertencia} 
        onClose={closeAdvertencia}
        title={`¿Estás seguro de eliminar a "${empleadoAEliminar?.nombre} ${empleadoAEliminar?.apellido}"?`}
        onClick={eliminarEmpleado}
      >
        <div className={styles.modalContenido}>
          <p>Esta acción no se puede deshacer.</p>
        </div>
      </Popup>

      {/* Popup para editar empleado */}
      <Popup 
        isOpen={editarEmpleado} 
        onClose={closeEditarEmpleado}
        title="Editar empleado"
        onClick={actualizarEmpleado}
      >
        <div className={styles.modalContenido}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',maxWidth:600,margin:'0 auto'}}>
            <input name="nombre" value={formEmpleado.nombre} onChange={handleFormChange} placeholder="Nombre" />
            <input name="apellidos" value={formEmpleado.apellidos} onChange={handleFormChange} placeholder="Apellidos" />
            <input name="email" value={formEmpleado.email} onChange={handleFormChange} placeholder="Correo" />
            <input name="fechanacimiento" type="date" value={formEmpleado.fechanacimiento} onChange={handleFormChange} />
            <select name="rol_id" value={formEmpleado.rol_id} onChange={handleFormChange}>
              {opcionesRoles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            <select name="status" value={formEmpleado.status} onChange={handleFormChange}>
              {estadosPosibles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="id_local" value={formEmpleado.id_local} onChange={handleFormChange}>
              <option value={1}>Local 1</option>
              <option value={2}>Local 2</option>
            </select>
          </div>
        </div>
      </Popup>

      {/* Popup para nuevo empleado */}
      <Popup 
        isOpen={nuevoEmpleado} 
        onClose={closeNuevoEmpleado}
        title="Agregar nuevo empleado"
        onClick={crearEmpleado}
      >
        <div className={styles.modalContenido}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',maxWidth:600,margin:'0 auto'}}>
            <input name="nombre" value={formEmpleado.nombre} onChange={handleFormChange} placeholder="Nombre" />
            <input name="apellidos" value={formEmpleado.apellidos} onChange={handleFormChange} placeholder="Apellidos" />
            <input name="email" value={formEmpleado.email} onChange={handleFormChange} placeholder="Correo" />
            <input name="fechanacimiento" type="date" value={formEmpleado.fechanacimiento} onChange={handleFormChange} />
            <select name="rol_id" value={formEmpleado.rol_id} onChange={handleFormChange}>
              {opcionesRoles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            <select name="status" value={formEmpleado.status} onChange={handleFormChange}>
              {estadosPosibles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="id_local" value={formEmpleado.id_local} onChange={handleFormChange}>
              <option value={1}>Local 1</option>
              <option value={2}>Local 2</option>
            </select>
            <input name="contrasena" value={formEmpleado.contrasena} onChange={handleFormChange} placeholder="Contraseña" type="password" />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default EmpleadosClientes;
