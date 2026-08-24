import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './WelcomeModal.css';

const WelcomeModal = ({ isOpen, onClose }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="welcome-modal-overlay">
      <div className="welcome-modal-container">
        <div className="welcome-modal-header">
          <div className="welcome-modal-header-left">
            <img src="/logo.png" alt="Piedmont Counseling Logo" className="welcome-modal-header-logo" />
            <h2 className="welcome-modal-title">Welcome to Piedmont Counseling and Development Services, PLLC</h2>
          </div>
          <button className="welcome-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        
        <div className="welcome-modal-content">
          <p><strong>Dear Client,</strong></p>
          
          <p>Welcome to Piedmont Counseling and Development Services, PLLC. We are honored that you have chosen our practice to support you on your journey toward greater emotional well-being, healing, and personal growth.</p>
          
          <p>We understand that beginning counseling can bring a variety of emotions. Our goal is to provide a professional, supportive, respectful, and confidential environment where you feel comfortable discussing the concerns that are important to you.</p>
          
          <p>Counseling is a <strong>collaborative process</strong>. Your therapist will bring professional knowledge, clinical experience, and guidance to the therapeutic relationship, while you bring your own experiences, strengths, goals, and willingness to participate in the process. We believe that meaningful progress is most likely when clients are actively engaged and work together with their therapist toward identified goals.</p>
          
          <p>The following intake paperwork is designed to help us learn more about you and to provide you with important information about our practice. It includes information regarding your history and current concerns, informed consent, privacy practices, office policies, communication, scheduling, financial responsibilities, and other important aspects of your care.</p>
          
          <p>Please take your time when completing the forms and answer the questions as accurately as possible. If there is a question that you do not understand or would prefer to discuss directly with your therapist, please let us know.</p>
          
          <p>Thank you for trusting <strong>Piedmont Counseling and Development Services, PLLC</strong>. We look forward to working with you and supporting you as you move toward the changes and goals that are meaningful to you.</p>
          
          <div className="welcome-modal-signature">
            <p>Warmly,</p>
            <p><strong>Piedmont Counseling and Development Services, PLLC</strong></p>
            <p><em>Supporting Growth, Healing, and Emotional Wellness</em></p>
          </div>
        </div>
        
        <div className="welcome-modal-actions">
          <button className="btn-primary welcome-modal-btn" onClick={onClose}>
            Continue to Intake Forms
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WelcomeModal;
