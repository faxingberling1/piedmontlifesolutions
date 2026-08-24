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

  const handleFileUpload = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [side]: reader.result }));
      };
      reader.readAsDataURL(file);
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
          <h3 className="step-title" style={{ fontSize: '1.4rem' }}>Client Information</h3>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="clientName" placeholder=" " value={formData.clientName || ''} onChange={handleChange} required />
              <label>Client/Patient Name</label>
            </div>
            <div className="input-group">
              <input type="date" name="clientDob" placeholder=" " value={formData.clientDob || ''} onChange={handleChange} required />
              <label className="active-label">Date of Birth</label>
            </div>
          </div>
          
          <div className="input-group">
            <input type="text" name="clientAddress" placeholder=" " value={formData.clientAddress || ''} onChange={handleChange} required />
            <label>Address</label>
          </div>
          
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="clientCity" placeholder=" " value={formData.clientCity || ''} onChange={handleChange} required />
              <label>City</label>
            </div>
            <div className="input-group">
              <input type="text" name="clientState" placeholder=" " value={formData.clientState || ''} onChange={handleChange} required />
              <label>State</label>
            </div>
            <div className="input-group">
              <input type="text" name="clientZip" placeholder=" " value={formData.clientZip || ''} onChange={handleChange} required />
              <label>ZIP</label>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <input type="tel" name="clientPhone" placeholder=" " value={formData.clientPhone || ''} onChange={handleChange} required />
              <label>Phone Number</label>
            </div>
            <div className="input-group">
              <input type="email" name="clientEmail" placeholder=" " value={formData.clientEmail || ''} onChange={handleChange} required />
              <label>Email Address</label>
            </div>
          </div>

          <h3 className="step-title" style={{ fontSize: '1.4rem', marginTop: '2rem' }}>Primary Insurance</h3>
          <div className="input-group">
            <input type="text" name="primaryInsCompany" placeholder=" " value={formData.primaryInsCompany || ''} onChange={handleChange} required />
            <label>Insurance Company</label>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="primaryInsId" placeholder=" " value={formData.primaryInsId || ''} onChange={handleChange} required />
              <label>Member/Subscriber ID</label>
            </div>
            <div className="input-group">
              <input type="text" name="primaryInsGroup" placeholder=" " value={formData.primaryInsGroup || ''} onChange={handleChange} required />
              <label>Group Number</label>
            </div>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="primaryInsPlan" placeholder=" " value={formData.primaryInsPlan || ''} onChange={handleChange} />
              <label>Plan Name/Type (if known)</label>
            </div>
            <div className="input-group">
              <input type="tel" name="primaryInsPhone" placeholder=" " value={formData.primaryInsPhone || ''} onChange={handleChange} />
              <label>Insurance Company Phone Number</label>
            </div>
          </div>

          <h3 className="step-title" style={{ fontSize: '1.4rem', marginTop: '2rem' }}>Policyholder/Subscriber Information</h3>
          <p className="step-subtitle">If the insurance policy is in someone else's name, please complete the following:</p>
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <input type="text" name="policyholderName" placeholder=" " value={formData.policyholderName || ''} onChange={handleChange} />
            <label>Policyholder/Subscriber Name</label>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p className="step-subtitle" style={{ marginBottom: '0.5rem' }}>Relationship to Client:</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Self', 'Spouse', 'Parent', 'Other'].map(rel => (
                <label key={rel} className="checkbox-label">
                  <input type="radio" name="policyholderRelationship" value={rel} checked={formData.policyholderRelationship === rel} onChange={handleChange} />
                  <span className="checkbox-text">{rel}</span>
                </label>
              ))}
            </div>
            {formData.policyholderRelationship === 'Other' && (
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <input type="text" name="policyholderRelationshipOther" placeholder=" " value={formData.policyholderRelationshipOther || ''} onChange={handleChange} />
                <label>Please specify (Other)</label>
              </div>
            )}
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="date" name="policyholderDob" placeholder=" " value={formData.policyholderDob || ''} onChange={handleChange} />
              <label className="active-label">Policyholder Date of Birth</label>
            </div>
            <div className="input-group">
              <input type="text" name="policyholderEmployer" placeholder=" " value={formData.policyholderEmployer || ''} onChange={handleChange} />
              <label>Policyholder Employer (if applicable)</label>
            </div>
          </div>

          <h3 className="step-title" style={{ fontSize: '1.4rem', marginTop: '2rem' }}>Secondary Insurance, If Applicable</h3>
          <div className="input-group">
            <input type="text" name="secondaryInsCompany" placeholder=" " value={formData.secondaryInsCompany || ''} onChange={handleChange} />
            <label>Insurance Company</label>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="secondaryInsId" placeholder=" " value={formData.secondaryInsId || ''} onChange={handleChange} />
              <label>Member/Subscriber ID</label>
            </div>
            <div className="input-group">
              <input type="text" name="secondaryInsGroup" placeholder=" " value={formData.secondaryInsGroup || ''} onChange={handleChange} />
              <label>Group Number</label>
            </div>
          </div>
          <div className="input-group">
            <input type="text" name="secondaryPolicyholderName" placeholder=" " value={formData.secondaryPolicyholderName || ''} onChange={handleChange} />
            <label>Policyholder Name</label>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <input type="text" name="secondaryPolicyholderRelationship" placeholder=" " value={formData.secondaryPolicyholderRelationship || ''} onChange={handleChange} />
              <label>Relationship to Client</label>
            </div>
            <div className="input-group">
              <input type="date" name="secondaryPolicyholderDob" placeholder=" " value={formData.secondaryPolicyholderDob || ''} onChange={handleChange} />
              <label className="active-label">Policyholder Date of Birth</label>
            </div>
          </div>

          <h3 className="step-title" style={{ fontSize: '1.4rem', marginTop: '2rem' }}>Insurance Card</h3>
          <p className="step-subtitle" style={{ marginBottom: '1rem' }}>Please provide a clear copy or image of the front and back of your current insurance card.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Front of insurance card (JPG, PNG, PDF)</label>
              <div className="file-upload-wrapper">
                <input type="file" id="frontCardFile" name="frontCardFile" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleFileUpload(e, 'frontCardData')} required className="file-upload-input" />
                <label htmlFor="frontCardFile" className="file-upload-label">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>{formData.frontCardData ? "Front Card Selected (Click to change)" : "Upload Front of Card"}</span>
                </label>
              </div>
            </div>
            <div style={{ margin: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>Back of insurance card (JPG, PNG, PDF)</label>
              <div className="file-upload-wrapper">
                <input type="file" id="backCardFile" name="backCardFile" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleFileUpload(e, 'backCardData')} required className="file-upload-input" />
                <label htmlFor="backCardFile" className="file-upload-label">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>{formData.backCardData ? "Back Card Selected (Click to change)" : "Upload Back of Card"}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="consent-box" style={{ marginTop: '2rem' }}>
            <h4>Authorization to Verify Benefits and Submit Claims</h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', paddingRight: '1rem', marginBottom: '1rem' }}>
              <p style={{ marginBottom: '1rem' }}>I authorize Piedmont Counseling and Development Services, PLLC and its authorized representatives to obtain information from my insurance company regarding my eligibility, benefits, coverage, deductibles, copayments, coinsurance, authorization requirements, and other information necessary for billing and payment purposes.</p>
              <p style={{ marginBottom: '1rem' }}>I authorize Piedmont Counseling and Development Services, PLLC to submit claims to my insurance carrier for covered services provided to me.</p>
              <p>I authorize the release of information reasonably necessary to process insurance claims, obtain payment, and conduct related healthcare operations, as permitted by applicable law.</p>
            </div>

            <h4 style={{ marginTop: '1.5rem' }}>Assignment of Insurance Benefits</h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', paddingRight: '1rem', marginBottom: '1rem' }}>
              <p style={{ marginBottom: '1rem' }}>I authorize payment of insurance benefits, when permitted by my insurance plan, directly to Piedmont Counseling and Development Services, PLLC for services provided to me.</p>
              <p style={{ marginBottom: '1rem' }}>I understand that verification of insurance benefits <strong>does not guarantee payment by my insurance company</strong>.</p>
              <p style={{ marginBottom: '1rem' }}>I understand that I am responsible for understanding my insurance benefits and for amounts that are my responsibility under my insurance plan, including applicable copayments, coinsurance, deductibles, and non-covered services, subject to applicable law and my agreements with the practice.</p>
              <p>If my insurance coverage changes or terminates, I agree to notify Piedmont Counseling and Development Services, PLLC as soon as possible and provide updated insurance information.</p>
            </div>

            <h4 style={{ marginTop: '1.5rem' }}>Client Acknowledgment and Authorization</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>By signing below, I acknowledge that the information I have provided is accurate to the best of my knowledge. I have read and understand the insurance authorization information above and authorize Piedmont Counseling and Development Services, PLLC to verify benefits and submit claims as described.</p>

            <div className="signature-section" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: 2, minWidth: '300px' }}>
                <span className="signature-label">Signature (Required)</span>
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
              
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <input type="date" name="signatureDate" placeholder=" " value={formData.signatureDate || ''} onChange={handleChange} required />
                  <label className="active-label">Date</label>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <input type="text" name="signatureRelationship" placeholder=" " value={formData.signatureRelationship || ''} onChange={handleChange} />
                  <label>Relationship to Client (if applicable)</label>
                </div>
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
