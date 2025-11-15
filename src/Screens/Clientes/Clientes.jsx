import React, { useState, useMemo, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./Clientes.module.css";
import SimpleTitle from "../../components/Titles/SimpleTitle";
import { Table } from "../../components/Tables/Table";
import Popup from '../../components/Popup/Popup';
import IconoInput from "../../components/Inputs/InputIcono";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders";
import OrderBy from "../../components/OrderBy/OrderBy";
import { useOrderBy } from "../../hooks/useOrderBy";
import { useFetch } from "../../utils/useFetch";
import { getToken } from "../../services/authService";
import { faUser, faSearch, faEnvelope, faIdCard, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import InputSearch from "../../components/Inputs/InputSearch";
import { useCheckToken } from "../../utils/checkToken";

const Clientes = () => {
    const { selectedLocal } = useOutletContext();
    const checkToken = useCheckToken();

    // Maneja las notificaciones
    const [notificacion, setNotificacion] = useState('');
    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => {
                setNotificacion('');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [notificacion]);

    // Estados para búsqueda
    const [busqueda, setBusqueda] = useState('');

    const token = getToken();
    const shouldFetch = Boolean(token);
    const clientesUrl = shouldFetch ? `${import.meta.env.VITE_API_URL}/clientes` : null;
    
    const { data: clientesResponse, loading, error, refetch } = useFetch(
        clientesUrl,
        {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
            method: 'GET'
        },
        []
    );

    // Estados para popups
    const [clienteAEliminar, setClienteAEliminar] = useState(null);
    const [advertencia, setAdvertencia] = useState(false);
    const [clienteAEditar, setClienteAEditar] = useState(null);
    const [editarCliente, setEditarCliente] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState(false);

    // Form state crear/editar
    const [formCliente, setFormCliente] = useState({
        nombre: '',
        nit: '',
        direccion: '',
        correo: ''
    });

    // Configuración de columnas de la tabla
    const columnas = [
        { key: 'nombre', titulo: 'Nombre' },
        { key: 'nit', titulo: 'NIT' },
        { key: 'direccion', titulo: 'Dirección' },
        { key: 'correo', titulo: 'Correo Electrónico' },
        { key: 'editar', titulo: 'Editar' }
    ];

    // Función para manejar búsqueda
    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    // Función para abrir popup de eliminar
    const openAdvertencia = (cliente) => {
        setClienteAEliminar(cliente);
        setAdvertencia(true);
    };

    const closeAdvertencia = () => {
        setAdvertencia(false);
        setClienteAEliminar(null);
    };

    // Función para abrir popup de editar
    const openEditarCliente = (cliente) => {
        const base = (cliente && clientesData?.find?.((c) => c.id === cliente.id)) || cliente;
        setClienteAEditar(base);
        setEditarCliente(true);
    };

    const closeEditarCliente = () => {
        setEditarCliente(false);
        setClienteAEditar(null);
    };

    // Función para abrir popup de nuevo cliente
    const openNuevoCliente = () => {
        setFormCliente({
            nombre: '',
            nit: '',
            direccion: '',
            correo: ''
        });
        setNuevoCliente(true);
    };

    const closeNuevoCliente = () => {
        setNuevoCliente(false);
    };

    // Cargar datos al formulario al abrir editar
    useEffect(() => {
        if (clienteAEditar) {
            setFormCliente({
                nombre: clienteAEditar.nombre || '',
                nit: clienteAEditar.nit || '',
                direccion: clienteAEditar.direccion || '',
                correo: clienteAEditar.correo || ''
            });
        }
    }, [clienteAEditar]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormCliente(prev => ({ ...prev, [name]: value }));
    };

    const validarCliente = (formCliente) => {
        if (!getToken()) {
            return 'No autorizado. Inicie sesión para continuar.';
        }

        if (!formCliente.nombre || !formCliente.nit) {
            return 'Complete los campos de nombre y NIT.';
        }

        if (formCliente.nombre.trim().length < 2) {
            return 'El nombre debe tener al menos 2 letras.';
        }

        if (formCliente.nit.trim().length < 1) {
            return 'El NIT es requerido.';
        }

        if (formCliente.correo && formCliente.correo.trim() !== '') {
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formCliente.correo);
            if (!emailValido) {
                return 'El correo ingresado no tiene un formato válido.';
            }
        }

        return null; // todo bien
    };

    // Crear cliente
    const crearCliente = async () => {
        const error = validarCliente(formCliente);
        if (error) {
            setNotificacion(error);
            return;
        }

        try {
            const payload = {
                nombre: formCliente.nombre.trim(),
                nit: formCliente.nit.trim(),
                direccion: formCliente.direccion.trim() || null,
                correo: formCliente.correo.trim() || null
            };

            const resp = await fetch(`${import.meta.env.VITE_API_URL}/clientes`, {
                method: 'POST',
                headers: {
                    'Authorization': getToken() ? `Bearer ${getToken()}` : '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!checkToken(resp)) return;

            if (!resp.ok) {
                let serverMsg = '';
                try { 
                    const errorData = await resp.json();
                    serverMsg = errorData?.error || errorData?.message || ''; 
                } catch {}
                throw new Error(serverMsg || `Error al crear cliente (HTTP ${resp.status})`);
            }
            
            await refetch();
            closeNuevoCliente();
            setNotificacion('Cliente creado exitosamente');
        } catch (e) {
            console.error('Error creando cliente:', e);
            alert(`No se pudo crear el cliente. ${e.message || ''}`);
        }
    };

    // Actualizar cliente
    const actualizarCliente = async () => {
        if (!clienteAEditar) return;

        const error = validarCliente(formCliente);
        if (error) {
            setNotificacion(error);
            return;
        }

        try {
            const payload = {
                nombre: formCliente.nombre.trim(),
                nit: formCliente.nit.trim(),
                direccion: formCliente.direccion.trim() || null,
                correo: formCliente.correo.trim() || null
            };

            const resp = await fetch(`${import.meta.env.VITE_API_URL}/clientes/${clienteAEditar.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': getToken() ? `Bearer ${getToken()}` : '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!checkToken(resp)) return;

            if (!resp.ok) {
                let serverMsg = '';
                try { 
                    const errorData = await resp.json();
                    serverMsg = errorData?.error || errorData?.message || ''; 
                } catch {}
                throw new Error(serverMsg || `Error al actualizar cliente (HTTP ${resp.status})`);
            }
            
            await refetch();
            closeEditarCliente();
            setNotificacion('Cliente actualizado exitosamente');
        } catch (e) {
            console.error('Error actualizando cliente:', e);
            alert(`No se pudo actualizar el cliente. ${e.message || ''}`);
        }
    };

    // Eliminar cliente
    const eliminarCliente = async () => {
        if (!clienteAEliminar) return;
        try {
            const resp = await fetch(`${import.meta.env.VITE_API_URL}/clientes/${clienteAEliminar.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': getToken() ? `Bearer ${getToken()}` : '',
                }
            });
            
            if (!checkToken(resp)) return;

            if (!resp.ok) {
                let serverMsg = '';
                try { 
                    const errorData = await resp.json();
                    serverMsg = errorData?.error || errorData?.message || ''; 
                } catch {}
                throw new Error(serverMsg || `Error al eliminar cliente (HTTP ${resp.status})`);
            }
            
            await refetch();
            closeAdvertencia();
            setNotificacion('Cliente eliminado exitosamente');
        } catch (e) {
            console.error('Error eliminando cliente:', e);
            alert(`No se pudo eliminar el cliente. ${e.message || ''}`);
        }
    };

    // Normalizar respuesta de clientes
    const clientesData = useMemo(() => {
        if (!clientesResponse) return [];
        
        // Si es array, usarlo directamente
        if (Array.isArray(clientesResponse)) {
            return clientesResponse;
        }
        
        // Si es objeto con propiedad clientes
        if (clientesResponse.clientes && Array.isArray(clientesResponse.clientes)) {
            return clientesResponse.clientes;
        }
        
        // Si es objeto con propiedad data
        if (clientesResponse.data && Array.isArray(clientesResponse.data)) {
            return clientesResponse.data;
        }
        
        return [];
    }, [clientesResponse]);

    // Aplicar búsqueda
    const dataFiltrada = useMemo(() => {
        if (!busqueda) return clientesData;
        
        return clientesData.filter(cliente => {
            const camposBusqueda = ['nombre', 'nit', 'direccion', 'correo'];
            return camposBusqueda.some(campo => 
                String(cliente[campo] || '').toLowerCase().includes(busqueda.toLowerCase())
            );
        });
    }, [clientesData, busqueda]);

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
                    <h1 className={styles.tituloClientes}>Clientes</h1>
                </div>
                <div className={styles.opcionesE}>
                <div className={styles.buscadorContainer}>
                    <InputSearch
                        icono={faSearch}
                        placeholder="Buscar por nombre, NIT, dirección..."
                        value={busqueda}
                        onChange={handleBusqueda}
                        type="text"
                        name="busqueda"
                    />
                </div>

                <div className={styles.headerBotonesClientes}>
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
                        onClick={openNuevoCliente}
                    />
                </div>
                </div>
            </div>

            <div className={styles.contenedorTabla}>
                {/* {loading && <p style={{color:'#5a60A5'}}>Cargando clientes...</p>}
                {error && <p style={{color:'crimson'}}>Error: {String(error)}</p>}
                {!loading && !error && clientesData.length === 0 && (
                    <p style={{color:'#666'}}>No hay clientes registrados</p>
                )} */}
                <Table
                    nameColumns={columnas}
                    data={sortedData.map(cliente => ({
                        id: cliente.id,
                        nombre: cliente.nombre || '-',
                        nit: cliente.nit || '-',
                        direccion: cliente.direccion || '-',
                        correo: cliente.correo || '-'
                    }))}
                    onEliminarClick={openAdvertencia}
                    onEditarClick={openEditarCliente}
                />
            </div>

            {/* Popup para eliminar cliente */}
            <Popup 
                isOpen={advertencia} 
                onClose={closeAdvertencia}
                title={`¿Estás seguro de eliminar a "${clienteAEliminar?.nombre}"?`}
                onClick={eliminarCliente}
            >
                <div className={styles.modalContenido}>
                    <p>Esta acción no se puede deshacer.</p>
                </div>
            </Popup>

            {/* Popup para editar cliente */}
            <Popup 
                isOpen={editarCliente} 
                onClose={closeEditarCliente}
                title="Editar cliente"
                onClick={actualizarCliente}
            >
                <div className={styles.modalContenido}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'12px',maxWidth:560,margin:'0 auto', width:'100%'}}>
                        <IconoInput
                            icono={faUser}
                            name="nombre"
                            value={formCliente.nombre}
                            onChange={handleFormChange}
                            placeholder="Nombre *"
                            type="text"
                            formatoAa={true}
                            required
                        />
                        <IconoInput
                            icono={faIdCard}
                            name="nit"
                            value={formCliente.nit}
                            onChange={handleFormChange}
                            placeholder="NIT *"
                            type="text"
                            required
                        />
                        <IconoInput
                            icono={faMapMarkerAlt}
                            name="direccion"
                            value={formCliente.direccion}
                            onChange={handleFormChange}
                            placeholder="Dirección"
                            type="text"
                        />
                        <IconoInput
                            icono={faEnvelope}
                            name="correo"
                            value={formCliente.correo}
                            onChange={handleFormChange}
                            placeholder="Correo electrónico"
                            type="email"
                        />
                    </div>
                </div>
            </Popup>

            {/* Popup para nuevo cliente */}
            <Popup 
                isOpen={nuevoCliente} 
                onClose={closeNuevoCliente}
                title="Agregar nuevo cliente"
                onClick={crearCliente}
            >
                <div className={styles.modalContenido}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'12px',maxWidth:560,margin:'0 auto', width:'100%'}}>
                        <IconoInput
                            icono={faUser}
                            name="nombre"
                            value={formCliente.nombre}
                            onChange={handleFormChange}
                            placeholder="Nombre *"
                            type="text"
                            formatoAa={true}
                            required
                        />
                        <IconoInput
                            icono={faIdCard}
                            name="nit"
                            value={formCliente.nit}
                            onChange={handleFormChange}
                            placeholder="NIT *"
                            type="text"
                            required
                        />
                        <IconoInput
                            icono={faMapMarkerAlt}
                            name="direccion"
                            value={formCliente.direccion}
                            onChange={handleFormChange}
                            placeholder="Dirección"
                            type="text"
                        />
                        <IconoInput
                            icono={faEnvelope}
                            name="correo"
                            value={formCliente.correo}
                            onChange={handleFormChange}
                            placeholder="Correo electrónico"
                            type="email"
                        />
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default Clientes;
