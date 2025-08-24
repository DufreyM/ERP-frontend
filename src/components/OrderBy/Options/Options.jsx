import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Options.module.css"


const Options = ({
    icon,
    text

}) => {
    return (
        <div className= {styles.contenedorOptions}>
             <FontAwesomeIcon icon={icon} className={styles.IconStyle1}/>
             <p>{text}</p>
        
        </div>
    )
}

export default Options;