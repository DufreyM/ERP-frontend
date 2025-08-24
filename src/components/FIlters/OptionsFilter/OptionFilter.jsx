import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import styles from "./OptionFilter.module.css";

const OptionFilter = ({
    icon,
    title,
    children,
    isOpend,
    changeOpen



}) => {
    return(

        <>
            <div className={styles.contenedorVisibleOptionFilter}>
                <div className={styles.tituloIconoOptionFIlter}>
                    <FontAwesomeIcon icon={icon} />
                    <p>{title}</p>
                </div>
                <button onClick={changeOpen}>
                    <FontAwesomeIcon icon={faChevronDown} />
                </button>
            </div>

            {isOpend ? (
                <div>
                    {children}
                </div>
            ) : <div/>}
            

        </>
    )
}

export default OptionFilter;