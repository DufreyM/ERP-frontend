import React, { useState } from 'react';
import styles from './InputIcono.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const IconoInput = ({
    icono,
    placeholder,
    value,
    onChange,
    type,
    error = false,
    name = "",
}) => {
    

    return (
        <div className={`${styles.contenedorInput} ${error ? styles.errorInput :''}`}>

            <input
                className={styles.inputStyle}
                type= {type}
                value= {value}
                name = {name}
                onChange={onChange}
                placeholder= {placeholder}
            />

            <span className={styles.iconoStyle} >
                <FontAwesomeIcon icon={icono} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>
    
        </div>
    );
};

export default IconoInput;