import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';
import { useNavigate } from 'react-router-dom';
import Filters from '../../components/FIlters/Filters';
import { Table } from '../../components/Tables/Table';
import styles from './Ventas.module.css'
import { tr } from 'date-fns/locale';

const Ventas = () => {
    const navigate = useNavigate();
    const irANuevaVenta = () => {
        navigate('/admin/historial-vc/nueva-venta');
    };

    const columnas = [  
        { key: 'idProducto', titulo: '#No.' },
        { key: 'bs', titulo: 'Fecha' },
        { key: 'cantidad', titulo: 'Producto' },
        { key: 'descripcion', titulo: 'Presentacion' },
        { key: 'precio', titulo: 'Cliente' },
        { key: 'descuentos', titulo: 'Usuario' },
        { key: 'total', titulo: 'Total (Q)' },
    ]

    const datos = [
  {
    idProducto: 1,
    bs: '01/08/2025',
    cantidad: 'Paracetamol',
    descripcion: 'Caja de 20 tabletas',
    precio: 'Carlos Pérez',
    descuentos: 'AdminUser1',
    total: 125.00
  },
  {
    idProducto: 2,
    bs: '02/08/2025',
    cantidad: 'Ibuprofeno',
    descripcion: 'Frasco de 100ml',
    precio: 'Ana López',
    descuentos: 'AdminUser2',
    total: 75.50
  },
  {
    idProducto: 3,
    bs: '02/08/2025',
    cantidad: 'Amoxicilina',
    descripcion: 'Caja de 10 cápsulas',
    precio: 'José Martínez',
    descuentos: 'AdminUser1',
    total: 210.00
  },
  {
    idProducto: 4,
    bs: '03/08/2025',
    cantidad: 'Loratadina',
    descripcion: 'Blister de 10 tabletas',
    precio: 'María González',
    descuentos: 'Vendedor01',
    total: 60.00
  },
  {
    idProducto: 5,
    bs: '03/08/2025',
    cantidad: 'Omeprazol',
    descripcion: 'Caja de 14 cápsulas',
    precio: 'Luis Ramírez',
    descuentos: 'Vendedor01',
    total: 88.75
  },
  {
    idProducto: 6,
    bs: '04/08/2025',
    cantidad: 'Metformina',
    descripcion: 'Caja de 30 tabletas',
    precio: 'Rosa Fernández',
    descuentos: 'AdminUser2',
    total: 99.90
  },
  {
    idProducto: 7,
    bs: '04/08/2025',
    cantidad: 'Salbutamol',
    descripcion: 'Inhalador 200 dosis',
    precio: 'Mario García',
    descuentos: 'Vendedor02',
    total: 150.25
  },
  {
    idProducto: 8,
    bs: '05/08/2025',
    cantidad: 'Cetirizina',
    descripcion: 'Frasco de 60ml',
    precio: 'Laura Herrera',
    descuentos: 'AdminUser1',
    total: 45.00
  },
  {
    idProducto: 9,
    bs: '05/08/2025',
    cantidad: 'Ácido fólico',
    descripcion: 'Caja de 30 tabletas',
    precio: 'Pedro Castillo',
    descuentos: 'Vendedor02',
    total: 59.99
  },
  {
    idProducto: 10,
    bs: '06/08/2025',
    cantidad: 'Vitamina C',
    descripcion: 'Frasco de 100 tabletas',
    precio: 'Lucía Torres',
    descuentos: 'Vendedor01',
    total: 110.00
  }
];


    return(
        <main className={styles.bodyVentas}>
            <div className={styles.headerVentas}>
                <div className={styles.titulosVentas}>
                    <h1 className={styles.tituloVentas}>Historial de ventas </h1>
                    <h3 className={styles.tituloVentas}>Total acumulado: Q100.00 </h3>
                </div>
               
            

                <div className={styles.headerBotonesVentas}>
                    <ButtonHeaders text = "Exportar" onlyLine= {true} ></ButtonHeaders>
                    <Filters
                        mostrarRangoFecha = {true}
                        mostrarRangoMonto = {true}
                        mostrarFiltros={datos}
                    ></Filters>
                    <ButtonHeaders text = "Nueva venta" onClick={irANuevaVenta}></ButtonHeaders>


                </div>
            </div>

            <div className={styles.TablaVentas}>

                <Table
                    nameColumns = {columnas}
                    data = {datos}
                
                />
            </div>

            


        </main>
    )
}

export default Ventas;