import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from '../Tables/Table.module.css';

const SelectSearchCV = ({
  options = [],
  value,
  onChange,
  placeholder = "Selecciona una opción",
  getOptionLabel = (opt) => opt.label,
  getOptionValue = (opt) => opt.value,
  getOptionDisabled = () => false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyles, setDropdownStyles] = useState({});
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => getOptionValue(opt) === String(value));

  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(search.toLowerCase())
  );

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
    onChange(getOptionValue(option));
    setSearch("");
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={styles.selectCVContainer}
        ref={containerRef}
        onClick={() => !disabled && setIsOpen(true)}
        style={{ cursor: disabled ? "not-allowed" : "pointer", position: "relative" }}
      >
        
        <input
          type="text"
          className={styles.selectCVInput}
          placeholder={placeholder}
          value={isOpen ? search : selectedOption ? getOptionLabel(selectedOption) : ""}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        />
      </div>

      {isOpen &&
        createPortal(
          <div className={styles.selectCVDropdown} style={dropdownStyles} data-portal-dropdown="true">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isDisabled = getOptionDisabled(opt);
                return (
                  <div
                    key={getOptionValue(opt)}
                    className={`${styles.selectCVOption} ${isDisabled ? styles.disabled : ""}`}
                    onClick={() => !isDisabled && handleSelect(opt)}
                  >
                    {getOptionLabel(opt)}
                  </div>
                );
              })
            ) : (
              <div className={styles.noOptions}>No se encontraron resultados</div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default SelectSearchCV;
