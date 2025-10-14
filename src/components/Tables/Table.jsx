/*Table
Es una tabla dinámica reutilizable que permite mostrar datos con diferentes columnas y acciones específicas (editar, eliminar, ver PDF, descargar).
Generalmente se utiliza para mostrar listas de documentos u objetos con múltiples propiedades.
El estilo se encuentra en el archivo Table.module.css.
Depende de los siguientes archivos y librerías:
  - FontAwesomeIcon (para íconos)
  - Table.module.css (estilos personalizados)
  - faFile, faTrash, faPen (íconos de FontAwesome)
Atributos:
  - nameColumns: Array con los nombres y claves de las columnas a mostrar.
  - data: Array de objetos que representan las filas de la tabla.
  - onEliminarClick: Función que se ejecuta al hacer clic en el ícono de eliminar.
  - onEditarClick: Función que se ejecuta al hacer clic en el ícono de editar.
Autor: Melisa 
Última modificación: 24/9/2025 
*/

import styles from "./Table.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faTrash, faPen, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export const Table = ({
    nameColumns,
    data,
    onEliminarClick,
    onEditarClick

}) => {
  //funcion para validar la fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  //acciones especificas
  const renderCellContent = (col, item) => {
    const valor = item[col.key];

    if (col.key === 'precio_unitario' || col.key === 'descuento' || col.key === 'total') {
      // Mostrar dinero con 2 decimales
      return Number(valor).toFixed(2);
    }

    if (col.key === 'archivo') {
      return (
        <span  title = {'Ver Archivo'} onClick={() => window.open(item.archivo, '_blank')} className={styles.IconStyle}>
          <FontAwesomeIcon icon = {faFile} />
          <p className={styles.pTable}>PDF</p>
        </span>

      )
    }

    if (col.key === 'editar') {
      return (
        <span title = {'Editar archivo'} onClick={() => onEditarClick?.(item)} className={styles.IconStyle}>
          <FontAwesomeIcon icon = {faPen} ></FontAwesomeIcon>
        </span>
      )
    }

    if (col.key === 'eliminar') {
      return (
        <span title = {'Eliminar archivo'} onClick={() => onEliminarClick(item)} className={styles.IconStyle}>
          <FontAwesomeIcon icon = {faTrash} className={styles.IconStyle2}></FontAwesomeIcon>
        </span>
      )
    }


    if (col.key === 'creacion') {
      return formatearFecha(item.creacion);
    }

    if (col.key === 'usuario') {
      return `${item.usuario?.nombre} ${item.usuario?.apellidos}`;
    }

    if (col.key === 'descargar') {
      return (
        <span
          onClick={() => window.open(item.descargar, '_blank')}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          ⭳
        </span>
      )
    }

    return item[col.key] || '' // valor genérico
  }

  

  return(
      
    <div className={styles.divTable}>
        
      <table className={styles.TableStyle}>
          <thead className={styles.theadStyle}>
              <tr> 
                  {nameColumns.map((col) =>(
                      <th key={col.key} 
                        className={[
                          styles.thStyle,
                          col.key === 'archivo' && styles.colArchivo,
                          col.key === 'eliminar' && styles.colIcono,
                          col.key === 'editar' && styles.colIcono,
                          col.key === 'creacion' && styles.colCreacion,
                        ].filter(Boolean).join(' ')}
                      >

                          {col.titulo}
                      </th>
                  ))}
              </tr>
          </thead>

          <tbody className={styles.tbodyStyle}>
            {data.length === 0 ? (
                <tr >
                  

                  <td colSpan={nameColumns.length} className={styles.emptyRow}>
                    <div className={styles.emptyRowContent}>
                      <span className={styles.IconError}>
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                      </span>
                      No hay datos disponibles por el momento
                    </div>
                  </td>
                </tr>
              ) : (
              
              data.map((item) => (
                  <tr key = {`${item.id}-${item.producto}`} className={styles.rowHover}>
                      {nameColumns.map((col) => (
                          <td key = {col.key} 
                            className={[
                          
                                col.type === 'numero' && styles.configuracionNumeros,
                                col.type === 'texto' && styles.configuracionTexto,
                                col.key === 'archivo' && styles.colArchivo,
                                col.key === 'eliminar' && styles.colIcono,
                                col.key === 'editar' && styles.colIcono,
                                col.key === 'creacion' && styles.colCreacion,
                                styles.thStyle,
                              ].filter(Boolean).join(' ')}
                            
                          >
                              {renderCellContent(col,item)}
                          </td>
                      ))
                          
                      }
                  </tr>
              ))

              )}
          </tbody>
      </table>    
    </div>
  )
}