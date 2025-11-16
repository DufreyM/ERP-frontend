import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import SimpleTitle from '../../components/Titles/SimpleTitle';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import ButtonText from '../../components/ButtonText/ButtonText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faDollarSign, faHouseMedical, faPhone, faEnvelope, faLocationDot, faImage, faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { getToken } from '../../services/authService';
import SelectSearch from '../../components/Inputs/SelectSearch';
import { useFetch } from '../../utils/useFetch.jsx';
import { useCheckToken } from '../../utils/checkToken.js';
import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';
import styles from './InventarioScreen.module.css';
import formStyles from './AgregarMedicamento.module.css';
import InputSelects from '../../components/Inputs/InputSelects.jsx';
import InputFile from '../../components/Inputs/InputFile.jsx';

const AgregarMedicamento = () => {
  const { selectedLocal } = useOutletContext();
  const navigate = useNavigate();
  const checkToken = useCheckToken();

  const [formProducto, setFormProducto] = useState({
    nombre: '',
    presentacion: '',
    proveedor_id: '',
    precioventa: '',
    preciocosto: '',
    receta: '', // 'true' | 'false'
    stock_minimo: '',
    detalles: ''
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [agregandoProveedor, setAgregandoProveedor] = useState(false);
  const [nuevoProveedorNombre, setNuevoProveedorNombre] = useState('');
  const [nuevoProveedorTelefono, setNuevoProveedorTelefono] = useState('');
  const [nuevoProveedorCorreo, setNuevoProveedorCorreo] = useState('');
  const [nuevoProveedorDireccion, setNuevoProveedorDireccion] = useState('');
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState('');
  const [notificacion, setNotificacion] = useState('');
  const [loading, setLoading] = useState(false);

  const token = getToken();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

  // Cargar proveedores
  const { data: proveedores } = useFetch(
    `${API_BASE_URL}/api/proveedor`,
    { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }
  );
  const opcionesProveedores = useMemo(() => {
    if (!Array.isArray(proveedores)) return [];
    return proveedores.map(p => ({ value: String(p.id), label: p.nombre, ...p }));
  }, [proveedores]);

  useEffect(() => {
    if (notificacion) {
      const t = setTimeout(() => setNotificacion(''), 2500);
      return () => clearTimeout(t);
    }
  }, [notificacion]);

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setFormProducto(prev => ({ ...prev, [name]: value }));
  };

  const validarProducto = () => {
    if (!getToken()) return 'No autorizado. Inicie sesión.';
    if (!formProducto.nombre || !formProducto.presentacion) return 'Complete nombre y presentación.';
    if (!proveedorSeleccionadoId) return 'Seleccione el proveedor.';
    const proveedorId = Number(proveedorSeleccionadoId);
    if (!Number.isInteger(proveedorId) || proveedorId <= 0) return 'Proveedor debe ser un número válido (>0).';
    const pv = Number(formProducto.precioventa);
    const pc = Number(formProducto.preciocosto);
    if (isNaN(pv) || pv < 0) return 'Precio de venta inválido.';
    if (isNaN(pc) || pc < 0) return 'Precio de costo inválido.';
    if (formProducto.receta !== 'true' && formProducto.receta !== 'false') return 'Seleccione si requiere receta (Sí/No).';
    const sm = Number(formProducto.stock_minimo);
    if (isNaN(sm) || sm < 0) return 'Stock mínimo inválido.';
    if (imagenFile) {
      const maxBytes = 10 * 1024 * 1024; // 10MB
      const allowed = ['image/png', 'image/jpeg'];
      if (!allowed.includes(imagenFile.type)) return 'La imagen debe ser PNG o JPG.';
      if (imagenFile.size > maxBytes) return 'La imagen no debe exceder 10 MB.';
    }
    return null;
  };

  const handleImagenChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImagenFile(file);
  };

  const crearProducto = async () => {
    const errorMsg = validarProducto();
    if (errorMsg) { 
      setNotificacion(errorMsg); 
      return; 
    }
    
    setLoading(true);
    try {
      let resp;
      if (imagenFile) {
        const fd = new FormData();
        fd.append('nombre', formProducto.nombre);
        fd.append('presentacion', formProducto.presentacion);
        fd.append('proveedor_id', String(Number(proveedorSeleccionadoId)));
        fd.append('precioventa', String(Number(formProducto.precioventa)));
        fd.append('preciocosto', String(Number(formProducto.preciocosto)));
        fd.append('receta', String(formProducto.receta === 'true'));
        fd.append('stock_minimo', String(Number(formProducto.stock_minimo)));
        fd.append('detalles', formProducto.detalles || '');
        fd.append('imagen', imagenFile);
        resp = await fetch(`${API_BASE_URL}/api/productos`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      } else {
        const jsonPayload = {
          nombre: formProducto.nombre,
          presentacion: formProducto.presentacion,
          proveedor_id: Number(proveedorSeleccionadoId),
          precioventa: Number(formProducto.precioventa),
          preciocosto: Number(formProducto.preciocosto),
          receta: (formProducto.receta === 'true'),
          stock_minimo: Number(formProducto.stock_minimo),
          detalles: formProducto.detalles || ''
        };
        resp = await fetch(`${API_BASE_URL}/api/productos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonPayload)
        });
      }
      
      if (!checkToken(resp)) return;
      
      if (!resp.ok) {
        let serverMsg = `HTTP ${resp.status}`;
        try {
          const text = await resp.text();
          try { serverMsg = (JSON.parse(text))?.error || (JSON.parse(text))?.message || text; }
          catch { serverMsg = text || serverMsg; }
        } catch {}
        throw new Error(serverMsg);
      }
      
      // Redirigir a inventario después de crear exitosamente
      navigate(-1); // Volver a la pantalla anterior (inventario)
    } catch (e) {
      console.error(e);
      setNotificacion(`No se pudo crear el producto. ${e?.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarProveedor = async () => {
    try {
      if (!nuevoProveedorNombre || !nuevoProveedorTelefono || !nuevoProveedorCorreo || !nuevoProveedorDireccion) {
        setNotificacion('Completa todos los campos del nuevo proveedor.');
        return;
      }
      const nuevoProveedor = {
        nombre: nuevoProveedorNombre,
        direccion: nuevoProveedorDireccion,
        correo: nuevoProveedorCorreo,
        telefonos: [{ numero: nuevoProveedorTelefono, tipo: 'fijo' }]
      };
      const resp = await fetch(`${API_BASE_URL}/api/proveedor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoProveedor)
      });
      if (!checkToken(resp)) return;
      if (!resp.ok) throw new Error('Error al registrar proveedor');
      const result = await resp.json();
      setProveedorSeleccionadoId(String(result.id));
      setNuevoProveedorNombre('');
      setNuevoProveedorTelefono('');
      setNuevoProveedorCorreo('');
      setNuevoProveedorDireccion('');
      setAgregandoProveedor(false);
    } catch (err) {
      console.error(err);
      setNotificacion('Ocurrió un error al registrar el proveedor.');
    }
  };

  const handleCancelar = () => {
    navigate(-1); // Volver a la pantalla anterior
  };

  return (
    <div className={formStyles.pageContainer}>
      <div className={formStyles.contentWrapper}>
        <SimpleTitle text="Agregar nuevo medicamento" />
        
        {notificacion && (
          <div className={formStyles.notification}>
            {notificacion}
          </div>
        )}

        
        <div className={formStyles.formContainer}>
        <div className={formStyles.inputWrapper}>
          <IconoInput
            icono={faBox}
            name="nombre"
            value={formProducto.nombre}
            onChange={handleProductoChange}
            placeholder="Nombre del medicamento"
            type="text"
            formatoAa={true}
          />
        </div>
        <div className={formStyles.inputWrapper}>
          <IconoInput
            icono={faBox}
            name="presentacion"
            value={formProducto.presentacion}
            onChange={handleProductoChange}
            placeholder="Presentación del medicamento"
            type="text"
            formatoAa={true}
          />
        </div>

        {/* Proveedor con SelectSearch + agregar nuevo */}
        <div className={formStyles.inputWrapper}>
          <label style={{ display:'flex', alignItems:'center', gap:8, color:'#5a60a5', fontWeight:600, marginBottom:6 }}>
            <FontAwesomeIcon icon={faHouseMedical} /> Proveedor
          </label>
          {agregandoProveedor ? (
            <div className={formStyles.newProviderForm}>
              <div className={formStyles.providerNameContainer}>
                <div className={formStyles.providerNameInput}>
                  <IconoInput
                    icono={faHouseMedical}
                    placeholder="Nombre del proveedor"
                    type="text"
                    value={nuevoProveedorNombre}
                    onChange={(e) => setNuevoProveedorNombre(e.target.value)}
                    formatoAa={true}
                  />
                </div>
                <ButtonHeaders red={true} text={'Cancelar'} onClick={() => setAgregandoProveedor(false)} />
              </div>
              <div className={formStyles.inputWrapper}>
                <IconoInput
                  icono={faPhone}
                  placeholder="Teléfono del proveedor"
                  type="text"
                  value={nuevoProveedorTelefono}
                  onChange={(e) => setNuevoProveedorTelefono(e.target.value)}
                />
              </div>
              <div className={formStyles.inputWrapper}>
                <IconoInput
                  icono={faEnvelope}
                  placeholder="Correo del proveedor"
                  type="email"
                  value={nuevoProveedorCorreo}
                  onChange={(e) => setNuevoProveedorCorreo(e.target.value)}
                />
              </div>
              <div className={formStyles.inputWrapper}>
                <IconoInput
                  icono={faLocationDot}
                  placeholder="Dirección del proveedor"
                  type="text"
                  value={nuevoProveedorDireccion}
                  onChange={(e) => setNuevoProveedorDireccion(e.target.value)}
                />
              </div>
              <div className={formStyles.addProviderButtonContainer}>
                <ButtonForm text="Agregar proveedor" onClick={handleAgregarProveedor} />
              </div>
            </div>
          ) : (
            <div className={formStyles.proveedorContainer}>
              <div className={formStyles.selectSearchWrapper}>
                <SelectSearch
                  placeholder="Nombre del proveedor"
                  value={proveedorSeleccionadoId}
                  onChange={(value) => setProveedorSeleccionadoId(value)}
                  type="text"
                  options={opcionesProveedores}
                  tableStyle={false}
                  icono={faHouseMedical}
                />
              
              <button
                onClick={() => { setAgregandoProveedor(true); setProveedorSeleccionadoId(''); }}
                className={formStyles.addProviderButton}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            </div>
          )}
        </div>

        <div className={formStyles.inputWrapper}>
          <IconoInput
            icono={faDollarSign}
            name="precioventa"
            value={formProducto.precioventa}
            onChange={handleProductoChange}
            placeholder="Precio de venta"
            type="number"
            step="0.01"
            minValue ={"0"}
          />
        </div>
        <div className={formStyles.inputWrapper}>
          <IconoInput
            icono={faDollarSign}
            name="preciocosto"
            value={formProducto.preciocosto}
            onChange={handleProductoChange}
            placeholder="Precio de costo"
            type="number"
            step="0.01"
            minValue ={"0"}
          />
        </div>
        <div className={formStyles.inputWrapper}>
          <label style={{ color:'#5a60a5', fontWeight:600, marginBottom:6, display:'block' }}>¿Requiere receta?</label>
          <InputSelects
            name="receta"
            value={formProducto.receta}
            icono={faPen}
            placeholder={"Seleccione una opción"}
            onChange={handleProductoChange}

            opcions={[
              {value: "true", label: "Sí"},
              {value: "false", label: "No"},
              
            ]}
          ></InputSelects>

          
        </div>
        <div className={formStyles.inputWrapper}>
          <IconoInput
            icono={faBox}
            name="stock_minimo"
            value={formProducto.stock_minimo}
            onChange={handleProductoChange}
            placeholder="Stock mínimo"
            type="number"
            minValue={0}
          />
        </div>
        <div className={formStyles.inputWrapper}>
          <label style={{ color:'#5a60a5', fontWeight:600, marginBottom:6, display:'block' }}>Detalles</label>
          <textarea
            name="detalles"
            value={formProducto.detalles}
            onChange={handleProductoChange}
            placeholder="Detalles del medicamento"
            rows={3}
            className={formStyles.textareaInput}
          />
        </div>
        <div className={formStyles.inputWrapper}>
          <label style={{ display:'flex', alignItems:'center', gap:8, color:'#5a60a5', fontWeight:600, marginBottom:6 }}>
            <FontAwesomeIcon icon={faImage} /> Seleccionar imagen (PNG/JPG, máx 10MB)
          </label>
          {/* <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImagenChange}
            className={formStyles.fileInput}
          /> */}

          <InputFile
            id = "agregar-foto-m"
            type='file'
            accept={"image/png, image/jpeg"}
            onChange={handleImagenChange}
          
          />


          
        </div>

        {/* Botones de acción */}
        <div className={formStyles.actionButtons}>
          <ButtonHeaders 
            text={loading ? "Guardando..." : "Guardar medicamento"} 
            onClick={crearProducto}
            disabled={loading}
          />
          <ButtonHeaders 
            text="Cancelar" 
            onClick={handleCancelar}
            onlyLine={false}
            red = {true}
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default AgregarMedicamento;

