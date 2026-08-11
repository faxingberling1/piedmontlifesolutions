# Security & Architecture Recommendations

This document summarizes our discussion regarding how to securely process, store, and transmit Protected Health Information (PHI) like patient intake forms, medical histories, and signatures.

## The Core Issue: HIPAA Compliance
Because this application collects PHI for a medical clinic (Piedmont Counseling & Development Services), it is strictly governed by HIPAA regulations. 

> [!CAUTION]
> **Standard email is generally not HIPAA compliant.** Sending unencrypted PDFs containing SSNs and medical histories via standard email APIs (like Resend, SendGrid, or Mailgun) directly to a standard inbox (like Gmail or Outlook) exposes patients to identity theft and constitutes a severe breach of privacy and regulatory standards. 

To be HIPAA compliant, any third-party service that touches patient data must sign a **Business Associate Agreement (BAA)** with the clinic.

---

## 1. The Most Secure Architectures (HIPAA Compliant)

If the clinic wants to ensure 100% legal compliance and maximum security, you must avoid emailing the PDFs directly. Instead, the PDFs should be uploaded to a secure vault, and the clinic should receive a "notification-only" email.

### Option A: Firebase (Backend-as-a-Service)
- **How it works:** The React app uploads the PDF directly to an encrypted Firebase Cloud Storage bucket. A Firebase Cloud Function then uses Resend to send a generic email to the clinic (*"A new form was submitted by J.D. Log in to view."*).
- **The Dashboard:** We build a hidden `/admin` route on this website. Clinic staff log in using Firebase Authentication to securely download the PDFs from the vault.
- **Compliance:** Google Cloud (Firebase) will sign a BAA.

### Option B: Direct Integration (Google Workspace or Microsoft 365 via GoDaddy)
- **How it works:** If the clinic uses GoDaddy for email, they are most likely using **Microsoft 365**. Microsoft (like Google) will sign a BAA for healthcare providers. Instead of a custom dashboard, we can use the Microsoft Graph API (or Google Drive API) to instantly drop the submitted PDFs directly into a secure folder in the clinic's OneDrive, SharePoint, or Google Drive.
- **The Dashboard:** None needed. The clinic staff just opens their secure OneDrive or Google Drive folder to view the new PDFs.

---

## 2. The "No-Backend" Frontend-Only Architecture

If your absolute top priority is having **zero backend infrastructure** (no Express server, no Firebase, no Vercel functions), you must use a service designed specifically for frontend-only email delivery.

### Option: EmailJS
- **How it works:** EmailJS is designed to send emails directly from a React frontend. You create a template in their dashboard and place your Public Key in your React code. It restricts sending to only your approved template and destination email.
- **Compliance:** EmailJS is **not** HIPAA compliant and does not offer BAAs. Using this method carries severe regulatory risks.

---

## 3. The "Direct Email" Architecture (Using Resend)

If the clinic explicitly chooses to accept the regulatory risks and insists on having the PDF emailed directly to them using **Resend**, you must build a backend. You cannot use Resend directly in a React frontend, as it would expose your API keys to the public.

### Option A: Express Server on Railway (Current Infrastructure)
- **How it works:** Since you are already paying for **Railway**, we can add a lightweight Node.js/Express server directly into your Vite React project. Railway will run this server, which will host your frontend and provide a hidden `/api/send-email` endpoint to securely hold your Resend API key and process the emails.
- **Cost:** Free (included in your existing Railway bill).

### Option B: Vercel Serverless Functions
- **How it works:** You migrate your hosting from Railway to **Vercel**. Vercel provides free "Serverless Functions." You write a single backend script to handle Resend, and Vercel automatically deploys it securely.
- **Cost:** 100% Free (Vercel Hobby Plan + Resend Free Tier easily handles 100+ forms/month).

---

## 4. Building a Minimal Login Page (The Secure Dashboard Workflow)

If you decide to proceed with the secure storage approach (e.g., Firebase Option A), we will build a minimal, private login page into this React app specifically for clinic staff to access the forms.

### How It Works:
1. **The Hidden Route:** We create a new page in the app, accessible only via a specific URL like `piedmontlifesolutions.com/admin`. The general public never sees a link to this page.
2. **The Authentication Flow:** 
   - When clinic staff visit the `/admin` URL, they are greeted by a simple login screen requesting an email and password.
   - We integrate **Firebase Authentication**, which handles all password encryption, session management, and optional Two-Factor Authentication (2FA) securely on Google's servers.
3. **The Private Dashboard:** 
   - Once successfully logged in, the React app grants the staff member access to the "Dashboard" view.
   - The dashboard retrieves a list of all PDFs from the secure vault (Firebase Cloud Storage) and displays them in a clean table (e.g., Patient Name, Date Submitted, Form Type).
   - Staff can click a button next to any patient's name to securely download the PDF to their local computer.
4. **Session Security:** After downloading, the staff can log out. Firebase automatically clears their secure token so the dashboard is locked down again.

*By using this workflow, the clinic maintains a seamless administrative experience without sacrificing patient privacy or violating HIPAA regulations.*
