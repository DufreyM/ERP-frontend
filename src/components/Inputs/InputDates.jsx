


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
    maxWidth = '500px',
    minDate,
}) => {
    
    

    return (
        <div className={`${styles.contenedorInputDate} ${error ? styles.errorInput :''}`}>

            <DatePicker
               
                placeholderText = {placeholder}
                selected = {selected}
                onChange={onChange}
                dateFormat="yyyy-MM-dd"  
                minDate={minDate} 

                className={styles.inputStyleDate}
                popperPlacement="bottom"
                wrapperClassName="custom-datepicker-wrapper"
            />

            <span className={styles.iconoStyle} >
                <FontAwesomeIcon icon={icono} style={{ color: error? 'red' : '#5a60a5' }} />
            </span>

            <style jsx>{`
                .custom-datepicker-wrapper input {
                    max-width: ${maxWidth};
                }
            `}</style>
    
        </div>
    );
};

export default InputDates;