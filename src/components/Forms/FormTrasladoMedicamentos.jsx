import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faArrowRight, faBuilding } from '@fortawesome/free-solid-svg-icons';
import IconoInput from '../Inputs/InputIcono';
import SelectSearch from '../Inputs/SelectSearch';
import InputSelects from '../Inputs/InputSelects';
import ButtonHeaders from '../ButtonHeaders/ButtonHeaders';
import { getToken } from '../../services/authService';

const FormTrasladoMedicamentos = ({ 
  isOpen, 
  onClose, 
  productosDisponibles = [], 
  localActual,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    producto_id: '',
    cantidad: '',
    destino_local_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locales, setLocales] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Cargar locales disponibles
  useEffect(() => {
    const cargarLocales = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/locales`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filtrar el local actual de las opciones de destino
          const localesDisponibles = data.filter(local => local.id !== localActual);
          setLocales(localesDisponibles);
        }
      } catch (error) {
        console.error('Error al cargar locales:', error);
      }
    };

    if (isOpen) {
      cargarLocales();
    }
  }, [isOpen, localActual]);

  // Preparar opciones de medicamentos para el SelectSearch
  const opcionesMedicamentos = productosDisponibles.map(producto => ({
    value: producto.id || producto.codigo,
    label: `${producto.nombre} - ${producto.presentacion} (Stock: ${producto.stock_actual})`
  }));

  // Opciones de locales para el destino
  const opcionesLocales = locales.map(local => ({
    value: local.id,
    label: `Local ${local.id} - ${local.nombre || `Local ${local.id}`}`
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al cambiar input
  };

  const handleMedicamentoChange = (value) => {
    setFormData(prev => ({
      ...prev,
      producto_id: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    // Validaciones
    if (!formData.producto_id) {
      setError('Por favor selecciona un medicamento');
      setLoading(false);
      return;
    }

    if (!formData.cantidad || formData.cantidad <= 0) {
      setError('Por favor ingresa una cantidad válida');
      setLoading(false);
      return;
    }

    if (!formData.destino_local_id) {
      setError('Por favor selecciona un local de destino');
      setLoading(false);
      return;
    }

    // Verificar que la cantidad no exceda el stock disponible
    const productoSeleccionado = productosDisponibles.find(
      p => String(p.id || p.codigo) === String(formData.producto_id)
    );
    
    if (productoSeleccionado && parseInt(formData.cantidad) > productoSeleccionado.stock_actual) {
      setError(`La cantidad no puede ser mayor al stock disponible (${productoSeleccionado.stock_actual})`);
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      const transferenciaData = {
        origen_local_id: localActual,
        destino_local_id: parseInt(formData.destino_local_id),
        productos: [
          {
            producto_id: parseInt(formData.producto_id),
            cantidad: parseInt(formData.cantidad)
          }
        ]
      };

      const response = await fetch(`${API_BASE_URL}/transferencias`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferenciaData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Error al realizar traslado (${response.status})`);
      }

      // Éxito
      const result = await response.json();
      console.log('Traslado exitoso:', result);
      
      // Limpiar formulario
      setFormData({
        producto_id: '',
        cantidad: '',
        destino_local_id: ''
      });

      // Cerrar modal y notificar éxito
      onClose();
      if (onSuccess) {
        onSuccess(result);
      }

    } catch (err) {
      console.error('Error al realizar traslado:', err);
      setError(err.message || 'Error al realizar el traslado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      producto_id: '',
      cantidad: '',
      destino_local_id: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content" style={{ maxWidth: '500px' }}>
        <h3>Trasladar Medicamento</h3>
        <button className="close-btn" onClick={handleClose}>X</button>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '16px', 
          margin: '20px 0',
          maxWidth: '100%'
        }}>
          {/* Selector de medicamento con búsqueda */}
          <div>
            <label style={{ 
              color: '#5a60a5', 
              fontWeight: 500, 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Medicamento
            </label>
            <SelectSearch
              options={opcionesMedicamentos}
              value={formData.producto_id}
              onChange={handleMedicamentoChange}
              placeholder="Buscar medicamento..."
            />
          </div>

          {/* Input de cantidad */}
          <IconoInput
            icono={faPills}
            name="cantidad"
            value={formData.cantidad}
            onChange={handleInputChange}
            placeholder="Cantidad a trasladar"
            type="number"
            min="1"
          />

          {/* Selector de local destino */}
          <div>
            <label style={{ 
              color: '#5a60a5', 
              fontWeight: 500, 
              marginBottom: '8px', 
              display: 'block' 
            }}>
              Local de Destino
            </label>
            <InputSelects
              icono={faBuilding}
              placeholder="Seleccionar local destino"
              name="destino_local_id"
              value={formData.destino_local_id}
              onChange={handleInputChange}
              opcions={opcionesLocales}
            />
          </div>

          {/* Mostrar información del medicamento seleccionado */}
          {formData.producto_id && (
            <div style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              {(() => {
                const producto = productosDisponibles.find(
                  p => String(p.id || p.codigo) === String(formData.producto_id)
                );
                return producto ? (
                  <div>
                    <strong>{producto.nombre}</strong>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {producto.presentacion} - Stock disponible: {producto.stock_actual}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            color: 'red',
            fontSize: '14px',
            marginBottom: '16px',
            padding: '8px',
            backgroundColor: '#ffe6e6',
            borderRadius: '4px',
            border: '1px solid #ffcccc'
          }}>
            {error}
          </div>
        )}

        <div className='buttonStylePopUp'>
          <ButtonHeaders 
            red={true} 
            text="Cancelar" 
            onClick={handleClose}
          />
          <ButtonHeaders 
            text={loading ? 'Trasladando...' : 'Trasladar'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FormTrasladoMedicamentos;
