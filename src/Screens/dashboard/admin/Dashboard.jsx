import { useOutletContext } from 'react-router-dom';
import { getToken } from '../../../services/authService';
import { useFetch } from '../../../utils/useFetch';
import { useCheckToken } from '../../../utils/checkToken';
import VentasLineChart from '../../../components/Graficas/Graficas12Meses';
import TopProductosChart from '../../../components/Graficas/GraficasTopProductos';
import VentasComprasChart from '../../../components/Graficas/GraficasComprasVentas';
import TopClientesChart from '../../../components/Graficas/GraficasClientes';
import BaseGraficas from '../../../components/Graficas/GraficasVentas';
import styles from './Dashboard.module.css'
import SimpleTitle from '../../../components/Titles/SimpleTitle';

const Dashboard = () => {
    const { selectedLocal } = useOutletContext();
    const localSeleccionado = selectedLocal + 1 ;
    const checkToken = useCheckToken();


    const token = getToken();
    const {
        data: datosVentas12Meses, 
        loading: loading12Meses, 
        error: error12Meses } = useFetch(`${import.meta.env.VITE_API_URL}/graficas/ventas-12-meses?local_id=${localSeleccionado}` , 
    {
        headers: {'Authorization': `Bearer ${token}`}
    });
    

    const {
        data: datosTopProductos, 
        loading: loadingTopProductos, 
        error: errorTopProductos } = useFetch(`${import.meta.env.VITE_API_URL}/graficas/top-productos?local_id=${localSeleccionado}` , 
    {
        headers: {'Authorization': `Bearer ${token}`}
    });

    const {
        data: datosVentasCompras, 
        loading: loadingVentasCompras, 
        error: errorVentasCompras } = useFetch(`${import.meta.env.VITE_API_URL}/graficas/ventascompras?local_id=${localSeleccionado}` , 
    {
        headers: {'Authorization': `Bearer ${token}`}
    });
    console.log(datosVentasCompras)

    const {
        data: datosTopClientes, 
        loading: loadingTopClientes, 
        error: errorTopClientes } = useFetch(`${import.meta.env.VITE_API_URL}/graficas/top-clientes?local_id=${localSeleccionado}` , 
    {
        headers: {'Authorization': `Bearer ${token}`}
    });


      
   

    const dataLocales = [
        {
            nombre: 'Local 1',
            notificaciones: ['Notifa 1', 'Notif 2'],
            tareas: ['Tarea A', 'Tarea B']
        },
        {
            nombre: 'Local 2',
            notificaciones: ['Notif 3', 'Notif 4'],
            tareas: ['Tarea C', 'Tarea D']
        }
    ];


    const localActual = dataLocales[selectedLocal];

    return (
        <div className={styles.base}>
            {/* <h2>{localActual.nombre}</h2>
            <p>Notificaciones: {localActual.notificaciones.join(', ')}</p>
            <p>Tareas: {localActual.tareas.join(', ')}</p> */}

            <SimpleTitle
                 text={"Panel de inicio"}
            ></SimpleTitle>
            <div className={styles.filaGraficas}>
                <BaseGraficas
                    data={datosVentas12Meses || []}
                    loading={loading12Meses}
                    error={error12Meses}
                    nameGrafic={"ventas-12-meses"}

                ></BaseGraficas>

                <BaseGraficas
                    data = {datosVentasCompras || []}
                    loading={loadingVentasCompras}
                    error={errorVentasCompras}
                    nameGrafic={"ventas-compras"}
                ></BaseGraficas>

            </div>

             <BaseGraficas
                data={datosTopProductos || []}
                loading={loadingTopProductos}
                error={errorTopProductos}
                nameGrafic={"top-productos"}
            ></BaseGraficas>
           
            
            
            <BaseGraficas
                data = {datosTopClientes || []}
                loading={loadingTopClientes}
                error={errorTopClientes}
                nameGrafic={"top-clientes"}
            
            ></BaseGraficas>
        
          


          

            
        </div>
    );
};

export default Dashboard;