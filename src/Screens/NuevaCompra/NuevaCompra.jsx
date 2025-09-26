import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAddressCard, faArrowLeft, faSearch, faPen, faPlus, faHospital, faHouseMedical, faPhone, faEnvelope, faLocationDot, faCircleInfo, faCommentDollar, faSackDollar} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useOutletContext } from 'react-router-dom';
// import styles2 from './NuevaCompra.module.css'
import styles from '../NuevaVenta/NuevaVenta.module.css'
import IconoInput from "../../components/Inputs/InputIcono";
import { useState } from "react";
import { getToken } from "../../services/authService";
import { useFetch } from "../../utils/useFetch";
import { TablaCompras } from "../../components/Tables/TablaCompras";
import { TablaFactura } from "../../components/Tables/TablaFactura";

const NuevaCompra = () => {

    const navigate = useNavigate();
    const volver = () => {
        navigate(-1); // Va una página atrás en el historial
    };

    //productos
    const token = getToken(); 
    const { selectedLocal } = useOutletContext();
    const localSeleccionado = selectedLocal + 1 ;
    const {data: productos, loading, error } = useFetch(`http://localhost:3000/api/productos/con-stock?local_id=${localSeleccionado}`);
      const [lineas, setLineas] = useState([]);
  

    
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


    return(
        <main className={styles.aaa}>
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
                            <div className={styles.contenedorNitcliente}>

                             <IconoInput
                            icono={faHouseMedical}
                            placeholder={"Nombre del proveedor"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                           <button 
                        //   onClick={handleBuscarCliente} 
                          className={styles.buttonBuscarVenta}>
                            <FontAwesomeIcon icon = {faPlus}></FontAwesomeIcon>
                          </button>
                          </div>

                          <IconoInput
                            icono={faPhone}
                            placeholder={"Teléfono del proveedor"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                          <IconoInput
                            icono={faEnvelope}
                            placeholder={"Correo del proveedor"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                          <IconoInput
                            icono={faLocationDot}
                            placeholder={"Dirección del proveedor"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                          
                         




                        </div>



                        

                
                            
                        
                            
                        
                        </div>
                        <div className={styles.datosClienteVenta}>
                        <div className={styles.contenedorRegistrado}>
                            <h2 className={styles.subtituloNuevaVenta}>Datos de la compra</h2>
                        <IconoInput
                            icono={faCircleInfo}
                            placeholder={"No de la factura"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                          <IconoInput
                            icono={faPen}
                            placeholder={"Descripción de la venta"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                          <IconoInput
                            icono={faCommentDollar}
                            placeholder={"Credito"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />

                          <IconoInput
                            icono={faSackDollar}
                            placeholder={"Cuotas"}
                            // value={nitCliente}
                            //onChange={handleNitCliente}
                            type = {"numeric"}
                            // Aquí puedes conectar el estado de NIT si deseas
                          />
                          </div>
                          </div>
                    </article>

                    <article className={styles.contenedorDatosVenta}>
                                    <div>
                                        <h2 className={styles.subtituloNuevaVenta}>Detalles de venta</h2>
                                        
                    
                                        <TablaCompras
                                          productosDisponibles = {productosFiltrados}
                                          lineas={lineas}
                                          setLineas={setLineas}
                                        ></TablaCompras>
                                 
                    
                                      
                    
                                       
                                    </div>
                    </article>

           
        </main>
    )
}

export default NuevaCompra;