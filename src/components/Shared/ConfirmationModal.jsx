import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{title || "Confirm Submission"}</h2>
        <p className="modal-message">{message || "Are you sure you want to submit?"}</p>
        
        <div className="modal-actions">
          <button 
            className="btn-clear modal-btn-cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText || "Cancel"}
          </button>
          <button 
            className="btn-primary modal-btn-confirm" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (confirmText || "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
