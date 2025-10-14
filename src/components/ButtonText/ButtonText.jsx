/*ButtonText
Es el botón que tiene una pregunta y generalmente redirecciona -> ¿eres visitador médico? ingresa
El estilo se encuentra en el archivo ButtonText.module.css
Atributos:
  texto: el texto que se muestra en el botón ¿eres visitador medico?
  textoButton: el texto que se clickea 'ingresa'
  accion: función de lo que quieres que haga el botón
Autor: Melisa 
Ultima modificación: 7/5/2025 
*/

import styles from './ButtonText.module.css';

const ButtonText = ({
    texto,
    textoButton,
    accion
}) => {
    return(
        <button className= {styles.divButtonText}
        onClick={accion}>
            
            {texto}
            <span>
                {' '}
            </span>
            <span className={styles.spanButtonText}
            >
                {textoButton}
            </span>
            
        </button>
    );
};

export default ButtonText;