import './InsightSection.css'

export function InsightSection() {
  return (
    <div id="insight" className="insight-wrapper">
      {/* Decorative ambient glows matching site style */}
      <div className="insight-bg-glow insight-bg-glow--top" />
      <div className="insight-bg-glow insight-bg-glow--bottom" />

      <div className="insight-container">
        
        {/* Glassmorphic Technical Card */}
        <div className="insight-card">
          {/* Wireframe grids & corner marks */}
          <div className="insight-card-grid" />
          
          <div className="insight-content">
            <span className="insight-badge">COMING SOON</span>
            <h2 className="insight-title">Insights from the Verge.</h2>
            <p className="insight-text">
              We are curating industry deep-dives, engineering research, and architectural whitepapers on modernizing legacy systems inside insurance operations.
            </p>
            <div className="insight-accent-bar" />
          </div>
        </div>

      </div>
    </div>
  )
}
