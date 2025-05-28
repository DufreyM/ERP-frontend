
import './PopupButton.css';  // Opcional: para personalizar los estilos del popup

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;  // No renderiza nada si `isOpen` es false

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
