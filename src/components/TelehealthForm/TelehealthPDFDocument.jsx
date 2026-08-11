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
  sigSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  sigBlock: { width: '60%', position: 'relative' },
  dateBlock: { width: '30%', position: 'relative' },
  sigLine: { borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8, marginTop: 45, fontSize: 9, color: TEXT_MUTED, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  sigImage: { width: 160, height: 40, position: 'absolute', top: 0, left: 10 },
  sigDate: { position: 'absolute', top: 20, left: 10, fontSize: 12, color: TEXT_DARK },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, borderTopWidth: 1, borderTopColor: BORDER, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40 },
  footerText: { fontSize: 8, color: TEXT_MUTED, letterSpacing: 0.2 },
  paragraph: { fontSize: 9, color: TEXT_DARK, lineHeight: 1.5, marginBottom: 10 },
  subTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginTop: 10, marginBottom: 4 }
});

const Header = () => (
  <View style={styles.headerWrap} fixed>
    <View style={styles.headerLeft}>
      <Text style={styles.clinicName}>Piedmont Counseling</Text>
      <Text style={styles.formTitle}>Telehealth Consent Form</Text>
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

const TelehealthPDFDocument = ({ formData }) => {
  const emergencyContacts = Array.isArray(formData.emergencyContacts) ? formData.emergencyContacts : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Client Information</SectionTitle>
            <View style={styles.grid}>
              <Field label="Client Name (Patient)" value={formData.clientName} width="colFull" />
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Emergency Contacts</SectionTitle>
            <View style={styles.grid}>
              {emergencyContacts.map((contact, index) => (
                <React.Fragment key={index}>
                  <Field label={`Contact ${index + 1} Name`} value={contact.name} width="colHalf" />
                  <Field label={`Contact ${index + 1} Phone`} value={contact.phone} width="colHalf" />
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Informed Consent Agreement</SectionTitle>
            
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.paragraph}>
                This Informed Consent for Telehealth contains important information focusing on providing mental health care services using the internet or the phone. Please read this carefully. By signing this document, it represents an agreement between us regarding the benefits, risks, confidentiality expectations, and emergency procedures involved with telehealth services.
              </Text>
              
              <Text style={styles.subTitle}>Key Provisions:</Text>
              <Text style={styles.paragraph}>• You must be in a private place where you will not be interrupted or distracted (not driving or in public).</Text>
              <Text style={styles.paragraph}>• The clinic uses HIPAA-compliant platforms like Doxyme.org and Zoom.</Text>
              <Text style={styles.paragraph}>• In the event of an emergency during a technology failure, you agree to contact 911 or local emergency services immediately.</Text>
              <Text style={styles.paragraph}>• The same fee rates, co-pays, deductibles, and cancellation policies apply to telehealth sessions as in-person sessions.</Text>
              <Text style={styles.paragraph}>• Telehealth sessions will not be recorded unless mutually agreed upon in writing.</Text>
            </View>

            <View style={[styles.fieldContainer, { backgroundColor: '#fdf8f6', borderColor: '#fef08a', marginTop: 10 }]}>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY }]}>
                I acknowledge that I have read and agree to the full terms and conditions of the Telehealth Informed Consent. My signature below indicates my agreement to proceed with remote therapy under these policies.
              </Text>
            </View>

            <View style={{ marginTop: 30 }}>
              <Signature 
                label="Patient Signature (Required)" 
                imgData={formData.signatureData} 
                date={formData.signatureDate} 
              />
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

export default TelehealthPDFDocument;
