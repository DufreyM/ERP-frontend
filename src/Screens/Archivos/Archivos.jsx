// Pantalla de Archivos. Sirve para que la administradora pueda revisar los archivos subidos por los demás roles. 
//Aun falta implementar las funciones reales que consultan a la BD, actualmente solo están comentadas como se pretende sea su funcionamiento
//Renato Rojas. 28/05/2025

import React, { useState, useEffect } from "react"
import { Outlet, useOutletContext } from 'react-router-dom';
import { getOptions } from '../../utils/selects';
import styles from "./Archivos.module.css"
import SimpleTitle from "../../components/Titles/SimpleTitle"
import { faGear, faUser,  faArrowDownZA, faPen, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Table } from "../../components/Tables/Table";
import Popup from '../../components/Popup/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetch } from "../../utils/useFetch";
import ButtonForm from "../../components/ButtonForm/ButtonForm";
import IconoInput from "../../components/Inputs/InputIcono";
import InputFile from "../../components/Inputs/InputFile";
import Filters from "../../components/FIlters/Filters";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders";
import InputDates from "../../components/Inputs/InputDates";


const ArchivosScreen = () => {
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1 ;
  const {data, loading, error } = useFetch(`http://localhost:3000/documentos-locales?local_id=${localSeleccionado}`);
 
  //Estados de filtros
  const [opcionsRoles, setOpcionsRoles] = useState([]);
  const [opcionsUsers, setOpcionsUsers] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  //Editar un archivo
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [file, setFile] = useState('');
  const [nameFile, setNameFile] = useState('');
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  //Nuevo archivo
  const [popupNuevo, setPopupNuevo] = useState(false);
  const openNuevo = () => setPopupNuevo(true);
  const closeNuevo = () => setPopupNuevo(false);

  //eliminar archivo
  const [advertencia, setAdvertencia] = useState(false);
  const closeAdvertencia = () => setAdvertencia(false);

  const onEditEvent = (id) => {
    console.log("Editar evento con id:", id);
    openPopup(); // si quieres usar tu popup
  };

 

  //Opciones de filtrado por Rol
  useEffect(() => {
    getOptions("http://localhost:3000/api/roles", item => ({
        value: item.id,
        label: item.nombre,
    })).then((opciones) => {
      //const data = dataExtendida;


      const rolIdEnUso = [...new Set(data.map(doc => doc.usuario?.rol_id))];
      const rolesUsados = opciones.filter(rol => rolIdEnUso.includes(rol.value));
      setOpcionsRoles(rolesUsados);

      const mapaUsuarios = new Map();

      data.forEach(doc => {
        const usuario = doc.usuario;
        if (!usuario) return;

        if (!mapaUsuarios.has(usuario.id)) {
          mapaUsuarios.set(usuario.id, {
            value: usuario.id,
            label: `${usuario.nombre} ${usuario.apellidos}`,
            rol_id: usuario.rol_id,
          });
        }
      });

      const opcionesUsuarios = Array.from(mapaUsuarios.values());
      setOpcionsUsers(opcionesUsuarios);


    });

  }, [data]);


  const columnas = [  
    { key: 'nombre', titulo: 'Nombre del archivo' },
    { key: 'usuario', titulo: 'Subido por' },
    { key: 'creacion', titulo: 'Fecha de Subido' },
    { key: 'archivo', titulo: 'Abrir' },
    { key: 'editar', titulo: 'Editar' },
    { key: 'eliminar', titulo: 'Eliminar' },
    
  ]

  const [formData, setFormData] = useState({
      rol: "",
      usuarios: "",
      eliminado: "",
    })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,

      ...(name ==="rol" && {usuarios:""})
     }));

     if (name === "rol") {
      const rolSeleccionado = parseInt(value);

      if (isNaN(rolSeleccionado)) {
        setUsuariosFiltrados(opcionsUsers); // todos los usuarios
      } else {
        const filtrados = opcionsUsers.filter(usuario => usuario.rol_id === rolSeleccionado);
        setUsuariosFiltrados(filtrados);
      }
    }
  };

  const eliminarDocumento = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/documentos-locales/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el documento');
      }

      alert('Documento eliminado con éxito');

      // Opcional: recargar los datos
      window.location.reload(); // o usa un useFetch que se pueda refrescar
    } catch (error) {
      console.error(error);
      alert('Hubo un error al eliminar el documento');
    }
  };


  
  

  //Mostrar datos
  const datosFiltrados = (data?.filter(doc => {
    const coincideRol = formData.rol ? String(doc.usuario?.rol_id) === formData.rol : true;
    const coincideUsuario = formData.usuarios ? String(doc.usuario?.id) === formData.usuarios : true;
    return coincideRol && coincideUsuario;
  }) || []).sort((a, b) => {
    const nombreA = a.nombre?.toLowerCase() || '';
    const nombreB = b.nombre?.toLowerCase() || '';
    return ordenAscendente
      ? nombreA.localeCompare(nombreB)
      : nombreB.localeCompare(nombreA);
  });

  

    return(
    <div className={styles.contenedorGeneral}>
      <div className={styles.contenedorEncabezado}>
        <div className={styles.contenedorTitle}>
          <SimpleTitle text={"Archivos"}></SimpleTitle>
        </div>
        
        <Filters
          formData={formData}
          handleChange={handleChange}
          opciones={{
            roles: opcionsRoles,
            usuarios: usuariosFiltrados
          }}
          mostrarFiltros={{
            rol: true,
            usuario: true,
          }}
          onResetFiltros={() => {
            setFormData({ rol: "", usuarios: "", eliminado: "" });
            setUsuariosFiltrados(opcionsUsers);
            setOrdenAscendente(true);
          }}

          ordenAscendente={ordenAscendente}
          setOrdenAscendente={setOrdenAscendente}
        />

        <ButtonHeaders 
          text= 'Subir +'
          onClick={openNuevo}
        />

      </div> 


        <div className = {styles.contenedorArchivos}>

          {/* Pop up para subir un archivo */}
          {<Popup 
            isOpen={popupNuevo} 
            onClose={closeNuevo}
            title={'Subir nuevo archivo'}
          
          >
            <div className={styles.modalContenido}>

                  <IconoInput
                  icono = {faPen}
                  placeholder = {"Asignar nombre visible del archivo"}
                  value = {nameFile}
                  onChange = {true}
                  type = "text"
                  
                  name = ""
                  
                  ></IconoInput>

                  <InputDates
                    icono = {faCalendar}
                    placeholder = {"Fecha de vencimiento del archivo (opcional)"}
                  ></InputDates>
               

                  <InputFile
                  icono = {faPen}
                  placeholder = {"Nombre del archivo"}
                  value = {file}
                  accept=".pdf"
                  onChange = {true}
                  
                  name = ""
                  
                  ></InputFile>
                  
                
                    
                   
                 
            </div>

          </Popup>
    
          }



            <Table
              nameColumns={columnas}
              data={datosFiltrados}
              onEliminarClick={(item) =>{ 
                setDocumentoAEliminar(item);
                setAdvertencia(true);
              }}
              
            >
            </Table>

              {/* Pop up para subir un archivo */}
          {<Popup 
            isOpen={advertencia} 
            onClose={closeAdvertencia}
            title={`¿Estas seguro de eliminar "${documentoAEliminar?.nombre}"?`}
            onClick ={() => {
              eliminarDocumento(documentoAEliminar.id);
              closeAdvertencia();
            }}
          >

          </Popup>
    
          }

          
        </div>
      
    </div>
    )
}

export default ArchivosScreen;
//1O4Oh-8YKCw7gM_7QB44hmh_PccV5N1cN