import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const PRIMARY = '#1c2b4c';
const SECONDARY = '#b89053';
const TEXT_DARK = '#0f172a';
const TEXT_MUTED = '#64748b';
const BORDER = '#e2e8f0';
const BG_LIGHT = '#f8fafc';

const styles = StyleSheet.create({
  page: { backgroundColor: '#ffffff', paddingBottom: 60, fontFamily: 'Helvetica' },
  headerWrap: { backgroundColor: PRIMARY, paddingVertical: 30, paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: SECONDARY },
  headerLeft: { flex: 1 },
  clinicName: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: 0.5, marginBottom: 4 },
  formTitle: { fontSize: 11, color: SECONDARY, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Helvetica-Bold' },
  headerRight: { textAlign: 'right' },
  contactText: { fontSize: 9, color: '#94a3b8', marginBottom: 2 },
  content: { paddingVertical: 30, paddingHorizontal: 40 },
  sectionBlock: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: BORDER, paddingBottom: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: PRIMARY, textTransform: 'uppercase', letterSpacing: 1 },
  sectionAccent: { width: 40, height: 2, backgroundColor: SECONDARY, position: 'absolute', bottom: -1.5, left: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: -8, marginRight: -8 },
  colHalf: { width: '50%', paddingHorizontal: 8, marginBottom: 12 },
  colThird: { width: '33.33%', paddingHorizontal: 8, marginBottom: 12 },
  colFull: { width: '100%', paddingHorizontal: 8, marginBottom: 12 },
  fieldContainer: { backgroundColor: BG_LIGHT, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#f1f5f9' },
  fieldLabel: { fontSize: 7.5, color: TEXT_MUTED, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 4 },
  fieldValue: { fontSize: 11, color: TEXT_DARK, lineHeight: 1.4, minHeight: 14 },
  checkboxGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  checkboxItem: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }, 
  checkboxBox: { width: 12, height: 12, borderRadius: 2, backgroundColor: SECONDARY, marginRight: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  checkboxInner: { width: 6, height: 6, backgroundColor: '#ffffff', borderRadius: 1 },
  checkboxText: { fontSize: 10, color: TEXT_DARK },
  sigSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  sigBlock: { width: '60%', position: 'relative' },
  dateBlock: { width: '30%', position: 'relative' },
  sigLine: { borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8, marginTop: 45, fontSize: 9, color: TEXT_MUTED, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  sigImage: { width: 160, height: 40, position: 'absolute', top: 0, left: 10 },
  sigDate: { position: 'absolute', top: 20, left: 10, fontSize: 12, color: TEXT_DARK },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, borderTopWidth: 1, borderTopColor: BORDER, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40 },
  footerText: { fontSize: 8, color: TEXT_MUTED, letterSpacing: 0.2 },
});

const Header = () => (
  <View style={styles.headerWrap} fixed>
    <View style={styles.headerLeft}>
      <Text style={styles.clinicName}>Piedmont Counseling</Text>
      <Text style={styles.formTitle}>Client Intake Assessment</Text>
    </View>
    <View style={styles.headerRight}>
      <Text style={styles.contactText}>4917 Piedmont Pkwy, Suite 104</Text>
      <Text style={styles.contactText}>Jamestown, NC 27282</Text>
      <Text style={[styles.contactText, { color: SECONDARY, fontFamily: 'Helvetica-Bold', marginTop: 2 }]}> (336) 493-5600</Text>
    </View>
  </View>
);

const Footer = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>Piedmont Counseling & Development Services, PLLC • Confidential Medical Record</Text>
    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `PAGE ${pageNumber} OF ${totalPages}`} />
  </View>
);

const SectionTitle = ({ children }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{children}</Text>
    <View style={styles.sectionAccent} />
  </View>
);

const Field = ({ label, value, width = 'colHalf' }) => (
  <View style={styles[width]}>
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  </View>
);

const Signature = ({ label, imgData, date }) => (
  <View style={styles.sigSection}>
    <View style={styles.sigBlock}>
      {Boolean(imgData) && <Image style={styles.sigImage} src={imgData} />}
      <Text style={styles.sigLine}>{label}</Text>
    </View>
    <View style={styles.dateBlock}>
      <Text style={styles.sigDate}>{date || '—'}</Text>
      <Text style={styles.sigLine}>Date Signed</Text>
    </View>
  </View>
);

