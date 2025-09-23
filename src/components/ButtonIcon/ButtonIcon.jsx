import styles from "./ButtonIcon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ButtonIcon = ({
    icon,
    title,
    onClick,
    red = false,
    solid = false,
    disabled
}) => {
    return(
        <button
            onClick={onClick}
            className={`${styles.filtroBotonIcon}  ${red ? styles.filtroBotonRojo : ''} ${solid ? styles.filtroBotonSolido : ''}`}
            disabled = {disabled}
        >
            <FontAwesomeIcon icon={icon} className={styles.IconStyle1}/> {title}
        </button>
    )

}

export default ButtonIcon;