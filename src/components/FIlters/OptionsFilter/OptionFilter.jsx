import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight} from '@fortawesome/free-solid-svg-icons';
import styles from "./OptionFilter.module.css";


const OptionFilter = ({
 
    title,
    children,
    isOpend,
    changeOpen

}) => {
    return(

        <>
            <button onClick={changeOpen} className={styles.contenedorVisibleOptionFilter}>
                
                <div className={styles.BotonDesplegarFitltro}>
                    <FontAwesomeIcon icon={faChevronRight} className={`${styles.chevronIcon} ${isOpend ? styles.rotateDown : ''}`}/>
                </div>
                
                <p className={styles.titulosOpciones}><strong>{title}</strong></p>
            </button>
                
            

            
            <div className={`${styles.contenidoOptionFilter}  ${isOpend ? styles.contenidoOptionFilterActive : ''}`}>
                {children}
            </div>
           


             {/* <div className={styles.contenedorVisibleOptionFilter}>
                <div className={styles.tituloIconoOptionFIlter}>
                    <FontAwesomeIcon icon={icon} style={{fontSize: '20px'}}/>
                    <p><strong>{title}</strong></p>
                </div>
                <button onClick={changeOpen} className={styles.BotonDesplegarFitltro}>
                    <FontAwesomeIcon icon={faChevronDown} style={{fontSize: '20px'}}/>
                </button>
            </div>

            {isOpend ? (
                <div>
                    {children}
                </div>
            ) : <div/>} */}
            

        </>
    )
}

export default OptionFilter;