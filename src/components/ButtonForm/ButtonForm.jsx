import react from "react";
import styles from './ButtonForm.module.css';

const ButtonForm = ({
  text,
  onClick

}) => {
    
    return(
        <button 
        className= {styles.divButtonForm}
        onClick={onClick}
        >
           {text}
        </button>
    );
};

export default ButtonForm;