import { NavLink } from "react-router-dom";
import styles from "./ButtonsNavbar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ButtonsNavbar = ({
    icono,
    text,
    to
   
}) => {
    return (
        <NavLink 
            to= {to} 
            end
            className={({isActive}) =>
                isActive
                ? `${styles.contentButtonNavbar} ${styles.activeButtonNavbar}` :
                styles.contentButtonNavbar}
        >
            <FontAwesomeIcon icon={icono} 
            className={styles.spanNavbarButton}/>
            <p className={styles.textNavbarButton}>{text}</p>
        </NavLink>
    )
}
