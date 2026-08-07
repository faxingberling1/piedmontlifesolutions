import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../IntakeForm/IntakeForm.css'; 
import { pdf } from '@react-pdf/renderer';
import emailjs from '@emailjs/browser';
import TelehealthPDFDocument from './TelehealthPDFDocument';
import ConfirmationModal from '../Shared/ConfirmationModal';
import AlertModal from '../Shared/AlertModal';

const TelehealthForm = () => {
  const sigPadRef = useRef(null);
  const [formData, setFormData] = useState({
    emergencyContacts: [{ name: '', phone: '' }],
    signatureData: null
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '' });
  const [formError, setFormError] = useState('');

  const showAlert = (title, message) => setAlertState({ isOpen: true, title, message });
  const closeAlert = () => setAlertState({ isOpen: false, title: '', message: '' });

  const emergencyContacts = Array.isArray(formData.emergencyContacts) ? formData.emergencyContacts : [{ name: '', phone: '' }];

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...emergencyContacts];
    newContacts[index][field] = value;
    setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...emergencyContacts, { name: '', phone: '' }]
    }));
  };

  const removeEmergencyContact = (index) => {
    if (emergencyContacts.length === 1) return;
    const newContacts = emergencyContacts.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const doc = <TelehealthPDFDocument formData={formData} />;
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
      setFormError("Missing Signature: Please provide your Patient signature before submitting.");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    try {
      const doc = <TelehealthPDFDocument formData={formData} />;
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
          Your Telehealth Consent Form has been successfully submitted and securely sent to our clinic.<br/>
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

          <div className="consent-box" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.7)' }}>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(28,43,76,0.1)', paddingBottom: '0.5rem' }}>
              Informed Consent for Telehealth Services
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: '1.6', maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                This Informed Consent for Telehealth contains important information focusing on providing mental health care services using the internet or the phone. Please read this carefully, and let me know if you have any questions. When you sign this document, it will represent an agreement between us.
              </p>
              
              <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Benefits and Risks of Telehealth</h4>
              <p style={{ marginBottom: '1rem' }}>
                Telehealth/health refers to providing psychotherapy services and/or medication management services remotely using telecommunications technologies, such as video conferencing or telephone. One of the benefits of telehealth is that the client and clinician can engage in services without being in the same physical location. Telehealth, however, requires some technical competence on both our parts to be helpful. Although there are benefits of telehealth, there are some differences between in-person psychotherapy and telehealth, as well as some risks. For example:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Risks to confidentiality.</strong> Because telehealth sessions take place outside of the therapist’s private office, there is potential for other people to overhear sessions if you are not in a private place during the session. <strong>It is important for you to be sure you are in a private place for our session where you will not be interrupted. Please do not be driving, in an open public area or any other setting where you will be distracted-this is so you are able to get the most out of your sessions.</strong> It is also important for you to protect the privacy of our session on your cell phone or other device. You should participate in therapy only while in a room or area where other people are not present and cannot overhear the conversation. Doxyme.org is a HIPPA compliant platform by which I provide telehealth services. I also use the Zoom platform.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Issues related to technology.</strong> There are many ways that technology issues might impact telehealth. For example, technology may stop working during a session, other people might be able to get access to our private conversation, or stored data could be accessed by unauthorized people or companies.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Crisis management and intervention.</strong> Typically, I will <em>not</em> engage in telehealth with clients who are currently in a crisis situation requiring high levels of support and intervention. Before engaging in telehealth, on this form we will identify the approach to any potential crisis situations that may arise during the course of our telehealth work.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Efficacy.</strong> Most research shows that telehealth is about as effective as in-person psychotherapy. However, some clinicians believe that something is lost by not being in the same room. For example, there is question about a clinician’s ability to fully understand non-verbal information when working remotely.</li>
              </ul>

              <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Electronic Communications</h4>
              <p style={{ marginBottom: '1rem' }}>
                <strong>I only use <u>video</u> telehealth unless you have <u>no</u> access to devices.</strong> You are solely responsible for any cost to you to obtain any necessary equipment, accessories, or software to take part in telehealth. <strong>There is no cost to you to access my services via doxyme.org. which is the medical grade platform that I use. I also use Zoom, which is no additional cost.</strong>
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>You will receive an emailed telehealth session invitation from me prior to your appointment. Please log into that link in the invitation at the time of your appointment. I STRONGLY encourage you to attempt a Pre-Call test that you can access via the link prior to our appointment.</strong>
              </p>

              <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Confidentiality</h4>
              <p style={{ marginBottom: '1rem' }}>
                I have a legal and ethical responsibility to make my best efforts to protect all communications that are a part of our telehealth. However, the nature of electronic communications technologies is such that I cannot guarantee that our communications will be kept confidential or that other people may not gain access to our communications. I will try to use updated encryption methods, firewalls, and back-up systems to help keep your information private, but there is a risk that our electronic communications may be compromised, unsecured, or accessed by others. You should also take reasonable steps to ensure the security of our communications (for example, only using secure networks for telehealth sessions and having passwords to protect the device you use for telehealth).
              </p>
              <p style={{ marginBottom: '1rem' }}>
                The extent of confidentiality and the exceptions to confidentiality that we outlined in our Policies and Procedures still apply in telehealth. Please let me know if you have any questions about exceptions to confidentiality.
              </p>

              <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Emergencies and/or Technology Failure Issues</h4>
              <p style={{ marginBottom: '1rem' }}>
                Assessing and evaluating threats and other emergencies can be more difficult when conducting telehealth than in traditional in-person therapy. To address some of these difficulties, below is an emergency plan for engaging in telehealth services. I will ask you to identify an emergency contact person who is near your location and who I will contact in the event of a crisis or emergency to assist in addressing the situation. I will ask that you name that person along with their contact information at the bottom of this form, which will allow me to contact your emergency contact person as needed during such a crisis or emergency.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                If the session is interrupted for any reason, such as the technological connection fails <strong>and you are having an emergency,</strong> do not call me back; instead, call 911, and/or any other hotlines local resources that we will identify in our emergency plan or go to your nearest emergency room. Call me back after you have called or obtained emergency services.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                If the session is interrupted and <strong>you are not having an emergency,</strong> disconnect from the session and I will wait two (2) minutes and then re-contact you via the telehealth platform on which we agreed to conduct therapy.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <span style={{ backgroundColor: '#f0f0f0' }}>If the Therapist feels the client is at risk, therapist may contact emergency contact or local emergency services for an in person safety screening</span>
              </p>

              <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Appointment Management</h4>
              <p style={{ marginBottom: '1rem' }}>
                Please <strong>do not use email to manage</strong> (scheduling, cancelling, rescheduling, etc) any appointments. While we may send you information regarding your appointment via email, we will <u>not</u> consider any appointment adjustments via email. You will need to call the office at 336-493-5600 to make any adjustments.
              </p>

              <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Fees</h4>
              <p style={{ marginBottom: '1rem' }}>
                The same fee rates will apply for telehealth as apply for in-person psychotherapy. You will be responsible for your deductible and copay as usual. <strong>You will be required to have a credit or debit card on file to use telehealth services (unless you do not have a credit or debit card.)</strong> No shows or late cancels will be handled in accordance with our stated policies and procedures.
              </p>

              <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Records</h4>
              <p style={{ marginBottom: '1rem' }}>
                The telehealth sessions shall not be recorded in any way unless agreed to in writing by mutual consent. I will maintain a record of our session in the same way I maintain records of in-person sessions in accordance with my policies.
              </p>
            </div>
          </div>

          <h3 className="step-title" style={{ fontSize: '1.4rem' }}>Emergency Contact Information</h3>
          <p className="step-subtitle">Please provide an emergency contact who is near your location.</p>
          
          <div style={{ marginBottom: '2rem' }}>
            {emergencyContacts.map((contact, index) => (
              <div className="form-grid" key={index} style={{ gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                <div className="input-group" style={{ marginBottom: 0, flex: 2 }}>
                  <input 
                    type="text" 
                    placeholder=" " 
                    value={contact.name} 
                    onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)} 
                    required={index === 0} 
                  />
                  <label>Name of Emergency Contact</label>
                </div>
                <div className="input-group" style={{ marginBottom: 0, flex: 2 }}>
                  <input 
                    type="tel" 
                    placeholder=" " 
                    value={contact.phone} 
                    onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)} 
                    required={index === 0} 
                  />
                  <label>Contact Phone Number</label>
                </div>
                {emergencyContacts.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeEmergencyContact(index)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem', marginTop: '0.2rem' }}
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addEmergencyContact}
              style={{ background: 'none', border: '2px dashed rgba(28,43,76,0.2)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>+</span> Add another emergency contact
            </button>
          </div>

          <div className="consent-box" style={{ marginTop: '2rem' }}>
            <h4>Informed Consent Agreement</h4>
            <p>
              This agreement is intended as a supplement to the general informed consent that we agreed to at the outset of our clinical work together and does not amend any of the terms of that agreement. Your signature below indicates agreement with its terms and conditions.
            </p>
            
            <div className="signature-section" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: 2, minWidth: '300px' }}>
                <span className="signature-label">Patient Signature (Required)</span>
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
      title="Submit Telehealth Consent"
      message="Are you sure you want to submit your Telehealth Consent Form? Please ensure all information is accurate and you have reviewed the PDF preview."
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

export default TelehealthForm;
