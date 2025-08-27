import { faMagnifyingGlassDollar,faFilter, faGear, faUser,faArrowUpAZ,faArrowDownZA,faFilterCircleXmark, faCalendar} from '@fortawesome/free-solid-svg-icons';
import styles from "./ButtonDisplay.module.css";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ButtonDisplay = ({
    icon,
    title,
    children
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
        <>
            <div ref={filtroRef} className={styles.filtroContainer}>
                <button
                    onClick={() => setAbierto(prev => !prev)}
                    className={styles.filtroBoton}
                >
                    <FontAwesomeIcon icon={icon} className={styles.IconStyle1}/> {title}
                </button>

                {abierto && (
                    <div className={styles.filtroDropdown}>
                        {children}
                    </div>
                )}
            </div>
        </>
    )
}

export default ButtonDisplay;