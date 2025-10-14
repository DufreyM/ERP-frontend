import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Options.module.css"


const Options = ({
    icon,
    text,
    onChange,
    selected,
    value

}) => {

    const handleClick = () => {
        onChange(value);
    };

    return (
        <button 
            onClick={handleClick} 
            className= {` ${styles.contenedorOptions}  ${selected ? styles.contenedorOptionsActive: ''}`} >
             <FontAwesomeIcon icon={icon} className={styles.IconStyle1}/>
             <p>{text}</p>
        
        </button>
    )
}

export default Options;