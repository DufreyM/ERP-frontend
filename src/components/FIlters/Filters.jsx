import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassDollar,faFilter, faGear, faUser,faFilterCircleXmark, faCalendar, faDollar, faBriefcaseMedical} from '@fortawesome/free-solid-svg-icons';
import styles from "./Filters.module.css";
import { useState, useRef, useEffect } from "react";
import InputSelects from "../Inputs/InputSelects";
import InputDates from "../Inputs/InputDates";
import IconoInput from "../Inputs/InputIcono";
import ButtonDisplay from "../ButtonDisplay/ButtonDisplay";
import DatePicker from "react-datepicker";
import OptionFilter from "./OptionsFilter/OptionFilter";
import "../Inputs/datepicker-custom.css"
import LittleOptions from "./LittleOptions/LittleOptions";

const Filters = ({


    formData,
    handleChange,
    opciones,
    mostrarFiltros,
    onResetFiltros,
    


    
    

    onFechaInicioChange,
    onFechaFinChange,
    


    // mamadas que necesito:
    // Rango de fechas 
    // Tipos Usuario
       // Usuario como tal
    // Rango de precio
    // Tipo medicamento

    title = "CAMBIAR",
    mostrarRangoFecha = true,
    mostrarRangoPrecio = true,
    mostrarUsuario = true,
    mostrarMedicamento = true,

    //atributos para rango de precio
    precioMin,
    setPrecioMin,
    precioMax,
    setPrecioMax,

    //atributos para rango de fecha
    fechaInicio, 
    setFechaInicio,
    fechaFin, 
    setFechaFin,


}) => {

  //Todos los estados de abierto y cerrado de cada filtro
  const [isOpendDate, setIsOpendDate] = useState(false);
  const [isOpendRol, setIsOpendRol] = useState(false);
  const [isOpendPrice, setIsOpendPrice] = useState(false);
  const [isOpendMedic, setIsOpendMedic] = useState(false);


  const handleRangoFechaRapida = (opcion) => {
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);

  switch(opcion) {
    case "Hoy":
      setFechaInicio(new Date(hoy.setHours(0,0,0,0)));
      setFechaFin(new Date(hoy.setHours(23,59,59,999)));
      break;

    case "Ayer":
      setFechaInicio(new Date(ayer.setHours(0,0,0,0)));
      setFechaFin(new Date(ayer.setHours(23,59,59,999)));
      break;

    case "Este mes":
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      setFechaInicio(inicioMes);
      setFechaFin(finMes);
      break;

    // Agregar más casos...
    }
  };

  

  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  return(
      <>
        <ButtonDisplay
          icon={faFilter}
          title={"Filtros"}
        > 
          <h3 className={styles.titleFilters}>Filtros de {title}</h3>

          {/* Filtro de fecha */}
          {mostrarRangoFecha ? (
            

            <div>

              <OptionFilter
                icon={faCalendar}
                title={"Fecha"}
                isOpend={isOpendDate}
                changeOpen={() => setIsOpendDate(prev => !prev)}

              >

                <LittleOptions 
                  title={"Hoy"}
                  onClick={() => handleRangoFechaRapida("Hoy")}
                />
                <LittleOptions 
                  title={"Ayer"}
                  onClick={() => handleRangoFechaRapida("Ayer")}
                />
                <LittleOptions title={"Esta semana"}></LittleOptions>
                <LittleOptions title={"Semana pasada"}></LittleOptions>
                <LittleOptions 
                  title={"Este mes"}
                  onClick={() => handleRangoFechaRapida("Este mes")}
                />
                <LittleOptions title={"Mes pasado"}></LittleOptions>
                <LittleOptions title={"Este año"}></LittleOptions>
                <LittleOptions title={"Año Pasado"}></LittleOptions>
              
                <div className={styles.contenedorFiltroFechas}>

                 
                  <div className={styles.contenedorfechaCalendario}>
                    <IconoInput
                    icono = {faCalendar}
                    value={fechaInicio?.toLocaleDateString()}
                    
                    ></IconoInput>

                    

                    <DatePicker 
                      inline
                      selected={fechaInicio}
                      onChange={(date) => setFechaInicio(date)}
                      startDate={fechaInicio}
                      endDate={fechaFin}
                      selectsStart
                      calendarClassName="calendario-pequeno"
                    ></DatePicker>

                  </div>  

                  <div className={styles.contenedorfechaCalendario}>

                    <IconoInput
                      icono = {faCalendar}
                      value={fechaFin?.toLocaleDateString()}
                      ></IconoInput>


                    <DatePicker
                      inline
                      selected={fechaFin}
                      onChange={(date) => setFechaFin(date)}
                      startDate={fechaInicio}
                      endDate={fechaFin}
                      selectsEnd
                      minDate={fechaInicio}
                      calendarClassName="calendario-pequeno"
                    ></DatePicker>

                 </div>

            
                </div>
                

              </OptionFilter>

              
            </div>
          ) : <div/>}


          {/* Filtro de Usuarios y tipos de usuarios */}
          {mostrarUsuario ? (
            

            <div>

              <OptionFilter
                icon={faUser}
                title={"Usuarios y tipos de usuario"}
                isOpend={isOpendRol}
                changeOpen={() => setIsOpendRol(prev => !prev)}

              >
                <InputSelects
                  icono={faGear}
                  placeholder="Filtrado de archivos por rol"
                  value={formData.rol}
                  onChange={handleChange}
                  name="rol"
                  opcions={opciones.roles}
                />

                <InputSelects
                  icono={faUser}
                  placeholder="Filtrado de archivos por usuario"
                  value={formData.usuarios}
                  onChange={handleChange}
                  name="usuarios"
                 opcions={opciones.usuarios}
                />
                

              </OptionFilter>

              
            </div>
          ) : <div/>}


          {/* Filtro de Precio */}
          {mostrarRangoPrecio ? (
            

            <div>

              <OptionFilter
                icon={faDollar}
                title={"Precio"}
                isOpend={isOpendPrice}
                changeOpen={() => setIsOpendPrice(prev => !prev)}

              >
                <div className={styles.contenedorFiltroPrecio}>
                  <IconoInput
                    icono = {faDollar}
                    type={"number"}
                    placeholder={"Precio mínimo"}
                    value = {precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                  
                  ></IconoInput>

                  <IconoInput
                    icono = {faDollar}
                    type={"number"}
                    placeholder={"Precio maximo"}
                    value = {precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                  ></IconoInput>
                </div>
                
              

              </OptionFilter>

              
            </div>
          ) : <div/>}


          {/* Filtro de tipo de medicamento*/}
          {mostrarMedicamento ? (
            

            <div>

              <OptionFilter
                icon={faBriefcaseMedical}
                title={"Tipo de medicamento"}
                isOpend={isOpendMedic}
                changeOpen={() => setIsOpendMedic(prev => !prev)}

              >
                

              </OptionFilter>

              
            </div>
          ) : <div/>}




          {/* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}
         
            <h3 className={styles.titleFilters}>Filtros de archivos</h3>
            {mostrarFiltros?.rol && (
      
              <InputSelects
                icono={faGear}
                placeholder="Filtrado de archivos por rol"
                value={formData.rol}
                onChange={handleChange}
                name="rol"
                opcions={opciones.roles}
              />
            )}

            {mostrarFiltros?.usuario || mostrarFiltros?.usuarioID  && (
              <InputSelects
                icono={faUser}
                placeholder="Filtrado de archivos por usuario"
                value={formData.usuarios}
                onChange={handleChange}
                name="usuarios"
                opcions={opciones.usuarios}
              />
            )}

            {mostrarFiltros?.producto && (
              <InputSelects
                icono={faUser}
                placeholder="Filtrado de archivos por usuario"
                value={formData.usuarios}
                onChange={handleChange}
                name="usuarios"
                opcions={opciones.usuarios}
              />
            )}

            {mostrarRangoFecha? (
              <div>
                <h4>Filtros por fecha</h4>
                <InputDates
                  icono = {faCalendar}
                  placeholder={"Filtrar por fecha desde"}
                  selected={fechaInicio}
                  onChange={onFechaInicioChange}
                >
                </InputDates>

                <InputDates
                  icono = {faCalendar}
                  placeholder={"Filtrar por fecha hasta"}
                  selected={fechaFin}
                  onChange={onFechaFinChange}
                  minDate={fechaInicio}
                >
                </InputDates>
              </div>
            ) : <div/>
            }

            {mostrarRangoPrecio? (
              <div>
                <IconoInput
                  icono = {faMagnifyingGlassDollar}
                  placeholder={"Filtrar por fecha desde"}
                >
                </IconoInput>

                <IconoInput
                  icono = {faMagnifyingGlassDollar}
                  placeholder={"Filtrar por fecha hasta"}
                >
                </IconoInput>
              </div>
            ) : <div/>
            }

            <h3 className={styles.titleFilters}>Ordenar datos</h3>

            <div className={styles.ordenButtons}>
              
              <FontAwesomeIcon
                icon={faFilterCircleXmark}
                title="Eliminar filtros"
                onClick={onResetFiltros}
                className={styles.IconStyle}
              />
            </div>
         
        
          
        </ButtonDisplay>
        
        
      </>
  )
}

export default Filters;
