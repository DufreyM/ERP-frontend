/*ButtonForm
Es el botón azul que se utiliza en la mayoría de los formularios definidos, como Login y Resetpassword etc
El estilo se encuentra en el archivo ButtonForm.module.css
Atributos:
  text: el texto que se muestra en el botón
  oClick: función de lo que quieres que haga el botón
Autor: Melisa 
Ultima modificación: 7/5/2025 
*/

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