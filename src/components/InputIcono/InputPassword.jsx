import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import styles from '../InputIcono/InputIcono.module.css';


const InputPassword = ({
    showPassword,
    togglePasswordVisibility,
    icono,
    placeholder,
    value,
    onChange,
    error = false,
    name = ""
}) => {
    
    return (
        <div className={`${styles.contenedorInput} ${error ? styles.errorInput :''}`}>
        
             <span className={styles.iconoEye} onClick={() => {
                console.log("wa");
                togglePasswordVisibility();
             }}>
                <FontAwesomeIcon icon={showPassword? faEye : faEyeSlash} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>

            <input
                className={styles.inputStylePassword}
                type= {showPassword ? "text" : "password"}
                value= {value}
                name = {name}
                onChange={onChange}
                placeholder= {placeholder}
            />


            <span className={styles.iconoStyle}>
                <FontAwesomeIcon icon={icono} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>
    
        </div>
    );
};

export default InputPassword;