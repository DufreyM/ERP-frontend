import react from "react";
import styles from './ButtonText.module.css';

const ButtonText = ({
    texto,
    textoButton,
    accion
}) => {
    return(
        <div className= {styles.divButtonText}>
            <span>
                {texto}
                <span>
                    {' '}
                </span>
                <span className={styles.spanButtonText}
                onClick={accion}>
                    {textoButton}
                </span>
            </span>
        </div>
    );
};

export default ButtonText;