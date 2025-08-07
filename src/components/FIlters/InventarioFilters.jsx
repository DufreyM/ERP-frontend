import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilter, 
  faGear, 
  faArrowUpAZ, 
  faArrowDownZA, 
  faFilterCircleXmark,
  faSortAmountUp,
  faSortAmountDown,
  faSortAlphaDown,
  faSortAlphaUp
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

          {mostrarFiltros?.ordenPrecio && (
            <InputSelects
              icono={faSortAmountUp}
              placeholder="Ordenar por precio"
              value={formData.ordenPrecio}
              onChange={handleChange}
              name="ordenPrecio"
              opcions={opciones.ordenPrecio}
            />
          )}

          {mostrarFiltros?.ordenStock && (
            <InputSelects
              icono={faSortAmountDown}
              placeholder="Ordenar por stock"
              value={formData.ordenStock}
              onChange={handleChange}
              name="ordenStock"
              opcions={opciones.ordenStock}
            />
          )}

          <h3 className={styles.titleFilters}>Ordenar datos</h3>

          <div className={styles.ordenButtons}>
            <FontAwesomeIcon
              icon={faArrowUpAZ}
              title="Ordenar A-Z"
              onClick={() => setOrdenAscendente(true)}
              className={styles.IconStyle}
            />
            <FontAwesomeIcon
              icon={faArrowDownZA}
              title="Ordenar Z-A"
              onClick={() => setOrdenAscendente(false)}
              className={styles.IconStyle}
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
  );
};

export default InventarioFilters;
