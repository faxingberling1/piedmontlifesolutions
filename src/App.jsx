import { useState } from 'react'
import { FileText, Shield, Video, Home } from 'lucide-react'
import IntakeFormWizard from './components/IntakeForm/IntakeFormWizard'
import InsuranceForm from './components/InsuranceForm/InsuranceForm'
import TelehealthForm from './components/TelehealthForm/TelehealthForm'
import './App.css'

// The existing forms portal layout
function FormsPortal() {
  const [activeForm, setActiveForm] = useState('intake'); // 'intake', 'insurance', 'telehealth'

  const forms = [
    {
      id: 'intake',
      title: 'Client Intake Form',
      description: 'Required for all new patients.',
      icon: <FileText size={20} />
    },
    {
      id: 'insurance',
      title: 'Insurance Form',
      description: 'Provide your billing details.',
      icon: <Shield size={20} />
    },
    {
      id: 'telehealth',
      title: 'Telehealth Consent',
      description: 'Consent for virtual sessions.',
      icon: <Video size={20} />
    }
  ];

  return (
    <div className="app-layout">
      {/* Decorative Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Piedmont Logo" className="brand-logo" />
          <h2 className="sidebar-title">Patient Forms</h2>
          <span className="sidebar-subtitle">Please select a form to complete</span>
        </div>

        <nav className="nav-menu">
          {forms.map(form => (
            <div
              key={form.id}
              className={`nav-item ${activeForm === form.id ? 'active' : ''}`}
              onClick={() => setActiveForm(form.id)}
            >
              <div className="nav-icon">
                {form.icon}
              </div>
              <div className="nav-content">
                <span className="nav-label">{form.title}</span>
                <span className="nav-description">{form.description}</span>
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" className="sidebar-home-btn">
            <Home size={18} />
            <span>Return to Homepage</span>
          </a>
        </div>
      </aside>

      {/* Main Form Content */}
      <main className="main-content">
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-title">
              {forms.find(f => f.id === activeForm)?.title}
            </h2>
            <p className="form-subtitle">
              {forms.find(f => f.id === activeForm)?.description}
            </p>
          </div>

          {/* Form Content Wrapper */}
          {activeForm === 'intake' ? (
            <IntakeFormWizard />
          ) : activeForm === 'insurance' ? (
            <InsuranceForm />
          ) : activeForm === 'telehealth' ? (
            <TelehealthForm />
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-light)' }}>
              <p style={{ fontStyle: 'italic' }}>
                The multi-step wizard for the {forms.find(f => f.id === activeForm)?.title} is currently under construction.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function App() {
  return <FormsPortal />
}

export default App
