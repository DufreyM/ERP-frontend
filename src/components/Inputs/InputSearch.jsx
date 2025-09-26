
import styles from './InputIcono.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const InputSearch = ({
    icono,
    placeholder,
    value,
    onChange,
    type,
    error = false,
    name = "",
    disabled=false,
    onFocus
}) => {
    

    return (
        <div className={`${styles.contenedorInputStyle} ${error ? styles.errorInput :''}`}>

            <input
                className={styles.inputStyleSearch}
                type= {type}
                value= {value}
                name = {name}
                onChange={onChange}
                placeholder= {placeholder}
                disabled = {disabled}
                onFocus={onFocus}
            />

            <span className={styles.iconoStyle} >
                <FontAwesomeIcon icon={icono} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>
    
        </div>
    );
};

export default InputSearch;