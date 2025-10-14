import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../Ventas/Ventas.module.css'
import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';

import { useFetch } from '../../utils/useFetch';
import { getToken } from '../../services/authService';
import { useMemo, useState } from 'react';
import { Table } from '../../components/Tables/Table';
import { useOpcionesUsuarioDinamicos } from '../../hooks/useOpcionesUsuariosDinamico';
import { useFiltroGeneral } from '../../hooks/useFiltroGeneral';
import { useOrderBy } from '../../hooks/useOrderBy';
import Filters from '../../components/FIlters/Filters';
import OrderBy from '../../components/OrderBy/OrderBy';
import FiltroResumen from '../../components/FIlters/FiltroResumen/FiltroResumen';


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
    ? `http://localhost:3000/compras?local_id=${localSeleccionado}`
    : null;  //url para los eventos dependiendo del local

    //Se llama a traer la función useFetch (utils/useFetch) que retorna la carga de datos, y existe la opción de forzar un refetch manual en caso de modificaciones a los eventos.
    const { data, loading, error } = useFetch(url, {headers: { 'Authorization': `Bearer ${token}` }}, [token, localSeleccionado]);

    const datosCompras = Array.isArray(data) ? data : [];    //Se guardan los datos en un array
    //console.log("datosCompras");
    //console.log(datosCompras);



    const datosTransformados = useMemo(() => {
        return datosCompras.flatMap(compra =>{

            const ultimoPago = compra.pagos.reduce((ultimo, actual) => {
                return new Date(actual.fecha) > new Date(ultimo.fecha) ? actual : ultimo;
            }, compra.pagos[0]);


            if (compra.productos.length === 0) {
            // Si no hay productos, devuelve un objeto con un texto indicando la ausencia
            return [{
                id: compra.id,
                factura: compra.no_factura,
                credito: compra.credito,
                proveedor: compra.proveedor.nombre,
                lote: '-',
                producto: '-',
                cantidad: '-',
                total: Number(compra.total) || 0,
                descripcion: compra.descripcion,
                estadoPago:  ultimoPago ? ultimoPago.estado : 'Sin pagos',
                usuario: compra.usuario,
                encargado:  `${compra.usuario?.nombre || 'usuario inválido'} ${compra.usuario?.apellidos || ''}`,
                fecha: '-',
                fecha_mostrar: '-',
            }];
        }

         // Si hay productos, mapearlos normalmente
        return compra.productos.map(producto => ({
            id: compra.id,
            factura: compra.no_factura,
            credito: compra.credito === true ? 'Sí' :'No',
            proveedor: compra.proveedor.nombre,
            lote: producto.lote.lote || 'Sin Lote',
            producto: producto.lote.producto.nombre || 'Sin producto',
            cantidad: producto.cantidad,
            total: Number(compra.total) || 0,
            descripcion: compra.descripcion,
            estadoPago:  ultimoPago ? ultimoPago.estado : 'Sin pagos',
            usuario: compra.usuario,
            encargado:  `${compra.usuario?.nombre || 'usuario inválido'} ${compra.usuario?.apellidos || ''}`,
            fecha: new Date(producto.fecha),
            fecha_mostrar: new Date(producto.fecha).toLocaleDateString('es-ES')
        }));

        }
        );
    }, [datosCompras]);

    //console.log("datos compras transformados")
    //console.log(datosTransformados)
   

    
    const columnas = [  
        { key: 'id', titulo: '#No.',type: 'texto' },
        { key: 'factura', titulo: 'Factura',type: 'texto' },
        { key: 'proveedor', titulo: 'Proveedor', type: 'texto' },

       
        { key: 'fecha_mostrar', titulo: 'Fecha', type: 'texto' },
        { key: 'encargado', titulo: 'Realizado por:', type: 'texto' },
        { key: 'descripcion', titulo: 'Descripción', type: 'texto' },
      
        { key: 'producto', titulo: 'Producto', type: 'texto' },
        { key: 'lote', titulo: 'Lote',type: 'texto' },
        { key: 'cantidad', titulo: 'Cantidad', type: 'numero' },
        { key: 'estadoPago', titulo: 'Estado', type: 'texto' },

        { key: 'total', titulo: 'Total',type: 'numero' },
       
    ];

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

    const expandFechaResume = () => {setIsOpendDate(true); setPanelAbierto(true);};
    const expandPrecioResume = () => {setIsOpendPrice(true); setPanelAbierto(true);};
    const expandRolResume = () => {setIsOpendRol(true); setPanelAbierto(true);};
    const expandMedicamentoResume = () => {setIsOpendMedic(true); setPanelAbierto(true);};

    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [opcionsRoles, setOpcionsRoles] = useState([]);
    const [opcionsUsers, setOpcionsUsers] = useState([]);
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

     const tipoUserKeyMap = useMemo(() => ({
          ROL: "usuario.rol_id",
          USUARIO: "usuario",
        }), []);
    
    //llamo a un hook
    useOpcionesUsuarioDinamicos({
        data: datosCompras,
        tipoUserKeyMap: tipoUserKeyMap,
        setOpcionsRoles: setOpcionsRoles,
        setOpcionsUsers: setOpcionsUsers
    });


    const [rolSeleccionado, setRolSeleccionado] = useState("");
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "rol") {
        const numValue = parseInt(value);
        setRolSeleccionado(isNaN(numValue) ? "" : numValue);
        setUsuarioSeleccionado(""); // Reinicia usuario si cambia el rol

        const rolSeleccionadoNum = parseInt(value);
        if (isNaN(rolSeleccionadoNum)) {
            setUsuariosFiltrados(opcionsUsers); // todos los usuarios
        } else {
            const filtrados = opcionsUsers.filter(usuario => usuario.rol_id === rolSeleccionadoNum);
            setUsuariosFiltrados(filtrados);
        }
        }

        if (name === "usuarios") {
        setUsuarioSeleccionado(value);
        }
    };

    const rolSeleccionadoObj = useMemo(() => {
        return opcionsRoles.find(r => String(r.value) === String(rolSeleccionado)) || null;
    }, [rolSeleccionado, opcionsRoles]);

    const usuarioSeleccionadoObj = useMemo(() => {
        return opcionsUsers.find(u => String(u.value) === String(usuarioSeleccionado)) || null;
    }, [usuarioSeleccionado, opcionsUsers]);


    const filterKeyMap = useMemo(() => ({
        ROL: "usuario.rol_id",
        USUARIO: "usuario.id",
        RANGO_FECHA: "fecha",
        RANGO_PRECIO: "total"
    }), []);

    const {dataFiltrada} = useFiltroGeneral({
        data: datosTransformados, 
        filterKeyMap: filterKeyMap, 
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        usuarioId: usuarioSeleccionado,
        rolId: rolSeleccionado,
        precioMin: precioMin, 
        precioMax: precioMax,
    });


     //Funciones necesarias para el funcionamiento de Order By
    //Constante que almacena los nombres o key de los datos a filtrar
    const sortKeyMap={
        PRICE_HIGH: "total",
        PRICE_LOW: "total",
        DATE_NEW: "fecha",
        DATE_OLD:"fecha"

    }

      const resetFiltros = () => {
        setFechaInicio(null);
        setFechaFin(null);
        

        setPrecioMin('');
        setPrecioMax('');

        setRolSeleccionado('');
        setUsuarioSeleccionado('');
        setUsuariosFiltrados(opcionsUsers);

    };

    const {sortedData, sortOption, setSortOption} = useOrderBy({data: dataFiltrada, sortKeyMap: sortKeyMap});

    const totalAcumulado = useMemo(() => {
        return sortedData.reduce((sum, item) => {
        const total = parseFloat(item.total); // Asegura que sea número
        return sum + (isNaN(total) ? 0 : total);
        }, 0);
    }, [sortedData]);


   



    return(
        <main className={styles.bodyVentas}>
            <div className={styles.headerVentas}>
                <div className={styles.titulosVentas}>
                    <h1 className={styles.tituloVentas}>Historial de Compras </h1>
                    <h3 className={styles.tituloVentas}>Total acumulado: Q{totalAcumulado.toFixed(2)} </h3>
                </div>
            
                <div className={styles.headerBotonesVentas}>
                    <ButtonHeaders text = "Exportar" onlyLine= {true} ></ButtonHeaders>
                    <Filters
                      title = {"Ventas"}
                      panelAbierto={panelAbierto}
                      setPanelAbierto={setPanelAbierto}
                      mostrarRangoFecha = {true}
                      mostrarRangoPrecio = {true}
                      mostrarUsuario = {true}
                      mostrarMedicamento = {false}

                      //atributos para usuarios y roles
                      isOpendRol = {isOpendRol}
                      expandRol = {expandRol}
                      expandUsuario = {expandUsuario}
                      opcionesUsuarios = {usuariosFiltrados}
                      opcionesRoles = {opcionsRoles}
                      usuarioSeleccionado = {usuarioSeleccionado}
                      rolSeleccionado = {rolSeleccionado}
                      handleChange = {handleChange}
          
                      
                      //atributos para rango de precio
                      isOpendPrice = {isOpendPrice}
                      expandPrecio = {expandPrecio}
                      precioMin = {precioMin}
                      setPrecioMin = {setPrecioMin}
                      precioMax = {precioMax}
                      setPrecioMax = {setPrecioMax}
                                        
                      isOpendDate = {isOpendDate}
                      expandFecha = {expandFecha}
                      setFechaInicio = {setFechaInicio}
                      fechaInicio={fechaInicio}
                      fechaFin={fechaFin}
                      setFechaFin = {setFechaFin}

                      resetFiltros={resetFiltros}
                    ></Filters>

                    <OrderBy
                      FAbecedario = {false}
                      FExistencias = {false}
                      FPrecio = {true}
                      FFecha = {true}
                      selectedOption = {sortOption}
                      onChange = {setSortOption}
                    >

                    </OrderBy>
                    
                    <ButtonHeaders text = "Nueva compra" onClick={irANuevaCompra}></ButtonHeaders>
                </div>
            </div>

            <div className={styles.TablaVentas}>
                <div className={styles.contenedorFiltroResumen}>

                    <FiltroResumen
                        fechaInicio={fechaInicio}
                        fechaFin={fechaFin}
                        precioMin={precioMin}
                        precioMax={precioMax}
                        usuarioSeleccionado={usuarioSeleccionadoObj}
                        rolSeleccionado={rolSeleccionadoObj}
                        // funciones para abrir paneles
                        expandFecha={expandFechaResume}
                        expandPrecio={expandPrecioResume}
                        expandRol={expandRolResume}
                        expandMedicamento={expandMedicamentoResume}

                        // medicamentoSeleccionado={medicamentoSeleccionado}
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
                        onRemoveMedicamento={() => handleChangeMedicamento({ target: { name: 'tipo', value: '' } })}
                    />
                    
                </div>
                <Table
                    nameColumns={columnas}
                    data={sortedData}
                ></Table>
                

            </div>
            
                          
                      
        </main>
    )
}

export default Compras;