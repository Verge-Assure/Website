import './ThankYouSection.css'

export function ThankYouSection() {
  const handleBackToHome = () => {
    window.history.pushState(null, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div id="thank-you" className="thanks-wrapper">
      {/* Ambient background glow */}
      <div className="thanks-bg-glow" />

      <div className="thanks-container">
        
        {/* Glassmorphic Technical Card */}
        <div className="thanks-card">
          <div className="thanks-card-grid" />
          
          <div className="thanks-content">
            {/* Checked dynamic icon */}
            <div className="thanks-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            
            <h2 className="thanks-title">Thank you for connecting with us.</h2>
            
            <p className="thanks-text">
              Your request has been securely received. Our systems engineering team will review your details and get in touch with you shortly to schedule your demo.
            </p>
            
            <button onClick={handleBackToHome} className="thanks-home-btn">
              Back to Home <span className="thanks-btn-arrow">→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
export default ThankYouSection
