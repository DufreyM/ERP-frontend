import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from './InputIcono.module.css';


const SelectSearch = ({
  options = [],
  value,
  onChange,
  placeholder = "Selecciona una opción",
  icono,
  error = false,
  disabled = false,
  popup = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyles, setDropdownStyles] = useState({});
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Cierra al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInDropdown = e.target.closest('[data-portal-dropdown="true"]');
      const clickedInContainer = containerRef.current?.contains(e.target);

      if (!clickedInContainer && !clickedInDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calcula posición del dropdown
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyles({
        position: "absolute",
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option.value);
    setSearch(""); // limpia búsqueda
    setIsOpen(false); // cierra dropdown
  };

  return (
    <>
      <div
        className={`${styles.contenedorInput} ${error ? styles.errorInput : ""}`}
        ref={containerRef}
        onClick={() => !disabled && setIsOpen(true)}
        style={{ position: "relative", cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <input
          type="text"
          className={styles.inputStyle}
          placeholder={placeholder}
          value={isOpen ? search : selectedOption?.label || ""}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          readOnly={disabled}
          //D???
          style={{
            paddingRight: icono ? '60px' : '40px'
          }}
        />

        {/* Íconos */}
        <div>
          {icono && (
            //Daniela no me muevas lstyles.iconoStylesos styles 
            <span className={popup ? styles.iconoPopupStyle : styles.iconoStyle}>
           
              <FontAwesomeIcon icon={icono} style={{ color: error ? "red" : "#5a60a5" }} />
            </span>
          )}
          <span className={styles.iconoSelects}>
            <FontAwesomeIcon icon={faChevronDown} style={{ color: "#5a60a5" }} />
          </span>
        </div>
      </div>

      {/* Dropdown renderizado en portal */}
      {isOpen &&
        createPortal(
          <div
            className={styles.dropdown}
            style={dropdownStyles}
            data-portal-dropdown="true"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={styles.option}
                  style={{
                    padding: "8px 10px",
                    cursor: "pointer",
                    backgroundColor: opt.value === value ? "#e6e6f7" : "transparent",
                  }}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No se encontraron resultados</div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default SelectSearch;
