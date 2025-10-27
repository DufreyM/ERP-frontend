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
import { faUser, faSearch, faEnvelope, faCalendar, faPhone } from '@fortawesome/free-solid-svg-icons';
import InputSearch from "../../components/Inputs/InputSearch";
import InputSelects from "../../components/Inputs/InputSelects";
import InputDates from "../../components/Inputs/InputDates";

// Función para formatear fecha
const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}-${mes}-${año}`;
};

const VisitadoresAdmin = () => {
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1;

  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Filtros de API
  const [statusSeleccionado, setStatusSeleccionado] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const token = getToken();
  const shouldFetch = Boolean(token);
  
  // Memoizar la URL para evitar recálculos innecesarios
  const visitadoresUrl = useMemo(() => {
    if (!shouldFetch) return null;
    
    const params = new URLSearchParams();
    params.set('id_local', String(localSeleccionado));
    if (proveedorSeleccionado) params.set('proveedor_id', String(proveedorSeleccionado));
    if (statusSeleccionado) params.set('status', statusSeleccionado);
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    
    return `${import.meta.env.VITE_API_URL}/visitadores?${params.toString()}`;
  }, [shouldFetch, localSeleccionado, proveedorSeleccionado, statusSeleccionado, page, limit]);

  // Memoizar las opciones de headers para evitar recreación
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

  // Estados para popups
  const [visitadorAEliminar, setVisitadorAEliminar] = useState(null);
  const [advertencia, setAdvertencia] = useState(false);
  const [visitadorAEditar, setVisitadorAEditar] = useState(null);
  const [editarVisitador, setEditarVisitador] = useState(false);

  // Form state crear/editar
  const [formVisitador, setFormVisitador] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono_fijo: '',
    telefono_movil: '',
    fecha_nacimiento: '',
    proveedor_id: '',
    contrasena: '',
    documento: null
  });

  // Opciones de proveedores para filtros
  const opcionesProveedores = [
    { id: 1, nombre: "Proveedor 1" },
    { id: 2, nombre: "Proveedor 2" }
  ];

  // Configuración de columnas de la tabla
  const columnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'apellido', titulo: 'Apellido' },
    { key: 'correo', titulo: 'Correo Electrónico' },
    { key: 'telefono_fijo', titulo: 'Teléfono Fijo' },
    { key: 'telefono_movil', titulo: 'Teléfono Móvil' },
    { key: 'fecha_nacimiento', titulo: 'Fecha de Nacimiento' },
    { key: 'proveedor', titulo: 'Proveedor' },
    { key: 'documento', titulo: 'Documento' },
    { key: 'status', titulo: 'Estado' },
    { key: 'editar', titulo: 'Editar' }
  ];

  console.log("VisitadoresAdmin: Configuración de columnas lista");

  // Función para manejar búsqueda
  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  // Función para manejar cambio de proveedor
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "proveedor") {
      const numValue = parseInt(value);
      setProveedorSeleccionado(isNaN(numValue) ? "" : numValue);
    }
  };

  // Función para abrir popup de eliminar
  const openAdvertencia = (visitador) => {
    setVisitadorAEliminar(visitador);
    setAdvertencia(true);
  };

  const closeAdvertencia = () => {
    setAdvertencia(false);
    setVisitadorAEliminar(null);
  };

  const closeEditarVisitador = () => {
    setEditarVisitador(false);
    setVisitadorAEditar(null);
    setFormVisitador({
      nombre: '',
      apellido: '',
      correo: '',
      telefono_fijo: '',
      telefono_movil: '',
      fecha_nacimiento: '',
      proveedor_id: '',
      contrasena: '',
      documento: null
    });
  };

  // Normalizar respuesta y aplicar filtros
  const visitadoresData = useMemo(() => {
    if (visitadoresResponse) {
      try { 
        console.debug('Visitadores GET response:', visitadoresResponse); 
      } catch (e) {
        console.error('Error al procesar respuesta:', e);
      }
    }
    
    // Si hay error en la respuesta, mostrar datos de prueba
    if (visitadoresResponse?.error) {
      console.warn('Error del servidor, mostrando datos de prueba:', visitadoresResponse.error);
      return [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@ejemplo.com',
          telefono_fijo: '1234567890',
          telefono_movil: '0987654321',
          fecha_nacimiento: '15-03-1985',
          fecha_nacimientoISO: '1985-03-15',
          proveedor_id: 1,
          proveedor: 'Proveedor 1',
          documento: '',
          status: 'activo'
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          correo: 'maria.gonzalez@ejemplo.com',
          telefono_fijo: '2345678901',
          telefono_movil: '1876543210',
          fecha_nacimiento: '22-07-1990',
          fecha_nacimientoISO: '1990-07-22',
          proveedor_id: 2,
          proveedor: 'Proveedor 2',
          documento: '',
          status: 'inactivo'
        }
      ];
    }
    
    const maybeArrays = [
      visitadoresResponse?.data?.items,
      visitadoresResponse?.data?.rows,
      visitadoresResponse?.data,
      visitadoresResponse?.items,
      visitadoresResponse?.rows,
      visitadoresResponse?.visitadores,
      visitadoresResponse?.results,
      visitadoresResponse,
    ];
    const lista = maybeArrays.find(arr => Array.isArray(arr)) || [];
    
    return lista.map((v) => {
      // Extraer teléfonos fijo y móvil de la relación telefonos
      const telefonos = v.telefonos || [];
      const telefonoFijo = telefonos.find(t => t.tipo === 'fijo')?.numero || '';
      const telefonoMovil = telefonos.find(t => t.tipo === 'móvil')?.numero || '';
      
      return {
        id: v.id,
        nombre: v.usuario?.nombre || '',
        apellido: v.usuario?.apellidos || '',
        correo: v.usuario?.email || '',
        telefono_fijo: telefonoFijo,
        telefono_movil: telefonoMovil,
        fecha_nacimiento: v.usuario?.fechanacimiento ? formatearFecha(v.usuario.fechanacimiento) : '',
        fecha_nacimientoISO: v.usuario?.fechanacimiento || '',
        proveedor_id: v.proveedor_id || '',
        proveedor: v.proveedor?.nombre || v.proveedor?.razon_social || (v.proveedor_id ? `ID ${v.proveedor_id}` : ''),
        documento: v.documento_url || '',
        status: v.usuario?.status || 'inactivo'
      };
    });
  }, [visitadoresResponse]);

  // Función para abrir popup de editar (definida después de visitadoresData)
  const openEditarVisitador = (visitador) => {
    const base = (visitador && visitadoresData?.find?.((v) => v.id === visitador.id)) || visitador;
    setVisitadorAEditar(base);
    setEditarVisitador(true);
  };

  // Toggle status activo/inactivo (definida después de visitadoresData)
  const onToggleStatus = async (visitador) => {
    const original = visitadoresData.find(v => v.id === visitador.id) || visitador;
    const esActivo = String(original.status).toLowerCase() === 'activo';
    
    // Si está activo y va a inactivo, usar PATCH deactivate
    // Si está inactivo y va a activo, usar PATCH activate
    if (esActivo) {
      // Cambiar de activo a inactivo = PATCH deactivate
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${original.id}/deactivate`, {
          method: 'PATCH',
          headers: {
            'Authorization': getToken() ? `Bearer ${getToken()}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (!checkToken(resp)) return;
        
        if (!resp.ok) {
          const errorText = await resp.text();
          throw new Error(errorText || `Error al desactivar visitador (HTTP ${resp.status})`);
        }
        
        await refetch();
      } catch (e) {
        console.error('Error al desactivar visitador:', e);
      }
    } else {
      // Cambiar de inactivo a activo = PATCH activate
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${original.id}/activate`, {
          method: 'PATCH',
          headers: {
            'Authorization': getToken() ? `Bearer ${getToken()}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (!checkToken(resp)) return;
        
        if (!resp.ok) {
          const errorText = await resp.text();
          throw new Error(errorText || `Error al activar visitador (HTTP ${resp.status})`);
        }
        
        await refetch();
      } catch (e) {
        console.error('Error al activar visitador:', e);
      }
    }
  };

  // Aplicar filtros y búsqueda
  const dataFiltrada = useMemo(() => {
    let filtered = visitadoresData;
    
    // Filtro por proveedor
    if (proveedorSeleccionado) {
      filtered = filtered.filter(visitador => 
        String(visitador.proveedor_id) === String(proveedorSeleccionado)
      );
    }
    
    // Filtro por fecha de nacimiento
    if (fechaInicio || fechaFin) {
      filtered = filtered.filter(visitador => {
        if (!visitador.fecha_nacimientoISO) return true;
        const fechaItem = new Date(visitador.fecha_nacimientoISO);
        return (!fechaInicio || fechaItem >= fechaInicio) && 
               (!fechaFin || fechaItem <= fechaFin);
      });
    }
    
    // Aplicar búsqueda
    if (busqueda) {
      filtered = filtered.filter(visitador => {
        const camposBusqueda = ['nombre', 'apellido', 'correo', 'proveedor'];
        return camposBusqueda.some(campo => 
          visitador[campo]?.toLowerCase().includes(busqueda.toLowerCase())
        );
      });
    }
    
    // Ordenar por estado: activos primero, inactivos al final
    filtered.sort((a, b) => {
      const statusA = String(a.status).toLowerCase();
      const statusB = String(b.status).toLowerCase();
      
      // Si ambos tienen el mismo estado, mantener orden original
      if (statusA === statusB) return 0;
      
      // Activos primero (activo = 0, inactivo = 1)
      if (statusA === 'activo' && statusB === 'inactivo') return -1;
      if (statusA === 'inactivo' && statusB === 'activo') return 1;
      
      return 0;
    });
    
    return filtered;
  }, [visitadoresData, proveedorSeleccionado, fechaInicio, fechaFin, busqueda]);

  // Configuración de ordenamiento
  const sortKeyMap = {
    AZ: "nombre",
    ZA: "nombre",
  };

  const { sortedData, sortOption, setSortOption } = useOrderBy({
    data: dataFiltrada,
    sortKeyMap
  });

  // Eliminar visitador
  const eliminarVisitador = async () => {
    if (!visitadorAEliminar) return;
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${visitadorAEliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getToken() ? `Bearer ${getToken()}` : '',
        }
      });
      if (!checkToken(resp)) return;
      if (!resp.ok) throw new Error('Error al eliminar');
      await refetch();
      closeAdvertencia();
    } catch (e) {
      console.error(e);
    }
  };

  // Cargar datos al formulario al abrir editar
  useEffect(() => {
    if (visitadorAEditar) {
      // Buscar el visitador en los datos normalizados para obtener la estructura correcta
      const visitadorNormalizado = visitadoresData.find(v => v.id === visitadorAEditar.id) || visitadorAEditar;
      
      // Formatear la fecha para el input de fecha (formato YYYY-MM-DD)
      let fechaFormateada = '';
      if (visitadorNormalizado.fecha_nacimientoISO) {
        const fecha = new Date(visitadorNormalizado.fecha_nacimientoISO);
        if (!isNaN(fecha.getTime())) {
          fechaFormateada = fecha.toISOString().split('T')[0];
        }
      }
      
      setFormVisitador({
        nombre: visitadorNormalizado.nombre || '',
        apellido: visitadorNormalizado.apellido || '',
        correo: visitadorNormalizado.correo || '',
        telefono_fijo: visitadorNormalizado.telefono_fijo || '',
        telefono_movil: visitadorNormalizado.telefono_movil || '',
        fecha_nacimiento: fechaFormateada,
        proveedor_id: visitadorNormalizado.proveedor_id || '',
        contrasena: '',
        documento: visitadorNormalizado.documento
          ? { url: visitadorNormalizado.documento, nombre: 'Documento actual' }
          : null
      });
    }
  }, [visitadorAEditar, visitadoresData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormVisitador(prev => ({ ...prev, [name]: name === 'proveedor_id' ? Number(value) : value }));
  };

  const actualizarVisitador = async () => {
    // Validaciones
    if (!visitadorAEditar) {
      return;
    }

    if (!getToken()) {
      return;
    }

    // Validar campos requeridos
    if (!formVisitador.nombre?.trim()) {
      return;
    }

    if (!formVisitador.apellido?.trim()) {
      return;
    }

    if (!formVisitador.correo?.trim()) {
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formVisitador.correo?.trim())) {
      return;
    }

    // Buscar el visitador original para obtener los IDs necesarios
    const maybeArrays = [
      visitadoresResponse?.data?.items,
      visitadoresResponse?.data?.rows,
      visitadoresResponse?.data,
      visitadoresResponse?.items,
      visitadoresResponse?.rows,
      visitadoresResponse?.visitadores,
      visitadoresResponse?.results,
      visitadoresResponse,
    ];
    const listaOriginal = maybeArrays.find(arr => Array.isArray(arr)) || [];
    const visitadorOriginal = listaOriginal.find(v => v.id === visitadorAEditar.id);

    if (!visitadorOriginal || !visitadorOriginal.usuario) {
      return;
    }

    const { usuario } = visitadorOriginal;
    const telefonoFijo = formVisitador.telefono_fijo?.trim();
    const telefonoMovil = formVisitador.telefono_movil?.trim();

    // Formatear la fecha de nacimiento correctamente
    let fechanacimientoFormateada = usuario.fechanacimiento; // Usar la fecha original por defecto
    
    if (formVisitador.fecha_nacimiento) {
      // Si hay una nueva fecha, convertirla al formato ISO
      const fecha = new Date(formVisitador.fecha_nacimiento);
      if (!isNaN(fecha.getTime())) {
        fechanacimientoFormateada = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }
    }

    const updateData = {
      proveedor_id: Number(formVisitador.proveedor_id) || null,
      usuario: {
        id: Number(usuario.id),
        nombre: formVisitador.nombre.trim(),
        apellidos: formVisitador.apellido.trim(),
        email: formVisitador.correo.trim(),
        fechanacimiento: fechanacimientoFormateada,
        rol_id: usuario.rol_id,
        status: usuario.status,
        contrasena: "unchanged" // No cambiar contraseña en edición
      },
      telefonos: [
        ...(telefonoFijo ? [{
          id: visitadorOriginal.telefonos?.find(t => t.tipo === 'fijo')?.id ?? null,
          numero: telefonoFijo,
          tipo: 'fijo'
        }] : []),
        ...(telefonoMovil ? [{
          id: visitadorOriginal.telefonos?.find(t => t.tipo === 'móvil')?.id ?? null,
          numero: telefonoMovil,
          tipo: 'móvil'
        }] : [])
      ]
    };

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/visitadores/${visitadorAEditar.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!checkToken(resp)) return;

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(errorText || `Error al actualizar (HTTP ${resp.status})`);
      }

      await resp.json();
      await refetch();
      closeEditarVisitador();
    } catch (e) {
      console.error("Error al actualizar visitador:", e);
    }
  };

  return (
    <div className={styles.contenedorGeneral}>
      <div className={styles.contenedorEncabezado}>
        <div className={styles.contenedorTitle}>
        <SimpleTitle text="Visitadores médicos" />
        </div>

        {/* Buscador */}
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

        {/* Filtros */}
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
          rolSeleccionado={proveedorSeleccionado}
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

      </div>

      <div className={styles.contenedorTabla}>
        {loading && <p style={{color:'#5a60A5'}}>Cargando...</p>}
        {error && <p style={{color:'crimson'}}>Error: {String(error)}</p>}
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

      {/* Popup para eliminar visitador */}
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

      {/* Popup para editar visitador */}
      <Popup 
        isOpen={editarVisitador} 
        onClose={closeEditarVisitador}
        title="Editar visitador médico"
        onClick={actualizarVisitador}
      >
        <div className={styles.modalContenido}>
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'12px',maxWidth:560,margin:'0 auto', width:'100%'}}>
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
              name="correo"
              value={formVisitador.correo}
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
              onChange={(date) => setFormVisitador(prev => ({...prev, fecha_nacimiento: date ? date.toISOString().slice(0,10) : ''}))}
            />
            <InputSelects
              icono={faUser}
              placeholder="Proveedor"
              name="proveedor_id"
              value={formVisitador.proveedor_id}
              onChange={handleFormChange}
              opcions={opcionesProveedores.map(p => ({ value: p.id, label: p.nombre }))}
            />
            <IconoInput
              icono={faUser}
              name="documento"
              value=""
              onChange={(e) => setFormVisitador(prev => ({...prev, documento: e.target.files[0]}))}
              placeholder="Documento PDF"
              type="file"
              accept=".pdf"
            />
          </div>
        </div>
      </Popup>

    </div>
  );
};

export default VisitadoresAdmin;