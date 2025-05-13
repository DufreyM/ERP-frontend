



import React, { useState } from 'react';
import styles from './InputIcono.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css"



const InputDates = ({
    icono,
    placeholder,
    selected,
    onChange,
    error = false,
}) => {
    
    

    return (
        <div className={`${styles.contenedorInput} ${error ? styles.errorInput :''}`}>

            <DatePicker
                className={styles.inputStyleDate}
                placeholderText = {placeholder}
                selected = {selected}
                onChange={onChange}
                dateFormat="yyyy-MM-dd"   
            />

            <span className={styles.iconoStyle} >
                <FontAwesomeIcon icon={icono} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>
    
        </div>
    );
};

export default InputDates;