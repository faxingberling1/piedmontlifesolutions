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
});

const Header = () => (
  <View style={styles.headerWrap} fixed>
    <View style={styles.headerLeft}>
      <Text style={styles.clinicName}>Piedmont Counseling</Text>
      <Text style={styles.formTitle}>Insurance Authorization Form</Text>
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

const InsurancePDFDocument = ({ formData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Client Profile</SectionTitle>
            <View style={styles.grid}>
              <Field label="Client Name" value={formData.clientName} width="colFull" />
              <Field label="Billable Party" value={formData.billableParty} width="colHalf" />
              <Field label="Relationship to Client" value={formData.relationshipToClient} width="colHalf" />
              <Field label="Street Address" value={formData.address} width="colFull" />
              <Field label="City" value={formData.city} width="colThird" />
              <Field label="State" value={formData.state} width="colThird" />
              <Field label="Zip" value={formData.zip} width="colThird" />
              <Field label="Phone" value={formData.phone} width="colHalf" />
              <Field label="Relationship to Primary Insured" value={formData.clientRelationship} width="colHalf" />
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Primary Insured Information</SectionTitle>
            <View style={styles.grid}>
              <Field label="Primary Insured's Name" value={formData.primaryName} width="colHalf" />
              <Field label="Birthdate" value={formData.primaryDob} width="colHalf" />
              <Field label="Insured's SSN" value={formData.primarySsn} width="colHalf" />
              <Field label="Employer" value={formData.primaryEmployer} width="colHalf" />
              <Field label="Primary Address" value={formData.primaryAddressStreet} width="colFull" />
              <Field label="City" value={formData.primaryCity} width="colThird" />
              <Field label="State" value={formData.primaryState} width="colThird" />
              <Field label="Zip" value={formData.primaryZip} width="colThird" />
              <Field label="Gender" value={formData.primaryGender} width="colFull" />
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Insurance Details</SectionTitle>
            <View style={styles.grid}>
              <Field label="Primary Insurance Company" value={formData.primaryInsuranceName} width="colFull" />
              <Field label="Primary I.D. #" value={formData.primaryInsuranceId} width="colHalf" />
              <Field label="Primary Group #" value={formData.primaryInsuranceGroup} width="colHalf" />
              
              {Boolean(formData.secondaryInsuranceName) && (
                <>
                  <Field label="Secondary Insurance Company" value={formData.secondaryInsuranceName} width="colFull" />
                  <Field label="Secondary I.D. #" value={formData.secondaryInsuranceId} width="colHalf" />
                  <Field label="Secondary Group #" value={formData.secondaryInsuranceGroup} width="colHalf" />
                </>
              )}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Authorization & Assignment of Benefits</SectionTitle>
            <View style={[styles.fieldContainer, { backgroundColor: '#fdf8f6', borderColor: '#fef08a' }]}>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY }]}>
                I hereby authorize the release of any medical or other information necessary to process all claims for the client described above. I also request and assign payment of insurance, medical, and or government benefits to Piedmont Counseling & Development Services, PLLC.
              </Text>
            </View>

            <View style={{ marginTop: 30 }}>
              <Signature 
                label="Patient/Authorized Person Signature" 
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

export default InsurancePDFDocument;
