import React, { useState } from 'react'
import './BookDemoSection.css'
import { FORM_URL } from '../../../config'

export function BookDemoSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || loading) return

    setLoading(true)
    fetch(FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then((response) => {
      setLoading(false)
      if (response.ok) {
        window.history.pushState(null, '', '/thank-you')
        window.dispatchEvent(new PopStateEvent('popstate'))
      } else {
        alert('Oops! There was a problem submitting your email. Please try again.')
      }
    })
    .catch(() => {
      setLoading(false)
      alert('Oops! There was a network issue. Please check your connection and try again.')
    })
  }

  return (
    <div id="book-demo" className="demo-wrapper">
      {/* Ambient background glow */}
      <div className="demo-bg-glow" />

      <div className="demo-container">
        
        {/* Glassmorphic card container */}
        <div className="demo-card">
          <div className="demo-grid-overlay" />
          
          <div className="demo-grid">
            
            {/* Left Column: Welcome & Info */}
            <div className="demo-content">
              <span className="demo-label">SCHEDULE A DEMO</span>
              <h2 className="demo-heading">
                <span>Welcome to</span>
                <span>Verge Assure.</span>
              </h2>
              <p className="demo-text">
                Experience systems modernization designed specifically for insurance innovators. Our team will walk you through custom integrations, live dashboards, and legacy data ingestion pipelines.
              </p>
              <p className="demo-text-sub">
                Enter your email to request demo access, and our engineering team will get in touch with you shortly.
              </p>
            </div>

            {/* Right Column: Form */}
            <div className="demo-form-box">
              <form onSubmit={handleSubmit} className="demo-form">
                <span className="demo-form-label">REQUEST ACCESS</span>
                <h3 className="demo-form-heading">Let's connect</h3>
                
                <div className="demo-input-group">
                  <input 
                    type="email" 
                    required 
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email" 
                    className="demo-input"
                  />
                  <button type="submit" disabled={loading} className="demo-submit-btn">
                    {loading ? 'Submitting...' : 'Request Demo'} <span className="demo-submit-arrow">→</span>
                  </button>
                </div>
                
                <p className="demo-form-hint">
                  By submitting, you agree to have our systems engineers contact you regarding product demos.
                </p>
              </form>
            </div>

          </div>
        </div>

        {/* Minimalist subpage footer */}
        <footer className="demo-footer">
          <span className="demo-footer-copy">
            © {new Date().getFullYear()} Verge Assure Technology. All rights reserved.
          </span>
        </footer>

      </div>
    </div>
  )
}
