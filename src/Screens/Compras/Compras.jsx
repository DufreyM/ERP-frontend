import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../Ventas/Ventas.module.css'
import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';
import { Table } from '@fullcalendar/daygrid/internal.js';
import { useFetch } from '../../utils/useFetch';
import { getToken } from '../../services/authService';
import { useMemo } from 'react';

const Compras = () => {
    
    const navigate = useNavigate();
    const irANuevaCompra = () => {
        navigate('/admin/historial-vc/nueva-compra');
    };

    //Obtener datos de la base de datos
    const token = getToken();                       //Se solicita el tocken del inicio de sesión ya que es solicitado en el fetch
    const { selectedLocal } = useOutletContext();   //Se llama al contexto (En qué local se está)
    const localSeleccionado = selectedLocal >= 0 ? selectedLocal + 1 : null;   //Se suma 1 ya que el indice empieza en 0, pero en la base de datos comienza con 1
    const url = localSeleccionado
    ? `http://localhost:3000/compras`
    : null;  //url para los eventos dependiendo del local

    //Se llama a traer la función useFetch (utils/useFetch) que retorna la carga de datos, y existe la opción de forzar un refetch manual en caso de modificaciones a los eventos.
    const { data, loading, error } = useFetch(url, {headers: { 'Authorization': `Bearer ${token}` }}, [token, localSeleccionado]);

    const datosCompras = Array.isArray(data) ? data : [];    //Se guardan los datos en un array
    console.log("datosCompras");
    console.log(datosCompras);



    const datosTransformados = useMemo(() => {
        return datosCompras.flatMap(compra =>
        compra.detalles.map(detalle => ({
            id: compra.id,
            factura: compra.no_factura,
            credito: compra.credito,

            proveedor: compra.proveedor.nombre,

            total: compra.total,
            usuarioID: `${compra.usuario?.nombre || 'usuario inválido'} ${venta.usuario?.apellidos || ''}`,



            tipo_pago: compra.tipo_pago,
            total: Number(compra.total) || 0,
            cliente: compra.cliente?.nombre || 'Sin cliente',
            cantidad: detalle.cantidad,
            producto: detalle.producto.nombre,
            subTotal: detalle.precio_unitario,
            lote: detalle.lote.lote,
            created_at: new Date(compra.created_at),
            fecha_venta_mostrar: new Date(compra.created_at).toLocaleDateString('es-ES'),
            usuarioID: `${compra.encargado?.nombre || 'usuario inválido'} ${venta.encargado?.apellidos || ''}`,
            precio_unitario: detalle.precio_unitario,
            descuento: detalle.descuento,
            encargado: compra.encargado,
        }))
        );
    }, [datosCompras]);

    
        const columnas = [  
        { key: 'id', titulo: '#No.',type: 'texto' },
        
        { key: 'fecha_venta_mostrar', titulo: 'Fecha', type: 'texto' },
        { key: 'usuarioID', titulo: 'Realizado por:', type: 'texto' },
        { key: 'cliente', titulo: 'Cliente', type: 'texto' },
        { key: 'tipo_pago', titulo: 'Forma de pago',type: 'texto' },
        { key: 'producto', titulo: 'Producto', type: 'texto' }, 
        { key: 'cantidad', titulo: 'Cantidad', type: 'numero' },     
        { key: 'precio_unitario', titulo: 'Precio Unitario (Q)', type: 'numero' },
        { key: 'descuento', titulo: 'Descuento (Q)', type: 'numero' },
        { key: 'total', titulo: 'Total (Q)', type: 'numero' },
       
        ];
    

        
     


    return(
        <main className={styles.bodyVentas}>
            <div className={styles.headerVentas}>
                <div className={styles.titulosVentas}>
                    <h1 className={styles.tituloVentas}>Historial de Compras </h1>
                    <h3 className={styles.tituloVentas}>Total acumulado: Q{"totalAcumulado.toFixed(2)"} </h3>
                </div>
            
                <div className={styles.headerBotonesVentas}>
                    <ButtonHeaders text = "Exportar" onlyLine= {true} ></ButtonHeaders>
                    <ButtonHeaders text = "Nueva compra" onClick={irANuevaCompra}></ButtonHeaders>
                </div>
            </div>

            <div className={styles.TablaVentas}>
                <div className={styles.contenedorFiltroResumen}></div>

            </div>
            
                          
                      
        </main>
    )
}

export default Compras;