const IntakePDFDocument = ({ formData = {} }) => {
  const medications = Array.isArray(formData.medications) ? formData.medications : [];
  const symptoms = Array.isArray(formData.symptoms) ? formData.symptoms : [];
  
  return (
    <Document>
      {/* PAGE 1: Client Information */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Client Information</SectionTitle>
            <View style={styles.grid}>
              <Field label="First Name" value={formData.firstName} width="colHalf" />
              <Field label="Last Name" value={formData.lastName} width="colHalf" />
              <Field label="Date of Birth" value={formData.dob} width="colThird" />
              <Field label="Social Security #" value={formData.ssn} width="colThird" />
              <Field label="Gender" value={formData.gender} width="colThird" />
              <Field label="Sexual Orientation" value={formData.orientation} width="colFull" />
              <Field label="Street Address" value={formData.address} width="colFull" />
              <Field label="City" value={formData.city} width="colThird" />
              <Field label="State" value={formData.state} width="colThird" />
              <Field label="Zip" value={formData.zip} width="colThird" />
              <Field label="Home Phone" value={formData.phoneHome} width="colThird" />
              <Field label="Cell Phone" value={formData.phoneCell} width="colThird" />
              <Field label="Work Phone" value={formData.phoneWork} width="colThird" />
              <Field label="Email Address" value={formData.email} width="colFull" />
              <Field label="May I leave a message?" value={formData.leaveMessage} width="colHalf" />
              <Field label="With Whom?" value={formData.messageWithWhom} width="colHalf" />
            </View>
            
            <Text style={[styles.fieldLabel, { marginTop: 15, marginBottom: 8 }]}>Emergency Contact</Text>
            <View style={styles.grid}>
              <Field label="Name" value={formData.emergencyName} width="colThird" />
              <Field label="Phone #" value={formData.emergencyPhone} width="colThird" />
              <Field label="Relationship" value={formData.emergencyRelationship} width="colThird" />
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 15, marginBottom: 8 }]}>Referral</Text>
            <View style={styles.grid}>
              <Field label="Name of person who referred you" value={formData.referredBy} width="colHalf" />
              <Field label="May we thank them?" value={formData.thankReferral} width="colHalf" />
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      {/* PAGE 2: Clinical Information */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Clinical Information</SectionTitle>
            <View style={styles.grid}>
              <Field label="Nature of current problem(s) and why seeking treatment now" value={formData.currentProblem} width="colFull" />
              <Field label="What are you hoping to achieve through therapy?" value={formData.therapyGoals} width="colFull" />
            </View>
            
            <Text style={[styles.fieldLabel, { marginTop: 15, marginBottom: 8 }]}>Previous Inpatient or Outpatient treatment and/or counseling</Text>
            <View style={styles.grid}>
              <Field label="Where" value={formData.prevTreatmentWhere} width="colThird" />
              <Field label="When" value={formData.prevTreatmentWhen} width="colThird" />
              <Field label="With Whom" value={formData.prevTreatmentWhom} width="colThird" />
              <Field label="Did you find it helpful? Why/why not:" value={formData.prevTreatmentHelpful} width="colFull" />
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      {/* PAGE 3: Social & Education */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Social & Education</SectionTitle>
            
            <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>Household Members</Text>
            <View style={styles.grid}>
              {[1, 2, 3, 4].map(num => (
                (formData[`householdName${num}`] || formData[`householdAge${num}`]) ? (
                  <React.Fragment key={num}>
                    <Field label={`Name ${num}`} value={formData[`householdName${num}`]} width="colThird" />
                    <Field label={`Age ${num}`} value={formData[`householdAge${num}`]} width="colThird" />
                    <Field label={`Supportive? ${num}`} value={formData[`householdSupportive${num}`]} width="colThird" />
                  </React.Fragment>
                ) : null
              ))}
            </View>
            
            <Text style={[styles.fieldLabel, { marginTop: 15, marginBottom: 8 }]}>Education & Occupation</Text>
            <View style={styles.grid}>
              <Field label="Name of school if currently enrolled" value={formData.schoolEnrolled} width="colFull" />
              <Field label="High School Diploma" value={formData.hsDiploma} width="colThird" />
              <Field label="GED" value={formData.ged} width="colThird" />
              <Field label="College" value={formData.college === 'Yes' ? `Yes (${formData.collegeYears} years)` : formData.college} width="colThird" />
              <Field label="Degree(s)" value={formData.degree} width="colHalf" />
              <Field label="Graduate School Degree" value={formData.gradDegree} width="colHalf" />
              <Field label="Present Occupation" value={formData.occupation} width="colHalf" />
              <Field label="Employer" value={formData.employer} width="colHalf" />
              <Field label="Length of Employment" value={formData.employmentLength} width="colHalf" />
              <Field label="Any issues with current employer?" value={formData.employerIssues} width="colHalf" />
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      {/* PAGE 4: Medical History */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Medical History</SectionTitle>
            <View style={styles.grid}>
              <Field label="Primary Care Physician" value={formData.pcp} width="colThird" />
              <Field label="Physician Phone" value={formData.pcpPhone} width="colThird" />
              <Field label="Date of last visit" value={formData.pcpLastVisit} width="colThird" />
              <Field label="Physician Address: Street" value={formData.pcpAddressStreet} width="colFull" />
              <Field label="City" value={formData.pcpCity} width="colThird" />
              <Field label="State" value={formData.pcpState} width="colThird" />
              <Field label="Zip" value={formData.pcpZip} width="colThird" />
              <Field label="May I notify your physician that I am treating you?" value={formData.notifyPcp} width="colFull" />
            </View>
            
            <Text style={[styles.fieldLabel, { marginTop: 15, marginBottom: 8 }]}>Medications / Supplements</Text>
            <View style={styles.grid}>
              {medications.length > 0 && medications[0].name !== '' ? (
                medications.map((med, i) => (
                  <React.Fragment key={i}>
                     <Field label={`Medication ${i+1}`} value={med.name} width="colHalf" />
                     <Field label={`Reason ${i+1}`} value={med.reason} width="colHalf" />
                  </React.Fragment>
                ))
              ) : (
                <Field label="Medications" value="No medications listed" width="colFull" />
              )}
            </View>

            <View style={[styles.grid, { marginTop: 15 }]}>
               <Field label="Serious illnesses or injuries (esp. head)" value={formData.seriousIllnesses} width="colFull" />
               <Field label="Major surgeries to date" value={formData.surgeries} width="colFull" />
               <Field label="Allergies to food or drugs" value={formData.allergies} width="colFull" />
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      {/* PAGE 5: Symptoms Checklist */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Symptoms Checklist</SectionTitle>
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {marginBottom: 10}]}>Currently experiencing:</Text>
              {symptoms.length > 0 ? (
                <View style={styles.checkboxGrid}>
                  {symptoms.map(symptom => (
                    <View key={symptom} style={styles.checkboxItem}>
                      <View style={styles.checkboxBox}><View style={styles.checkboxInner} /></View>
                      <Text style={styles.checkboxText}>{symptom}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.fieldValue}>No symptoms reported.</Text>
              )}
              
              {Boolean(formData.otherSymptoms) && (
                 <View style={{ marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: BORDER }}>
                   <Text style={styles.fieldLabel}>Other symptoms</Text>
                   <Text style={styles.fieldValue}>{formData.otherSymptoms}</Text>
                 </View>
              )}
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      {/* PAGE 6: Legal Authorizations */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Consents, Policies & Signatures</SectionTitle>
            
            <View style={[styles.fieldContainer, { backgroundColor: '#fdf8f6', borderColor: '#fef08a' }]}>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY }]}>
                I/We consent that <Text style={{ fontFamily: 'Helvetica-Bold' }}>{formData.consentClientName || '_________________________'}</Text> may be treated as a client by Piedmont Counseling & Development Services, PLLC. By signing below, I acknowledge that I have read, understand, and agree to the Consent for Treatment, Office Policies, and HIPAA Notice of Privacy Practices provided to me.
              </Text>
            </View>

            <View style={{ marginTop: 30 }}>
              <Signature 
                label="Patient Signature" 
                imgData={formData.signatureData} 
                date={formData.patientSignatureDate} 
              />
              
              <View style={{ height: 40 }} />
              
              <Signature 
                label="Parent / Guardian Signature (If Applicable)" 
                imgData={formData.guardianSignatureData} 
                date={formData.guardianSignatureDate} 
              />
              
              <View style={{ height: 40 }} />

              <Signature 
                label="Client Signature for Office Policies Acknowledgment" 
                imgData={formData.officePoliciesSignatureData} 
                date={formData.officePoliciesSignatureDate} 
              />
              
              <View style={{ height: 40 }} />

              <Signature 
                label="Client Signature for HIPAA Acknowledgment" 
                imgData={formData.hipaaSignatureData} 
                date={formData.hipaaSignatureDate} 
              />
            </View>
          </View>
        </View>
        <Footer />
      </Page>
    </Document>
  );
};

export default IntakePDFDocument;
