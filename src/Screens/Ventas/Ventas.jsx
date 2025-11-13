import ButtonHeaders from '../../components/ButtonHeaders/ButtonHeaders';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Filters from '../../components/FIlters/Filters';
import { Table } from '../../components/Tables/Table';
import styles from './Ventas.module.css'
import { useMemo, useState } from 'react';
import { getToken } from '../../services/authService';
import { useFetch } from '../../utils/useFetch';
import { useOpcionesUsuarioDinamicos } from '../../hooks/useOpcionesUsuariosDinamico';
import { useFiltroGeneral } from '../../hooks/useFiltroGeneral';
import { useOrderBy } from '../../hooks/useOrderBy';
import OrderBy from '../../components/OrderBy/OrderBy';
import FiltroResumen from '../../components/FIlters/FiltroResumen/FiltroResumen';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExportarComo from '../../components/ExportarComo/ExportarComo';
import {jwtDecode} from 'jwt-decode';


const Ventas = () => {
    const navigate = useNavigate();
    
  

    //Obtener datos de la base de datos
    const token = getToken();                       //Se solicita el tocken del inicio de sesión ya que es solicitado en el fetch
    const { selectedLocal } = useOutletContext();   //Se llama al contexto (En qué local se está)
    const localSeleccionado = selectedLocal >= 0 ? selectedLocal + 1 : null;   //Se suma 1 ya que el indice empieza en 0, pero en la base de datos comienza con 1
    const url = localSeleccionado
    ? `${import.meta.env.VITE_API_URL}/ventas?local_id=${localSeleccionado}`
    : null;  //url para los eventos dependiendo del local

    const decodedToken = token ? jwtDecode(token) : null; 
    const rolUsuario = decodedToken ? decodedToken.rol_id : null;
    const mostrarNuevaVenta = rolUsuario === 1 || rolUsuario === 2; 

    const irANuevaVenta = () => {   //movido para fix de navegaciones
        let rutaDestino = "/"; // por defecto

        if (rolUsuario === 1) {
          rutaDestino = "/admin/historial-vc/nueva-venta";
        } else if (rolUsuario === 2) {
          rutaDestino = "/dependiente/historial-vc/nueva-venta";
        } else {
          rutaDestino = "/no-autorizado"; 
        }
        navigate(rutaDestino);
    };

    //Se llama a traer la función useFetch (utils/useFetch) que retorna la carga de datos, y existe la opción de forzar un refetch manual en caso de modificaciones a los eventos.
    const { data, loading, error } = useFetch(url, {headers: { 'Authorization': `Bearer ${token}` }}, [token, localSeleccionado]);
   
    const datosVentas = Array.isArray(data) ? data : [];    //Se guardan los datos en un array
    //console.log("datosVentas");
    //console.log(datosVentas);

    
 


    const datosTransformados = useMemo(() => {
      return datosVentas.flatMap(venta =>
        venta.detalles.map(detalle => ({
          id: venta.id,
          tipo_pago: venta.tipo_pago,
          total: Number(venta.total) || 0,
          cliente: venta.cliente?.nombre || 'Sin cliente',
          cantidad: detalle.cantidad,
          producto: detalle.producto.nombre,
          subTotal: detalle.precio_unitario,
          lote: detalle.lote.lote,
          created_at: new Date(venta.created_at),
          fecha_venta_mostrar: new Date(venta.created_at).toLocaleDateString('es-ES'),
          usuarioID: `${venta.encargado?.nombre || 'usuario inválido'} ${venta.encargado?.apellidos || ''}`,
          precio_unitario: detalle.precio_unitario,
          descuento: detalle.descuento,
          encargado: venta.encargado,
        }))
      );
    }, [datosVentas]);


    const columnas = [  
    { key: 'id', titulo: '#No.',type: 'texto' },
    
    { key: 'fecha_venta_mostrar', titulo: 'Fecha', type: 'texto' },
    { key: 'usuarioID', titulo: 'Realizado por:', type: 'texto' },
    { key: 'cliente', titulo: 'Cliente', type: 'texto' },
    { key: 'tipo_pago', titulo: 'Forma de pago',type: 'texto' },
    { key: 'producto', titulo: 'Producto', type: 'texto' }, 
    { key: 'lote', titulo: 'Lote', type: 'texto'},
    { key: 'cantidad', titulo: 'Cantidad', type: 'numero' },     
    { key: 'precio_unitario', titulo: 'Precio Unitario (Q)', type: 'numero' },
    //{ key: 'descuento', titulo: 'Descuento (Q)', type: 'numero' },
    { key: 'total', titulo: 'Total (Q)', type: 'numero' },
   
    ];

    //console.log(datosTransformados);


  //Filtros
  //manejo de filtros activos
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [isOpendDate, setIsOpendDate] = useState(false);
  const [selectedPreDate, setSelectedPreDate] = useState('');
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
      ROL: "encargado.rol_id",
      USUARIO: "encargado",
    }), []);

  //llamo a un hook
  useOpcionesUsuarioDinamicos({
    data: datosVentas,
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
    ROL: "encargado.rol_id",
    USUARIO: "encargado.id",
    RANGO_FECHA: "created_at",
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
      DATE_NEW: "created_at",
      DATE_OLD:"created_at"

  
  }

  


  const resetFiltros = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setSelectedPreDate('');
    

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


  const exportarAExcel = () => {
    if (!sortedData || sortedData.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    // Mapea los datos según las columnas visibles
    const datosParaExcel = sortedData.map(item => {
        const fila = {};
        columnas.forEach(col => {
        fila[col.titulo] = item[col.key];
        });
        return fila;
    });

    // Crea una hoja y un archivo Excel
    const hoja = XLSX.utils.json_to_sheet(datosParaExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Compras");

    // Obtener fecha actual en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split("T")[0];
    const nombreArchivo = `Historial_Ventas_${fechaActual}.xlsx`;

    // Genera el archivo y descarga
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, nombreArchivo);
  };

  const exportarAPDF = () => {
    const doc = new jsPDF();
    const columnasPDF = columnas.map(col => col.titulo);
    const filasPDF = sortedData.map(item => columnas.map(col => item[col.key]));
    // Obtener fecha actual en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split("T")[0];

    const nombreArchivo1 = `Historial_Ventas_${fechaActual}.pdf`;

    doc.text("Historial de Ventas", 14, 15);
    autoTable(doc, {
        startY: 20,
        head: [columnasPDF],
        body: filasPDF,
    });

    doc.save(nombreArchivo1);
  };
  


    return(
        <main className={styles.bodyVentas}>
            <div className={styles.headerVentas}>
                <div className={styles.titulosVentas}>
                    <h1 className={styles.tituloVentas}>Historial de ventas </h1>
                    <h3 className={styles.tituloVentas}>Total acumulado: Q{totalAcumulado.toFixed(2)} </h3>
                </div>
               
            

                <div className={styles.headerBotonesVentas}>
                    <ExportarComo
                      onChangeExcel={exportarAExcel}
                      onChangePDF={exportarAPDF}
                    ></ExportarComo>
                    
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
                      setSelectedPreDate={setSelectedPreDate}
                      selectedPreDate={selectedPreDate}

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
                    {mostrarNuevaVenta &&(
                    <ButtonHeaders text = "Nueva venta" onClick={irANuevaVenta}></ButtonHeaders>
                    )}

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
                    nameColumns = {columnas}
                    data = {sortedData}
                
                />
            </div>

            


        </main>
    )
}

export default Ventas;