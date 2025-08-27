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

    //atributos para usuarios y roles
    opcionesUsuarios,
    opcionesRoles,
    usuarioSeleccionado,
    rolSeleccionado, 
    handleChange,

    //atributos para tipo medicamento
    opcionesTipoMedicamento,
    medicamentoSeleccionado,
    handleChangeMedicamento

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

  const primerDiaSemana = new Date(hoy);
  primerDiaSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo

  const ultimoDiaSemana = new Date(primerDiaSemana);
  ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);

  switch(opcion) {
    case "Hoy":
      setFechaInicio(new Date(hoy.setHours(0,0,0,0)));
      setFechaFin(new Date(hoy.setHours(23,59,59,999)));
      break;

    case "Ayer":
      setFechaInicio(new Date(ayer.setHours(0,0,0,0)));
      setFechaFin(new Date(ayer.setHours(23,59,59,999)));
      break;

    case "Esta semana":
      setFechaInicio(new Date(primerDiaSemana.setHours(0, 0, 0, 0)));
      setFechaFin(new Date(ultimoDiaSemana.setHours(23, 59, 59, 999)));
      break;

    case "Semana pasada":
      const inicioSemanaPasada = new Date(primerDiaSemana);
      inicioSemanaPasada.setDate(primerDiaSemana.getDate() - 7);
      const finSemanaPasada = new Date(ultimoDiaSemana);
      finSemanaPasada.setDate(ultimoDiaSemana.getDate() - 7);
      setFechaInicio(new Date(inicioSemanaPasada.setHours(0, 0, 0, 0)));
      setFechaFin(new Date(finSemanaPasada.setHours(23, 59, 59, 999)));
      break;

    case "Este mes":
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      setFechaInicio(inicioMes);
      setFechaFin(finMes);
      break;

    case "Mes pasado":
      const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      const finMesPasado = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      setFechaInicio(new Date(inicioMesPasado.setHours(0, 0, 0, 0)));
      setFechaFin(new Date(finMesPasado.setHours(23, 59, 59, 999)));
      break;

    case "Este año":
      const inicioAno = new Date(hoy.getFullYear(), 0, 1);
      const finAno = new Date(hoy.getFullYear(), 11, 31);
      setFechaInicio(new Date(inicioAno.setHours(0, 0, 0, 0)));
      setFechaFin(new Date(finAno.setHours(23, 59, 59, 999)));
      break;

    case "Año pasado":
      const inicioAnoPasado = new Date(hoy.getFullYear() - 1, 0, 1);
      const finAnoPasado = new Date(hoy.getFullYear() - 1, 11, 31);
      setFechaInicio(new Date(inicioAnoPasado.setHours(0, 0, 0, 0)));
      setFechaFin(new Date(finAnoPasado.setHours(23, 59, 59, 999)));
      break;

    // Agregar más casos...
    }
  };

  const handleInputFecha = (valor) => {
  const partes = valor.split(/[\/\-]/); // admite formatos con / o -
  if (partes.length === 3) {
    // Ajusta el orden según el formato de fecha que estés usando
    const [dia, mes, anio] = partes.map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    // Validación básica para evitar fechas inválidas
    if (!isNaN(fecha.getTime())) {
      setFechaInicio(fecha);
    }
  }
};




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
                <LittleOptions 
                  title={"Esta semana"}
                  onClick={() => handleRangoFechaRapida("Esta semana")}
                />
                <LittleOptions 
                  title={"Semana pasada"}
                  onClick={() => handleRangoFechaRapida("Semana pasada")}
                />
                <LittleOptions 
                  title={"Este mes"}
                  onClick={() => handleRangoFechaRapida("Este mes")}
                />
                <LittleOptions 
                  title={"Mes pasado"}
                  onClick={() => handleRangoFechaRapida("Mes pasado")}
                />

                <LittleOptions 
                  title={"Este año"}
                  onClick={() => handleRangoFechaRapida("Este año")}
                />
                <LittleOptions 
                  title={"Año pasado"}
                  onClick={() => handleRangoFechaRapida("Año pasado")}
                />
           
              
                <div className={styles.contenedorFiltroFechas}>

                 
                  <div className={styles.contenedorfechaCalendario}>
                    <IconoInput
                      icono = {faCalendar}
                      value={fechaInicio ? fechaInicio.toLocaleDateString() : ""}
                      onChange={(e) => handleInputFecha(e.target.value)}
                    
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
                      value={fechaFin ? fechaFin.toLocaleDateString() : ""}
                      onChange={(e) => handleInputFecha(e.target.value)}
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
                  value={rolSeleccionado}
                  onChange={handleChange}
                  name="rol"
                  opcions={opcionesRoles}
                />

                <InputSelects
                  icono={faUser}
                  placeholder="Filtrado de archivos por usuario"
                  value={usuarioSeleccionado}
                  onChange={handleChange}
                  name="usuarios"
                 opcions={opcionesUsuarios}
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
                 <InputSelects
                  icono={faGear}
                  placeholder="Filtrar por tipo de medicamento"
                  value={medicamentoSeleccionado}
                  onChange={handleChangeMedicamento}
                  name="tipo"
                  opcions={opcionesTipoMedicamento}
                />
                

              </OptionFilter>

              
            </div>
          ) : <div/>}




          {/* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}
         
          
         

            <h3 className={styles.titleFilters}>Ordenar datos</h3>

            {/* <div className={styles.ordenButtons}>
              
              <FontAwesomeIcon
                icon={faFilterCircleXmark}
                title="Eliminar filtros"
                onClick={onResetFiltros}
                className={styles.IconStyle}
              />
            </div> */}
         
        
          
        </ButtonDisplay>
        
        
      </>
  )
}

export default Filters;
