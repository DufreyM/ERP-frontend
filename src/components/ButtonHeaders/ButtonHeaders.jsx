import { faL } from '@fortawesome/free-solid-svg-icons';
import styles from './ButtonHeaders.module.css';

const ButtonHeaders = ({
  text,
  onClick,
  onlyLine = false,
  red = false

}) => {
    
    return(
        <button 
          className= {`
            ${styles.divButtonForm}
            ${onlyLine === true? styles.LineButton: ''}
            ${red === true? styles.RedButton: ''}
          `}
          
          onClick={onClick}
        >
           {text}
        </button>
    );
};

export default ButtonHeaders;