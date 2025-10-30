import React, { useEffect, useState } from 'react';
import SimpleTitle from '../../components/Titles/SimpleTitle';
import IconoInput from '../../components/Inputs/InputIcono.jsx';
import PopupButton from '../../components/Popup/Popup';
import styles from './InventarioScreen.module.css';
import ButtonText from '../../components/ButtonText/ButtonText';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';
import FormTrasladoMedicamentos from '../../components/Forms/FormTrasladoMedicamentos';
import { useOutletContext } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight, faHouseMedical, faPlus, faImage, faDollarSign, faBox, faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import OrderBy from '../../components/OrderBy/OrderBy.jsx';
import { useOrderBy } from '../../hooks/useOrderBy.js';
import { useFiltroGeneral } from '../../hooks/useFiltroGeneral.js';
import Filters from '../../components/FIlters/Filters.jsx';
import FiltroResumen from '../../components/FIlters/FiltroResumen/FiltroResumen.jsx';
import { getToken } from '../../services/authService';
import { useFetch } from '../../utils/useFetch.jsx';
import { useCheckToken } from '../../utils/checkToken.js';


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
  const [showTrasladoForm, setShowTrasladoForm] = useState(false);
  const checkToken = useCheckToken();

  const token = getToken();
  const getPayloadFromToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error("Token inválido", error);
      return null;
    }
  };

  const API_BASE_URL = `${import.meta.env.VITE_API_URL}`

  const { data: productosData, refetch } = useFetch(
    `${API_BASE_URL}/api/productos/con-stock?local_id=${selectedLocal + 1}`,
    {}, 
    [selectedLocal]
  );

  useEffect(() => {
    if (selectedLocal !== undefined && selectedLocal !== null) {
      setLoading(true);
      const tokenActual = token;
      if (!tokenActual) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      fetch(`${API_BASE_URL}/api/productos/con-stock?local_id=${selectedLocal + 1}`, {
        headers: {
          'Authorization': `Bearer ${tokenActual}`,
        },
      })
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
  }, [selectedLocal, token]);

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
      const tokenActual = token;
      if (!tokenActual) {
        alert('No se encontró el token de autenticación');
        setDeleting(false);
        return;
      }

      await fetch(`${API_BASE_URL}/api/productos/${productoSeleccionado.codigo}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenActual}`,
        },
      });
      if (!checkToken(response)) return;
      setProductos(productos.filter(p => p.codigo !== productoSeleccionado.codigo));
      setProductoSeleccionado(null);
      setShowConfirmDelete(false);
    } catch {
      alert('Error al eliminar el producto');
    } finally {
      setDeleting(false);
    }
  };

  // Función para abrir el formulario de traslado
  const openTrasladoForm = () => {
    setShowTrasladoForm(true);
  };

  // Función para cerrar el formulario de traslado
  const closeTrasladoForm = () => {
    setShowTrasladoForm(false);
  };

  const openNuevoProducto = () => setNuevoProductoOpen(true);
  const closeNuevoProducto = () => {
    setNuevoProductoOpen(false);
    setFormProducto({
      nombre: '',
      presentacion: '',
      proveedor_id: '',
      precioventa: '',
      preciocosto: '',
      receta: '',
      stock_minimo: '',
      detalles: ''
    });
    setImagenFile(null);
  };

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

  // Ya no manejamos archivos; imagen será URL string en formProducto.imagen

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
    if (errorMsg) { setNotificacion(errorMsg); return; }
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
      await refetch();
      closeNuevoProducto();
    } catch (e) {
      console.error(e);
      setNotificacion(`No se pudo crear el producto. ${e?.message || ''}`);
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

  // Función para manejar el éxito del traslado
  const handleTrasladoSuccess = (result) => {
    console.log('Traslado completado:', result);
    // Recargar los productos para reflejar el cambio de stock
    if (selectedLocal !== undefined && selectedLocal !== null) {
      setLoading(true);
      const tokenActual = token;
      if (tokenActual) {
        fetch(`${API_BASE_URL}/api/productos/con-stock?local_id=${selectedLocal + 1}`, {
          headers: {
            'Authorization': `Bearer ${tokenActual}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            const productosArray = Array.isArray(data) ? data : [];
            setProductos(productosArray);
            setProductosOriginales(productosArray);
            setLoading(false);
          })
          .catch(() => {
            setError('Error al recargar productos');
            setLoading(false);
          });
      }
    }
  };



  //Filtros
  //manejo de filtros activos
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [isOpendDate, setIsOpendDate] = useState(false);
  const [isOpendRol, setIsOpendRol] = useState(false);
  const [isOpendPrice, setIsOpendPrice] = useState(false);
  const [isOpendMedic, setIsOpendMedic] = useState(false);

  const expandFecha = () => {setIsOpendDate(prev => !prev); };
  const expandPrecio = () => {setIsOpendPrice(prev => !prev);};
  const expandRol = () => {setIsOpendRol(prev => !prev); };
  const expandUsuario = () => {setIsOpendRol(prev => !prev); };
  const expandMedicamento = () => {setIsOpendMedic(prev => !prev); };

  const expandFechaResume = () => {setIsOpendDate(true); setPanelAbierto(true);};
  const expandPrecioResume = () => {setIsOpendPrice(true); setPanelAbierto(true);};
  const expandRolResume = () => {setIsOpendRol(true); setPanelAbierto(true);};
  const expandUsuarioResume = () => {setIsOpendRol(true); setPanelAbierto(true);};
  const expandMedicamentoResume = () => {setIsOpendMedic(true); setPanelAbierto(true);};

 // Función para manejar cambios en los filtros
  const [opcionesTipoMedicamento, setOpcionesTipoMedicamento] = useState([ ]);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState([ ])


  // Extraer tipos únicos de los productos
  useEffect(() => {
  const tiposUnicos = [...new Set(productosOriginales.map(p => p.detalles))].filter(tipo => tipo);
  const opcionesTipos = tiposUnicos.map(tipo => ({
    value: tipo,
    label: tipo
  }));
  setOpcionesTipoMedicamento(opcionesTipos);
}, [productosOriginales]);


  function convertirDatos(data) {
    return data.map(item => ({
      ...item,
      stock_actual: parseFloat(item.stock_actual),
      precioventa: parseFloat(item.precioventa),
      preciocosto: parseFloat(item.preciocosto),
    }));
  }



 
    const productosConvertidos = convertirDatos(productos);

    //intentofiltros
    const handleMedicamentoChange = (nuevosTiposSeleccionados) => {
      setMedicamentoSeleccionado(nuevosTiposSeleccionados);
    };


    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
   
    const handleRemoveMedicamento = (tipo) => {
      setMedicamentoSeleccionado(prev => 
        prev.filter(m => m.value !== tipo.value)
      );
    };

     const filterKeyMap={
        RANGO_PRECIO: "precioventa",
        TIPO_MEDICAMENTO: "detalles",
   
    }



    const {dataFiltrada} = useFiltroGeneral({
      data: productosConvertidos, 
      filterKeyMap: filterKeyMap, 
      precioMin: precioMin, 
      precioMax: precioMax,
      tipoMedicamento: medicamentoSeleccionado
    });
    //Funciones necesarias para el funcionamiento de Order By
    //Constante que almacena los nombres o key de los datos a filtrar
    const sortKeyMap={
        AZ: "nombre",
        ZA: "nombre",
        STOCK_HIGH: "stock_actual",
        STOCK_LOW: "stock_actual",
        PRICE_HIGH: "precioventa",
        PRICE_LOW: "precioventa",
   
    }

    const resetFiltros = () => {
      setPrecioMin('');
      setPrecioMax('');
      setMedicamentoSeleccionado([]);
    };

   
  
    //LLamar useOrdeyBy desde hooks/useOrderBy.js
    //se manda las claves que se utilizará en el filtrado y los datos ya filtrados
    //para que se ordene luego de filtrar.
    //sortedData es la data que se mostrará en pantalla
    //sortOption debe de ir en el componente de Ordeyby al igual que setSortOption
    const {sortedData, sortOption, setSortOption} = useOrderBy({data: dataFiltrada, sortKeyMap});
    
   

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
      

        <Filters
          title = {"Inventario"}
          panelAbierto={panelAbierto}
          setPanelAbierto={setPanelAbierto}
          mostrarRangoFecha ={false}
          mostrarRangoPrecio = {true}
          mostrarUsuario = {false}
          mostrarMedicamento = {true}

          //atributos para rango de precio
          isOpendPrice = {isOpendPrice}
          expandPrecio = {expandPrecio}
          precioMin = {precioMin}
          setPrecioMin = {setPrecioMin}
          precioMax = {precioMax}
          setPrecioMax = {setPrecioMax}

          isOpendMedic = {isOpendMedic}
          expandMedicamento = {expandMedicamento}
          opcionesTipoMedicamento = {opcionesTipoMedicamento}
          medicamentoSeleccionado ={medicamentoSeleccionado}
          handleChangeMedicamento ={handleMedicamentoChange}

          resetFiltros = {resetFiltros}
                       
        ></Filters>

        <OrderBy
          FAbecedario={true}
          FExistencias={true}
          FPrecio={true}
          FFecha={false}
          selectedOption={sortOption}
          onChange={setSortOption}
        ></OrderBy>

        <ButtonHeaders 
          text="Trasladar Medicamento"
          onClick={openTrasladoForm}
        />
      <ButtonHeaders 
        text="Agregar Medicamento"
        onClick={openNuevoProducto}
      />
      </div>
      
      <FiltroResumen
          //fechaInicio={fechaInicio}
          //fechaFin={fechaFin}
          precioMin={precioMin}
          precioMax={precioMax}
          //usuarioSeleccionado={usuarioSeleccionado}
          //rolSeleccionado={rolSeleccionado}
          medicamentoSeleccionado={medicamentoSeleccionado}

           // funciones para abrir paneles
          expandFecha={expandFechaResume}
          expandPrecio={expandPrecioResume}
          expandRol={expandRolResume}
          expandMedicamento={expandMedicamentoResume}

          onRemoveFecha={() => {
            setFechaInicio(null);
            setFechaFin(null);
            setSelectedPreDate(""); // si lo manejas así
          }}
          onRemovePrecio={() => {
            setPrecioMin('');
            setPrecioMax('');
          }}
          onRemoveUsuario={() => handleChange({ target: { name: 'usuarios', value: '' } })}
          onRemoveRol={() => handleChange({ target: { name: 'rol', value: '' } })}
          onRemoveMedicamento={handleRemoveMedicamento}

          
        />

      {loading && <div className={styles.loading}>Cargando productos...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.productosGrid}>
        {sortedData.map(producto => (
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
        <PopupButton
          isOpen={Boolean(productoSeleccionado)}
          onClose={() => setProductoSeleccionado(null)}
          title={productoSeleccionado.nombre}
          hideActions
        >
          <div className={styles.popupContent}>
            <img
              src={productoSeleccionado.imagen || '/default-user.svg'}
              alt={productoSeleccionado.nombre}
              className={styles.popupImg}
            />
            <div className={styles.popupDetails}>
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
      
      {nuevoProductoOpen && (
        <PopupButton
          isOpen={nuevoProductoOpen}
          onClose={closeNuevoProducto}
          title="Agregar nuevo medicamento"
          onClick={crearProducto}
        >
          {notificacion && (
            <div style={{ color: '#c00', marginBottom: 8 }}>{notificacion}</div>
          )}
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'12px',maxWidth:560,margin:'0 auto', width:'100%', maxHeight: '70vh', overflowY: 'auto', paddingRight: 6}}>
            <IconoInput
              icono={faBox}
              name="nombre"
              value={formProducto.nombre}
              onChange={handleProductoChange}
              placeholder="Paracetamol 500mg"
              type="text"
              formatoAa={true}
            />
            <IconoInput
              icono={faBox}
              name="presentacion"
              value={formProducto.presentacion}
              onChange={handleProductoChange}
              placeholder="Caja con 10 tabletas"
              type="text"
              formatoAa={true}
            />

            {/* Proveedor con SelectSearch + agregar nuevo */}
            <div>
              <label style={{ display:'flex', alignItems:'center', gap:8, color:'#5a60a5', fontWeight:600, marginBottom:6 }}>
                <FontAwesomeIcon icon={faHouseMedical} /> Proveedor
              </label>
              {agregandoProveedor ? (
                <>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'8px', alignItems:'start' }}>
                    <IconoInput
                      icono={faHouseMedical}
                      placeholder="Nombre del nuevo proveedor"
                      type="text"
                      value={nuevoProveedorNombre}
                      onChange={(e) => setNuevoProveedorNombre(e.target.value)}
                      formatoAa={true}
                    />
                    <ButtonHeaders red={true} text={'Cancelar'} onClick={() => setAgregandoProveedor(false)} />
                  </div>
                  <IconoInput
                    icono={faPhone}
                    placeholder="Teléfono del proveedor"
                    type="text"
                    value={nuevoProveedorTelefono}
                    onChange={(e) => setNuevoProveedorTelefono(e.target.value)}
                  />
                  <IconoInput
                    icono={faEnvelope}
                    placeholder="Correo del proveedor"
                    type="email"
                    value={nuevoProveedorCorreo}
                    onChange={(e) => setNuevoProveedorCorreo(e.target.value)}
                  />
                  <IconoInput
                    icono={faLocationDot}
                    placeholder="Dirección del proveedor"
                    type="text"
                    value={nuevoProveedorDireccion}
                    onChange={(e) => setNuevoProveedorDireccion(e.target.value)}
                  />
                  <ButtonForm text="Agregar proveedor" onClick={handleAgregarProveedor} />
                </>
              ) : (
                <div style={{ display:'flex', gap:'8px', alignItems:'start' }}>
                  <SelectSearch
                    placeholder="Nombre del proveedor"
                    value={proveedorSeleccionadoId}
                    onChange={(value) => setProveedorSeleccionadoId(value)}
                    type="text"
                    options={opcionesProveedores}
                    tableStyle={false}
                  />
                  <button
                    onClick={() => { setAgregandoProveedor(true); setProveedorSeleccionadoId(''); }}
                    style={{
                      background: '#5a60a5', border: 'none', borderRadius: '4px', color: 'white', padding: '8px 12px', cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )}
            </div>

            <IconoInput
              icono={faDollarSign}
              name="precioventa"
              value={formProducto.precioventa}
              onChange={handleProductoChange}
              placeholder="12.50"
              type="number"
              step="0.01"
            />
            <IconoInput
              icono={faDollarSign}
              name="preciocosto"
              value={formProducto.preciocosto}
              onChange={handleProductoChange}
              placeholder="8.75"
              type="number"
              step="0.01"
            />
            <div>
              <label style={{ color:'#5a60a5', fontWeight:600, marginBottom:6, display:'block' }}>¿Requiere receta?</label>
              <select name="receta" value={formProducto.receta} onChange={handleProductoChange} style={{ width:'100%', padding:'10px', border:'2px solid #cccccc8e', borderRadius:4, color:'#000' }}>
                <option value="">Seleccione...</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <IconoInput
              icono={faBox}
              name="stock_minimo"
              value={formProducto.stock_minimo}
              onChange={handleProductoChange}
              placeholder="20"
              type="number"
            />
            <div>
              <label style={{ color:'#5a60a5', fontWeight:600, marginBottom:6, display:'block' }}>Detalles</label>
              <textarea
                name="detalles"
                value={formProducto.detalles}
                onChange={handleProductoChange}
                placeholder="Analgésico y antipirético de uso común"
                rows={1}
                style={{ width:'100%', padding:'10px', border:'2px solid #5a60a5', borderRadius:'4px', color:'#000', resize:'none' }}
              />
            </div>
            <div>
              <label style={{ display:'flex', alignItems:'center', gap:8, color:'#5a60a5', fontWeight:600, marginBottom:6 }}>
                <FontAwesomeIcon icon={faImage} /> Seleccionar imagen (PNG/JPG, máx 10MB)
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImagenChange}
                style={{ width:'100%', padding:'10px', border:'2px dashed #5a60a5', borderRadius:'8px', backgroundColor:'transparent', color:'#5a60a5', cursor:'pointer' }}
              />
            </div>
          </div>
        </PopupButton>
      )}


       {/* Formulario de traslado de medicamentos */}
      <FormTrasladoMedicamentos
        isOpen={showTrasladoForm}
        onClose={closeTrasladoForm}
        productosDisponibles={productosConvertidos}
        localActual={selectedLocal + 1}
        onSuccess={handleTrasladoSuccess}
      />



    </div>
  );
};

export default InventarioScreen;

