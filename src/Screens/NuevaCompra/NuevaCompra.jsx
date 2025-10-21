import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAddressCard, faArrowLeft, faTimes, faPen, faPlus, faHospital, faHouseMedical, faPhone, faEnvelope, faLocationDot, faCircleInfo, faCommentDollar, faSackDollar} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../NuevaVenta/NuevaVenta.module.css'
import IconoInput from "../../components/Inputs/InputIcono";
import InputSelects from "../../components/Inputs/InputSelects";
import { useEffect, useMemo, useState } from "react";
import { getToken } from "../../services/authService";
import { useFetch } from "../../utils/useFetch";
import { TablaCompras } from "../../components/Tables/TablaCompras";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders";
import ButtonText from "../../components/ButtonText/ButtonText";
import Popup from "../../components/Popup/Popup";
import { useEventHandlers } from "../../hooks/Calendar/useEventHandlers";
import SelectSearch from "../../components/Inputs/SelectSearch";

const NuevaCompra = () => {

  const navigate = useNavigate();
  const volver = () => {
      navigate(-1); // Va una página atrás en el historial
  };

  //productos
  const token = getToken(); 
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1 ;
  //Separacion de memoria entre locales
  const compraKey = `compra-temporal-local-${selectedLocal}`;
  const {data: productos, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/productos/con-stock?local_id=${localSeleccionado}`, {
      headers: {'Authorization': `Bearer ${token}`}
  });
  const [lineas, setLineas] = useState([]);

  const [datosRestaurados, setDatosRestaurados] = useState(false);
  const [mostrarPopupCancelar, setMostrarPopupCancelar] = useState(false);
  const [eliminarCompra, setEliminarCompra] = useState(false);
  const openEliminarCompra = () => setEliminarCompra(true);
  const closeEliminarCompra = () => setEliminarCompra(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [notificacion, setNotificacion] = useState('');
  useEffect(() => {
      if (notificacion) {
          const timer = setTimeout(() => {
          setNotificacion('');
          }, 2500); // se quita en 2.5 segundos

          return () => clearTimeout(timer);
      }
  }, [notificacion]);


  //proveedores
  const {data: proveedores, loadingP, errorP } = useFetch(`${import.meta.env.VITE_API_URL}/api/proveedor`, {
      headers: {'Authorization': `Bearer ${token}`}
  });
    const [agregandoProveedor, setAgregandoProveedor] = useState(false);
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState('');
  
  // Datos del proveedor nuevo (si estás agregando uno)
  const [nuevoProveedorNombre, setNuevoProveedorNombre] = useState('');
  const [nuevoProveedorTelefono, setNuevoProveedorTelefono] = useState('');
  const [nuevoProveedorCorreo, setNuevoProveedorCorreo] = useState('');
  const [nuevoProveedorDireccion, setNuevoProveedorDireccion] = useState('');


  const opcionesProveedores = useMemo(() => {
    if (!Array.isArray(proveedores)) return [];

    return proveedores.map(proveedor => ({
      value: String(proveedor.id),
      label: proveedor.nombre,
      ...proveedor
    }));
  }, [proveedores]);

  const proveedorSeleccionado = useMemo(() => {
    return opcionesProveedores.find(p => p.value === proveedorSeleccionadoId) || null;
  }, [proveedorSeleccionadoId, opcionesProveedores]);


  useEffect(() => {
    if (!datosRestaurados && !agregandoProveedor) {
      setLineas([]);
    }
  }, [proveedorSeleccionadoId]);

  const handleAgregarProveedor = async () => {
    try {
      // Validaciones básicas
      if (!nuevoProveedorNombre || !nuevoProveedorTelefono || !nuevoProveedorCorreo || !nuevoProveedorDireccion) {
        setNotificacion("Por favor, completa todos los campos del proveedor.");
        return;
      }

      const nuevoProveedor = {
        nombre: nuevoProveedorNombre,
        direccion: nuevoProveedorDireccion,
        correo: nuevoProveedorCorreo,
        telefonos: [
          {numero: nuevoProveedorTelefono,
            tipo: "fijo"
          }
        ]
      };
      

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proveedor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoProveedor)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al agregar proveedor:", errorText);
        throw new Error("Error al registrar proveedor.");
      }

      const result = await response.json();
      //console.log("Proveedor agregado con éxito:", result);

      setNotificacion("¡Proveedor agregado correctamente!");
      
      // Agrega el nuevo proveedor al listado (opcional)
      // También podrías refetch desde el servidor si prefieres
      if (Array.isArray(proveedores)) {
        setNotificacion("¡Proveedor agregado correctamente!");
        setTimeout(() => window.location.reload(), 1000);

      }

      // Selecciona el proveedor recién creado
      setProveedorSeleccionadoId(String(result.id));

      // Limpia formulario de proveedor nuevo
      setNuevoProveedorNombre('');
      setNuevoProveedorTelefono('');
      setNuevoProveedorCorreo('');
      setNuevoProveedorDireccion('');
      setAgregandoProveedor(false);

    } catch (error) {
      console.error(error.message);
      setNotificacion("Ocurrió un error al registrar el proveedor.");
    }
  };

  // Datos de la compra
  const [numeroFactura, setNumeroFactura] = useState('');
  const [descripcionCompra, setDescripcionCompra] = useState('');
  const [cuotasSeleccionadas, setCuotasSeleccionadas] = useState(0);


  const handleNumeroFactura = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {  // solo acepta números
      setNumeroFactura(value);
    }
  };

  const handleDescripcionCompra = (e) => {
    setDescripcionCompra(e.target.value);
    setErrorMessage('');
  };

  const handleCuotasSeleccionadas = (e) => {
    setCuotasSeleccionadas(Number(e.target.value));
    setErrorMessage('');
  };

  const handleNuevoProveedorNombre = (e) => {
    setNuevoProveedorNombre(e.target.value);
    setErrorMessage('');
  };

  const handleNuevoProveedorTelefono = (e) => {
    setNuevoProveedorTelefono(e.target.value);
    setErrorMessage('');
  };

  const handleNuevoProveedorCorreo = (e) => {
    setNuevoProveedorCorreo(e.target.value);
    setErrorMessage('');
  };

  const handleNuevoProveedorDireccion = (e) => {
    setNuevoProveedorDireccion(e.target.value);
    setErrorMessage('');
  };


  // Restaurar datos al montar o cambiar de local
  useEffect(() => {
    const datosGuardados = localStorage.getItem(compraKey);
    if (datosGuardados) {
      const compra = JSON.parse(datosGuardados);
      setLineas(compra.lineas || []);
      setNumeroFactura(compra.numeroFactura || '');
      setDescripcionCompra(compra.descripcionCompra || '');
      setCuotasSeleccionadas(compra.cuotasSeleccionadas || 0);
      setProveedorSeleccionadoId(compra.proveedorSeleccionadoId || '');
      setAgregandoProveedor(compra.agregandoProveedor || false);
      setNuevoProveedorNombre(compra.nuevoProveedorNombre || '');
      setNuevoProveedorTelefono(compra.nuevoProveedorTelefono || '');
      setNuevoProveedorCorreo(compra.nuevoProveedorCorreo || '');
      setNuevoProveedorDireccion(compra.nuevoProveedorDireccion || '');
    } else {
      // Reiniciar si no hay datos para este local
      setLineas([]);
      setNumeroFactura('');
      setDescripcionCompra('');
      setCuotasSeleccionadas(0);
      setProveedorSeleccionadoId('');
      setAgregandoProveedor(false);
      setNuevoProveedorNombre('');
      setNuevoProveedorTelefono('');
      setNuevoProveedorCorreo('');
      setNuevoProveedorDireccion('');
    }
    setDatosRestaurados(true);
  }, [compraKey]);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (!datosRestaurados) return;

    const datosCompra = {
      lineas,
      numeroFactura,
      descripcionCompra,
      cuotasSeleccionadas,
      proveedorSeleccionadoId,
      agregandoProveedor,
      nuevoProveedorNombre,
      nuevoProveedorTelefono,
      nuevoProveedorCorreo,
      nuevoProveedorDireccion
    };

    localStorage.setItem(compraKey, JSON.stringify(datosCompra));
  }, [
    lineas,
    numeroFactura,
    descripcionCompra,
    cuotasSeleccionadas,
    proveedorSeleccionadoId,
    agregandoProveedor,
    nuevoProveedorNombre,
    nuevoProveedorTelefono,
    nuevoProveedorCorreo,
    nuevoProveedorDireccion,
    compraKey
  ]);


  //Cuotas
  const opcionesCuotas = [
    {value: 0, label: "Sin cuotas"},
    {value: 1, label: "1 cuota"},
    {value: 2, label: "2 cuotas"},
    {value: 3, label: "3 cuotas"},
  ]


  //eventos
  //Obtener estas funciones desde useEventsHandlers (hooks/calendar/useEvents)
  const { combinarFechaYHora, obtenerHoraDesdeFecha, crearEvento, actualizarEvento, HandleEliminarEvento } = useEventHandlers({
    token,
    localId: localSeleccionado,
    onSuccess: (msg) => setNotificacion(msg),
    onError: (msg) => setErrorMessage(msg),
    removeEventFromState: (id) => setEvents(prev => prev.filter(e => e.id !== id))
  });

  const agendarRecordatoriosPago = async (cuotas, compraId) => {
    const hoy = new Date();
    const intervaloDias = 15;

    const eventos = [];

    for (let i = 0; i < cuotas; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + (i + 1) * intervaloDias);

      eventos.push({
        titulo: `Pago cuota ${i + 1} de la compra #${compraId}`,
        tipo_evento_id: 2, // Asegurarse que 2 es notificación
        estado_id: 2,
        fecha: fecha.toISOString(),
        visitador_id: null,
        detalles: `Recordatorio para el pago de la cuota ${i + 1}`,
        local_id: localSeleccionado,
      });
    }

    

    try {
      for (const evento of eventos) {
        await crearEvento(evento); // reutilizás tu función de calendario
      }
      //console.log('Eventos de pago creados correctamente');
    } catch (error) {
      console.error('Error al crear eventos de pago:', error);
    }
  };

