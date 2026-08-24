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

const Signature = ({ label, imgData, date, relationship }) => (
  <View style={styles.sigSection}>
    <View style={styles.sigBlock}>
      {Boolean(imgData) && <Image style={styles.sigImage} src={imgData} />}
      <Text style={styles.sigLine}>{label}</Text>
    </View>
    <View style={styles.dateBlock}>
      <Text style={styles.sigDate}>{date || '—'}</Text>
      <Text style={styles.sigLine}>Date Signed</Text>
    </View>
    {relationship !== undefined && (
      <View style={styles.dateBlock}>
        <Text style={styles.sigDate}>{relationship || '—'}</Text>
        <Text style={styles.sigLine}>Relationship</Text>
      </View>
    )}
  </View>
);

const InsurancePDFDocument = ({ formData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        
        <View style={styles.content}>
          <View style={styles.sectionBlock}>
            <SectionTitle>Client Information</SectionTitle>
            <View style={styles.grid}>
              <Field label="Client/Patient Name" value={formData.clientName} width="colHalf" />
              <Field label="Date of Birth" value={formData.clientDob} width="colHalf" />
              <Field label="Address" value={formData.clientAddress} width="colFull" />
              <Field label="City" value={formData.clientCity} width="colThird" />
              <Field label="State" value={formData.clientState} width="colThird" />
              <Field label="Zip" value={formData.clientZip} width="colThird" />
              <Field label="Phone" value={formData.clientPhone} width="colHalf" />
              <Field label="Email" value={formData.clientEmail} width="colHalf" />
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Primary Insurance</SectionTitle>
            <View style={styles.grid}>
              <Field label="Insurance Company" value={formData.primaryInsCompany} width="colFull" />
              <Field label="Member/Subscriber ID" value={formData.primaryInsId} width="colHalf" />
              <Field label="Group Number" value={formData.primaryInsGroup} width="colHalf" />
              <Field label="Plan Name/Type" value={formData.primaryInsPlan} width="colHalf" />
              <Field label="Insurance Company Phone" value={formData.primaryInsPhone} width="colHalf" />
            </View>
          </View>

          {Boolean(formData.policyholderName) && (
            <View style={styles.sectionBlock}>
              <SectionTitle>Policyholder/Subscriber Information</SectionTitle>
              <View style={styles.grid}>
                <Field label="Policyholder Name" value={formData.policyholderName} width="colHalf" />
                <Field label="Relationship to Client" value={formData.policyholderRelationship === 'Other' ? `Other (${formData.policyholderRelationshipOther})` : formData.policyholderRelationship} width="colHalf" />
                <Field label="Policyholder Date of Birth" value={formData.policyholderDob} width="colHalf" />
                <Field label="Employer" value={formData.policyholderEmployer} width="colHalf" />
              </View>
            </View>
          )}

          {Boolean(formData.secondaryInsCompany) && (
            <View style={styles.sectionBlock}>
              <SectionTitle>Secondary Insurance</SectionTitle>
              <View style={styles.grid}>
                <Field label="Insurance Company" value={formData.secondaryInsCompany} width="colFull" />
                <Field label="Member/Subscriber ID" value={formData.secondaryInsId} width="colHalf" />
                <Field label="Group Number" value={formData.secondaryInsGroup} width="colHalf" />
                <Field label="Policyholder Name" value={formData.secondaryPolicyholderName} width="colFull" />
                <Field label="Relationship to Client" value={formData.secondaryPolicyholderRelationship} width="colHalf" />
                <Field label="Policyholder DOB" value={formData.secondaryPolicyholderDob} width="colHalf" />
              </View>
            </View>
          )}

          <View style={styles.sectionBlock}>
            <SectionTitle>Insurance Card</SectionTitle>
            <View style={styles.grid}>
              <Field label="Front of Card Provided" value={formData.frontCardData ? 'Yes' : 'No'} width="colHalf" />
              <Field label="Back of Card Provided" value={formData.backCardData ? 'Yes' : 'No'} width="colHalf" />
            </View>
            <View style={[styles.grid, { marginTop: 10 }]}>
              {Boolean(formData.frontCardData) && formData.frontCardData.startsWith('data:image/') && (
                <View style={[styles.colHalf, { alignItems: 'center' }]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>Front of Card</Text>
                  <Image src={formData.frontCardData} style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }} />
                </View>
              )}
              {Boolean(formData.backCardData) && formData.backCardData.startsWith('data:image/') && (
                <View style={[styles.colHalf, { alignItems: 'center' }]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>Back of Card</Text>
                  <Image src={formData.backCardData} style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }} />
                </View>
              )}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionTitle>Authorizations & Agreements</SectionTitle>
            
            <Text style={[styles.fieldLabel, { marginTop: 10, marginBottom: 6, fontSize: 9, color: PRIMARY }]}>Authorization to Verify Benefits and Submit Claims</Text>
            <View style={[styles.fieldContainer, { backgroundColor: '#fdf8f6', borderColor: '#fef08a', marginBottom: 15 }]}>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY, marginBottom: 8 }]}>I authorize Piedmont Counseling and Development Services, PLLC and its authorized representatives to obtain information from my insurance company regarding my eligibility, benefits, coverage, deductibles, copayments, coinsurance, authorization requirements, and other information necessary for billing and payment purposes.</Text>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY, marginBottom: 8 }]}>I authorize Piedmont Counseling and Development Services, PLLC to submit claims to my insurance carrier for covered services provided to me.</Text>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY }]}>I authorize the release of information reasonably necessary to process insurance claims, obtain payment, and conduct related healthcare operations, as permitted by applicable law.</Text>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 10, marginBottom: 6, fontSize: 9, color: PRIMARY }]}>Assignment of Insurance Benefits</Text>
            <View style={[styles.fieldContainer, { backgroundColor: '#fdf8f6', borderColor: '#fef08a', marginBottom: 15 }]}>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY, marginBottom: 8 }]}>I authorize payment of insurance benefits, when permitted by my insurance plan, directly to Piedmont Counseling and Development Services, PLLC for services provided to me.</Text>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY, marginBottom: 8 }]}>I understand that verification of insurance benefits does not guarantee payment by my insurance company.</Text>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY, marginBottom: 8 }]}>I understand that I am responsible for understanding my insurance benefits and for amounts that are my responsibility under my insurance plan, including applicable copayments, coinsurance, deductibles, and non-covered services, subject to applicable law and my agreements with the practice.</Text>
              <Text style={[styles.fieldValue, { lineHeight: 1.6, color: PRIMARY }]}>If my insurance coverage changes or terminates, I agree to notify Piedmont Counseling and Development Services, PLLC as soon as possible and provide updated insurance information.</Text>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 10, marginBottom: 6, fontSize: 9, color: PRIMARY }]}>Client Acknowledgment and Authorization</Text>
            <Text style={[styles.fieldValue, { lineHeight: 1.6, marginBottom: 15 }]}>By signing below, I acknowledge that the information I have provided is accurate to the best of my knowledge. I have read and understand the insurance authorization information above and authorize Piedmont Counseling and Development Services, PLLC to verify benefits and submit claims as described.</Text>

            <View style={{ marginTop: 30 }}>
              <Signature 
                label="Signature" 
                imgData={formData.signatureData} 
                date={formData.signatureDate} 
                relationship={formData.signatureRelationship}
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
