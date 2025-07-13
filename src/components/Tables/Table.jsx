
import styles from "./Table.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export const Table = ({
    nameColumns,
    data,

}) => {

  const renderCellContent = (col, item) => {
    if (col.key === 'ver') {
      return (
        <span onClick={() => window.open(item.ver, '_blank')} className={styles.IconStyle}>
          <FontAwesomeIcon icon = {faEye} className={styles.IconStyle}></FontAwesomeIcon>
        </span>
      )
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
    return <h1>No hay datos disponibles</h1>
  }

  return(
      
    <div className={styles.divTable}>
        
      <table className={styles.TableStyle}>
          <thead className={styles.theadStyle}>
              <tr> 
                  {nameColumns.map((col) =>(
                      <th key={col.key} className={styles.thStyle}>
                          {col.titulo}
                      </th>
                  ))}
              </tr>
          </thead>

          <tbody className={styles.tbodyStyle}>
              {data.map((item) => (
                  <tr key = {item.id} className={styles.rowHover}>
                      {nameColumns.map((col) => (
                          <td key = {col.key} className={styles.tdStyle}>
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