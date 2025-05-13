import React, { useState } from 'react';
import styles from './InputIcono.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';

const InputSelects = ({
    icono,
    placeholder,
    value,
    onChange,
    type,
    error = false,
    name = "",
    opcions
}) => {
    const [abierto, setAbierto] = useState(false);
    

    return (
        <div className={`  ${styles.contenedorInput}  ${styles.selects}  ${error ? styles.errorInput :''}`}>
            
            
            <select
                onFocus={() => setAbierto(true)}
                onBlur={() => setAbierto(false)}
                className={styles.inputStyle}
                type= {type}
                value= {value}
                name = {name}
                onChange={onChange}
            >
                <option value="">{placeholder}</option>
                {opcions.map((opcion, index) =>(
                    <option key ={index} value={opcion.value}>
                        {opcion.label}
                    </option>
                ))}
                
            </select>


            <span className={styles.iconoStyle} >
                <FontAwesomeIcon icon={icono} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>

            <span className= {`${styles.iconoSelects} ${abierto ? styles.iconoAbierto : ''}`} >
                <FontAwesomeIcon icon={faChevronDown} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>

            
    
        </div>
    );
};

export default InputSelects;