import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAddressCard, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import IconoInput from "../../components/Inputs/InputIcono";
import SimpleTitle from "../../components/Titles/SimpleTitle";
import styles from "./NuevaVenta.module.css"
import { Table } from '../../components/Tables/Table';
import { useNavigate } from 'react-router-dom';



const NuevaVenta = () => {
  const navigate = useNavigate();
  const volver = () => {
    navigate(-1); // Va una página atrás en el historial
  };

    const columnas = [  
        { key: 'idProducto', titulo: '#No.' },
        { key: 'bs', titulo: 'B/S' },
        { key: 'cantidad', titulo: 'Cantidad' },
        { key: 'descripcion', titulo: 'Descripción' },
        { key: 'precio', titulo: 'P. Unitario con IVA' },
        { key: 'descuentos', titulo: 'Descuentos (Q)' },
        { key: 'total', titulo: 'Total (Q)' },
        { key: 'impuestos', titulo: 'Impuestos' },
    ]

    const datos = [
  {
    idProducto: 1,
    bs: 'B',
    cantidad: 5,
    descripcion: 'Producto A',
    precio: 20.00,
    descuentos: 5.00,
    total: 95.00,
    impuestos: 15.00,
  },
  {
    idProducto: 2,
    bs: 'S',
    cantidad: 3,
    descripcion: 'Producto B',
    precio: 15.00,
    descuentos: 0.00,
    total: 45.00,
    impuestos: 7.50,
  },
  {
    idProducto: 3,
    bs: 'B',
    cantidad: 10,
    descripcion: 'Producto C',
    precio: 30.00,
    descuentos: 10.00,
    total: 290.00,
    impuestos: 45.00,
  },
  {
    idProducto: 4,
    bs: 'S',
    cantidad: 7,
    descripcion: 'Producto D',
    precio: 25.00,
    descuentos: 2.50,
    total: 172.50,
    impuestos: 25.00,
  },
  {
    idProducto: 5,
    bs: 'B',
    cantidad: 2,
    descripcion: 'Producto E',
    precio: 50.00,
    descuentos: 5.00,
    total: 95.00,
    impuestos: 15.00,
  },
  {
    idProducto: 6,
    bs: 'S',
    cantidad: 6,
    descripcion: 'Producto F',
    precio: 40.00,
    descuentos: 10.00,
    total: 210.00,
    impuestos: 30.00,
  },
  {
    idProducto: 7,
    bs: 'B',
    cantidad: 8,
    descripcion: 'Producto G',
    precio: 18.00,
    descuentos: 3.00,
    total: 126.00,
    impuestos: 18.00,
  },
  {
    idProducto: 8,
    bs: 'S',
    cantidad: 4,
    descripcion: 'Producto H',
    precio: 22.00,
    descuentos: 1.50,
    total: 86.50,
    impuestos: 12.00,
  },
];


    return(
        <main>
          <div className={styles.titloNuevaVentayBoton}>
            <button className ={styles.buttonVolverV} onClick={volver}>
               <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "25px" }}></FontAwesomeIcon>
            </button>
            <h1 className={styles.tituloNuevaVenta}> Nueva venta</h1>
          </div>

            <article className={styles.encabezadoNuevaVenta}>
                <div className={styles.datosClienteVenta}>
                    <h2 className={styles.subtituloNuevaVenta}>Datos del cliente</h2>
                    <IconoInput
                        icono={faUser}
                        placeholder={"Nombre del receptor"}
                    ></IconoInput>

                    <IconoInput
                        icono={faAddressCard}
                        placeholder={"Nit del receptor"}
                    ></IconoInput>
                </div>

                <div className={styles.gridDatosCertificacion}>
                    <p>Moneda:</p>
                    <p>GTQ</p>
                    <p>Fecha y hora de emisión:</p>
                    <p>17/02/2025 11:43:02</p>
                    <p>Fecha y hora de certificación:</p>
                    <p>17/02/2025 11:43:02</p>
                </div>
            </article>

            <article className={styles.contenedorDatosVenta}>
                <div>
                    <h2 className={styles.subtituloNuevaVenta}>Datos de la venta</h2>
                    <IconoInput></IconoInput> {/*provisional */}

                    <Table
                        nameColumns = {columnas}
                        data = {datos}
                    
                    />

                  

                   
                </div>

                <div>
                    
                </div>

            </article>

        </main>

    )
}

export default NuevaVenta;