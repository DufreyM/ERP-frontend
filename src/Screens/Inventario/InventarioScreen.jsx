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
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import OrderBy from '../../components/OrderBy/OrderBy.jsx';
import { useOrderBy } from '../../hooks/useOrderBy.js';
import { useFiltroGeneral } from '../../hooks/useFiltroGeneral.js';
import Filters from '../../components/FIlters/Filters.jsx';
import FiltroResumen from '../../components/FIlters/FiltroResumen/FiltroResumen.jsx';
import { getToken } from '../../services/authService';
import { useFetch } from '../../utils/useFetch.jsx';


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


  const token = getToken();
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}`

  const { data: productosData, refetch } = useFetch(
    `${API_BASE_URL}/api/productos/con-stock?local_id=${selectedLocal + 1}`,
    {}, 
    [selectedLocal]
  );

  useEffect(() => {
    if (productosData) {
      setProductos(productosData);
      setProductosOriginales(productosData);
    }
  }, [productosData]);


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
      const tokenActual = getToken();
      
      await fetch(`${API_BASE_URL}/api/productos/${productoSeleccionado.codigo}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenActual}`,
        },
      });
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

  // Función para manejar el éxito del traslado
  const handleTrasladoSuccess = (result) => {
    console.log('Traslado completado:', result);
    refetch();
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
    console.log(productosConvertidos);

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

