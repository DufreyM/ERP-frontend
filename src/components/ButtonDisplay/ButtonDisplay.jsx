
import styles from "./ButtonDisplay.module.css";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ButtonDisplay = ({
    icon,
    title,
    children,
    filter,
    abierto,
    setAbierto
}) => {
    
    const filtroRef = useRef(null);
        
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtroRef.current && !filtroRef.current.contains(event.target)  && !event.target.closest('[data-portal-dropdown="true"]')) {
                setAbierto(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return(
        <>
            <div ref={filtroRef} className={styles.filtroContainer}>
                <button
                    onClick={() => setAbierto(prev => !prev)}
                    className={`${styles.filtroBoton}  ${abierto ? styles.filtroBotonActivo : ''}`}
                >
                    <FontAwesomeIcon icon={icon} className={styles.IconStyle1}/> {title}
                </button>

               
                <div className={`${styles.filtroDropdown} ${filter ? styles.filtroDropdownFiltro : ''} ${abierto ? styles.filtroDropdownActivo : ''}`}>
                    {children}
                </div>
            
            </div>
        </>
    )
}

export default ButtonDisplay;