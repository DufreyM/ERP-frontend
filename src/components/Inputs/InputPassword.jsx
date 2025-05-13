/*InputPassword
Es el Input que del lado izquierdo tiene un espacio para un icono decorativo y del lado derecho 
un icono funcional para ocultar el contenido escrito.
El estilo se encuentra en el archivo InputIcono.module.css
Atributos:
  showPassword: const [showPassword, setShowPassword] = useState(false);
  togglePasswordVisibility: setShowPassword(!showPassword);
  icono: el icono decorativo del lado izquierdo
  placeholder: el texto que se lee para saber qué se debe de ingresar
  value: la variable que guarda su contenido
  onChange: el handler apropiado
  type: si es texto, int etc
  error: función de manejo de errores
  name: nombre
Autor: Melisa 
Ultima modificación: 7/5/2025 
*/

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import styles from './InputIcono.module.css';


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