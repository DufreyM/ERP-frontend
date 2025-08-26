import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilter, 
  faGear, 

  faFilterCircleXmark,
  
} from '@fortawesome/free-solid-svg-icons';
import styles from "./Filters.module.css";
import { useState, useRef, useEffect } from "react";
import InputSelects from "../Inputs/InputSelects";

const InventarioFilters = ({
  formData,
  handleChange,
  opciones,
  mostrarFiltros,
  onResetFiltros,
 ordenAscendente,
  setOrdenAscendente
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

  return (
    <div ref={filtroRef} className={styles.filtroContainer}>
      <button
        onClick={() => setAbierto(prev => !prev)}
        className={styles.filtroBoton}
      >
        <FontAwesomeIcon icon={faFilter} className={styles.IconStyle}/> Filtros
      </button>

      {abierto && (
        <div className={styles.filtroDropdown}>
          <h3 className={styles.titleFilters}>Filtros de inventario</h3>
          
          {mostrarFiltros?.tipo && (
            <InputSelects
              icono={faGear}
              placeholder="Filtrar por tipo de medicamento"
              value={formData.tipo}
              onChange={handleChange}
              name="tipo"
              opcions={opciones.tipos}
            />
          )}

       

          <h3 className={styles.titleFilters}>Ordenar datos</h3>

          <div className={styles.ordenButtons}>
           
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
  );
};

export default InventarioFilters;
