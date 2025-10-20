import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash, faCircleMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './Table.module.css'; // (opcional, para tus estilos personalizados)
import ButtonIcon from '../ButtonIcon/ButtonIcon';
import DatePicker from 'react-datepicker';

export const TablaCompras = ({ 
  productosDisponibles,
  lineas,
  setLineas

}) => {

  const productoYaAgregado = (productoId, indexActual) => {
    return lineas.some((linea, i) => {
      return i !== indexActual && parseInt(linea.productoId) === parseInt(productoId);
    });
  };

  const productosRestantes = productosDisponibles.filter(
    (producto) =>  !productoYaAgregado(producto.id)
  );
  
  const puedeAgregarMas = productosDisponibles.some(
    (producto) =>  !productoYaAgregado(producto.id)
  );

  const agregarLinea = () => {
    if (productosRestantes.length === 0) return;

    const nuevaLinea = {
      id: Date.now(),
      productoId: '',
      nombre: '',
      cantidad: 1,
      precio_costo: 0,
      precio_venta: 0,
      lote: '',
      fecha_vencimiento: null,
      subtotal: 0
    };
    //console.log("Agregando nueva línea:", nuevaLinea);

    setLineas([
      ...lineas,
      nuevaLinea
    ]);
  };

  // Elimina una fila
  const eliminarLinea = (index) => {
    const nuevasLineas = [...lineas];
    nuevasLineas.splice(index, 1);
    setLineas(nuevasLineas);
  };


  const actualizarLinea = (index, campo, valor) => {
    const nuevasLineas = [...lineas];
    const linea = {...nuevasLineas[index]};

    if (campo === 'productoId') {
      const idNumerico = parseInt(valor);
      if (isNaN(idNumerico)) {
        linea.productoId = '';
        linea.nombre = '';
      } else {
        const producto = productosDisponibles.find(p => p.id === idNumerico);
        if (producto) {
          linea.productoId = producto.id;
          linea.nombre = producto.nombre;
          linea.precio_costo = producto.preciocosto || linea.precio_costo;
          linea.precio_venta = producto.precioventa || linea.precio_venta;
        }
      }
    } else {
      linea[campo] = valor;
    }

    const cantidad = parseFloat(linea.cantidad) || 0;
    const precioCosto = parseFloat(linea.precio_costo) || 0;
    linea.subtotal = cantidad * precioCosto;

    nuevasLineas[index] = linea;
    setLineas(nuevasLineas);
  };



  const handleChangeProducto = (index, value) => {
    const idNumerico = parseInt(value);
    const productoSeleccionado = productosDisponibles.find(p => p.id === idNumerico);
    if (productoSeleccionado) {
      //console.log("Seleccionado (en onChange):", productoSeleccionado.nombre);
      // Actualizá la línea en una sola pasada para evitar problemas de estado
      setLineas(prev => prev.map((l, idx) => {
        if (idx !== index) return l;
        const cantidad = parseFloat(l.cantidad) || 1;
        const precio_costo = productoSeleccionado.preciocosto || 0;
        return {
          ...l,
          productoId: productoSeleccionado.id,    // numérico en el objeto
          nombre: productoSeleccionado.nombre,
          precio_costo,
          precio_venta: productoSeleccionado.precioventa || 0,
          subtotal: cantidad * precio_costo
        };
      }));
    }
  };

  const totalFactura = lineas.reduce((acc, linea) => acc + linea.subtotal, 0);

  return (
    <div className={styles.divTable}>
      

      <div className={styles.total}>
        <strong className={styles.totalText}>Total de compra: Q{totalFactura.toFixed(2)}</strong>
        <ButtonIcon 
          solid = {true}
          icon = {faPlus}
          title={'Agregar producto'}
          onClick={agregarLinea}
          disabled={!puedeAgregarMas}

        ></ButtonIcon>
      </div>

      {productosRestantes.length === 0 && (
      
        <p className={styles.errorTexto}>
          Ya se han agregado todos los productos disponibles.
        </p>
      )}
      
      
      <table className={`${styles.TableStyle} ${styles.TablaCompras}`}>
        <thead className={styles.theadStyleFactura}>
          <tr className={styles.thStyleFactura}>
            <th>No</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Lote</th>
            <th>Fecha de vencimiento</th>
            <th>Precio de costo(Q)</th>
            <th>Precio de venta (Q)</th>
            <th>Subtotal (costo)</th>
            <th>Eliminar</th>
          </tr>
        </thead>


       <tbody className={styles.tbodyStyle}>
        {lineas.map((linea, i) => (
          <tr key={linea.id}>
            <td>{i + 1}</td>

            {/* Producto */}
            <td className={styles.thStyle}>
                            
              <select
                value={String(linea.productoId || '')} // forzamos string
                onChange={(e) => {
                  //console.log('Seleccionado (en onChange):', e.target.value);
                  handleChangeProducto(i, e.target.value);
                }}
              >
                <option value="">Seleccionar</option>
                {productosDisponibles.map((producto) => {
                  const yaUsado = productoYaAgregado(producto.id, i) && producto.id !== parseInt(linea.productoId);
                  const deshabilitado = yaUsado;
                  return (
                    <option
                      key={producto.id}
                      value={String(producto.id)} // value string
                      disabled={deshabilitado}
                    >
                      {producto.nombre}
                    </option>
                  );
                })}
              </select>

            </td>

            {/* Cantidad */}
            <td>
              <input
                className={styles.InputTableFactura}
                type="number"
                min="1"
                value={linea.cantidad === 0 ? "" : linea.cantidad}
                  onChange={(e) => actualizarLinea(i, 'cantidad', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value === "" || parseInt(e.target.value) < 1) {
                      actualizarLinea(i, 'cantidad', 1); // Valor por defecto
                    }
                }}
              />
            </td>

            {/* Lote */}
            <td>
              <input
                className={styles.InputTableFactura}
                type="text"
                placeholder="Lote"
                value={linea.lote || ''}
                onChange={(e) => actualizarLinea(i, 'lote', e.target.value)}
              />
            </td>

            <td>
            
              <DatePicker
                selected={linea.fecha_vencimiento}
                onChange={(date) => actualizarLinea(i, 'fecha_vencimiento', date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Fecha"
                className={`${styles.InputTableFactura2} ${styles.fechaInput}`} // usa tu clase existente para mantener estilos
              />
            </td>

            {/* Precio costo */}
            <td>
              <input
                className={styles.InputTableFactura}
                type="number"
                min="0.01"
                value={linea.precio_costo}
                onChange={(e) => actualizarLinea(i, 'precio_costo', e.target.value)}
              />
            </td>

            {/* Precio venta */}
            <td>
              <input
                className={styles.InputTableFactura}
                type="number"
                min="0.01"
                value={linea.precio_venta}
                onChange={(e) => actualizarLinea(i, 'precio_venta', e.target.value)}
              />
            </td>

            {/* Subtotal (costo) */}
            <td>Q{(linea.subtotal || 0).toFixed(2)}</td>

            {/* Eliminar */}
            <td>
              <button onClick={() => eliminarLinea(i)} className={styles.buttonDeleteTable}>
                <FontAwesomeIcon icon={faTrash} className={styles.IconStyle2} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>

      </table>

      

      
    </div>
  );
};