//enviar compras  
 const enviarCompra = async () => {

  if (!numeroFactura) {
    setNotificacion("Debes ingresar el número de factura.");
    return;
  }

  if (lineas.length === 0) {
    setNotificacion("Debes agregar al menos un producto a la compra.");
    return;
  }

  if (!proveedorSeleccionadoId && !agregandoProveedor) {
    setNotificacion("Selecciona o crea un proveedor.");
    return;
  }

  const algunaLineaSinProducto = lineas.some(
    linea => !linea.productoId || linea.productoId === ""
  );

  if (algunaLineaSinProducto) {
    setNotificacion("Todas las filas deben tener un producto seleccionado.");
    return;
  }

    const detalles = lineas.map(linea => ({
      producto_id: parseInt(linea.productoId),
      cantidad: parseFloat(linea.cantidad),
      precio_costo: parseFloat(linea.precio_costo),
      precio_venta: parseFloat(linea.precio_venta),
      lote: linea.lote,
      fecha_vencimiento: linea.fecha_vencimiento
        ? linea.fecha_vencimiento.toISOString().split('T')[0]
        : null
    }));

    const camposInvalidos = detalles.some(det =>
      !det.producto_id ||
      det.cantidad <= 0 ||
      !det.lote ||
      !det.fecha_vencimiento
    );

    if (camposInvalidos) {
      setNotificacion("Hay errores en los productos: verifica cantidad, lote y fecha.");
      return;
    }

    const credito = cuotasSeleccionadas > 0;

    const numeroFacturaEntero = parseInt(numeroFactura, 10);

  if (isNaN(numeroFacturaEntero)) {
    setNotificacion("El número de factura no es válido");
    return;
  }


  const payload = {
    no_factura: numeroFacturaEntero,
    descripcion: descripcionCompra,
    credito,
    ...(credito ? { cuotas: cuotasSeleccionadas } : {}),
    ...(agregandoProveedor
      ? {
          nuevo_proveedor: {
            nombre: nuevoProveedorNombre,
            telefono: nuevoProveedorTelefono,
            correo: nuevoProveedorCorreo,
            direccion: nuevoProveedorDireccion
          }
        }
      : {
          proveedor_id: parseInt(proveedorSeleccionadoId)
        }),
    detalles,
    local_id: localSeleccionado
  };


  try {
      
      
    const res = await fetch(`${import.meta.env.VITE_API_URL}/compras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Error en la respuesta:", errData);
      setNotificacion("No se pudo guardar la compra.");
      return;
    }

      const data = await res.json();
      localStorage.removeItem(compraKey);
      setNotificacion("Compra registrada con éxito");
      if (credito && data && data.compra_id) {
        //console.log(`Agendando ${cuotasSeleccionadas} recordatorio(s) para la compra #${data.compra_id}`);

        await agendarRecordatoriosPago(cuotasSeleccionadas, data.compra_id);
      }

      //console.log("Respuesta:", data);
      navigate(-1);

      // limpiar form si querés
      // setLineas([]);
      // reset otros campos
    } catch (error) {
      console.error("Error al enviar:", error);
      setNotificacion("Error de red al registrar la compra.");
    }
  };

  const handleCancelarCompra = () => {
    setLineas([]);
    setNumeroFactura('');
    setDescripcionCompra('');
    setCuotasSeleccionadas(0);
    setProveedorSeleccionadoId('');
    setAgregandoProveedor(false);
    setNuevoProveedorNombre('');
    setNuevoProveedorTelefono('');
    setNuevoProveedorCorreo('');
    setNuevoProveedorDireccion('');
    localStorage.removeItem(compraKey);
    navigate(-1);
  };


  //Filtrado de productos (que aparezcan unicamente los que estan relacionado con el proveedor)
    
  const filtrarProductos = (productos) => {
    return productos.map((p) => ({
      id: parseInt(p.codigo),
      nombre: p.nombre,
      preciocosto: parseFloat(p.preciocosto || p.preciocosto === 0 ? p.preciocosto : p.preciocosto), // por si viene string
      precioventa: parseFloat(p.precioventa || p.precioventa === 0 ? p.precioventa : p.precioventa),
      presentacion: p.presentacion,
      receta: p.receta,
      stock_actual: parseInt(p.stock_actual || 0),
      proveedor_id: parseInt(p.proveedor_id || (p.proveedor && p.proveedor.id) || 0),
      raw: p // opcional: mantener el original si lo necesitas
    }));
  };

  const productosFiltrados = productos
    ? filtrarProductos(productos).filter(p => {
        if (!proveedorSeleccionadoId) return true; // si no hay proveedor seleccionado, devuelve todo
        return parseInt(p.proveedor_id) === parseInt(proveedorSeleccionadoId);
      })
    : [];

