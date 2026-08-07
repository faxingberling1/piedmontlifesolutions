import React from 'react';
import { createPortal } from 'react-dom';

const AlertModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return createPortal(
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
    </div>,
    document.body
  );
};

export default AlertModal;
