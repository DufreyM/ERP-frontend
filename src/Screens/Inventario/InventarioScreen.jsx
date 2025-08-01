import React, { useEffect, useState } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import PopupButton from '../../components/Popup/Popup';
import styles from './InventarioScreen.module.css';
import ButtonText from '../../components/ButtonText/ButtonText';
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
              src={producto.imagen_url || '/default-user.svg'}
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
              src={productoSeleccionado.imagen_url || '/default-user.svg'}
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

