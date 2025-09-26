import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash, faCircleMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './Table.module.css'; // (opcional, para tus estilos personalizados)
import ButtonIcon from '../ButtonIcon/ButtonIcon';

export const TablaCompras = ({ 
  productosDisponibles,
  lineas,
  setLineas

}) => {
  
  const productoYaAgregado = (productoId) => {
    return lineas.some(linea => parseInt(linea.productoId) === parseInt(productoId));
  };

  const productosRestantes = productosDisponibles.filter(
    (producto) =>  !productoYaAgregado(producto.id)
  );
  
  const puedeAgregarMas = productosDisponibles.some(
    (producto) =>  !productoYaAgregado(producto.id)
  );

  const agregarLinea = () => {
    if (productosRestantes.length === 0) return;

    setLineas([
      ...lineas,
      {
        id: Date.now(),
        productoId: '',
        nombre: '',
        cantidad: 1,
        precio_unitario: 0,
        descuento: 0,
        subtotal: 0
      }
    ]);
  };



  // Elimina una fila
  const eliminarLinea = (index) => {
    const nuevasLineas = [...lineas];
    nuevasLineas.splice(index, 1);
    setLineas(nuevasLineas);
  };

  // Actualiza valores al cambiar inputs
  const actualizarLinea = (index, campo, valor) => {
  const nuevasLineas = [...lineas];
  const linea = nuevasLineas[index];

  if (campo === 'productoId') {
    const producto = productosDisponibles.find(p => p.id === parseInt(valor));
    if (producto) {
      linea.productoId = producto.id;
      linea.nombre = producto.nombre;
      linea.precio_unitario = producto.precio;
      linea.stock_actual = producto.stock_actual; // Guardamos stock en la línea
    }
  } else if (campo === 'cantidad') {
    const cantidad = parseInt(valor) || 1;
    const maxStock = parseInt(linea.stock_actual) || Infinity;
    linea.cantidad = Math.min(cantidad, maxStock); // Limita la cantidad
  } else {
    linea[campo] = valor;
  }

  // Cálculo del subtotal
  const cantidad = parseFloat(linea.cantidad) || 0;
  const precio = parseFloat(linea.precio_unitario) || 0;
  const descuento = parseFloat(linea.descuento) || 0;
  const subtotal = (cantidad * precio) - descuento;
  linea.subtotal = subtotal;

  setLineas(nuevasLineas);
};

 

  


  const totalFactura = lineas.reduce((acc, linea) => acc + linea.subtotal, 0);

  return (
    <div className={styles.divTable}>
      

      <div className={styles.total}>
        <strong className={styles.totalText}>Total de venta: Q{totalFactura.toFixed(2)}</strong>
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
      
      
      <table className={`${styles.TableStyle} ${styles.TablaVentas}`}>
        <thead className={styles.theadStyleFactura}>
          <tr className={styles.thStyleFactura}>
            <th>No</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Descuento (Q)</th>
            <th>IVA (12%)</th>
            <th>Subtotal</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody className={styles.tbodyStyle}>
          {lineas.map((linea, i) => (
            <tr key={linea.id}>
              <td>{i + 1}</td>

              <td  className={styles.thStyle}>
                <select
                  value={linea.productoId}
                  onChange={(e) => actualizarLinea(i, 'productoId', e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  {productosDisponibles.map((producto) => {
                    const yaUsado = productoYaAgregado(producto.id) && producto.id !== parseInt(linea.productoId);
                   
                    const deshabilitado = (yaUsado) && producto.id !== parseInt(linea.productoId);

                    return (
                      <option
                        key={producto.id}
                        value={producto.id}
                        disabled={deshabilitado}
                      >
                        {producto.nombre}
                      </option>
                    );
                  })}

                </select>
              </td>
              <td>
                {/**Input de cantidad */}

                <div className={styles.inputCantidadWrapper}>
                  <button
                    type="button"
                    onClick={() => actualizarLinea(i, 'cantidad', Math.max(1, parseInt(linea.cantidad) - 1))}
                    className={styles.botonCantidadFacturaVenta}
                  >
                    <FontAwesomeIcon 
                      icon={faCircleMinus}
                      className={styles.IconPlusMin}
                    ></FontAwesomeIcon>
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={linea.cantidad}
                    onChange={(e) => actualizarLinea(i, 'cantidad', e.target.value)}
                    className={styles.InputTableFactura}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const maxStock = parseInt(linea.stock_actual) || Infinity;
                      const nuevaCantidad = Math.min(parseInt(linea.cantidad) + 1, maxStock);
                      actualizarLinea(i, 'cantidad', nuevaCantidad);
                    }}
                    className={styles.botonCantidadFacturaVenta}
                  >

                    
                    <FontAwesomeIcon 
                      icon={faCirclePlus}
                      className={styles.IconPlusMin}
                    ></FontAwesomeIcon>
                  </button>
      
                </div>
                {linea.cantidad >= linea.stock_actual && (
                      <small style={{ color: "red" }}>Stock máximo alcanzado</small>
                    )}
              </td>
              
              <td>Q{parseFloat(linea.precio_unitario).toFixed(2)}</td>
              <td>
                <input
                  className={styles.InputTableFactura}
                  type="number"
                  min="0"
                  max="100"
                  value={linea.descuento}
                  onChange={(e) => actualizarLinea(i, 'descuento', e.target.value)}
                />
              </td>

              <td>
                  Q{(
                    parseFloat(linea.precio_unitario) -
                    parseFloat(linea.precio_unitario) / 1.12
                  ).toFixed(2)}
                </td>
                              
              <td>Q{linea.subtotal.toFixed(2)}</td>
              <td >
                <button onClick={() => eliminarLinea(i)}
                className={styles.buttonDeleteTable}
                  >
                  <FontAwesomeIcon 
                    icon={faTrash}
                    className={styles.IconStyle2}
                  ></FontAwesomeIcon>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

      
    </div>
  );
};
