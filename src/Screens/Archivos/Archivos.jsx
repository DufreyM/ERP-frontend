// Pantalla de Archivos. Sirve para que la administradora pueda revisar los archivos subidos por los demás roles. 
//Aun falta implementar las funciones reales que consultan a la BD, actualmente solo están comentadas como se pretende sea su funcionamiento
//Renato Rojas. 28/05/2025

import React, { useState, useEffect, useMemo } from "react"
import { useOutletContext } from 'react-router-dom';
import { getOptions } from '../../utils/selects';
import styles from "./Archivos.module.css"
import SimpleTitle from "../../components/Titles/SimpleTitle"
import {  faPen, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Table } from "../../components/Tables/Table";
import Popup from '../../components/Popup/Popup';
import { useFetch } from "../../utils/useFetch";
import IconoInput from "../../components/Inputs/InputIcono";
import InputFile from "../../components/Inputs/InputFile";
import Filters from "../../components/FIlters/Filters";
import ButtonHeaders from "../../components/ButtonHeaders/ButtonHeaders";
import InputDates from "../../components/Inputs/InputDates";
import { getToken } from '../../services/authService';
import ButtonDisplay from "../../components/ButtonDisplay/ButtonDisplay";
import OrderBy from "../../components/OrderBy/OrderBy";
import { useOrderBy } from "../../hooks/useOrderBy";
import { useFiltroGeneral } from "../../hooks/useFiltroGeneral";
import { useOpcionesUsuarioDinamicos } from "../../hooks/useOpcionesUsuariosDinamico";
import FiltroResumen from "../../components/FIlters/FiltroResumen/FiltroResumen";


