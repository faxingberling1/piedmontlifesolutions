import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../IntakeForm/IntakeForm.css'; // Re-use the wizard CSS for styling consistency
import { pdf } from '@react-pdf/renderer';
import InsurancePDFDocument from './InsurancePDFDocument';
import ConfirmationModal from '../Shared/ConfirmationModal';
import AlertModal from '../Shared/AlertModal';

const InsuranceForm = () => {
  const sigPadRef = useRef(null);
  const [formData, setFormData] = useState({
    signatureData: null
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '' });
  const [formError, setFormError] = useState('');

  const showAlert = (title, message) => setAlertState({ isOpen: true, title, message });
  const closeAlert = () => setAlertState({ isOpen: false, title: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignatureEnd = () => {
    setFormError('');
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      setFormData(prev => ({
        ...prev,
        signatureData: sigPadRef.current.toDataURL()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        signatureData: null
      }));
    }
  };

  const handlePreviewPDF = async () => {
    try {
      const doc = <InsurancePDFDocument formData={formData} />;
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
    if (!formData.signatureData) {
      setFormError("Missing Signature: Please provide your Patient/Authorized Person signature before submitting.");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    try {
      const doc = <InsurancePDFDocument formData={formData} />;
      const blob = await pdf(doc).toBlob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_name: formData.clientName || 'New Patient',
              reply_to: formData.email || '',
              pdf_attachment: base64data,
              form_type: 'Insurance Form'
            })
          });
          
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          
          setIsSubmitting(false);
          setIsModalOpen(false);
          setIsSubmitted(true);
        } catch (error) {
          setIsSubmitting(false);
          setIsModalOpen(false);
          setIsSubmitted(true);
          console.error("API Error:", error);
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
          Your Insurance Form has been successfully submitted and securely sent to our clinic.<br/>
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
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="step-content">
          
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <input type="text" name="clientName" placeholder=" " value={formData.clientName || ''} onChange={handleChange} required />
            <label>Client Name (Patient)</label>
          </div>

          {/* Billable Party Info */}
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="billableParty" placeholder=" " value={formData.billableParty || ''} onChange={handleChange} required />
              <label>Billable Party Name</label>
            </div>
            <div className="input-group">
              <input type="text" name="relationshipToClient" placeholder=" " value={formData.relationshipToClient || ''} onChange={handleChange} required />
              <label>Relationship to Client</label>
            </div>
          </div>
          
          <div className="input-group">
            <input type="text" name="address" placeholder=" " value={formData.address || ''} onChange={handleChange} required />
            <label>Street Address</label>
          </div>
          
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="city" placeholder=" " value={formData.city || ''} onChange={handleChange} required />
              <label>City</label>
            </div>
            <div className="input-group">
              <input type="text" name="state" placeholder=" " value={formData.state || ''} onChange={handleChange} required />
              <label>State</label>
            </div>
            <div className="input-group">
              <input type="text" name="zip" placeholder=" " value={formData.zip || ''} onChange={handleChange} required />
              <label>Zip</label>
            </div>
            <div className="input-group">
              <input type="tel" name="phone" placeholder=" " value={formData.phone || ''} onChange={handleChange} required />
              <label>Phone #</label>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p className="step-subtitle" style={{ marginBottom: '0.5rem' }}>Client's relationship to primary insured:</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Self', 'Spouse', 'Partner', 'Child', 'Other'].map(rel => (
                <label key={rel} className="checkbox-label">
                  <input type="radio" name="clientRelationship" value={rel} checked={formData.clientRelationship === rel} onChange={handleChange} />
                  <span className="checkbox-text">{rel}</span>
                </label>
              ))}
            </div>
          </div>

          <h3 className="step-title" style={{ fontSize: '1.4rem', marginTop: '1rem' }}>Primary Insured Information</h3>
          <p className="step-subtitle">(if different from above)</p>
          
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="primaryName" placeholder=" " value={formData.primaryName || ''} onChange={handleChange} />
              <label>Primary Insured's Name</label>
            </div>
            <div className="input-group">
              <input type="date" name="primaryDob" placeholder=" " value={formData.primaryDob || ''} onChange={handleChange} />
              <label className="active-label">Birthdate</label>
            </div>
            <div className="input-group">
              <input type="text" name="primarySsn" placeholder=" " value={formData.primarySsn || ''} onChange={handleChange} />
              <label>Insured's Social Security #</label>
            </div>
            <div className="input-group">
              <input type="text" name="primaryEmployer" placeholder=" " value={formData.primaryEmployer || ''} onChange={handleChange} />
              <label>Primary Insured's Employer</label>
            </div>
          </div>

          <div className="input-group">
            <input type="text" name="primaryAddressStreet" placeholder=" " value={formData.primaryAddressStreet || ''} onChange={handleChange} />
            <label>Primary Insured's Address: Street</label>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="primaryCity" placeholder=" " value={formData.primaryCity || ''} onChange={handleChange} />
              <label>City</label>
            </div>
            <div className="input-group">
              <input type="text" name="primaryState" placeholder=" " value={formData.primaryState || ''} onChange={handleChange} />
              <label>State</label>
            </div>
            <div className="input-group">
              <input type="text" name="primaryZip" placeholder=" " value={formData.primaryZip || ''} onChange={handleChange} />
              <label>Zip</label>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p className="step-subtitle" style={{ marginBottom: '0.5rem' }}>Primary Insured's Gender:</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['Male', 'Female', 'Transgender'].map(gender => (
                <label key={gender} className="checkbox-label">
                  <input type="radio" name="primaryGender" value={gender} checked={formData.primaryGender === gender} onChange={handleChange} />
                  <span className="checkbox-text">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <h3 className="step-title" style={{ fontSize: '1.4rem' }}>Insurance Details</h3>
          
          <div className="input-group">
            <input type="text" name="primaryInsuranceName" placeholder=" " value={formData.primaryInsuranceName || ''} onChange={handleChange} required />
            <label>Primary Insurance Company Name</label>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="primaryInsuranceId" placeholder=" " value={formData.primaryInsuranceId || ''} onChange={handleChange} required />
              <label>Primary Insurance I.D. #</label>
            </div>
            <div className="input-group">
              <input type="text" name="primaryInsuranceGroup" placeholder=" " value={formData.primaryInsuranceGroup || ''} onChange={handleChange} />
              <label>Group #</label>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '1rem' }}>
            <input type="text" name="secondaryInsuranceName" placeholder=" " value={formData.secondaryInsuranceName || ''} onChange={handleChange} />
            <label>Secondary Insurance Company Name (Optional)</label>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="secondaryInsuranceId" placeholder=" " value={formData.secondaryInsuranceId || ''} onChange={handleChange} />
              <label>Secondary Insurance I.D. #</label>
            </div>
            <div className="input-group">
              <input type="text" name="secondaryInsuranceGroup" placeholder=" " value={formData.secondaryInsuranceGroup || ''} onChange={handleChange} />
              <label>Group #</label>
            </div>
          </div>

          <div className="consent-box" style={{ marginTop: '2rem' }}>
            <h4>Authorization & Assignment of Benefits</h4>
            <p>
              I hereby authorize the release of any medical or other information necessary to process all claims for the client described above. 
              I also request and assign payment of insurance, medical, and or government benefits to Piedmont Counseling & Development Services, PLLC.
            </p>
            <div className="signature-section" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: 2, minWidth: '300px' }}>
                <span className="signature-label">Patient/Authorized Person Signature (Required)</span>
                <div className="signature-container" style={{ border: '1px solid rgba(28,43,76,0.2)', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', height: '150px' }}>
                  <SignatureCanvas 
                    ref={sigPadRef}
                    penColor="#1c2b4c"
                    canvasProps={{ className: 'sigCanvas' }}
                    onEnd={handleSignatureEnd}
                  />
                </div>
                <button type="button" className="btn-clear" onClick={() => { sigPadRef.current.clear(); handleSignatureEnd(); }}>Clear Signature</button>
              </div>
              
              <div className="input-group" style={{ flex: 1, minWidth: '200px', marginTop: '1.5rem' }}>
                <input type="date" name="signatureDate" placeholder=" " value={formData.signatureDate || ''} onChange={handleChange} required />
                <label className="active-label">Date</label>
              </div>
            </div>
          </div>

          <div className="wizard-actions" style={{ alignItems: 'center' }}>
            <div style={{ flex: 1 }}></div>

            <div className="clinic-footer">
              4917 Piedmont Pkwy, Suite 104, Jamestown, NC 27282 * Phone: (336) 493-5600 * Fax: (888) 908-7050<br/>
              Moniquec@piedmontlifesolutions.com
            </div>
            
            <div style={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={handlePreviewPDF}>
                  Preview PDF
                </button>
                <button type="button" className="btn-primary-small submit-btn" onClick={handleFinalSubmit}>
                  Submit Form
                </button>
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

        </div>
      </form>
    </div>

    <ConfirmationModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onConfirm={confirmSubmission} 
      isLoading={isSubmitting}
      title="Submit Insurance Form"
      message="Are you sure you want to submit your Insurance Form? Please ensure all information is accurate and you have reviewed the PDF preview."
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

export default InsuranceForm;
