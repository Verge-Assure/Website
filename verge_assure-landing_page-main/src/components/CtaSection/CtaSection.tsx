import React, { useState } from 'react'
import './CtaSection.css'
import { FORM_URL } from '../../../config'

export function CtaSection() {
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
    <section id="contact" className="cta-wrapper">
      <div className="cta-container">
        
        {/* Decorative wireframe background grid lines inside the CTA box */}
        <div className="cta-grid-overlay" />
        
        {/* Left Side: Creative VA logo structure + Headline */}
        <div className="cta-content">
          <span className="cta-label">GET STARTED</span>
          <h2 className="cta-heading">
            <span>Ready to</span>
            <span>Verge?</span>
          </h2>
          <p className="cta-text">
            Build modern, legacy-aware insurance platforms that ship in weeks, not years. Talk to our engineering team or request a customized product demo.
          </p>

          {/* Buttons Group */}
          <div className="cta-actions">
            <button 
              onClick={() => {
                window.history.pushState(null, '', '/book-demo')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
              className="cta-btn cta-btn--primary"
              style={{ cursor: 'pointer' }}
            >
              Book a Demo <span className="cta-btn-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Right Side: Quick Contact Form */}
        <div className="cta-form-box">
          <form onSubmit={handleSubmit} className="cta-form">
            <span className="cta-form-label">REQUEST COLLABORATION</span>
            <h3 className="cta-form-heading">Start a Conversation</h3>
            
            <div className="cta-input-group">
              <input
                type="email"
                required
                disabled={loading}
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cta-input"
              />
              <button type="submit" disabled={loading} className="cta-submit-btn">
                {loading ? 'Submitting...' : 'Submit'} <span className="cta-submit-arrow">→</span>
              </button>
            </div>
            <p className="cta-form-hint">
              By submitting, you agree to connect with our technical specialists.
            </p>
          </form>

          {/* System Status Badge */}
          <div className="cta-system-status">
            <span className="cta-status-dot" />
            <span className="cta-status-text">SYSTEMS OPERATIONAL — VERGE ASSURE CLOUD v1.4</span>
          </div>
        </div>

      </div>

      {/* Corporate Technical Footer */}
      <footer className="cta-footer">
        <div className="cta-footer-brand">
          <div className="cta-footer-logo">
            <svg width="40" height="15" viewBox="208 410 606 203" fill="currentColor">
              <path d="M661 410h20l14 5 10 9 8 10 15 26 10 18 12 21 15 26 15 26 15 26 17 29 3 6v2h-54l-14-24-14-25-14-24-12-20-14-25-13-23-8-13-2-1-14 25-16 27-9 16-13 22-8 14-9 11-6 7-14 11-13 8-14 6-15 5-17 2h-16l-15-2-21-7-14-7-10-7-10-9-2-3 16-16 7-8 6-7 5-1 15 11 8 4 9 3h28l10-3 12-6 10-8 5-5 8-11 15-26 13-23 15-25 6-12 7-11 8-11 8-7 12-5ZM208 410h53l6 9 14 25 12 21 15 26 12 21 15 26 12 21 3 5v2h2l2-6 13-22 12-21 15-26 16-27 10-14 13-13 14-10 16-8 18-6 11-2h28l13 2 18 6 16 8 10 7 10 9-1 4-11 12-13 13-5 6-4-1-10-8-10-6-12-4h-23l-11 2-12 5-11 8-10 11-13 21-13 23-12 21-11 19-13 22-7 9-8 7-10 5-8 2h-16l-12-4-9-6-8-8-10-15-13-24-12-21-11-19-15-26-12-21-15-26-12-20-5-10Z" />
            </svg>
            <span>VERGE ASSURE TECHNOLOGY</span>
          </div>
        </div>

        <div className="cta-footer-bottom">
          <p>© {new Date().getFullYear()} Verge Assure Technology. All rights reserved.</p>
          <div className="cta-footer-legal">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </section>
  )
}
