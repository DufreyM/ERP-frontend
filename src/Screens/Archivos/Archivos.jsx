// Pantalla de Archivos. Sirve para que la administradora pueda revisar los archivos subidos por los demás roles. 
//Aun falta implementar las funciones reales que consultan a la BD, actualmente solo están comentadas como se pretende sea su funcionamiento
//Renato Rojas. 28/05/2025

import React, { useState } from "react"
import InputSelects from "../../components/Inputs/InputSelects"
import styles from "./Archivos.module.css"
import SimpleTitle from "../../components/Titles/SimpleTitle"
import { faGear,faUser } from '@fortawesome/free-solid-svg-icons';


const ArchivosScreen = () => {
  const [formData, setFormData] = useState({
      rol: "",
      usuarios: "",
      eliminado: "",
    })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  const poblarUsuarios = (labelSelect) =>{
    //request a la base de datos
    //req(labelSelect), res
    const algo = [{}]
    // algo= res.map(nombre,id)
    return algo
  }
  const handleDownload = (id) => {
    let url = ''
    switch (id) {
      case 1:
        url = 'https://drive.google.com/uc?export=download&id=1hVSDV4JfMjMc7Dt0e66rV5EYpPeX2WAW'
        break;
      case 2:
        url = 'https://drive.google.com/uc?export=download&id=1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN'
        break;
      default:
        break;
    }
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.click()
  }
  const handleWatch = (id) => {
    let url = ''
    switch (id) {
      case 1:
        url = 'https://drive.google.com/file/d/1hVSDV4JfMjMc7Dt0e66rV5EYpPeX2WAW/view?usp=sharing'
        break;
      case 2:
        url = 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing'
        break;
      default:
        break;
    }
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }
  const [showUsuarios, setShowUsuarios] = useState(false)
  const [showFiltros, setShowFiltros] = useState(false);

    return(
    <div className={styles.contenedorGeneral}>
      <SimpleTitle text={"Archivos"}></SimpleTitle>
        <div className = {styles.contenedorArchivos}>
          <div className={styles.barraSeleccion}>
            <InputSelects 
            icono={faGear} 
            placeholder={"Por rol"}
            value={formData.rol}
            onChange={handleChange}
            name="rol"
            opcions={[
              {label:"Dependienta", value:"dependienta"},
              {label:"Contador", value:"contador"},
              {label:"Química Farmacéutica", value:"quimica_farmaceutica"}
            ]}
            />
            <InputSelects 
            icono={faUser} 
            placeholder={"Usuarios"}
            value={formData.usuarios}
            onChange={handleChange}
            name="usuarios"
            opcions={
              // va a tocar hacer un select de la base de datos acá
              poblarUsuarios()
              //se debería de ver como {label:"Melisa Mendizabal", value:"id_contador"},
            }
            />
            <button className={styles.botonFiltro}>Eliminar filtros</button>
          </div>
            <table className={styles.table}>
              <tr className={styles.tr}>
                <th className={styles.th}>Archivo</th>
                <th className={styles.th}>Subido por:</th>
                <th className={styles.th}>Ver </th>
                <th className={styles.th}>Descargar</th>
                {/* Estos nombres de columnas están bien que estén quemados, porque aunque cambie la data, no van a cambiar los headers */}
              </tr>
              <tr>
                {/* Estos sí hay que hacer una función que los traiga, para poblarlos correctamente.Todos los tr vendrán de BD */}
                <td className={styles.td}>Reporte mensual</td>
                <td className={styles.td}>Melisa Mendizabal</td>
                <td className={styles.td}><button onClick={()=>handleWatch(1)}>Ver</button></td>
                <td className={styles.td}>
                  <span onClick={()=>handleDownload(1)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    ⭳
                  </span>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>Rayos X (incidente RonRon)</td>
                <td className={styles.td}>Erick Marroquín</td>
                <td className={styles.td}><button onClick={()=>handleWatch(2)}>Ver</button></td>
                <td className={styles.td}>
                  <span onClick={()=> handleDownload(2)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    ⭳
                  </span>
                </td>
              </tr>
            </table>
        </div>
      
    </div>
    )
}

export default ArchivosScreen
//1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN