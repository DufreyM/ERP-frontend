import React, { useEffect, useState } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import PopupButton from '../../components/Popup/Popup';
import styles from './InventarioScreen.module.css';
import ButtonText from '../../components/ButtonText/ButtonText';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import InventarioFilters from '../../components/FIlters/InventarioFilters';
import { useOutletContext } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const InventarioScreen = () => {
  const { selectedLocal } = useOutletContext();
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    tipo: '',
    ordenPrecio: '',
    ordenStock: ''
  });
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (selectedLocal !== undefined && selectedLocal !== null) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/productos/con-stock?local_id=${selectedLocal + 1}`)
        .then(res => res.json())
        .then(data => {
          const productosArray = Array.isArray(data) ? data : [];
          setProductos(productosArray);
          setProductosOriginales(productosArray);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar productos');
          setLoading(false);
        });
    }
  }, [selectedLocal]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Filtrar productos en tiempo real
    if (value.trim() === '') {
      setProductos(productosOriginales);
    } else {
      const productosFiltrados = productosOriginales.filter(producto =>
        producto.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setProductos(productosFiltrados);
    }
  };

  // Función para manejar cambios en los filtros
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para resetear filtros
  const onResetFiltros = () => {
    setFormData({
      tipo: '',
      ordenPrecio: '',
      ordenStock: ''
    });
    setOrdenAscendente(true);
    setProductos(productosOriginales);
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    let productosFiltrados = [...productosOriginales];

    // Filtro por tipo
    if (formData.tipo) {
      productosFiltrados = productosFiltrados.filter(p => p.detalles === formData.tipo);
    }

    // Ordenar por precio
    if (formData.ordenPrecio) {
      productosFiltrados.sort((a, b) => {
        const precioA = parseFloat(a.precioventa || a.precio_venta || 0);
        const precioB = parseFloat(b.precioventa || b.precio_venta || 0);
        return formData.ordenPrecio === 'asc' ? precioA - precioB : precioB - precioA;
      });
    }

    // Ordenar por stock
    if (formData.ordenStock) {
      productosFiltrados.sort((a, b) => {
        const stockA = parseInt(a.stock_actual || 0);
        const stockB = parseInt(b.stock_actual || 0);
        return formData.ordenStock === 'asc' ? stockA - stockB : stockB - stockA;
      });
    }

    // Aplicar búsqueda sobre los productos filtrados
    if (searchTerm.trim() === '') {
      setProductos(productosFiltrados);
    } else {
      const productosFiltradosYBusqueda = productosFiltrados.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProductos(productosFiltradosYBusqueda);
    }
  };

  // Función para manejar el orden alfabético con los iconos
  const handleOrdenAlfabetico = (ascendente) => {
    setOrdenAscendente(ascendente);
    let productosOrdenados = [...productos];
    
    productosOrdenados.sort((a, b) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();
      return ascendente 
        ? nombreA.localeCompare(nombreB)
        : nombreB.localeCompare(nombreA);
    });
    
    setProductos(productosOrdenados);
  };

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros();
  }, [formData, productosOriginales, searchTerm]);

  // Extraer tipos únicos de los productos
  const tiposUnicos = [...new Set(productosOriginales.map(p => p.detalles))].filter(tipo => tipo);

  const opciones = {
    tipos: tiposUnicos.map(tipo => ({
      value: tipo,
      label: tipo
    })),
    ordenPrecio: [
      { value: 'asc', label: 'Menor a Mayor' },
      { value: 'desc', label: 'Mayor a Menor' }
    ],
    ordenStock: [
      { value: 'asc', label: 'Menor a Mayor' },
      { value: 'desc', label: 'Mayor a Menor' }
    ]
  };

  const mostrarFiltros = {
    tipo: true,
    ordenPrecio: true,
    ordenStock: true
  };

  const handleDelete = async () => {
    if (!productoSeleccionado) return;
    setDeleting(true);
    try {
      await fetch(`/api/productos/${productoSeleccionado.codigo}`, { method: 'DELETE' });
      setProductos(productos.filter(p => p.codigo !== productoSeleccionado.codigo));
      setProductoSeleccionado(null);
      setShowConfirmDelete(false);
    } catch {
      alert('Error al eliminar el producto');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.inventarioContainer}>
      <SimpleTitle text="Inventario" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '400px' }}>
          <label style={{ color: '#5a60a5', fontWeight: 500, marginBottom: 4 }}>Medicamento</label>
          <IconoInput
            icono={faSearch}
            placeholder="Escribe el nombre de un medicamento"
            value={searchTerm}
            onChange={handleSearchInputChange}
            type="text"
            name="medicamento"
          />
        </div>
        <InventarioFilters
          formData={formData}
          handleChange={handleChange}
          opciones={opciones}
          mostrarFiltros={mostrarFiltros}
          onResetFiltros={onResetFiltros}
          ordenAscendente={ordenAscendente}
          setOrdenAscendente={handleOrdenAlfabetico}
        />
      </div>

      {loading && <div className={styles.loading}>Cargando productos...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.productosGrid}>
        {productos.map(producto => (
          <div
            key={producto.codigo}
            className={styles.productoCard}
            onClick={() => setProductoSeleccionado(producto)}
          >
            <img
              src={producto.imagen || '/default-user.svg'}
              alt={producto.nombre}
              className={styles.productoImg}
            />
            <h3 className={styles.nombre}>{producto.nombre}</h3>
            <div className={styles.presentacion}>{producto.presentacion}</div>
            <div className={styles.detalles}>{producto.detalles}</div>
            <div className={styles.precio}>{`Q${producto.precioventa}`}</div>
            <div className={styles.stock}>{`Stock: ${producto.stock_actual}`}</div>
          </div>
        ))}
      </div>
      
      {productoSeleccionado && (
        <PopupButton onClose={() => setProductoSeleccionado(null)}>
          <div className={styles.popupContent}>
            <img
              src={productoSeleccionado.imagen || '/default-user.svg'}
              alt={productoSeleccionado.nombre}
              className={styles.popupImg}
            />
            <div className={styles.popupDetails}>
              <h2 className={styles.nombre}>{productoSeleccionado.nombre}</h2>
              <div className={styles.presentacion}>{productoSeleccionado.presentacion}</div>
              <div className={styles.detalles}>{productoSeleccionado.detalles}</div>
              <div className={styles.proveedor}><b>Proveedor:</b> {productoSeleccionado.proveedor?.nombre || '-'}</div>
              <div className={styles.precio}><b>Precio venta:</b> Q{productoSeleccionado.precio_venta}</div>
              <div className={styles.precioCosto}><b>Precio costo:</b> Q{productoSeleccionado.precio_costo}</div>
              <div className={styles.stock}><b>Stock:</b> {productoSeleccionado.stock_actual}</div>
              <div className={styles.popupActions}>
                <ButtonText
                  text="Editar"
                  icon="edit"
                  onClick={() => alert('Funcionalidad de edición aquí')}
                  color="primary"
                />
                <ButtonText
                  text="Eliminar"
                  icon="delete"
                  onClick={() => setShowConfirmDelete(true)}
                  color="danger"
                />
              </div>
              {showConfirmDelete && (
                <div className={styles.confirmDelete}>
                  <p>¿Seguro que deseas eliminar este producto?</p>
                  <ButtonForm
                    text={deleting ? 'Eliminando...' : 'Sí, eliminar'}
                    onClick={handleDelete}
                    disabled={deleting}
                  />
                  <ButtonForm
                    text="Cancelar"
                    onClick={() => setShowConfirmDelete(false)}
                    color="secondary"
                  />
                </div>
              )}
            </div>
          </div>
        </PopupButton>
      )}
    </div>
  );
};

export default InventarioScreen;

