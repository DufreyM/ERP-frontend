import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Filters from '../../components/FIlters/Filters';
import { Table } from '../../components/Tables/Table';
import styles from './Ventas.module.css'
import { useState } from 'react';


const Ventas = () => {
    const navigate = useNavigate();
    const irANuevaVenta = () => {
        navigate('/admin/historial-vc/nueva-venta');
    };

    const { selectedLocal } = useOutletContext();
    const localSeleccionado = selectedLocal + 1 ;


 

   const datos = [
  {
    id: 12,
    cliente_id: null,
    total: "780.00",
    tipo_pago: "efectivo",
    fecha_venta: '2025-08-06T14:00:00.000Z',
    cliente: null,
    detalles: [
      {
        id: 1,
        venta_id: 12,
        producto_id: 1,
        lote_id: 1,
        cantidad: 130,
        precio_unitario: "10.00",
        descuento: "40.00",
        subtotal: "780.00",
        producto: {
          codigo: 1,
          nombre: "Levofloxacina",
          presentacion: "Tabletas 500 mg x 30 comprimidos",
          proveedor_id: 1,
          precioventa: "10.00",
          preciocosto: "6.00",
          receta: true,
          stock_minimo: 10,
          detalles: "Antibiótico de amplio espectro",
          imagen: "https://res.cloudinary.com/dokere5ey/image/upload/v1754450906/levofloxacina_1_x7oolc.png"
        },
        lote: {
          id: 1,
          producto_id: 1,
          lote: "LOTE-001",
          fecha_vencimiento: "2024-12-31T00:00:00.000Z"
        }
      }
    ]
  },
  {
    id: 13,
    cliente_id: 2,
    total: "150.00",
    tipo_pago: "tarjeta",
    fecha_venta: '2025-08-01T14:00:00.000Z',
    cliente: {
      id: 2,
      nombre: "Ana López"
    },
    detalles: [
      {
        id: 2,
        venta_id: 13,
        producto_id: 2,
        lote_id: 2,
        cantidad: 10,
        precio_unitario: "15.00",
        descuento: "0.00",
        subtotal: "150.00",
        producto: {
          codigo: 2,
          nombre: "Ibuprofeno",
          presentacion: "Tabletas 400 mg x 20 comprimidos",
          proveedor_id: 2,
          precioventa: "15.00",
          preciocosto: "9.00",
          receta: false,
          stock_minimo: 15,
          detalles: "Analgésico y antiinflamatorio",
          imagen: "https://res.cloudinary.com/dokere5ey/image/upload/v1754450999/ibuprofeno_2_ynz5er.png"
        },
        lote: {
          id: 2,
          producto_id: 2,
          lote: "LOTE-002",
          fecha_vencimiento: "2025-06-15T00:00:00.000Z"
        }
      }
    ]
  },
  {
    id: 14,
    cliente_id: 3,
    total: "300.00",
    tipo_pago: "transferencia",
    fecha_venta: '2025-08-29T14:00:00.000Z',
    cliente: {
      id: 3,
      nombre: "Carlos Pérez"
    },
    detalles: [
      {
        id: 3,
        venta_id: 14,
        producto_id: 3,
        lote_id: 3,
        cantidad: 20,
        precio_unitario: "15.00",
        descuento: "0.00",
        subtotal: "300.00",
        producto: {
          codigo: 3,
          nombre: "Paracetamol",
          presentacion: "Tabletas 500 mg x 20",
          proveedor_id: 3,
          precioventa: "15.00",
          preciocosto: "7.50",
          receta: false,
          stock_minimo: 20,
          detalles: "Analgésico y antipirético",
          imagen: "https://res.cloudinary.com/dokere5ey/image/upload/v1754451090/paracetamol_3_ckwhhq.png"
        },
        lote: {
          id: 3,
          producto_id: 3,
          lote: "LOTE-003",
          fecha_vencimiento: "2025-09-10T00:00:00.000Z"
        }
      }
    ]
  },
  {
    id: 15,
    cliente_id: null,
    total: "220.00",
    tipo_pago: "efectivo",
    fecha_venta: '2025-08-15T14:00:00.000Z',
    cliente: null,
    detalles: [
      {
        id: 4,
        venta_id: 15,
        producto_id: 4,
        lote_id: 4,
        cantidad: 11,
        precio_unitario: "20.00",
        descuento: "0.00",
        subtotal: "220.00",
        producto: {
          codigo: 4,
          nombre: "Omeprazol",
          presentacion: "Cápsulas 20 mg x 14",
          proveedor_id: 4,
          precioventa: "20.00",
          preciocosto: "12.00",
          receta: true,
          stock_minimo: 10,
          detalles: "Inhibidor de bomba de protones",
          imagen: "https://res.cloudinary.com/dokere5ey/image/upload/v1754451170/omeprazol_4_gwjr2z.png"
        },
        lote: {
          id: 4,
          producto_id: 4,
          lote: "LOTE-004",
          fecha_vencimiento: "2025-11-30T00:00:00.000Z"
        }
      }
    ]
  },
  {
    id: 16,
    cliente_id: 4,
    total: "90.00",
    tipo_pago: "tarjeta",
    fecha_venta: '2025-08-06T14:00:00.000Z',
    cliente: {
      id: 4,
      nombre: "Lucía Torres"
    },
    detalles: [
      {
        id: 5,
        venta_id: 16,
        producto_id: 5,
        lote_id: 5,
        cantidad: 3,
        precio_unitario: "30.00",
        descuento: "0.00",
        subtotal: "90.00",
        producto: {
          codigo: 5,
          nombre: "Loratadina",
          presentacion: "Tabletas 10 mg x 10",
          proveedor_id: 5,
          precioventa: "30.00",
          preciocosto: "18.00",
          receta: false,
          stock_minimo: 12,
          detalles: "Antihistamínico",
          imagen: "https://res.cloudinary.com/dokere5ey/image/upload/v1754451256/loratadina_5_yxwmdd.png"
        },
        lote: {
          id: 5,
          producto_id: 5,
          lote: "LOTE-005",
          fecha_vencimiento: "2026-01-20T00:00:00.000Z"
        }
      }
    ]
  }
];
    
 


    const datosTransformados = datos.flatMap(venta =>
    venta.detalles.map(detalle => ({
        id: venta.id,
        tipo_pago: venta.tipo_pago,
        total: venta.total,
        cliente: venta.cliente?.nombre || 'Sin cliente',
        cantidad: detalle.cantidad,
        producto: detalle.producto.nombre,
        subTotal: detalle.precio_unitario,
        lote: detalle.lote.lote,
        fecha_venta: new Date(venta.fecha_venta),
        fecha_venta_mostrar: new Date(venta.fecha_venta).toLocaleDateString('es-ES'),
        usuarioID: 'aaaaaaaaa',
        precio_unitario: detalle.precio_unitario,
        descuento: detalle.descuento


       
    }))
    );

    const columnas = [  
    { key: 'id', titulo: '#No.' },
    
    { key: 'fecha_venta_mostrar', titulo: 'Fecha' },
    { key: 'usuarioID', titulo: 'Realizado por:' },
    { key: 'tipo_pago', titulo: 'Tipo de pago' },
    { key: 'producto', titulo: 'Producto' }, 
    { key: 'cantidad', titulo: 'Cantidad' },     
    { key: 'cliente', titulo: 'Cliente' },

    
    { key: 'precio_unitario', titulo: 'Precio Unitario (Q)' },
    { key: 'descuento', titulo: 'Descuento (Q)' },
    { key: 'total', titulo: 'Total (Q' },
   
    ];

    console.log(datosTransformados);


       //Filtros
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);

    const datosFiltrados = datosTransformados.filter((dato) => {
        const fechaVenta = new Date(dato.fecha_venta);
        
        if (fechaInicio && fechaVenta < new Date(fechaInicio)) return false;
        if (fechaFin && fechaVenta > new Date(fechaFin)) return false;

        return true;
    });

    const handleFechaInicioChange = (fecha) => setFechaInicio(fecha);
    const handleFechaFinChange = (fecha) => setFechaFin(fecha);
    console.log("datos  FILTRADOS");

    console.log(datosFiltrados);





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
                        formData={datosTransformados}
                        mostrarRangoFecha = {true}
                        mostrarRangoMonto = {true}
            
                        mostrarFiltros={{
                            rol: false,
                            usuarioID: false,
                        }}

                        onFechaInicioChange={setFechaInicio}
                        onFechaFinChange={setFechaFin}
                        fechaInicio={fechaInicio}
                        fechaFin={fechaFin}
                    ></Filters>
                    <ButtonHeaders text = "Nueva venta" onClick={irANuevaVenta}></ButtonHeaders>


                </div>
            </div>

            <div className={styles.TablaVentas}>

                <Table
                    nameColumns = {columnas}
                    data = {datosFiltrados}
                
                />
            </div>

            


        </main>
    )
}

export default Ventas;