// Pantalla de Archivos. Sirve para que la administradora pueda revisar los archivos subidos por los demás roles. 
//Aun falta implementar las funciones reales que consultan a la BD, actualmente solo están comentadas como se pretende sea su funcionamiento
//Renato Rojas. 28/05/2025

import React, { useState } from "react"
import InputSelects from "../../components/Inputs/InputSelects"
import styles from "./Archivos.module.css"
import SimpleTitle from "../../components/Titles/SimpleTitle"
import { faGear, faUser, faFilterCircleXmark, faArrowUpAZ, faArrowDownZA } from '@fortawesome/free-solid-svg-icons';
import { Table } from "../../components/Tables/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ArchivosScreen = () => {
  const columnas = [
    { key: 'archivo', titulo: 'Archivo' },
    { key: 'autor', titulo: 'Subido por' },
    { key: 'fecha', titulo: 'Fecha' },
    { key: 'ver', titulo: 'Vizualizar Archivo' },
    
  ]

  const datos = [
     {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1hVSDV4JfMjMc7Dt0e66rV5EYpPeX2WAW/view?usp=sharing',
   
    },

    {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing',

    },
    {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing',

    },
    {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing',

    },
    {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing',

    },
    {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing',

    },
    {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing',

    },
    {
      archivo: 'informe1.pdf',
      autor: 'Melisa Mendizábal',
      fecha: '2/07/2025',
      ver: 'https://drive.google.com/file/d/1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN/view?usp=sharing',

    },
    
  ]

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

            <div className={styles.IconsFilters}>
              <FontAwesomeIcon icon={faArrowUpAZ} className= {styles.IconStyle}></FontAwesomeIcon>
              <FontAwesomeIcon icon={faArrowDownZA} className= {styles.IconStyle}></FontAwesomeIcon>
              <FontAwesomeIcon icon={faFilterCircleXmark} className= {styles.IconStyle}></FontAwesomeIcon>
            </div>
            
          
          
          </div>
            

            

            <Table
              nameColumns={columnas}
              data={datos}
            >
            </Table>
          
        </div>
      
    </div>
    )
}

export default ArchivosScreen;
//1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN