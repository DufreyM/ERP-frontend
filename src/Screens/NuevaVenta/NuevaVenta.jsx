import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAddressCard, faArrowLeft, faSearch} from '@fortawesome/free-solid-svg-icons';
import IconoInput from "../../components/Inputs/InputIcono";
import styles from "./NuevaVenta.module.css"
import { useNavigate, useOutletContext } from 'react-router-dom';
import { TablaFactura } from "../../components/Tables/TablaFactura.jsx";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders.jsx";
import { useState, useEffect} from "react";
import { useFetch } from "../../utils/useFetch.jsx";
import { getToken } from "../../services/authService.js";
import Popup from "../../components/Popup/Popup.jsx";
import { useCheckToken } from "../../utils/checkToken.js";


const NuevaVenta = () => {
  const navigate = useNavigate();
  const volver = () => {
    navigate(-1); // Va una página atrás en el historial
  };

  //productos
  const token = getToken(); 
  const checkToken = useCheckToken();
  
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1 ;
  //Separacion de memoria entre locales
  const ventaKey = `venta-temporal-local-${selectedLocal}`;
  const {data: productos, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/productos/con-stock?local_id=${localSeleccionado}`, {
      headers: {'Authorization': `Bearer ${token}`}
  });

  const [notificacion, setNotificacion] = useState('');
    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => {
            setNotificacion('');
            }, 2500); // se quita en 2.5 segundos

            return () => clearTimeout(timer);
        }
    }, [notificacion]);


  const [datosCargados, setDatosCargados] = useState(false);  

  useEffect(() => {
  // cada vez que cambie el local, marcamos que aún no cargamos sus datos
    setDatosCargados(false);
  }, [selectedLocal]);

  //bloquear cf cuando la venta sea mayor a 2500
  const [totalFactura, setTotalFactura] = useState(0);
  const [bloquearCF, setBloquearCF] = useState(false);

  useEffect(() => {
   
    if (totalFactura > 2500) {
      setNotificacion('No se puede vender como Consumidor Final, el total supera Q2500'); 
      setBloquearCF(true);
      if (tipoCliente === "cf") setTipoCliente("registrado");
    } else {
      setBloquearCF(false);
    }
  }, [totalFactura]);



  const filtrarProductos = (productos) => {
    return productos.map((p) => ({
      id: parseInt(p.codigo),
      nombre: p.nombre,
      precio: parseFloat(p.precioventa),
      presentacion: p.presentacion,
      receta: p.receta,
      stock_actual: parseInt(p.stock_actual),
    }));
  }
  

  const productosFiltrados = productos? filtrarProductos(productos): [];
  const [lineas, setLineas] = useState([]);


  const [errorMessage, setErrorMessage] = useState("");
  const [tipoCliente, setTipoCliente] = useState("registrado"); // o "cf"
  const [nitCliente, setNitCliente] = useState();
  const [nombreClienteManual, setNombreClienteManual] = useState("");
  const [datosCliente, setDatosCliente] = useState(null);
  const [tipoPago, setTipoPago] = useState("efectivo");
  const [mostrarInputNombreManual, setMostrarInputNombreManual] = useState(false)
 
  useEffect(() => {
    const datosGuardados = localStorage.getItem(ventaKey);
    if (datosGuardados) {
      try {
        const venta = JSON.parse(datosGuardados);
        setLineas(venta.lineas || []);
        setTipoCliente(venta.tipoCliente || "registrado");
        setNitCliente(venta.nitCliente || "");
        setNombreClienteManual(venta.nombreClienteManual || "");
        setTipoPago(venta.tipoPago || "efectivo");
      } catch (err) {
        console.error("Error parseando venta guardada:", err);
        // si hay error, limpiamos para no arrastrar datos corruptos
        setLineas([]);
        setTipoCliente("registrado");
        setNitCliente("");
        setNombreClienteManual("");
        setTipoPago("efectivo");
      }
    } else {
      // Si no hay datos para este local, resetea el estado
      setLineas([]);
      setTipoCliente("registrado");
      setNitCliente("");
      setNombreClienteManual("");
      setTipoPago("efectivo");
    }
    
    setDatosCargados(true);
  }, [ventaKey]);

   //para que no se pierdan los datos al refrescar
  useEffect(() => {
    if (!datosCargados) return; // no guardar hasta que hayamos cargado los datos del local actual

    const ventaTemp = {
      lineas,
      tipoCliente,
      nitCliente,
      nombreClienteManual,
      tipoPago,
    };

    try {
      localStorage.setItem(ventaKey, JSON.stringify(ventaTemp));
    } catch (err) {
      console.error("No se pudo guardar la venta temporal:", err);
    }
  }, [lineas, tipoCliente, nitCliente, nombreClienteManual, tipoPago, ventaKey, datosCargados]);




  const handleNitCliente = (e) => {
    setNitCliente(e.target.value);
    setErrorMessage('');
  }

  const handleBuscarCliente = async () => {
    if (!nitCliente) {
      setErrorMessage("Por favor, ingresa un NIT válido o completa los campos para registrar un cliente.");
      setDatosCliente(null);
      setMostrarInputNombreManual(true);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clientes?nit=${nitCliente}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!checkToken(response)) return;

    
      

      const data = await response.json();
      // Aquí verificamos si el cliente fue encontrado (según tu API, ajusta si es un array)
      if (!data || Object.keys(data).length === 0 || data.error || !data.id || !data.nombre) {
        throw new Error("Cliente no encontrado, escribe el nombre para registrarlo."); // Esto fuerza el catch
      }

      setDatosCliente(data);
      setMostrarInputNombreManual(false);
      setErrorMessage(""); // limpia errores si había

      //console.log("Cliente encontrado:", data);
    } catch (error) {
      //console.error("Error al buscar cliente:", error.message);
      setDatosCliente(null);
      setMostrarInputNombreManual(true);
      setErrorMessage("Cliente no encontrado, completa el nombre para registrarlo.");
      
    }
  };

  const handleConfirmarVenta = async () => {
    try {
      if (lineas.length === 0) {
        setNotificacion('Debe agregar al menos un producto'); 
       
        return;
      }

      // Validar que todos los productos estén seleccionados
      const algunaLineaSinProducto = lineas.some(
        (linea) => !linea.productoId || linea.productoId === ""
      );

      if (algunaLineaSinProducto) {
        setNotificacion("Por favor selecciona un producto en todas las líneas de la factura."); 
        return;
      }

      const detalles = lineas.map(linea => ({
        producto_id: parseInt(linea.productoId),
        cantidad: parseInt(linea.cantidad)
      }));

      let body = {
        tipo_pago: tipoPago,
        detalles,
        local_id: localSeleccionado

      };

      if (tipoCliente === "cf") {
        body.cliente = {
          nit: "CF",
          nombre: "Consumidor Final",
         
        };
      } else if (datosCliente) {
        // Cliente encontrado
        body.cliente_id = datosCliente.id;
      } else {
        // Cliente manual
        if (!nitCliente || !nombreClienteManual) {
          
          setNotificacion("Por favor ingresa NIT y nombre del cliente.");
          return;
        }

        body.cliente = {
          nit: nitCliente,
          nombre: nombreClienteManual,
          direccion: "",   // opcional
          correo: null        // opcional
        };
      }


    const response = await fetch(`${import.meta.env.VITE_API_URL}/ventas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!checkToken(response)) return;

    if (!response.ok) {
      const errorText = await response.text();
  console.error("Error del servidor:", errorText);
  throw new Error("Error al crear la venta");
  
    }

    const result = await response.json();
    //console.log("Venta registrada correctamente:", result);
    setNotificacion("¡Venta registrada con éxito!");
    localStorage.removeItem(ventaKey);


    // Redirigir o resetear formulario
    navigate(-1); 
  } catch (error) {
    console.error(error.message);
    setNotificacion("Ocurrió un error al registrar la venta.");
  }
};


//que no se pierdan los datos al refrescar
  const [eliminarEvento, setEliminarEvento] = useState(false);
  const openEliminarEvento = () => setEliminarEvento(true);
  const closeEliminarEvento = () => {setErrorMessage(''); setEliminarEvento(false);};

  const handleCancelarVenta = () => {
    
    
      localStorage.removeItem(ventaKey);
      navigate(-1);
    
  };

    return(
      
        <main className= {styles.NuevaCompraMain}>
          {notificacion && (
              <div className={styles.toast}>
                  {notificacion}
              </div>
          )}
          <div className={styles.titloNuevaVentayBoton}>
            <button className ={styles.buttonVolverV} onClick={volver}>
               <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "25px" }}></FontAwesomeIcon>
            </button>
            <h1 className={styles.tituloNuevaVenta}> Nueva venta</h1>
          </div>

            <article className={styles.encabezadoNuevaVenta}>
             
                <div className={styles.datosClienteVenta}>
                  <h2 className={styles.subtituloNuevaVenta}>Datos del cliente</h2>

                  <div className={styles.radioTipoCliente}>
                    <label className={tipoCliente === "registrado" ? styles.selected : ""}>
                      <input
                        type="radio"
                        name="tipoCliente"
                        value="registrado"
                        checked={tipoCliente === "registrado"}
                        onChange={() => setTipoCliente("registrado")}
                      />
                      Cliente registrado
                    </label>

                    <label className={tipoCliente === "cf" ? styles.selected : ""}>
                      <input
                        type="radio"
                        name="tipoCliente"
                        value="cf"
                        checked={tipoCliente === "cf"}
                        onChange={() => {
                          if (bloquearCF) {
                            setNotificacion("No se puede vender como Consumidor Final, el total supera Q2500.00");
                          } else {
                            setTipoCliente("cf");
                          }
                        }}
                        
                      />
                      Consumidor Final
                    </label>
                  </div>



                    {tipoCliente === "registrado" && (
                      <div className={styles.contenedorRegistrado}>
                        <div className={styles.contenedorNitcliente}>
                          <IconoInput
                            icono={faAddressCard}
                            placeholder={"Nit del receptor"}
                            value={nitCliente}
                            onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                          
                          <button onClick={handleBuscarCliente} className={styles.buttonBuscarVenta}>
                            <FontAwesomeIcon icon = {faSearch}></FontAwesomeIcon>
                          </button>
                          
                        </div>

                        {errorMessage && (
                          <p className={styles.errorText}>{errorMessage}</p>
                        )}

                       
                        {datosCliente &&(
                          <IconoInput
                              icono={faUser}
                              placeholder={"Nombre del receptor"}
                              value={datosCliente?.nombre || ""}
                              disabled={true}
                            />
                          )}

                          {!datosCliente && mostrarInputNombreManual && (
                            <IconoInput
                              icono={faUser}
                              placeholder={"Nombre del receptor"}
                              value={nombreClienteManual}
                              onChange={(e) => setNombreClienteManual(e.target.value)}
                              formatoAa={true}
                            />
                          )}
                          

                      </div>
                      )}

                      {tipoCliente === "cf" && (
                        <div className={styles.gridDatosCertificacion}>
                          <p className={styles.textoCF}><strong>Cliente:</strong></p>
                          <p>Consumidor Final</p>
                          <p className={styles.textoCF}><strong>NIT:</strong></p>
                          <p>Sin NIT</p>
                        </div>
                      )}
                </div>

                <div className={styles.gridDatosVenta}>
                  <h2 className={styles.subtituloNuevaVenta}>Datos de la venta</h2>
                    <div className={styles.gridDatosCertificacion}>
                      <p className={styles.textoCF}>Fecha:</p>
                      <p >{new Date().toLocaleDateString()}</p>
            
                      
                      <p className={styles.textoCF}>Moneda:</p>
                      <p>GTQ</p>
                      <p className={styles.textoCF} htmlFor="tipoPago"><strong>Forma de Pago:</strong></p>
                      <select
                      id="tipoPago"
                      value={tipoPago}
                      onChange={(e) => setTipoPago(e.target.value)}
                      className={styles.selectPago}
                    >
                      <option value="efectivo">Efectivo</option>
                      {/* Más opciones en el futuro */}
                    </select>
                    </div>            
                </div>
            </article>


            <article className={styles.contenedorDatosVenta}>
                <div>
                    <h2 className={styles.subtituloNuevaVenta}>Detalles de venta</h2>
                    

                    <TablaFactura
                      productosDisponibles = {productosFiltrados}
                      lineas={lineas}
                      setLineas={setLineas}
                      setTotalFactura={setTotalFactura}
                    ></TablaFactura>
            
                </div>

                <div>
                  
                 
                <div className={styles.botonesVenta}> 
                  <ButtonHeaders
                    text="Cancelar Venta"
                    onClick={openEliminarEvento}
                    red={true}
                  />

                  <ButtonHeaders
                    text="Confirmar venta"
                    onClick={handleConfirmarVenta}
                  />
                </div>
                    
                 
              </div>

            </article>

            {
              <Popup 
              isOpen={eliminarEvento} title={'¿Desea descartar esta venta?'}
              onClose={closeEliminarEvento} onClick={handleCancelarVenta}
              >
                  <div className='modalContenido'>
                      {errorMessage && (
                          <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                      )}
                  </div>

              </Popup>
            }

        </main>
    )
}

export default NuevaVenta;