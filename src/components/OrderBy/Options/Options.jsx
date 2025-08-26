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
        <div onClick={handleClick} className= {styles.contenedorOptions} 
        
        style={{
                fontWeight: selected ? 'bold' : 'normal',
                cursor: 'pointer',
                padding: '4px 8px',
                backgroundColor: selected ? '#ebebebff' : 'transparent'
            }}
        
        >
             <FontAwesomeIcon icon={icon} className={styles.IconStyle1}/>
             <p>{text}</p>
        
        </div>
    )
}

export default Options;