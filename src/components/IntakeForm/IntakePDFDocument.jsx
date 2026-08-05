import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Removed external Font.register to ensure maximum stability and prevent CORS/Network crashes

const PRIMARY = '#1c2b4c';
const SECONDARY = '#b89053';
const TEXT_DARK = '#0f172a';
const TEXT_MUTED = '#64748b';
const BORDER = '#e2e8f0';
const BG_LIGHT = '#f8fafc';

const styles = StyleSheet.create({
  page: { backgroundColor: '#ffffff', paddingBottom: 60, fontFamily: 'Helvetica' },
  
  // Modern Hero Header
  headerWrap: { backgroundColor: PRIMARY, paddingVertical: 30, paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: SECONDARY },
  headerLeft: { flex: 1 },
  clinicName: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: 0.5, marginBottom: 4 },
  formTitle: { fontSize: 11, color: SECONDARY, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'Helvetica-Bold' },
  headerRight: { textAlign: 'right' },
  contactText: { fontSize: 9, color: '#94a3b8', marginBottom: 2 },
  
  // Content Area
  content: { paddingVertical: 30, paddingHorizontal: 40 },
  
  // Modern Section Titles (Elegant Underline)
  sectionBlock: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: BORDER, paddingBottom: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: PRIMARY, textTransform: 'uppercase', letterSpacing: 1 },
  sectionAccent: { width: 40, height: 2, backgroundColor: SECONDARY, position: 'absolute', bottom: -1.5, left: 0 },
  
  // Grid System
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: -8, marginRight: -8 },
  colHalf: { width: '50%', paddingHorizontal: 8, marginBottom: 12 },
  colThird: { width: '33.33%', paddingHorizontal: 8, marginBottom: 12 },
  colFull: { width: '100%', paddingHorizontal: 8, marginBottom: 12 },
  
  // Modern Clean Fields
  fieldContainer: { backgroundColor: BG_LIGHT, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#f1f5f9' },
  fieldLabel: { fontSize: 7.5, color: TEXT_MUTED, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 4 },
  fieldValue: { fontSize: 11, color: TEXT_DARK, lineHeight: 1.4, minHeight: 14 },
  
  // Checkboxes
  checkboxGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  checkboxItem: { width: '33.33%', flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkboxBox: { width: 12, height: 12, borderRadius: 2, backgroundColor: SECONDARY, marginRight: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  checkboxInner: { width: 6, height: 6, backgroundColor: '#ffffff', borderRadius: 1 },
  checkboxText: { fontSize: 10, color: TEXT_DARK },
  
  // Signatures
  sigSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  sigBlock: { width: '60%', position: 'relative' },
  dateBlock: { width: '30%', position: 'relative' },
  sigLine: { borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8, marginTop: 45, fontSize: 9, color: TEXT_MUTED, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  sigImage: { width: 160, height: 40, position: 'absolute', top: 0, left: 10 },
  sigDate: { position: 'absolute', top: 20, left: 10, fontSize: 12, color: TEXT_DARK },
  
  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, borderTopWidth: 1, borderTopColor: BORDER, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40 },
  footerText: { fontSize: 8, color: TEXT_MUTED, letterSpacing: 0.2 },
});

const Header = () => (
  <View style={styles.headerWrap} fixed>
    <View style={styles.headerLeft}>
      <Text style={styles.clinicName}>Piedmont Life Solutions</Text>
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

const IntakePDFDocument = ({ formData }) => {
  const medications = Array.isArray(formData.medications) ? formData.medications : [];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Demographic Profile</SectionTitle>
            <View style={styles.grid}>
              <Field label="Full Name" value={formData.clientName} width="colFull" />
              <Field label="Date of Birth" value={formData.dob} width="colThird" />
              <Field label="Age" value={formData.age} width="colThird" />
              <Field label="Sex" value={formData.sex} width="colThird" />
              <Field label="Marital Status" value={formData.maritalStatus} width="colHalf" />
              <Field label="Home Address" value={formData.address} width="colHalf" />
              <Field label="City, State, Zip" value={formData.cityStateZip} width="colFull" />
              <Field label="Home Phone" value={formData.homePhone} width="colThird" />
              <Field label="Cell Phone" value={formData.cellPhone} width="colThird" />
              <Field label="Work Phone" value={formData.workPhone} width="colThird" />
              <Field label="Email Address" value={formData.email} width="colHalf" />
              <Field label="Employer" value={formData.employer} width="colHalf" />
              <Field label="Occupation" value={formData.occupation} width="colHalf" />
              <Field label="Length of Employment" value={formData.lengthOfEmployment} width="colHalf" />
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Clinical Focus</SectionTitle>
            <View style={styles.grid}>
              <Field label="Primary Reason for Seeking Help" value={formData.reasonForSeekingHelp} width="colFull" />
              <Field label="Goals for Therapy" value={formData.goals} width="colFull" />
              <Field label="When did this problem start?" value={formData.problemStart} width="colHalf" />
              <Field label="What made you seek help now?" value={formData.seekHelpNow} width="colHalf" />
            </View>
          </View>
        </View>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Medical History</SectionTitle>
            <View style={styles.grid}>
              <Field label="Primary Care Physician" value={formData.pcpName} width="colHalf" />
              <Field label="PCP Phone Number" value={formData.pcpPhone} width="colHalf" />
              <Field label="Date of Last Physical" value={formData.lastPhysicalDate} width="colThird" />
              <Field label="Head Injuries History" value={formData.headInjury} width="colThird" />
              <Field label="Legal Problems" value={formData.legalProblems} width="colThird" />
              <Field label="Major Surgeries" value={formData.surgeries} width="colFull" />
              <Field label="Known Allergies" value={formData.allergies} width="colFull" />
            </View>
            
            <Text style={[styles.fieldLabel, { marginTop: 15, marginBottom: 8 }]}>Active Medications</Text>
            <View style={styles.grid}>
              {medications.length > 0 && medications[0].name !== '' ? (
                medications.map((med, i) => (
                  <Field key={i} label={`Medication: ${med.name}`} value={`Reason: ${med.reason}`} width="colHalf" />
                ))
              ) : (
                <Field label="Medications" value="No medications listed" width="colFull" />
              )}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Symptom Assessment</SectionTitle>
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {marginBottom: 10}]}>Symptoms experienced over the last month:</Text>
              <View style={styles.checkboxGrid}>
                {Object.keys(formData).map(key => {
                  if (key.startsWith('symptom_') && formData[key]) {
                    return (
                      <View key={key} style={styles.checkboxItem}>
                        <View style={styles.checkboxBox}><View style={styles.checkboxInner} /></View>
                        <Text style={styles.checkboxText}>{key.replace('symptom_', '')}</Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
              {Boolean(formData.otherSymptoms) && (
                 <View style={{ marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: BORDER }}>
                   <Text style={styles.fieldLabel}>Additional Symptoms Reported</Text>
                   <Text style={styles.fieldValue}>{formData.otherSymptoms}</Text>
                 </View>
              )}
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Legal Authorizations</SectionTitle>
            
            <View style={[styles.fieldContainer, { backgroundColor: '#fdf8f6', borderColor: '#fef08a' }]}>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY }]}>
                I/We consent that <Text style={{ fontFamily: 'Helvetica-Bold' }}>{formData.clientName || '_________________________'}</Text> may be treated as a client by Piedmont Counseling & Development Services, PLLC. By signing below, I acknowledge that I have read, understand, and agree to the policies, terms of treatment, and HIPAA privacy practices provided to me.
              </Text>
            </View>

            <View style={{ marginTop: 30 }}>
              <Signature 
                label="Authorized Patient Signature" 
                imgData={formData.patientSignatureData} 
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
                label="HIPAA Acknowledgment Signature" 
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
