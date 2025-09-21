import React, { useState, useMemo } from "react";
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

  // Datos quemados de empleados con fechas formateadas
  const empleadosData = [
    {
      id: 1,
      nombre: "María",
      apellido: "González",
      email: "maria.gonzalez@econofarma.com",
      telefono: "555-0101",
      fechaNacimiento: formatearFecha("1985-03-15"),
      rol: "Administradora",
      rol_id: 1
    },
    {
      id: 2,
      nombre: "Ana",
      apellido: "Rodríguez",
      email: "ana.rodriguez@econofarma.com",
      telefono: "555-0102",
      fechaNacimiento: formatearFecha("1990-07-22"),
      rol: "Dependienta",
      rol_id: 2
    },
    {
      id: 3,
      nombre: "Carlos",
      apellido: "Mendoza",
      email: "carlos.mendoza@econofarma.com",
      telefono: "555-0103",
      fechaNacimiento: formatearFecha("1988-11-08"),
      rol: "Visitador Médico",
      rol_id: 3
    },
    {
      id: 4,
      nombre: "Laura",
      apellido: "Silva",
      email: "laura.silva@econofarma.com",
      telefono: "555-0104",
      fechaNacimiento: formatearFecha("1992-05-14"),
      rol: "Química Farmacéutica",
      rol_id: 4
    },
    {
      id: 5,
      nombre: "Roberto",
      apellido: "Hernández",
      email: "roberto.hernandez@econofarma.com",
      telefono: "555-0105",
      fechaNacimiento: formatearFecha("1987-09-30"),
      rol: "Contador",
      rol_id: 5
    },
    {
      id: 6,
      nombre: "Patricia",
      apellido: "López",
      email: "patricia.lopez@econofarma.com",
      telefono: "555-0106",
      fechaNacimiento: formatearFecha("1991-12-03"),
      rol: "Dependienta",
      rol_id: 2
    },
    {
      id: 7,
      nombre: "Miguel",
      apellido: "Torres",
      email: "miguel.torres@econofarma.com",
      telefono: "555-0107",
      fechaNacimiento: formatearFecha("1986-04-18"),
      rol: "Visitador Médico",
      rol_id: 3
    },
    {
      id: 8,
      nombre: "Carmen",
      apellido: "Vargas",
      email: "carmen.vargas@econofarma.com",
      telefono: "555-0108",
      fechaNacimiento: formatearFecha("1989-08-25"),
      rol: "Química Farmacéutica",
      rol_id: 4
    }
  ];

  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Estados para popups
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [advertencia, setAdvertencia] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);
  const [editarEmpleado, setEditarEmpleado] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState(false);

  // Opciones de roles para filtros
  const opcionesRoles = [
    { id: 1, nombre: "Administradora" },
    { id: 2, nombre: "Dependienta" },
    { id: 3, nombre: "Visitador Médico" },
    { id: 4, nombre: "Química Farmacéutica" },
    { id: 5, nombre: "Contador" }
  ];

  // Configuración de columnas de la tabla
  const columnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'apellido', titulo: 'Apellido' },
    { key: 'email', titulo: 'Correo Electrónico' },
    { key: 'telefono', titulo: 'Teléfono' },
    { key: 'fechaNacimiento', titulo: 'Fecha de Nacimiento' },
    { key: 'rol', titulo: 'Tipo de Rol' },
    { key: 'editar', titulo: 'Editar' },
    { key: 'eliminar', titulo: 'Eliminar' }
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
    setEmpleadoAEditar(empleado);
    setEditarEmpleado(true);
  };

  const closeEditarEmpleado = () => {
    setEditarEmpleado(false);
    setEmpleadoAEditar(null);
  };

  // Función para abrir popup de nuevo empleado
  const openNuevoEmpleado = () => setNuevoEmpleado(true);
  const closeNuevoEmpleado = () => setNuevoEmpleado(false);

  // Función para eliminar empleado (con doble confirmación)
  const eliminarEmpleado = () => {
    if (empleadoAEliminar) {
      console.log('Eliminando empleado:', empleadoAEliminar);
      // Aquí iría la llamada al backend
      closeAdvertencia();
    }
  };

  // Configuración de filtros
  const filterKeyMap = {
    RANGO_FECHA: "fechaNacimiento",
    ROL: "rol_id"
  };

  // Aplicar filtros
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
      const camposBusqueda = ['nombre', 'apellido', 'email', 'telefono', 'rol'];
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
        <Table
          nameColumns={columnas}
          data={sortedData}
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
        onClick={() => {
          console.log('Editando empleado:', empleadoAEditar);
          closeEditarEmpleado();
        }}
      >
        <div className={styles.modalContenido}>
          <p>Funcionalidad de edición en desarrollo...</p>
        </div>
      </Popup>

      {/* Popup para nuevo empleado */}
      <Popup 
        isOpen={nuevoEmpleado} 
        onClose={closeNuevoEmpleado}
        title="Agregar nuevo empleado"
        onClick={() => {
          console.log('Agregando nuevo empleado...');
          closeNuevoEmpleado();
        }}
      >
        <div className={styles.modalContenido}>
          <p>Funcionalidad de agregar empleado en desarrollo...</p>
        </div>
      </Popup>
    </div>
  );
};

export default EmpleadosClientes;
