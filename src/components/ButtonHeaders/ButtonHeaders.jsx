import { faL } from '@fortawesome/free-solid-svg-icons';
import styles from './ButtonHeaders.module.css';

const ButtonHeaders = ({
  text,
  onClick,
  onlyLine = false,
  red = false,
  disabled,

}) => {
    
    return(
        <button 
          className= {`
            ${styles.divButtonForm}
            ${onlyLine === true? styles.LineButton: ''}
            ${red === true? styles.RedButton: ''}
          `}
          
          onClick={onClick}
          disabled = {disabled}
        >
           {text}
        </button>
    );
};

export default ButtonHeaders;