const ArchivosScreen = () => {
  const { selectedLocal } = useOutletContext();
  const localSeleccionado = selectedLocal + 1 ;
  const {data, loading, error } = useFetch(`http://localhost:3000/documentos-locales?local_id=${localSeleccionado}`);

   
  const token = getToken();
  const getPayloadFromToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error("Token inválido", error);
      return null;
    }
  };

  const columnas = [  
    { key: 'nombre', titulo: 'Nombre del archivo' },
    { key: 'usuario', titulo: 'Subido por' },
    { key: 'creacion', titulo: 'Fecha de Subido' },
    { key: 'archivo', titulo: 'Abrir' },
    { key: 'editar', titulo: 'Editar' },
    { key: 'eliminar', titulo: 'Eliminar' },
    
  ]



  //datos
  const [errorMessage, setErrorMessage] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState(null);
  const [archivoPDF, setArchivoPDF] = useState(null);


  //Editar un archivo
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
  const [file, setFile] = useState('');
  

  //Nuevo archivo
  const [popupNuevo, setPopupNuevo] = useState(false);
  const openNuevo = () => setPopupNuevo(true);
  const closeNuevo = () => setPopupNuevo(false);

  //eliminar archivo
  const [advertencia, setAdvertencia] = useState(false);
  const closeAdvertencia = () => setAdvertencia(false);



  const handleNombreArchivo = (e) => {
        setNombreArchivo(e.target.value);
        setErrorMessage('');
  };


  const handleFechaVencimiento = (date) => {
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setErrorMessage("No puedes seleccionar una fecha pasada.");
            return;
        }
        setErrorMessage(""); // Limpia el mensaje si todo está bien
        setFechaVencimiento(date);
    
    };


    //Nuevo archivo
    const subirDocumento = async (token, datos) => {
      const formData = new FormData();
      formData.append('nombre', datos.nombre);
      formData.append('usuario_id', datos.usuario_id);
      formData.append('local_id', datos.local_id);
      formData.append('vencimiento', datos.vencimiento);
      formData.append('archivo', datos.archivo); // es un File, no un string

      const response = await fetch('http://localhost:3000/documentos-locales', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // No pongas Content-Type, fetch lo hace con FormData automáticamente
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    };


    const handleSubirDocumento = async () => {
      setErrorMessage('');

      if (!nombreArchivo || !archivoPDF || !fechaVencimiento) {
        setErrorMessage('Por favor, completa todos los campos.');
        return;
      }

      const tokenActual = token; 
      const payload = getPayloadFromToken(tokenActual);

      if (!payload) {
        setErrorMessage('No se pudo validar el token.');
        return;
      }

      const { id: usuarioId} = payload;

      const datos = {
        nombre: nombreArchivo,
        usuario_id: usuarioId,
        local_id: localSeleccionado,
        vencimiento: fechaVencimiento.toISOString().split('T')[0],
        archivo: archivoPDF
      };
      console.log('estoy mandando:', datos);

      try {
        const respuesta = await subirDocumento(tokenActual, datos);
        console.log('Documento subido:', respuesta);

        closeNuevo(); // si tienes un popup para cerrarlo
        //setNotificacion('Documento subido con éxito');
      } catch (error) {
        console.error('Error al subir documento:', error);
        setErrorMessage('Ocurrió un error al subir el documento.');
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


  //editar un archivo

  const [archivoAEditar, setArchivoAEditar] = useState(null);
  const [editarArchivo, setEditarArchivo] = useState(false);
  const openEditarArchivo = () => setEditarArchivo(true);
  const closeEditarArchivo = () => setEditarArchivo(false);

  const handleEditarArchivo = (archivo) => {
    setArchivoAEditar(archivo);
    setNombreArchivo(archivo.nombre);
    setFechaVencimiento(new Date(archivo.vencimiento)); // Asegúrate que venga como string tipo "2025-08-04"
    setFile(archivo.archivo); // solo para mostrar el nombre
    openEditarArchivo();
  };

  const editarDocumento = async (id, datos) => {
    const response = await fetch(`http://localhost:3000/documentos-locales/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  };

  const handleGuardarEdicion = async () => {
    if (!nombreArchivo || !fechaVencimiento) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    const payload = getPayloadFromToken(token);
    if (!payload) {
      setErrorMessage('Token inválido.');
      return;
    }

    const datosEditados = {
      nombre: nombreArchivo,
      usuario_id: payload.id,
      local_id: localSeleccionado,
      vencimiento: fechaVencimiento.toISOString().split('T')[0],
    };

    try {
      await editarDocumento(archivoAEditar.id, datosEditados);
      closeEditarArchivo();
      window.location.reload(); // o actualiza tu estado si no querés recargar
    } catch (error) {
      console.error('Error al editar documento:', error);
      setErrorMessage('Ocurrió un error al editar el documento.');
    }
  };

  

  //Funciones necesarias para el funcionamiento de filter
  //Filtros
  //manejo de filtros activos
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [isOpendDate, setIsOpendDate] = useState(false);
  const [isOpendRol, setIsOpendRol] = useState(false);

  const expandFecha = () => {setIsOpendDate(prev => !prev); };
  const expandRol = () => {setIsOpendRol(prev => !prev); };
  const expandUsuario = () => {setIsOpendRol(prev => !prev); };

  const expandFechaResume = () => {setIsOpendDate(true); setPanelAbierto(true);};
  const expandPrecioResume = () => {setIsOpendPrice(true); setPanelAbierto(true);};
  const expandRolResume = () => {setIsOpendRol(true); setPanelAbierto(true);};
  const expandMedicamentoResume = () => {setIsOpendMedic(true); setPanelAbierto(true);};
  //Mostrar datos

  const [opcionsRoles, setOpcionsRoles] = useState([]);
  const [opcionsUsers, setOpcionsUsers] = useState([]);
  

  const tipoUserKeyMap = useMemo(() => ({
    ROL: "usuario.rol_id",
    USUARIO: "usuario",
  }), []);

  
  //llamo a un hook
  useOpcionesUsuarioDinamicos({
    data: data,
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



  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  
  const filterKeyMap={
    RANGO_FECHA: "creacion",
    USUARIO: "usuario.id",
    ROL: "usuario.rol_id"
    
  }



  const {dataFiltrada} = useFiltroGeneral({
    data: data, 
    filterKeyMap: filterKeyMap, 
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    usuarioId: usuarioSeleccionado,
    rolId: rolSeleccionado
  });


  //Funciones necesarias para el funcionamiento de Order By
  //Constante que almacena los nombres o key de los datos a filtrar
  const sortKeyMap={
      AZ: "nombre",
      ZA: "nombre",
      DATE_NEW: "creacion",
      DATE_OLD:"creacion"


  }

   const resetFiltros = () => {
    setFechaInicio(null);
    setFechaFin(null);
  

     setRolSeleccionado('');
      setUsuarioSeleccionado('');
      setUsuariosFiltrados(opcionsUsers);

  };

  //LLamar useOrdeyBy desde hooks/useOrderBy.js
  //se manda las claves que se utilizará en el filtrado y los datos ya filtrados
  //para que se ordene luego de filtrar.
  //sortedData es la data que se mostrará en pantalla
  //sortOption debe de ir en el componente de Ordeyby al igual que setSortOption
  const {sortedData, sortOption, setSortOption} = useOrderBy({data: dataFiltrada, sortKeyMap});
  

  return(
    <div className={styles.contenedorGeneral}>
      <div className={styles.contenedorEncabezado}>
        <div className={styles.contenedorTitle}>
          <SimpleTitle text={"Archivos"}></SimpleTitle>
        </div>

       
        
        <Filters

          title = {"Archivos"}
          panelAbierto={panelAbierto}
          setPanelAbierto={setPanelAbierto}
          mostrarRangoFecha = {true}
          mostrarRangoPrecio = {false}
          mostrarUsuario = {true}
          mostrarMedicamento = {false}

          isOpendDate = {isOpendDate}
          expandFecha = {expandFecha}
          fechaInicio = {fechaInicio}
          setFechaInicio = {setFechaInicio}
          fechaFin = {fechaFin}
          setFechaFin = {setFechaFin}

           //atributos para usuarios y roles
          isOpendRol = {isOpendRol}
          expandRol = {expandRol}
          expandUsuario = {expandUsuario}
          opcionesUsuarios = {usuariosFiltrados}
          opcionesRoles = {opcionsRoles}
          usuarioSeleccionado = {usuarioSeleccionado}
          rolSeleccionado = {rolSeleccionado}
          handleChange={handleChange}

          resetFiltros={resetFiltros}
         
        />

        <OrderBy
          FAbecedario={true}
          FExistencias={false}
          FPrecio={false}
          FFecha={true}
          selectedOption={sortOption}
          onChange={setSortOption}
        ></OrderBy>

        <ButtonHeaders 
          text= 'Subir +'
          onClick={openNuevo}
        />

      </div> 


        <div className = {styles.contenedorArchivos}>
          
          <FiltroResumen
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            usuarioSeleccionado={usuarioSeleccionadoObj}
            rolSeleccionado={rolSeleccionadoObj}

            // funciones para abrir paneles
            expandFecha={expandFechaResume}
            expandPrecio={expandPrecioResume}
            expandRol={expandRolResume}
            expandMedicamento={expandMedicamentoResume}
            //medicamentoSeleccionado={medicamentoSeleccionado}
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

       

          <div className={styles.contenedorTablaArchivos}>
            <Table
              nameColumns={columnas}
              data={sortedData}
              onEliminarClick={(item) =>{ 
                setDocumentoAEliminar(item);
                setAdvertencia(true);
              }}

              onEditarClick={(item) =>
                handleEditarArchivo(item)
              }
              
            
            />
          </div>

          
          {/* Pop up para subir un archivo */}
          {<Popup 
            isOpen={popupNuevo} 
            onClose={closeNuevo}
            title={'Subir nuevo archivo'}
            onClick={handleSubirDocumento}
          
          >
            <div className={styles.modalContenido}>

                  <IconoInput
                  icono = {faPen}
                  placeholder = {"Asignar nombre visible del archivo"}
                  value = {nombreArchivo}
                  onChange = {handleNombreArchivo}
                  type = "text"
                  error={!!errorMessage}
                  name = ""
                  
                  ></IconoInput>

                  <InputDates
                    icono = {faCalendar}
                    placeholder = {"Fecha de vencimiento del archivo (opcional)"}
                    onChange={handleFechaVencimiento}
                    selected={fechaVencimiento}
                    minDate={new Date()}
                    error={!!errorMessage}

                  ></InputDates>
               

                  <InputFile
                  icono = {faPen}
                  placeholder = {"Nombre del archivo"}
                  value = {file}
                  accept=".pdf"
                  onChange = {(file) => setArchivoPDF(file)}
                  name = ""
                  
                  ></InputFile>

                  {errorMessage && (
                        <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                    )}

                 
            </div>

          </Popup>
    
          }


          {/* Pop up para editar un archivo */}
          {<Popup 
            isOpen={editarArchivo} 
            onClose={closeEditarArchivo}
            onClick={handleGuardarEdicion}
            title={'Editar un archivo'}
          
          >
            <div className={styles.modalContenido}>

                  <IconoInput
                    icono = {faPen}
                    placeholder = {"Asignar nombre visible del archivo"}
                    value = {nombreArchivo}
                    onChange = {handleNombreArchivo}
                    type = "text"
                    error={!!errorMessage}
                    name = ""
                  
                  ></IconoInput>

                  <InputDates
                    icono = {faCalendar}
                    placeholder = {"Fecha de vencimiento del archivo (opcional)"}
                    onChange={handleFechaVencimiento}
                    selected={fechaVencimiento}
                    minDate={new Date()}
                    error={!!errorMessage}

                  ></InputDates>
              

                 
            </div>

          </Popup>
    
          }

          {/* Pop up para liminar un archivo */}
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