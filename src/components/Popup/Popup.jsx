
import ButtonHeaders from '../ButtonHeaders/ButtonHeaders';
import './PopupButton.css';  
const Popup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onClick, 
  hideActions = false, 
  acceptText = 'Aceptar', 
  cancelText = 'Cancelar' 
}) => {
  if (!isOpen) return null;  // No renderiza nada si `isOpen` es false

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{title}</h3>
        <button className="close-btn" onClick={onClose}>X</button>
        {children}
      {!hideActions && (
        <div className='buttonStylePopUp'>
          <ButtonHeaders red = {true} text={cancelText} onClick={onClose}/>
          <ButtonHeaders text={acceptText}
            onClick={onClick}
          />
        </div>
      )}
      
      </div>
    </div>
  );
};

export default Popup;
