import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export const ClientInfo = ({ formData, handleChange }) => (
  <div className="step-content">
    <h3 className="step-title">Client Information</h3>
    <p className="step-subtitle">NOTE: If the client is under 18 years of age, this form must be completed and signed by a parent or legal guardian.</p>
    
    <div className="form-grid">
      <div className="input-group">
        <input type="text" name="firstName" placeholder=" " value={formData.firstName || ''} onChange={handleChange} required />
        <label>First Name (FULL NAME)</label>
      </div>
      <div className="input-group">
        <input type="text" name="lastName" placeholder=" " value={formData.lastName || ''} onChange={handleChange} required />
        <label>Last Name</label>
      </div>
      <div className="input-group">
        <input type="date" name="dob" placeholder=" " value={formData.dob || ''} onChange={handleChange} required />
        <label className="active-label">Date of Birth</label>
      </div>
      <div className="input-group">
        <input type="text" name="ssn" placeholder=" " value={formData.ssn || ''} onChange={handleChange} />
        <label>Social Security #</label>
      </div>
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <p className="step-subtitle" style={{ marginBottom: '0.5rem' }}>Gender:</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {['Male', 'Female', 'Transgender', 'MtF', 'FtM', 'Other', 'Refuse', 'Don\'t know'].map(g => (
          <label key={g} className="checkbox-label">
            <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} />
            <span className="checkbox-text">{g}</span>
          </label>
        ))}
      </div>
    </div>

    <div style={{ marginBottom: '2rem' }}>
      <p className="step-subtitle" style={{ marginBottom: '0.5rem' }}>Sexual Orientation:</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {['Heterosexual', 'Bisexual', 'Gay', 'Lesbian', 'Questioning'].map(o => (
          <label key={o} className="checkbox-label">
            <input type="radio" name="orientation" value={o} checked={formData.orientation === o} onChange={handleChange} />
            <span className="checkbox-text">{o}</span>
          </label>
        ))}
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
    </div>

    <div className="form-grid">
      <div className="input-group">
        <input type="tel" name="phoneHome" placeholder=" " value={formData.phoneHome || ''} onChange={handleChange} />
        <label>Home Phone</label>
      </div>
      <div className="input-group">
        <input type="tel" name="phoneCell" placeholder=" " value={formData.phoneCell || ''} onChange={handleChange} required />
        <label>Cell Phone</label>
      </div>
      <div className="input-group">
        <input type="tel" name="phoneWork" placeholder=" " value={formData.phoneWork || ''} onChange={handleChange} />
        <label>Work Phone</label>
      </div>
      <div className="input-group">
        <input type="email" name="email" placeholder=" " value={formData.email || ''} onChange={handleChange} required />
        <label>Email Address</label>
      </div>
    </div>

    <div className="form-grid" style={{ alignItems: 'center', marginBottom: '1.5rem' }}>
      <p style={{ color: 'var(--color-text)' }}>May I leave a message?</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <label className="checkbox-label"><input type="radio" name="leaveMessage" value="Yes" checked={formData.leaveMessage === 'Yes'} onChange={handleChange} /><span className="checkbox-text">YES</span></label>
        <label className="checkbox-label"><input type="radio" name="leaveMessage" value="No" checked={formData.leaveMessage === 'No'} onChange={handleChange} /><span className="checkbox-text">NO</span></label>
      </div>
      <div className="input-group" style={{ marginBottom: 0 }}>
        <input type="text" name="messageWithWhom" placeholder=" " value={formData.messageWithWhom || ''} onChange={handleChange} />
        <label>With Whom?</label>
      </div>
    </div>

    <h4 style={{ color: 'var(--color-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Emergency Contact</h4>
    <div className="form-grid">
      <div className="input-group">
        <input type="text" name="emergencyName" placeholder=" " value={formData.emergencyName || ''} onChange={handleChange} required />
        <label>Name</label>
      </div>
      <div className="input-group">
        <input type="tel" name="emergencyPhone" placeholder=" " value={formData.emergencyPhone || ''} onChange={handleChange} required />
        <label>Phone #</label>
      </div>
      <div className="input-group">
        <input type="text" name="emergencyRelationship" placeholder=" " value={formData.emergencyRelationship || ''} onChange={handleChange} required />
        <label>Relationship</label>
      </div>
    </div>

    <h4 style={{ color: 'var(--color-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Referral</h4>
    <div className="form-grid" style={{ alignItems: 'center' }}>
      <div className="input-group" style={{ marginBottom: 0 }}>
        <input type="text" name="referredBy" placeholder=" " value={formData.referredBy || ''} onChange={handleChange} />
        <label>Name of person who referred you (optional)</label>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-text)' }}>May we thank them?</p>
        <label className="checkbox-label"><input type="radio" name="thankReferral" value="Yes" checked={formData.thankReferral === 'Yes'} onChange={handleChange} /><span className="checkbox-text">YES</span></label>
        <label className="checkbox-label"><input type="radio" name="thankReferral" value="No" checked={formData.thankReferral === 'No'} onChange={handleChange} /><span className="checkbox-text">NO</span></label>
      </div>
    </div>
  </div>
);

export const ClinicalInfo = ({ formData, handleChange }) => (
  <div className="step-content">
    <h3 className="step-title">Clinical Information</h3>
    <div className="input-group full-width">
      <textarea name="currentProblem" placeholder=" " value={formData.currentProblem || ''} onChange={handleChange} required rows={3}></textarea>
      <label>Briefly state the nature of current problem(s) and why you are seeking treatment now:</label>
    </div>
    <div className="input-group full-width">
      <textarea name="therapyGoals" placeholder=" " value={formData.therapyGoals || ''} onChange={handleChange} required rows={3}></textarea>
      <label>What are you hoping to achieve through therapy?</label>
    </div>
    
    <h4 style={{ color: 'var(--color-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Previous Inpatient or Outpatient treatment and/or counseling</h4>
    <div className="form-grid">
      <div className="input-group">
        <input type="text" name="prevTreatmentWhere" placeholder=" " value={formData.prevTreatmentWhere || ''} onChange={handleChange} />
        <label>Where</label>
      </div>
      <div className="input-group">
        <input type="text" name="prevTreatmentWhen" placeholder=" " value={formData.prevTreatmentWhen || ''} onChange={handleChange} />
        <label>When</label>
      </div>
      <div className="input-group">
        <input type="text" name="prevTreatmentWhom" placeholder=" " value={formData.prevTreatmentWhom || ''} onChange={handleChange} />
        <label>With Whom</label>
      </div>
    </div>
    <div className="input-group full-width">
      <textarea name="prevTreatmentHelpful" placeholder=" " value={formData.prevTreatmentHelpful || ''} onChange={handleChange} rows={2}></textarea>
      <label>Did you find it helpful? Why/why not:</label>
    </div>
  </div>
);

export const SocialEducation = ({ formData, handleChange }) => (
  <div className="step-content">
    <h3 className="step-title">Social & Education</h3>
    
    <h4 style={{ color: 'var(--color-primary)', marginTop: '1rem', marginBottom: '1rem' }}>Social</h4>
    <p className="step-subtitle">Please list the names and ages of everyone who lives in your home:</p>
    {[1, 2, 3, 4].map(num => (
      <div className="form-grid" style={{ gap: '1rem', marginBottom: '0.5rem' }} key={num}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <input type="text" name={`householdName${num}`} placeholder=" " value={formData[`householdName${num}`] || ''} onChange={handleChange} />
          <label>Name</label>
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <input type="text" name={`householdAge${num}`} placeholder=" " value={formData[`householdAge${num}`] || ''} onChange={handleChange} />
          <label>Age</label>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Supportive?</span>
          <label className="checkbox-label"><input type="radio" name={`householdSupportive${num}`} value="Yes" checked={formData[`householdSupportive${num}`] === 'Yes'} onChange={handleChange} /><span className="checkbox-text">YES</span></label>
          <label className="checkbox-label"><input type="radio" name={`householdSupportive${num}`} value="No" checked={formData[`householdSupportive${num}`] === 'No'} onChange={handleChange} /><span className="checkbox-text">NO</span></label>
        </div>
      </div>
    ))}

    <h4 style={{ color: 'var(--color-primary)', marginTop: '2.5rem', marginBottom: '1rem' }}>Education & Occupation</h4>
    <div className="input-group full-width">
      <input type="text" name="schoolEnrolled" placeholder=" " value={formData.schoolEnrolled || ''} onChange={handleChange} />
      <label>Name of school if currently enrolled</label>
    </div>
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '1.5rem' }}>
      <div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>High School Diploma:</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <label className="checkbox-label"><input type="radio" name="hsDiploma" value="Yes" checked={formData.hsDiploma === 'Yes'} onChange={handleChange} /><span className="checkbox-text">YES</span></label>
          <label className="checkbox-label"><input type="radio" name="hsDiploma" value="No" checked={formData.hsDiploma === 'No'} onChange={handleChange} /><span className="checkbox-text">NO</span></label>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>GED:</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <label className="checkbox-label"><input type="radio" name="ged" value="Yes" checked={formData.ged === 'Yes'} onChange={handleChange} /><span className="checkbox-text">YES</span></label>
          <label className="checkbox-label"><input type="radio" name="ged" value="No" checked={formData.ged === 'No'} onChange={handleChange} /><span className="checkbox-text">NO</span></label>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>College:</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <label className="checkbox-label"><input type="radio" name="college" value="Yes" checked={formData.college === 'Yes'} onChange={handleChange} /><span className="checkbox-text">YES</span></label>
          <label className="checkbox-label"><input type="radio" name="college" value="No" checked={formData.college === 'No'} onChange={handleChange} /><span className="checkbox-text">NO</span></label>
          {['1','2','3','4'].map(yr => (
            <label key={yr} className="checkbox-label"><input type="radio" name="collegeYears" value={yr} checked={formData.collegeYears === yr} onChange={handleChange} /><span className="checkbox-text">{yr}</span></label>
          ))}
        </div>
      </div>
    </div>

    <div className="form-grid">
      <div className="input-group">
        <input type="text" name="degree" placeholder=" " value={formData.degree || ''} onChange={handleChange} />
        <label>Degree(s)</label>
      </div>
      <div className="input-group">
        <input type="text" name="gradDegree" placeholder=" " value={formData.gradDegree || ''} onChange={handleChange} />
        <label>Graduate School Degree</label>
      </div>
      <div className="input-group">
        <input type="text" name="occupation" placeholder=" " value={formData.occupation || ''} onChange={handleChange} />
        <label>Present Occupation</label>
      </div>
      <div className="input-group">
        <input type="text" name="employer" placeholder=" " value={formData.employer || ''} onChange={handleChange} />
        <label>Employer</label>
      </div>
      <div className="input-group">
        <input type="text" name="employmentLength" placeholder=" " value={formData.employmentLength || ''} onChange={handleChange} />
        <label>Length of Employment</label>
      </div>
      <div className="input-group">
        <input type="text" name="employerIssues" placeholder=" " value={formData.employerIssues || ''} onChange={handleChange} />
        <label>Any issues with current employer?</label>
      </div>
    </div>
  </div>
);

export const MedicalHistory = ({ formData, handleChange, setFormData }) => {
  const medications = Array.isArray(formData.medications) ? formData.medications : [{ name: '', reason: '' }];

  const handleMedChange = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setFormData(prev => ({ ...prev, medications: newMeds }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...medications, { name: '', reason: '' }]
    }));
  };

  const removeMedication = (index) => {
    if (medications.length === 1) return; // Keep at least one
    const newMeds = medications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, medications: newMeds }));
  };

  return (
    <div className="step-content">
      <h3 className="step-title">Medical History</h3>
      <div className="form-grid">
        <div className="input-group">
          <input type="text" name="pcp" placeholder=" " value={formData.pcp || ''} onChange={handleChange} />
          <label>Primary Care Physician</label>
        </div>
        <div className="input-group">
          <input type="tel" name="pcpPhone" placeholder=" " value={formData.pcpPhone || ''} onChange={handleChange} />
          <label>Physician Phone</label>
        </div>
        <div className="input-group">
          <input type="date" name="pcpLastVisit" placeholder=" " value={formData.pcpLastVisit || ''} onChange={handleChange} />
          <label className="active-label">Date of last visit</label>
        </div>
      </div>

      <div className="input-group">
        <input type="text" name="pcpAddressStreet" placeholder=" " value={formData.pcpAddressStreet || ''} onChange={handleChange} />
        <label>Physician Address: Street</label>
      </div>
      <div className="form-grid">
        <div className="input-group">
          <input type="text" name="pcpCity" placeholder=" " value={formData.pcpCity || ''} onChange={handleChange} />
          <label>City</label>
        </div>
        <div className="input-group">
          <input type="text" name="pcpState" placeholder=" " value={formData.pcpState || ''} onChange={handleChange} />
          <label>State</label>
        </div>
        <div className="input-group">
          <input type="text" name="pcpZip" placeholder=" " value={formData.pcpZip || ''} onChange={handleChange} />
          <label>Zip</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--color-text)' }}>May I notify your physician that I am treating you?</p>
        <label className="checkbox-label"><input type="radio" name="notifyPcp" value="Yes" checked={formData.notifyPcp === 'Yes'} onChange={handleChange} /><span className="checkbox-text">YES</span></label>
        <label className="checkbox-label"><input type="radio" name="notifyPcp" value="No" checked={formData.notifyPcp === 'No'} onChange={handleChange} /><span className="checkbox-text">NO</span></label>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p className="step-subtitle" style={{ marginBottom: '1rem' }}>List any medications or nutritional supplements you currently take and reasons:</p>
        {medications.map((med, index) => (
          <div className="form-grid" key={index} style={{ gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
            <div className="input-group" style={{ marginBottom: 0, flex: 1.5 }}>
              <input 
                type="text" 
                placeholder=" " 
                value={med.name} 
                onChange={(e) => handleMedChange(index, 'name', e.target.value)} 
              />
              <label>Name of medication/supplement</label>
            </div>
            <div className="input-group" style={{ marginBottom: 0, flex: 2 }}>
              <input 
                type="text" 
                placeholder=" " 
                value={med.reason} 
                onChange={(e) => handleMedChange(index, 'reason', e.target.value)} 
              />
              <label>Reason for taking</label>
            </div>
            {medications.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeMedication(index)}
                style={{ 
                  background: 'none', border: 'none', color: '#ef4444', 
                  fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem', marginTop: '0.2rem'
                }}
                title="Remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={addMedication}
          style={{ 
            background: 'none', border: '2px dashed rgba(28,43,76,0.2)', 
            color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '8px', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.9rem', fontWeight: '500'
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>+</span> Add another medication
        </button>
      </div>

      <div className="input-group full-width">
        <textarea name="seriousIllnesses" placeholder=" " value={formData.seriousIllnesses || ''} onChange={handleChange} rows={2}></textarea>
        <label>List any serious illnesses or injuries, especially those involving the head:</label>
      </div>
      <div className="input-group full-width">
        <textarea name="surgeries" placeholder=" " value={formData.surgeries || ''} onChange={handleChange} rows={2}></textarea>
        <label>List any major surgeries you have had to date:</label>
      </div>
      <div className="input-group full-width">
        <textarea name="allergies" placeholder=" " value={formData.allergies || ''} onChange={handleChange} rows={2}></textarea>
        <label>List allergies to food or drugs:</label>
      </div>
    </div>
  );
};

export const SymptomsChecklist = ({ formData, handleCheckboxChange, handleChange }) => {
  const symptomsList = [
    "Family Problems", "Forgetfulness or difficulty concentrating",
    "Relationship Problems", "Sleep Disturbance",
    "Death/Illness of loved one", "Unexplained mood changes",
    "Parenting Difficulties", "Irritability and Anger",
    "Financial stress", "Feelings of sadness or guilt",
    "Legal problems", "Social Withdrawal",
    "Difficulty with daily routine", "Feelings of helplessness/hopelessness",
    "Appetite Changes", "Fatigue",
    "Loss of sexual interest", "Substance abuse/addiction",
    "Decreased interest in activities", "Anxiousness and/or nervousness",
    "Compulsive behaviors", "Obsessive thoughts",
    "Stress", "Difficulty relaxing",
    "Eating Disorder", "Poor self-esteem/body image",
    "Racing thoughts", "Pornography",
    "History of Violence", "Self-Injury (history or current)",
    "Thoughts of harming self", "Thoughts of harming others",
    "Difficulty controlling impulses", "Gambling"
  ];

  return (
    <div className="step-content">
      <h3 className="step-title">Symptoms Checklist</h3>
      <p className="step-subtitle">PLEASE CHECK ANY OF THE FOLLOWING SYMPTOMS YOU ARE CURRENTLY EXPERIENCING:</p>
      <div className="checkbox-grid">
        {symptomsList.map((symptom) => (
          <label key={symptom} className="checkbox-label">
            <input 
              type="checkbox" 
              checked={formData.symptoms?.includes(symptom) || false}
              onChange={(e) => handleCheckboxChange(symptom, e.target.checked)}
            />
            <span className="checkbox-text">{symptom}</span>
          </label>
        ))}
      </div>
      <div className="input-group full-width" style={{ marginTop: '1.5rem' }}>
        <input type="text" name="otherSymptoms" placeholder=" " value={formData.otherSymptoms || ''} onChange={handleChange} />
        <label>Other symptoms (please specify):</label>
      </div>
    </div>
  );
};

export const ConsentsSignatures = ({ formData, handleChange, handleSignatureEnd, sigPadRef, handleGuardianSignatureEnd, guardianSigPadRef, handleHipaaSignatureEnd, hipaaSigPadRef }) => (
  <div className="step-content">
    <h3 className="step-title">Consents, Policies & Signatures</h3>
    
    <div className="consent-box" style={{ marginBottom: '2rem' }}>
      <h4>Consent for Treatment</h4>
      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', maxHeight: '200px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '1rem' }}>
        <p>I hereby give consent to Piedmont Counseling & Development Services, PLLC to provide evaluation, treatment, and/or other services that we may mutually determine to be appropriate. I understand that services will be rendered in a professional manner consistent with accepted ethical standards. I acknowledge that I have reviewed and read the professional disclosure sheet and the HIPPA information sheet.</p>
        <p>I understand that I must cancel an appointment at least 24 hours before the scheduled time (excluding emergencies). Otherwise, I will be charged a cancellation fee for the session. Payment will be due and payable to Piedmont Counseling at the beginning of each session unless other arrangements have been negotiated.</p>
        <p>I understand that if payment for services I received here is not made, the therapist may stop my treatment. I understand that I may discontinue my involvement in therapy at any time.</p>
        <p>If I choose to do so, I will inform the therapist of my decision. Due to typical work schedules of therapists, I understand that it may take my therapist up to 48 hours to return a phone call. I also understand that calls made over the weekends and holidays will not be returned until the following business day. If at any time during treatment I cannot wait for a return call from my therapist, I agree to contact my psychiatrist, Mobile crisis, my primary physician, or go to the nearest emergency room.</p>
      </div>
      
      <p style={{ marginTop: '1.5rem', marginBottom: '1.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', color: 'var(--color-primary)' }}>
        I/We consent that 
        <input 
          type="text" 
          name="consentClientName" 
          value={formData.consentClientName || ''} 
          onChange={handleChange} 
          placeholder="Client Name" 
          style={{ 
            border: 'none', borderBottom: '2px solid var(--color-primary)', 
            background: 'transparent', outline: 'none', fontSize: '1rem', 
            padding: '0.2rem 0.5rem', width: '220px', textAlign: 'center',
            color: 'var(--color-primary)', fontWeight: '600'
          }} 
          required 
        /> 
        may be treated as a client by Piedmont Counseling & Development Services, PLLC.
      </p>

      <div className="form-grid" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div className="signature-section" style={{ flex: 2, minWidth: '300px' }}>
            <span className="signature-label">Patient Signature</span>
            <div className="signature-container" style={{ border: '1px solid rgba(28,43,76,0.2)', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', height: '120px' }}>
              <SignatureCanvas ref={sigPadRef} penColor="#1c2b4c" canvasProps={{ className: 'sigCanvas' }} onEnd={handleSignatureEnd} />
            </div>
            <button type="button" className="btn-clear" onClick={() => { sigPadRef.current.clear(); handleSignatureEnd(); }}>Clear</button>
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: '150px', marginTop: '1.5rem' }}>
            <input type="date" name="patientSignatureDate" placeholder=" " value={formData.patientSignatureDate || ''} onChange={handleChange} required />
            <label className="active-label">Date</label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div className="signature-section" style={{ flex: 2, minWidth: '300px' }}>
            <span className="signature-label">Parent / Guardian Signature</span>
            <div className="signature-container" style={{ border: '1px solid rgba(28,43,76,0.2)', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', height: '120px' }}>
              <SignatureCanvas ref={guardianSigPadRef} penColor="#1c2b4c" canvasProps={{ className: 'sigCanvas' }} onEnd={handleGuardianSignatureEnd} />
            </div>
            <button type="button" className="btn-clear" onClick={() => { guardianSigPadRef.current.clear(); handleGuardianSignatureEnd(); }}>Clear</button>
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: '150px', marginTop: '1.5rem' }}>
            <input type="date" name="guardianSignatureDate" placeholder=" " value={formData.guardianSignatureDate || ''} onChange={handleChange} />
            <label className="active-label">Date</label>
          </div>
        </div>
      </div>
    </div>

    <div className="consent-box" style={{ marginBottom: '2rem' }}>
      <h4>Office Policies</h4>
      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', maxHeight: '200px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '1rem' }}>
        <ul style={{ paddingLeft: '1.2rem', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <li>Please keep this information for future reference.</li>
          <li>When you come in for your session, please take a seat in the waiting room and I will come out to greet you at our scheduled time.</li>
          <li>The standard sessions last 50 minutes. If you have insurance, there is a contracted rate for your sessions. The charge for the first session is $150.00 and the charge for ongoing sessions is $130.00.</li>
          <li>For contact between sessions, please call the office number listed above. I will check messages daily except on weekends and holidays. <strong>If you experience an after hours emergency, please call (1) 911, (2) Mobile Crisis Management services in your county Guilford/Randolph 1 (877) 626-1772 or Davidson 1 (866) 275-9552, or (3) High Point Regionals Assessment team at (336) 878-6098.</strong></li>
          <li>Please make payment in the form of cash, debit, or credit card at the beginning of each session.</li>
          <li>If you need to cancel or reschedule an appointment please notify me at least 24 hours in advance. Failure to provide 24 hour notice, except in the case of emergency, will result in a charge for the missed session. Please note that <strong>if your session is scheduled for Monday the cancellation policy requires cancellation by the end of the business day on Friday.</strong> The fee for cancellation or no show will be $50. <strong>Please Note: This fee must be paid before additional appointments are given. Your insurance will not cover this charge.</strong> In the event of inclement weather, I will attempt to contact you by phone regarding your session time. You may also call (336) 493-5600 to hear schedule changes.</li>
          <li>Completing disability forms, FMLA forms, school psychological evaluations, report writing and some types of testing, and other requested supplemental insurance forms requires time away from patient care and day to day business operations. <strong>Prepayment of $25.00 per form is required.</strong> Please understand that in order to complete forms your medical record must be reviewed, forms completed and signed by the physician and copied into your medical record. Some of these forms can be quite complicated and tedious to fill out. Please provide us with pertinent information, especially dates of disability and return to work. We request that you allow 5 business days for this process.</li>
          <li>If you become involved in any legal matter that requires your therapist to testify in court, or to prepare reports for your attorney or the court, you will be charged $100.00 per hour for these special services. These services will not be billed to insurance as they are not mental health therapy/evaluation services.</li>
        </ul>
      </div>
      <label className="checkbox-label" style={{ marginTop: '0.5rem' }}>
        <input type="checkbox" required />
        <span className="checkbox-text" style={{ fontWeight: '600' }}>I acknowledge and agree to the Office Policies</span>
      </label>
    </div>

    <div className="consent-box">
      <h4>HIPAA Notice of Privacy Practices</h4>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', maxHeight: '250px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '1rem', lineHeight: '1.6' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>
        <p style={{ marginBottom: '1rem' }}><strong>Effective date:</strong> February 1, 2014</p>
        <p style={{ marginBottom: '1rem' }}>I will always be totally committed to maintaining client’s confidentiality and will only release healthcare information about you in accordance with federal and state laws and fracture of the counseling profession.</p>
        <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>THIS NOTICE DESCRIBES OUR POLICIES RELATED TO THE USE AND DISCLOSURE OF YOUR HEALTHCARE INFORMATION. PLEASE READ IT CAREFULLY.</p>
        
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>I. Uses and Disclosures of Your Health Information for the Purposes of Providing Services</p>
        <p style={{ marginBottom: '1rem' }}>I may use or disclose protected information (PHI) for treatment, payment, and healthcare operations purposes without your consents, according to state and federal laws. <em>Treatment.</em> I may need to use or disclose health information about you to provide, manage, or coordinate health care or related services. This could include consultation with other healthcare providers. <em>Payment.</em> Information may be disclosed in order to obtain reimbursement for your healthcare. This may be needed to verify insurance coverage and/or benefits with your insurance carrier, to process sure claims, and information needed for billing and collection purposes. <em>Healthcare Operations.</em> I may need to use information about you to review activities that relate to the performance and operation of my practice. This could include such business related matters as audits, case management, certification, compliance, and licensing activities.</p>
        
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>II. Uses and Disclosures Requiring Authorization</p>
        <p style={{ marginBottom: '1rem' }}>Any use or disclosure of your PHI for purposes outside of treatment, payment, and healthcare operations requires a written authorization from you. This authorization provides permission above and beyond the general consent and permit only specific disclosures.</p>
        
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>III. Uses or Disclosures of Your Information Which Does Not Require Your Consent</p>
        <p style={{ marginBottom: '1rem' }}>I may be required to use or disclose your PHI without your consent for authorization in the following circumstances: <em>Abuse:</em> If you provide me with information that leads me to suspect child or elder abuse, neglect, or death due to maltreatment, I must report that information to the county Department of Social Services. If asked by the Department of Social Services to turn over information from your records relevant to a child protective services investigation, I must comply.<br/><br/>
        <em>Judicial or Administrative Proceedings:</em> I may share your information as required by law in the event of a subpoena or court order, or if a crime is committed on our premises. <em>Serious Threat to Health or Safety:</em> I may disclose confidential information to protect you or others from a serious threat of harm by your. <em>Workers Compensation:</em> If you file a Workmen’s Compensation claim, I am required by law to provide your mental health information relevant to the claim to your employer and the North Carolina Industrial Commission.</p>
        
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>IV. Patient Rights:</p>
        <p style={{ marginBottom: '1rem' }}><em>Right to request how we contact you.</em> You have the right to request and receive confidential communications of PHI by alternative means and at alternative locations. <em>Right to release your medical records.</em> You may consent in writing to release your records to others. You have the right to refocus authorization and writing at any time. However, a revocation is not valid to the extent that we acted in reliance on such authorization. <em>Right to inspect and copy your medical and billing records.</em> You have the right to inspect and obtain a copy of your information contained in our medical records. Under limited circumstances, we may deny your request to inspect and copy. If you asked for a copy of any information, we may charge a reasonable fee for the cost of copying, mailing, and supplies. <em>Right to add information or command your medical records.</em> If you feel that information contained in your medical record is incorrect or incomplete, you may ask me to add information or amend the record. Under certain circumstances, I may deny your request to add or amend. On your request, I will discuss with you the details of the amendment process. <em>Right to an accounting of disclosure.</em> You may request an accounting of any disclosures, if any, for which you have neither provided consent, nor authorizations. On your request, I will discuss with you the details of the accounting process. <em>Right to request restrictions on uses and disclosures of your health information.</em> You have the right to ask for restrictions on certain uses and disclosures of your health information. This request must be submitted in writing. However, I am required to agree to such requests. <em>Right to complain.</em> If you believe your privacy rights have been violated, please contact me personally, and we can discuss any and all concerns. If you are not satisfied with the outcome, you may file a written complaint with the US Department of Health and Human Services. I will not retaliate against an individual for filing such a complaint. <em>Right to receive changes in policy.</em> You have the right to obtain a paper copy of the notice, even if you have agreed to receive notice electronically. The therapist reserves the right to change the terms of this notice and to make the new notice provisions effective for all PHI that I maintain. I will provide you with a revised notice by distributing this in the office and/or by mail or e-mail.</p>
      </div>
      <div className="signature-section" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <span className="signature-label">Client Signature for HIPAA Acknowledgment</span>
          <div className="signature-container" style={{ border: '1px solid rgba(28,43,76,0.2)', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', height: '120px' }}>
            <SignatureCanvas ref={hipaaSigPadRef} penColor="#1c2b4c" canvasProps={{ className: 'sigCanvas' }} onEnd={handleHipaaSignatureEnd} />
          </div>
          <button type="button" className="btn-clear" onClick={() => { hipaaSigPadRef.current.clear(); handleHipaaSignatureEnd(); }}>Clear</button>
        </div>
        
        <div className="input-group" style={{ flex: 1, minWidth: '150px', marginTop: '1.5rem' }}>
          <input type="date" name="hipaaSignatureDate" placeholder=" " value={formData.hipaaSignatureDate || ''} onChange={handleChange} required />
          <label className="active-label">Date</label>
        </div>
      </div>
    </div>
  </div>
);
