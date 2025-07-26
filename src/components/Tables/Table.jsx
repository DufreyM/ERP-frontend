
import styles from "./Table.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

export const Table = ({
    nameColumns,
    data,
    onEliminarClick,

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
        <span title = {'Editar archivo'} onClick={() => onEliminarClick?.(item)} className={styles.IconStyle}>
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

  if (!data || data.length === 0) {
    return <h2 style={{color: '#5a60A5'}}>No hay datos disponibles</h2>
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
              {data.map((item) => (
                  <tr key = {item.id} className={styles.rowHover}>
                      {nameColumns.map((col) => (
                          <td key = {col.key} 
                            className={[
                                styles.thStyle,
                                col.key === 'archivo' && styles.colArchivo,
                                col.key === 'eliminar' && styles.colIcono,
                                col.key === 'editar' && styles.colIcono,
                                col.key === 'creacion' && styles.colCreacion,
                              ].filter(Boolean).join(' ')}
                            
                          >
                              {renderCellContent(col,item)}
                          </td>
                      ))
                          
                      }
                  </tr>
              ))

              }
          </tbody>
      </table>    
    </div>
  )
}