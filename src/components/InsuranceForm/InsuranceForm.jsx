import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../IntakeForm/IntakeForm.css'; // Re-use the wizard CSS for styling consistency
import { pdf } from '@react-pdf/renderer';
import emailjs from '@emailjs/browser';
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
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '' });

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
    if (!formData.signatureData) {
      showAlert("Missing Signature", "Please provide your digital signature before submitting.");
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
          showAlert("Success", "Insurance Form successfully submitted and emailed to the clinic!");
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
            
            <div style={{ flex: 1, textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={handlePreviewPDF}>
                Preview PDF
              </button>
              <button type="button" className="btn-primary-small submit-btn" onClick={handleFinalSubmit}>
                Submit Form
              </button>
            </div>
          </div>

        </div>
      </form>

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmSubmission} 
        isLoading={isSubmitting}
        title="Submit Insurance Form"
        message="Are you sure you want to submit your Insurance Form? Please ensure all information is accurate and you have reviewed the PDF preview."
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

export default InsuranceForm;
