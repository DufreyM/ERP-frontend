
import ButtonHeaders from '../ButtonHeaders/ButtonHeaders';
import './PopupButton.css';  
const Popup = ({ isOpen, onClose, title, children, onClick }) => {
  if (!isOpen) return null;  // No renderiza nada si `isOpen` es false

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{title}</h3>
        <button className="close-btn" onClick={onClose}>X</button>
        {children}

      <div className='buttonStylePopUp'>
        <ButtonHeaders red = {true} text= 'Cancelar' onClick={onClose}/>
        <ButtonHeaders text= 'Aceptar'
        
          onClick={onClick}

        />
       
      </div>
      
      </div>
    </div>
  );
};

export default Popup;
