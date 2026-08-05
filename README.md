# Piedmont Life Solutions - Patient Form Portal

A modern, responsive React application designed for Piedmont Counseling & Development Services, PLLC. This portal provides a seamless digital experience for new and existing patients to complete essential forms, securely sign them, and automatically transmit them to the clinic as formatted PDFs.

## 🚀 Features

- **Client Intake Form Wizard**: A robust, multi-step wizard capturing demographic, clinical, social, and medical history. Includes a comprehensive symptoms checklist and consent signatures.
- **Insurance Authorization Form**: Captures primary and secondary insurance details, billable party information, and assignment of benefits.
- **Telehealth Consent Form**: Captures emergency contacts and digital consent for remote therapy sessions.
- **Dynamic PDF Generation**: Utilizes `@react-pdf/renderer` to instantly generate beautiful, dashboard-style Navy & Gold PDFs directly in the browser—with zero backend dependencies.
- **E-Signatures**: Integrates `react-signature-canvas` for smooth, touch-friendly digital signatures across all forms.
- **Automated Email Transmission**: Built-in support for `EmailJS` to attach generated PDFs as base64 strings and securely email them directly to the clinic's administrative inbox.
- **Immersive UI/UX**: Features a state-of-the-art UI with animated backgrounds, glassmorphism sidebar navigation, customized `lucide-react` iconography, and smooth transitional micro-animations.

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (Custom Design System, Flexbox/CSS Grid, CSS Variables)
- **PDF Engine**: `@react-pdf/renderer`
- **Email Service**: `EmailJS`
- **Icons**: `lucide-react`
- **Signatures**: `react-signature-canvas`

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js (v16+) installed.

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the local development server:
```bash
npm run dev
```

3. Open your browser and navigate to the localhost port provided in the terminal (usually `http://localhost:5173`).

### EmailJS Configuration (Required for Production)
To enable the automated email transmission of PDFs, you must configure your EmailJS account.

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Connect your Email Service (e.g., Gmail, Outlook, SMTP)
3. Create an Email Template with an Attachment variable.
4. Update the submission functions in the Form components (`IntakeFormWizard.jsx`, `InsuranceForm.jsx`, `TelehealthForm.jsx`) with your keys:
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`
   - `YOUR_PUBLIC_KEY`

## 🎨 Design System

The application adheres strictly to the Piedmont brand guidelines:
- **Primary Color (Navy)**: `#1c2b4c`
- **Secondary Color (Gold)**: `#d4b553` or `#b89053`
- **Typography**: `Inter` (Body) and `Playfair Display` (Headings)

## 📄 License

Proprietary Software. All rights reserved by Piedmont Counseling & Development Services, PLLC.
