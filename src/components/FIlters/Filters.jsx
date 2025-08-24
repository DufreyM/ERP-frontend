import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassDollar,faFilter, faGear, faUser,faArrowUpAZ,faArrowDownZA,faFilterCircleXmark, faCalendar, faDollar, faBriefcaseMedical} from '@fortawesome/free-solid-svg-icons';
import styles from "./Filters.module.css";
import { useState, useRef, useEffect } from "react";
import InputSelects from "../Inputs/InputSelects";
import InputDates from "../Inputs/InputDates";
import IconoInput from "../Inputs/InputIcono";
import ButtonDisplay from "../ButtonDisplay/ButtonDisplay";
import DatePicker from "react-datepicker";
import OptionFilter from "./OptionsFilter/OptionFilter";

const Filters = ({


    formData,
    handleChange,
    opciones,
    mostrarFiltros,
    onResetFiltros,
    ordenAscendente,
    setOrdenAscendente,


    
    

    onFechaInicioChange,
    onFechaFinChange,
    fechaInicio,
    fechaFin,


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


}) => {

  //Todos los estados de abierto y cerrado de cada filtro
  const [isOpendDate, setIsOpendDate] = useState(false);
  const [isOpendRol, setIsOpendRol] = useState(false);
  const [isOpendPrice, setIsOpendPrice] = useState(false);
  const [isOpendMedic, setIsOpendMedic] = useState(false);


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
                <p>Fecha elegida: {fechaSeleccionada?.toLocaleDateString()}</p>

                <DatePicker inline
                  selected={fechaSeleccionada}
                  onChange={(date) => setFechaSeleccionada(date)}
                ></DatePicker>

                <DatePicker inline></DatePicker>

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
                icon={faArrowUpAZ}
                title="Ordenar A-Z"
                onClick={() => setOrdenAscendente(true)}
                className={`${styles.IconStyle} ${ordenAscendente ? styles.activo : ''}`}
              />
              <FontAwesomeIcon
                icon={faArrowDownZA}
                title="Ordenar Z-A"
                onClick={() => setOrdenAscendente(false)}
                className={`${styles.IconStyle} ${!ordenAscendente ? styles.activo : ''}`}
              />
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
