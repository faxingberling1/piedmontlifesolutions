import React from 'react';

const AlertModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container alert-modal-container">
        <h2 className="modal-title">{title || "Notice"}</h2>
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button 
            className="btn-primary modal-btn-confirm" 
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