return(

      
        <main className={styles.NuevaCompraMain}>
          {notificacion && (
            <div className={styles.toast}>
              {notificacion}
            </div>
          )}

          {
            <Popup
              isOpen={eliminarCompra}
              title={'¿Desea descartar esta compra?'}
              onClose={closeEliminarCompra}
              onClick={handleCancelarCompra}
            >
              <div className='modalContenido'>
                {errorMessage && (
                  <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                )}
              </div>
            </Popup>
          }

            <div className={styles.titloNuevaVentayBoton}>
              <button className ={styles.buttonVolverV} onClick={volver}>
                  <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "25px" }}></FontAwesomeIcon>
              </button>
              <h1 className={styles.tituloNuevaVenta}> Registro de nueva compra</h1>
            </div>

              <article className={styles.encabezadoNuevaVenta}>
        
                <div className={styles.datosClienteVenta}>
                  <h2 className={styles.subtituloNuevaVenta}>Datos del Proveedor</h2>

                 

                    <div className={styles.contenedorRegistrado}>

                      {/* Si está en modo "agregar proveedor nuevo" */}
                      {agregandoProveedor ? (
                        <>
                          <div className={styles.contenedorNitcliente}>
                            <IconoInput
                              icono={faHouseMedical}
                              placeholder="Nombre del nuevo proveedor"
                              type="text"
                              value={nuevoProveedorNombre}
                              onChange={handleNuevoProveedorNombre}
                            />
                            <button
                              onClick={() => setAgregandoProveedor(false)}
                              className={styles.buttonBuscarVenta2}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>

                          <IconoInput 
                            icono={faPhone} 
                            placeholder="Teléfono del proveedor" 
                            type="text" 
                            value={nuevoProveedorTelefono}
                            onChange={handleNuevoProveedorTelefono}
                          />

                          <IconoInput 
                            icono={faEnvelope} 
                            placeholder="Correo del proveedor" 
                            type="email" 
                            value={nuevoProveedorCorreo}
                            onChange={handleNuevoProveedorCorreo}
                          />

                          <IconoInput 
                            icono={faLocationDot} 
                            placeholder="Dirección del proveedor" 
                            type="text" 
                            value={nuevoProveedorDireccion}
                            onChange={handleNuevoProveedorDireccion}
                          />

                      <ButtonHeaders
                        text = {"Agregar proveedor"}
                        onClick={handleAgregarProveedor}
                      ></ButtonHeaders>
                        </>
                      ) : (
                        <>
                          <div className={styles.contenedorNitcliente}>
                          

                            <SelectSearch
                              icono={faHouseMedical}
                              placeholder="Nombre del proveedor"
                              value={proveedorSeleccionadoId}
                              onChange={(value) => setProveedorSeleccionadoId(value)}
                              type="text"
                              options={opcionesProveedores}
                              tableStyle = {false}
                            ></SelectSearch>

                            <button
                              onClick={() => {
                                setAgregandoProveedor(true);
                                setProveedorSeleccionadoId(null); // limpia el select si vas a agregar
                              }}
                              className={styles.buttonBuscarVenta}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>

                          

                          {/* Si se seleccionó un proveedor, mostrar los datos */}
                          {proveedorSeleccionado && (
                            <>
                              <IconoInput
                                icono={faPhone}
                                placeholder="Ingrese el teléfono del proveedor"
                                value={proveedorSeleccionado.telefonos?.[0]?.numero || "No se encontró el telefono del proveedor"}
                                disabled
                              />
                              <IconoInput
                                icono={faEnvelope}
                                placeholder="Ingrese el correo del proveedor"
                                value={proveedorSeleccionado.correo || "No se encontró el correo del proveedor"}
                                disabled
                              />
                              <IconoInput
                                icono={faLocationDot}
                                placeholder="Ingrese la dirección del proveedor"
                                value={proveedorSeleccionado.direccion || "No se encontró la direccion del proveedor"}
                                disabled
                              />

                              

                          <ButtonText
                          texto={""}
                          textoButton={"Agregar producto relacionado con el proveedor"}
                          ></ButtonText>
                            </>

                            
                          )}
                        </>
                      )}
                    </div>

                                                
                  
                
                  </div>
                  <div className={styles.gridDatosCompra}>
                 
                      <h2 className={styles.subtituloNuevaVenta}>Datos de la compra</h2>
                  <div className={styles.contenedorDatosCompra}>
                  <IconoInput
                      icono={faCircleInfo}
                      placeholder={"No de la factura"}
                      value={numeroFactura}
                      onChange={handleNumeroFactura}
                      type = {"number"}
                      
                    />

                    <IconoInput
                      icono={faPen}
                      placeholder={"Descripción de la venta"}
                      value={descripcionCompra}
                      onChange={handleDescripcionCompra}
                      type = {"text"}
                  
                    />
                    

                    <InputSelects
                      icono={faCommentDollar}
                      placeholder={"Seleccione una opción de crédito"}
                      value={cuotasSeleccionadas}
                      onChange={handleCuotasSeleccionadas}
                      type = {"numeric"}
                      opcions={opcionesCuotas}
                      
                    />

                    {cuotasSeleccionadas > 0 && (
                      <p style={{ fontSize: "0.9rem", color: "#666" }}>
                        Se programarán {cuotasSeleccionadas} recordatorio(s) de pago para dentro de {cuotasSeleccionadas === 1 ? '15' : cuotasSeleccionadas === 2 ? '15 y 30' : '15, 30 y 45'} días.
                      </p>
                    )}

          </div>
                 
                    </div>
              </article>

              <article className={styles.contenedorDatosVenta}>
                  <div>
                    <h2 className={styles.subtituloNuevaVenta}>Detalles de compra</h2>
                  
                    <TablaCompras
                      productosDisponibles = {productosFiltrados}
                      lineas={lineas}
                      setLineas={setLineas}
                    ></TablaCompras>
                
                  </div>

                  <div>
                    <div className={styles.selectPagoWrapper2}>
                   
                        <ButtonHeaders
                          text="Cancelar compra"
                          onClick={openEliminarCompra}
                          red={true}
                        />

                        <ButtonHeaders
                          text="Confirmar compra"
                          onClick={enviarCompra}
                        />
                      </div>
                      
                </div>
              </article>

           
        </main>
    )
}

export default NuevaCompra;