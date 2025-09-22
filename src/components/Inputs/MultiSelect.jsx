import { useState, useRef, useEffect } from "react";
import styles from "./InputIcono.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

import { createPortal } from "react-dom";
import IconoInput from "./InputIcono";


const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Selecciona una o más opciones...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyles, setDropdownStyles] = useState({});
  const containerRef = useRef(null);

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

  // Reposiciona dropdown al abrir
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

  const toggleOption = (option) => {
    const alreadySelected = value.find((v) => v.value === option.value);
    console.log("Toggle option:", option, "Already selected:", !!alreadySelected);
    if (alreadySelected) {
      onChange(value.filter((v) => v.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option) => {
    onChange(value.filter((v) => v.value !== option.value));
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(search.toLowerCase()) &&
      !value.find((v) => v.value === option.value)
  );

  return (
    <>
      <div className={styles.multiSelectContainer} ref={containerRef}>

        <div className={styles.opcionesMulti}>
            {value.map((v) => (
                <span className={styles.chip} key={v.value}>
                {v.label}
                <button
                    type="button"
                    className={styles.removeChip}
                    onClick={(e) => {
                    e.stopPropagation();
                    removeOption(v);
                    }}
                >
                    ×
                </button>
                </span>
            ))}
        </div>
        <div onClick={() => setIsOpen((prev) => !prev)}>
          

          <IconoInput
            icono={faSearch}
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className={styles.searchInput}

          >

          </IconoInput>

        </div>
      </div>

      {isOpen &&
        createPortal(
            <div
                className={`${styles.dropdown}`}
                style={dropdownStyles}
                data-portal-dropdown="true"
            >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={styles.option}
                  onClick={() => toggleOption(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No hay resultados</div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default MultiSelect;
