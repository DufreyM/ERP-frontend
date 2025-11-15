import React, { useState, useMemo, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./Empleados.module.css";
import SimpleTitle from "../../components/Titles/SimpleTitle";
import { Table } from "../../components/Tables/Table";
import Popup from '../../components/Popup/Popup';
import IconoInput from "../../components/Inputs/InputIcono";
import InputPassword from "../../components/Inputs/InputPassword";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders";
import OrderBy from "../../components/OrderBy/OrderBy";
import { useOrderBy } from "../../hooks/useOrderBy";
import { useFetch } from "../../utils/useFetch";
import { getToken } from "../../services/authService";
import { faUser, faSearch, faEnvelope, faCalendar, faLock } from '@fortawesome/free-solid-svg-icons';
import InputSearch from "../../components/Inputs/InputSearch";
import InputSelects from "../../components/Inputs/InputSelects";
import InputDates from "../../components/Inputs/InputDates";
import { useCheckToken } from "../../utils/checkToken";

const Empleados = () => {
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1;
  const checkToken = useCheckToken();
  

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  // Función para formatear fecha a YYYY-MM-DD usando métodos locales (evita problemas de zona horaria)
  const formatearFechaParaInput = (date) => {
    if (!date) return '';
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  // Función para convertir string YYYY-MM-DD a Date usando hora local (evita problemas de zona horaria)
  const stringToDateLocal = (fechaString) => {
    if (!fechaString) return null;
    const partes = fechaString.split('-');
    if (partes.length !== 3) return null;
    const año = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Los meses en JS van de 0-11
    const dia = parseInt(partes[2], 10);
    return new Date(año, mes, dia);
  };

  //Maneja las noticiaciones de creación eliminación o edición de un estado
  const [notificacion, setNotificacion] = useState('');
  useEffect(() => {
      if (notificacion) {
          const timer = setTimeout(() => {
          setNotificacion('');
          }, 2500); // se quita en 2.5 segundos

          return () => clearTimeout(timer);
      }
  }, [notificacion]);

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  // Estados para búsqueda
  const [busqueda, setBusqueda] = useState('');
  
  // Filtros de API
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = new URLSearchParams();
  params.set('id_local', String(localSeleccionado));
  if (page) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));

  const token = getToken();
  const shouldFetch = Boolean(token);
  const empleadosUrl = shouldFetch ? `${import.meta.env.VITE_API_URL}/api/empleados?${params.toString()}` : null;
  const { data: empleadosResponse, loading, error, refetch } = useFetch(
    empleadosUrl,
    {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'GET'
    },
    [localSeleccionado, page, limit]
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

  // Opciones de roles
  const opcionesRoles = [
    { id: 1, nombre: "Administrador" },
    { id: 2, nombre: "Dependiente" },
    { id: 3, nombre: "Visitador Médico" },
    { id: 4, nombre: "Contador" }
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
    setShowPassword(false); // Resetear visibilidad de contraseña
    setNuevoEmpleado(true);
  };
  const closeNuevoEmpleado = () => {
    setNuevoEmpleado(false);
    setShowPassword(false); // Resetear visibilidad de contraseña al cerrar
  };

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
    // Si el valor es vacío (placeholder seleccionado), guardarlo como string vacío o null
    // Solo convertir a Number si el valor no está vacío
    if (name === 'rol_id' || name === 'id_local') {
      const numValue = value === '' ? '' : Number(value);
      setFormEmpleado(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormEmpleado(prev => ({ ...prev, [name]: value }));
    }
  };

  const validarEmpleado = (formEmpleado, { requiereContrasena = false } = {}) => {

    if (!getToken()) {
      return 'No autorizado. Inicie sesión para continuar.';
    }

    if (!formEmpleado.nombre || !formEmpleado.apellidos) {
      return 'Complete el campo de nombre y apellidos.';
    }

    if (formEmpleado.nombre.trim().length < 2 || formEmpleado.apellidos.trim().length < 2) {
      return 'Nombre y apellidos deben tener al menos 2 letras.';
    }


    if (!formEmpleado.email) {
      return 'Complete el campo con el correo del empleado.';
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmpleado.email);
    if (!emailValido) {
      return 'El correo ingresado no tiene un formato válido.';
    }

    if (requiereContrasena && !formEmpleado.contrasena) {
      return 'Complete el campo de contraseña, no olvide anotarla.';
    }

    if (requiereContrasena && formEmpleado.contrasena.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!formEmpleado.fechanacimiento) {
      return 'Complete el campo de fecha de nacimiento.';
    }

    const hoy = new Date();
    const fechaNacimiento = new Date(formEmpleado.fechanacimiento);
    const hace18Anios = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());

    if (isNaN(fechaNacimiento.getTime())) {
      return 'La fecha de nacimiento no es válida.';
    }

    if (fechaNacimiento.getFullYear() < 1900) {
      return 'La fecha de nacimiento es inválida.';
    }

    const esMayorDeEdad = fechaNacimiento <= hace18Anios;
    if (!esMayorDeEdad) {
      return 'El empleado debe tener al menos 18 años de edad.';
    }

    if (!formEmpleado.id_local) {
      return 'Seleccione el local de trabajo del usuario.';
    }

    if (!formEmpleado.rol_id || formEmpleado.rol_id === '') {
      return 'Seleccione un rol para el nuevo usuario.';
    }

    if (!formEmpleado.status) {
      return 'Seleccione el status del empleado.';
    }

    return null; // todo bien
  };


  // Crear empleado
  const crearEmpleado = async () => {
    
    const error = validarEmpleado(formEmpleado, { requiereContrasena: true });
      if (error) {
        setNotificacion(error);
        return;
      }
      

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/empleados`, {
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
      if (!checkToken(resp)) return; //Para redirigir a login cuando el token expiró

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

    const error = validarEmpleado(formEmpleado);
    if (error) {
      setNotificacion(error);
      return;
    }
      
    try {
      // Solo campos permitidos y no vacíos
      const camposPermitidos = ['nombre', 'apellidos', 'rol_id', 'email', 'status', 'id_local', 'fechanacimiento'];
      const payload = camposPermitidos.reduce((acc, key) => {
        const val = formEmpleado[key];
        if (val !== undefined && val !== null && String(val) !== '') acc[key] = val;
        return acc;
      }, {});
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/empleados/${empleadoAEditar.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      if (!checkToken(resp)) return; //Para redirigir a login cuando el token expiró

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
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/empleados/${empleadoAEliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
        }
      });
      if (!checkToken(resp)) return; //Para redirigir a login cuando el token expiró

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
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/empleados/${original.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nuevoStatus })
      });
      if (!checkToken(resp)) return; //Para redirigir a login cuando el token expiró

      if (!resp.ok) throw new Error('Error al cambiar estado');
      await refetch();
    } catch (e) {
      console.error(e);
      alert('No se pudo cambiar el estado');
    }
  };

  // Normalizar respuesta
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
      rol: (
        e.rol_id === 1 ? 'Administrador' :
        e.rol_id === 2 ? 'Dependiente' :
        e.rol_id === 3 ? 'Visitador Médico' :
        e.rol_id === 4 ? 'Contador' : ''
      ),
      status: (
        typeof e.status === 'string' ? e.status : (e.status ? 'activo' : 'inactivo')
      ),
      id_local: e.id_local,
    }));
  }, [empleadosResponse]);

  // Aplicar búsqueda
  const dataFiltrada = useMemo(() => {
    if (!busqueda) return empleadosData;
    
    return empleadosData.filter(empleado => {
      const camposBusqueda = ['nombre', 'apellidos', 'email', 'rol'];
      return camposBusqueda.some(campo => 
        empleado[campo]?.toLowerCase().includes(busqueda.toLowerCase())
      );
    });
  }, [empleadosData, busqueda]);

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
      {notificacion && (
          <div className="toast">
              {notificacion}
          </div>
      )}
      <div className={styles.contenedorEncabezado}>
        <div className={styles.contenedorTitle}>
          <h1 className={styles.tituloEmpleados}>Empleados</h1>
        </div>

        <div className={styles.buscadorContainer}>
          <InputSearch
            icono={faSearch}
            placeholder="Buscar empleados..."
            value={busqueda}
            onChange={handleBusqueda}
            type="text"
            name="busqueda"
          />
        </div>

        <div className={styles.headerBotonesEmpleados}>
          <OrderBy
            FAbecedario={true}
            FExistencias={false}
            FPrecio={false}
            FFecha={false}
            selectedOption={sortOption}
            onChange={setSortOption}
          />

          <ButtonHeaders 
            text="Agregar +"
            onClick={openNuevoEmpleado}
          />
        </div>
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
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'12px',maxWidth:560,margin:'0 auto', width:'100%'}}>
            <IconoInput
              icono={faUser}
              name="nombre"
              value={formEmpleado.nombre || ''}
              onChange={handleFormChange}
              placeholder="Nombre"
              type="text"
              formatoAa={true}
            />
            <IconoInput
              icono={faUser}
              name="apellidos"
              value={formEmpleado.apellidos || ''}
              onChange={handleFormChange}
              placeholder="Apellidos"
              type="text"
              formatoAa={true}
            />
            <IconoInput
              icono={faEnvelope}
              name="email"
              value={formEmpleado.email || ''}
              onChange={handleFormChange}
              placeholder="Correo electrónico"
              type="email"
            />
            <InputDates
              icono={faCalendar}
              placeholder="Fecha de nacimiento"
              selected={formEmpleado.fechanacimiento ? stringToDateLocal(formEmpleado.fechanacimiento) : (empleadoAEditar?.fechanacimientoISO ? stringToDateLocal(empleadoAEditar.fechanacimientoISO.slice(0,10)) : null)}
              onChange={(date) => setFormEmpleado(prev => ({...prev, fechanacimiento: formatearFechaParaInput(date)}))}
            />
            <InputSelects
              icono={faUser}
              placeholder="Tipo de rol"
              name="rol_id"
              value={formEmpleado.rol_id !== undefined ? String(formEmpleado.rol_id) : (empleadoAEditar?.rol_id ? String(empleadoAEditar.rol_id) : '')}
              onChange={handleFormChange}
              opcions={opcionesRoles.map(r => ({ value: r.id, label: r.nombre }))}
            />
            <InputSelects
              icono={faUser}
              placeholder="Estado"
              name="status"
              value={formEmpleado.status !== undefined ? String(formEmpleado.status) : (empleadoAEditar?.status ? String(empleadoAEditar.status) : '')}
              onChange={handleFormChange}
              opcions={estadosPosibles.map(s => ({ value: s, label: s.charAt(0).toUpperCase()+s.slice(1) }))}
            />
            <InputSelects
              icono={faUser}
              placeholder="Local"
              name="id_local"
              value={formEmpleado.id_local !== undefined ? String(formEmpleado.id_local) : (empleadoAEditar?.id_local ? String(empleadoAEditar.id_local) : '')}
              onChange={handleFormChange}
              opcions={[{value:1,label:'Local 1'},{value:2,label:'Local 2'}]}
            />
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
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'12px',maxWidth:560,margin:'0 auto', width:'100%'}}>
            <IconoInput
              icono={faUser}
              name="nombre"
              value={formEmpleado.nombre}
              onChange={handleFormChange}
              placeholder="Nombre"
              type="text"
              formatoAa={true}
            />
            <IconoInput
              icono={faUser}
              name="apellidos"
              value={formEmpleado.apellidos}
              onChange={handleFormChange}
              placeholder="Apellidos"
              type="text"
              formatoAa={true}
            />
            <IconoInput
              icono={faEnvelope}
              name="email"
              value={formEmpleado.email}
              onChange={handleFormChange}
              placeholder="Correo"
              type="email"
            />
            <InputDates
              icono={faCalendar}
              placeholder="Fecha de nacimiento"
              selected={formEmpleado.fechanacimiento ? stringToDateLocal(formEmpleado.fechanacimiento) : null}
              onChange={(date) => setFormEmpleado(prev => ({...prev, fechanacimiento: formatearFechaParaInput(date)}))}

            />
            <InputSelects
              icono={faUser}
              placeholder="Tipo de rol"
              name="rol_id"
              value={formEmpleado.rol_id}
              onChange={handleFormChange}
              opcions={opcionesRoles.map(r => ({ value: r.id, label: r.nombre }))}
            />
            <InputSelects
              icono={faUser}
              placeholder="Estado"
              name="status"
              value={formEmpleado.status}
              onChange={handleFormChange}
              opcions={estadosPosibles.map(s => ({ value: s, label: s.charAt(0).toUpperCase()+s.slice(1) }))}
            />
            <InputSelects
              icono={faUser}
              placeholder="Local"
              name="id_local"
              value={formEmpleado.id_local}
              onChange={handleFormChange}
              opcions={[{value:1,label:'Local 1'},{value:2,label:'Local 2'}]}
            />
            <InputPassword
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              icono={faLock}
              placeholder="Contraseña"
              value={formEmpleado.contrasena}
              onChange={handleFormChange}
              name="contrasena"
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Empleados;
