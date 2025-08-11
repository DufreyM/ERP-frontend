import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassDollar,faFilter, faGear, faUser,faArrowUpAZ,faArrowDownZA,faFilterCircleXmark, faCalendar} from '@fortawesome/free-solid-svg-icons';
import styles from "./Filters.module.css";
import { useState, useRef, useEffect } from "react";
import InputSelects from "../Inputs/InputSelects";
import InputDates from "../Inputs/InputDates";
import IconoInput from "../Inputs/InputIcono";

const Filters = ({
    formData,
    handleChange,
    opciones,
    mostrarFiltros,
    onResetFiltros,
    ordenAscendente,
    setOrdenAscendente,


    mostrarRangoFecha = false,
    mostrarRangoMonto = false,
    onFechaInicioChange,
    onFechaFinChange,
    fechaInicio,
    fechaFin

}) => {
    const [abierto, setAbierto] = useState(false);
    const filtroRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtroRef.current && !filtroRef.current.contains(event.target)) {
            setAbierto(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <div ref={filtroRef} className={styles.filtroContainer}>
            <button
                onClick={() => setAbierto(prev => !prev)}
                className={styles.filtroBoton}
            >
                <FontAwesomeIcon icon={faFilter} className={styles.IconStyle1}/> Filtros
            </button>

      {abierto && (
        
        <div className={styles.filtroDropdown}>
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

          {mostrarRangoMonto? (
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
        </div>
      )}
    </div>
    )

}

export default Filters;
