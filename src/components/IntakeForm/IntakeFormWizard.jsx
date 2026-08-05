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
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '' });

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
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      setFormData(prev => ({ ...prev, signatureData: sigPadRef.current.toDataURL() }));
    } else {
      setFormData(prev => ({ ...prev, signatureData: null }));
    }
  };

  const handleGuardianSignatureEnd = () => {
    if (guardianSigPadRef.current && !guardianSigPadRef.current.isEmpty()) {
      setFormData(prev => ({ ...prev, guardianSignatureData: guardianSigPadRef.current.toDataURL() }));
    } else {
      setFormData(prev => ({ ...prev, guardianSignatureData: null }));
    }
  };

  const handleHipaaSignatureEnd = () => {
    if (hipaaSigPadRef.current && !hipaaSigPadRef.current.isEmpty()) {
      setFormData(prev => ({ ...prev, hipaaSignatureData: hipaaSigPadRef.current.toDataURL() }));
    } else {
      setFormData(prev => ({ ...prev, hipaaSignatureData: null }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
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
    if (!formData.patientSignatureData || !formData.hipaaSignatureData) {
      showAlert("Missing Signatures", "Please provide both your Treatment signature and HIPAA signature before submitting.");
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
          showAlert("Success", "Intake Form successfully submitted and emailed to the clinic!");
          setIsModalOpen(false);
        } catch (error) {
          setIsSubmitting(false);
          showAlert("Submission Pending", "Note: The form was finalized, but EmailJS keys are not configured yet. Check the console for details.");
          setIsModalOpen(false);
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

  return (
    <div className="wizard-container">
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="step-indicator">
        Step {currentStep} of {totalSteps}
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
          
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
        </div>
      </form>
      
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmSubmission} 
        isLoading={isSubmitting}
        title="Submit Intake Form"
        message="Are you sure you want to submit your Intake Form? Please ensure all information is accurate and you have reviewed the PDF preview."
      />
      <AlertModal 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default IntakeFormWizard;
