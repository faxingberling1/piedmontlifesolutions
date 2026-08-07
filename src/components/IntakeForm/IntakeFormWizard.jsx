import React, { useState, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import emailjs from '@emailjs/browser';
import IntakePDFDocument from './IntakePDFDocument';
import ConfirmationModal from '../Shared/ConfirmationModal';
import AlertModal from '../Shared/AlertModal';
import { 
  ClientInfo, 
  ClinicalInfo, 
  SocialEducation, 
  MedicalHistory, 
  SymptomsChecklist, 
  ConsentsSignatures 
} from './IntakeSteps';
import './IntakeForm.css';

const IntakeFormWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const sigPadRef = useRef(null);
  const guardianSigPadRef = useRef(null);
  const hipaaSigPadRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '' });
  const [formError, setFormError] = useState('');

  const showAlert = (title, message) => setAlertState({ isOpen: true, title, message });
  const closeAlert = () => setAlertState({ isOpen: false, title: '', message: '' });

  const [formData, setFormData] = useState({
    symptoms: [],
    medications: [{ name: '', reason: '' }],
    signatureData: null,
    guardianSignatureData: null,
    hipaaSignatureData: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (symptom, isChecked) => {
    setFormData(prev => {
      const symptoms = prev.symptoms || [];
      if (isChecked) {
        return { ...prev, symptoms: [...symptoms, symptom] };
      } else {
        return { ...prev, symptoms: symptoms.filter(s => s !== symptom) };
      }
    });
  };

  const handleSignatureEnd = () => {
    setFormError('');
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      setFormData(prev => ({ ...prev, signatureData: sigPadRef.current.toDataURL() }));
    } else {
      setFormData(prev => ({ ...prev, signatureData: null }));
    }
  };

  const handleGuardianSignatureEnd = () => {
    setFormError('');
    if (guardianSigPadRef.current && !guardianSigPadRef.current.isEmpty()) {
      setFormData(prev => ({ ...prev, guardianSignatureData: guardianSigPadRef.current.toDataURL() }));
    } else {
      setFormData(prev => ({ ...prev, guardianSignatureData: null }));
    }
  };

  const handleHipaaSignatureEnd = () => {
    setFormError('');
    if (hipaaSigPadRef.current && !hipaaSigPadRef.current.isEmpty()) {
      setFormData(prev => ({ ...prev, hipaaSignatureData: hipaaSigPadRef.current.toDataURL() }));
    } else {
      setFormData(prev => ({ ...prev, hipaaSignatureData: null }));
    }
  };

  const nextStep = () => {
    setFormError('');
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setFormError('');
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePreviewPDF = async () => {
    try {
      const doc = <IntakePDFDocument formData={formData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error("Error generating PDF preview:", err);
      showAlert("Preview Error", "Failed to generate PDF preview.");
    }
  };

  const handleFinalSubmit = () => {
    setFormError('');
    
    const missing = [];
    if (!formData.signatureData && !formData.guardianSignatureData) {
      missing.push("Treatment (Patient or Guardian)");
    }
    if (!formData.hipaaSignatureData) {
      missing.push("HIPAA Acknowledgment");
    }

    if (missing.length > 0) {
      setFormError(`Missing Signatures: Please provide your ${missing.join(" and ")} signature(s) before submitting.`);
      return;
    }

    setIsModalOpen(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    try {
      const doc = <IntakePDFDocument formData={formData} />;
      const blob = await pdf(doc).toBlob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          await emailjs.send(
            'YOUR_SERVICE_ID', 
            'YOUR_TEMPLATE_ID', 
            {
              client_name: formData.clientName || 'New Patient',
              reply_to: formData.email || '',
              pdf_attachment: base64data
            }, 
            'YOUR_PUBLIC_KEY'
          );
          setIsSubmitting(false);
          setIsModalOpen(false);
          setIsSubmitted(true);
        } catch (error) {
          setIsSubmitting(false);
          setIsModalOpen(false);
          setIsSubmitted(true);
          console.error("EmailJS Error:", error);
        } finally {
          setIsSubmitting(false);
        }
      };
    } catch (err) {
      console.error("Error during submission:", err);
      setIsSubmitting(false);
      showAlert("Submission Error", "An error occurred while generating the PDF.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="wizard-container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ color: 'var(--color-secondary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Thank You!</h2>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
          Your Intake Form has been successfully submitted and securely sent to our clinic.<br/>
          We will review your information and be in touch shortly.
        </p>
        <button 
          className="btn-primary" 
          onClick={() => window.location.reload()} 
          style={{ padding: '0.75rem 2.5rem', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', border: 'none', background: 'var(--color-primary)', color: 'white', transition: 'all 0.3s ease' }}
          onMouseOver={(e) => { e.target.style.background = 'var(--color-secondary)'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 16px rgba(184, 144, 83, 0.4)'; }}
          onMouseOut={(e) => { e.target.style.background = 'var(--color-primary)'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
        >
          Return to Forms
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="wizard-container">
      <div className="stepper-container">
        <div className="stepper-track">
           <div className="stepper-fill" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
        </div>
        <div className="stepper-steps">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <button 
                key={stepNum}
                type="button"
                className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => { setFormError(''); setCurrentStep(stepNum); }}
                title={`Jump to step ${stepNum}`}
              >
                {stepNum}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        
        <div className="step-wrapper">
          {currentStep === 1 && <ClientInfo formData={formData} handleChange={handleChange} />}
          {currentStep === 2 && <ClinicalInfo formData={formData} handleChange={handleChange} />}
          {currentStep === 3 && <SocialEducation formData={formData} handleChange={handleChange} />}
          {currentStep === 4 && <MedicalHistory formData={formData} handleChange={handleChange} setFormData={setFormData} />}
          {currentStep === 5 && <SymptomsChecklist formData={formData} handleCheckboxChange={handleCheckboxChange} handleChange={handleChange} />}
          {currentStep === 6 && (
            <ConsentsSignatures 
              formData={formData} 
              handleChange={handleChange}
              handleSignatureEnd={handleSignatureEnd} 
              sigPadRef={sigPadRef} 
              handleGuardianSignatureEnd={handleGuardianSignatureEnd}
              guardianSigPadRef={guardianSigPadRef}
              handleHipaaSignatureEnd={handleHipaaSignatureEnd}
              hipaaSigPadRef={hipaaSigPadRef}
            />
          )}
        </div>

        <div className="wizard-actions" style={{ alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={prevStep}>
                Back
              </button>
            )}
          </div>

          <div className="clinic-footer">
            4917 Piedmont Pkwy, Suite 104, Jamestown, NC 27282 * Phone: (336) 493-5600 * Fax: (888) 908-7050<br/>
            Moniquec@piedmontlifesolutions.com
          </div>
          
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {currentStep < totalSteps ? (
                <button type="button" className="btn-primary-small" onClick={nextStep}>
                  Next Step
                </button>
              ) : (
                <>
                  <button type="button" className="btn-secondary" onClick={handlePreviewPDF}>
                    Preview PDF
                  </button>
                  <button type="button" className="btn-primary-small submit-btn" onClick={handleFinalSubmit}>
                    Submit Form
                  </button>
                </>
              )}
            </div>
            {formError && (
              <div style={{ 
                color: '#d32f2f', 
                backgroundColor: '#fdecea', 
                padding: '0.75rem 1rem', 
                borderRadius: '8px', 
                fontSize: '0.85rem', 
                border: '1px solid #d32f2f', 
                maxWidth: '400px', 
                textAlign: 'left',
                animation: 'fadeDown 0.3s ease'
              }}>
                <strong>Error: </strong>{formError}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
      
    <ConfirmationModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onConfirm={confirmSubmission} 
      isLoading={isSubmitting}
      title="Submit Intake Form"
      message="Are you sure you want to submit your Intake Form? Please ensure all information is accurate."
      cancelText="Review Form"
      confirmText="Confirm to Submit"
    />
    <AlertModal 
      isOpen={alertState.isOpen}
      title={alertState.title}
      message={alertState.message}
      onClose={closeAlert}
    />
  </>
  );
};

export default IntakeFormWizard;
