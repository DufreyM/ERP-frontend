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
import { faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import InputSearch from "../../components/Inputs/InputSearch";

const VisitadoresAdmin = () => {
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
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Filtros de API
  const [statusSeleccionado, setStatusSeleccionado] = useState(""); // 'activo' | 'inactivo' | ""
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = new URLSearchParams();
  params.set('id_local', String(localSeleccionado));
  if (proveedorSeleccionado) params.set('proveedor_id', String(proveedorSeleccionado));
  if (statusSeleccionado) params.set('status', statusSeleccionado);
  if (page) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));

  const token = getToken();
  const shouldFetch = Boolean(token);
  const visitadoresUrl = shouldFetch ? `http://localhost:3000/visitadores?${params.toString()}` : null;
  const { data: visitadoresResponse, loading, error, refetch } = useFetch(
    visitadoresUrl,
    {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'GET'
    },
    [localSeleccionado, proveedorSeleccionado, statusSeleccionado, page, limit]
  );

  // Estados para popups
  const [visitadorAEliminar, setVisitadorAEliminar] = useState(null);
  const [advertencia, setAdvertencia] = useState(false);
  const [visitadorAEditar, setVisitadorAEditar] = useState(null);
  const [editarVisitador, setEditarVisitador] = useState(false);

  // Form state crear/editar
  const estadosPosibles = ['activo', 'inactivo'];
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

  // Opciones de proveedores para filtros (esto debería venir de una API)
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

  // Función para abrir popup de editar
  const openEditarVisitador = (visitador) => {
    const base = (visitador && visitadoresData?.find?.((v) => v.id === visitador.id)) || visitador;
    setVisitadorAEditar(base);
    setEditarVisitador(true);
  };

  const closeEditarVisitador = () => {
    setEditarVisitador(false);
    setVisitadorAEditar(null);
  };


  // Cargar datos al formulario al abrir editar
  useEffect(() => {
  if (visitadorAEditar) {
    setFormVisitador({
      nombre: visitadorAEditar.usuario?.nombre || '',
      apellido: visitadorAEditar.usuario?.apellidos || '',
      correo: visitadorAEditar.usuario?.email || '',
      telefono_fijo: visitadorAEditar.telefonos?.find(t => t.tipo === 'fijo')?.numero || '',
      telefono_movil: visitadorAEditar.telefonos?.find(t => t.tipo === 'móvil')?.numero || '',
      fecha_nacimiento: visitadorAEditar.usuario?.fechanacimiento
        ? visitadorAEditar.usuario.fechanacimiento.slice(0, 10)
        : '',
      proveedor_id: visitadorAEditar.proveedor_id || '',
      contrasena: '',
      documento: visitadorAEditar.documento_url
        ? { url: visitadorAEditar.documento_url, nombre: visitadorAEditar.documento_nombre }
        : null
    });
  }
}, [visitadorAEditar]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormVisitador(prev => ({ ...prev, [name]: name === 'proveedor_id' ? Number(value) : value }));
  };


  const actualizarVisitador = async () => {
  if (!visitadorAEditar || !visitadorAEditar.usuario) {
    alert("El visitador no tiene datos de usuario cargados.");
    return;
  }

  const { usuario } = visitadorAEditar;

  const telefonoFijo = formVisitador.telefono_fijo?.trim();
  const telefonoMovil = formVisitador.telefono_movil?.trim();

  const updateData = {
    proveedor_id: Number(formVisitador.proveedor_id) || null,
    usuario: {
      id: Number(usuario.id),
      nombre: formVisitador.nombre?.trim() || usuario.nombre,
      apellidos: formVisitador.apellido?.trim() || usuario.apellidos,
      email: formVisitador.correo?.trim() || usuario.email,
      fechanacimiento: formVisitador.fecha_nacimiento || usuario.fechanacimiento,
      rol_id: usuario.rol_id,
      status: usuario.status,
      contrasena: usuario.contrasena || "unchanged"
    },
    telefonos: [
      ...(telefonoFijo ? [{
        id: visitadorAEditar.telefonos?.find(t => t.tipo === 'fijo')?.id ?? null,
        numero: telefonoFijo,
        tipo: 'fijo'
      }] : []),
      ...(telefonoMovil ? [{
        id: visitadorAEditar.telefonos?.find(t => t.tipo === 'móvil')?.id ?? null,
        numero: telefonoMovil,
        tipo: 'móvil'
      }] : [])
    ]
  };

  console.log("Payload enviado:", updateData);

  try {
    const resp = await fetch(`http://localhost:3000/visitadores/${visitadorAEditar.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': getToken() ? `Bearer ${getToken()}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(errorText || `Error al actualizar (HTTP ${resp.status})`);
    }

    await refetch();
    closeEditarVisitador();
  } catch (e) {
    console.error("❌ Error al actualizar visitador:", e);
    alert(`No se pudo actualizar el visitador. ${e.message || ''}`);
  }
};

  // Eliminar visitador
  const eliminarVisitador = async () => {
    if (!visitadorAEliminar) return;
    try {
      const resp = await fetch(`http://localhost:3000/visitadores/${visitadorAEliminar.id}`, {
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
      alert('No se pudo eliminar el visitador');
    }
  };

  // Toggle status activo/inactivo
  const onToggleStatus = async (visitador) => {
  const original = visitadoresData.find(v => v.id === visitador.id) || visitador;
  const nuevoStatus = String(original.status).toLowerCase() === 'activo' ? 'deactivate' : 'activate';

  try {
    const resp = await fetch(`http://localhost:3000/visitadores/${original.id}/${nuevoStatus}`, {
      method: 'PATCH',
      headers: {
        'Authorization': getToken() ? `Bearer ${getToken()}` : '',
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) throw new Error('Error al cambiar estado');
    await refetch();
  } catch (e) {
    console.error(e);
    alert('No se pudo cambiar el estado');
  }
};



  // Normalizar respuesta y aplicar filtros
  const visitadoresData = useMemo(() => {
    if (visitadoresResponse) {
      try { console.debug('Visitadores GET response:', visitadoresResponse); } catch {}
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
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',maxWidth:600,margin:'0 auto'}}>
            <input name="nombre" value={formVisitador.nombre} onChange={handleFormChange} placeholder="Nombre" />
            <input name="apellido" value={formVisitador.apellido} onChange={handleFormChange} placeholder="Apellido" />
            <input name="correo" value={formVisitador.correo} onChange={handleFormChange} placeholder="Correo" />
            <input name="telefono_fijo" value={formVisitador.telefono_fijo} onChange={handleFormChange} placeholder="Teléfono Fijo" />
            <input name="telefono_movil" value={formVisitador.telefono_movil} onChange={handleFormChange} placeholder="Teléfono Móvil" />
            <input name="fecha_nacimiento" type="date" value={formVisitador.fecha_nacimiento} onChange={handleFormChange} />
            <select name="proveedor_id" value={formVisitador.proveedor_id} onChange={handleFormChange}>
              <option value="">Seleccionar proveedor</option>
              {opcionesProveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            <input name="documento" type="file" accept=".pdf" onChange={(e) => setFormVisitador(prev => ({...prev, documento: e.target.files[0]}))} />
          </div>
        </div>
      </Popup>

    </div>
  );
};

export default VisitadoresAdmin;