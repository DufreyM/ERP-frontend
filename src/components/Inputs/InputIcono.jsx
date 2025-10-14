/*InputIcono
Es el Input que del lado izquierdo tiene un espacio para un icono decorativo
El estilo se encuentra en el archivo InputIcono.module.css
Atributos:
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
    disabled=false,
    onFocus
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
                disabled = {disabled}
                onFocus={onFocus}
            />

            <span className={styles.iconoStyle} >
                <FontAwesomeIcon icon={icono} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>
    
        </div>
    );
};

export default IconoInput;