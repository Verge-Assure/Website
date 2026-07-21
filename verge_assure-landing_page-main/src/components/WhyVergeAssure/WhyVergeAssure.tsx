import { useEffect, useRef, useState } from 'react'
import './WhyVergeAssure.css'

const STEPS = [
  {
    titles: ['Problem-First', 'Approach'],
    subtitle: 'We start from actual insurance problems, mapping out your daily user journeys and workflow constraints before writing a single line of code. This ensures we solve real operational friction, not hypothetical ones.',
  },
  {
    titles: ['Legacy-Aware', 'Innovation'],
    subtitle: 'We understand the complexity of legacy systems. We meet insurers where they are — bridging AS400, mainframe, or SQL data structures directly with modern cloud infrastructure without requiring a core system replacement.',
  },
  {
    titles: ['Industry-Led,', 'Tech-Powered'],
    subtitle: 'Our platform strategy is designed by veteran insurance executives and executed by elite technologists. We bring deep compliance expertise, domain-specific logic, and rapid engineering execution to ship in weeks.',
  },
  {
    titles: ['Customer-Centric', 'DNA'],
    subtitle: 'Your workflows, your decisions, and your business growth are amplified by our custom integrations. We build platforms tailored around your unique operations, empowering adjusters and underwriters.',
  },
]

// ── Main Section ────────────────────────────────────────────────────
export function WhyVergeAssure() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return

    function measure() {
      const label = labelRef.current
      const wrapper = wrapperRef.current
      if (!label || !wrapper) return

      const stickyEl = wrapper.querySelector('.wva-sticky')
      if (!stickyEl) return

      const stickyRect = stickyEl.getBoundingClientRect()

      // Temporarily remove ready class to disable transitions during measurement
      const hadReady = label.classList.contains('wva-section-label--ready')
      label.classList.remove('wva-section-label--ready')

      // Reset transform and class temporarily to measure natural position
      const hadClass = label.classList.contains('wva-section-label--centered')
      label.classList.remove('wva-section-label--centered')
      const prevTransform = label.style.transform
      label.style.transform = 'none'

      const naturalRect = label.getBoundingClientRect()
      const naturalX = naturalRect.left - stickyRect.left + naturalRect.width / 2
      const naturalY = naturalRect.top - stickyRect.top + naturalRect.height / 2

      // Restore class and transform
      label.style.transform = prevTransform
      if (hadClass) {
        label.classList.add('wva-section-label--centered')
      }

      // Target position: centered horizontally, 14% down from viewport top
      const targetX = stickyRect.width / 2
      const targetY = stickyRect.height * 0.14

      const dx = targetX - naturalX
      const dy = targetY - naturalY

      label.style.setProperty('--wva-dx', `${dx}px`)
      label.style.setProperty('--wva-dy', `${dy}px`)

      // Force layout reflow
      label.offsetHeight

      if (hadReady) {
        label.classList.add('wva-section-label--ready')
      } else {
        requestAnimationFrame(() => {
          label.classList.add('wva-section-label--ready')
        })
      }
    }

    measure()
    const timer = setTimeout(measure, 100)
    document.fonts.ready.then(measure)

    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(timer)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    function onScroll() {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const scrolled = window.scrollY - wrapper.offsetTop
      const totalScrollable = wrapper.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))
      const raw = progress * STEPS.length
      setActiveIndex(Math.min(Math.floor(raw), STEPS.length - 1))

      // Toggle centered class on scroll progress
      const isCentered = progress < 0.12

      const label = labelRef.current
      if (label) {
        if (isCentered) {
          label.classList.add('wva-section-label--centered')
        } else {
          label.classList.remove('wva-section-label--centered')
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  return (
    <div id="about" ref={wrapperRef} className={`wva-wrapper ${isMobile ? 'wva-wrapper--mobile' : ''}`}>
      <div className="wva-sticky">
        {isMobile ? (
          <div className="wva-mobile-container">
            <span className="wva-section-label">WHY VERGE ASSURE</span>
            <div className="wva-mobile-cards">
              {STEPS.map((step, i) => (
                <div key={i} className="wva-mobile-card">
                  <h3 className="wva-card-title">
                    {step.titles.map((t, idx) => (
                      <span key={idx} className="wva-title-line">{t}</span>
                    ))}
                  </h3>
                  <p className="wva-card-desc">
                    {step.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ── Left: label + titles ── */}
            <div className="wva-left">
              <span ref={labelRef} className="wva-section-label wva-section-label--centered">WHY VERGE ASSURE</span>
              <div className="wva-titles">
                {STEPS.map((step, i) => {
                  const state = i < activeIndex ? 'past' : i === activeIndex ? 'active' : 'future'
                  return (
                    <div key={i} className={`wva-title wva-title--${state}`}>
                      {step.titles.map((line, j) => <span key={j}>{line}</span>)}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Center: Dynamic Content Card ── */}
            <div className="wva-center">
              <div className="wva-card-box">
                {/* Ambient Background Glow inside the card container */}
                <div className="wva-card-glow" />
                <div className="wva-card-grid-overlay" />
                
                {STEPS.map((step, i) => {
                  const state = i < activeIndex ? 'past' : i === activeIndex ? 'active' : 'future'
                  return (
                    <div key={i} className={`wva-card-slide wva-card-slide--${state}`}>
                      <h3 className="wva-card-title">
                        {step.titles.map((t, idx) => (
                          <span key={idx} className="wva-title-line">{t}</span>
                        ))}
                      </h3>
                      <p className="wva-card-desc">
                        {step.subtitle}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Right spacer to keep center column centered ── */}
            <div className="wva-right" />
          </>
        )}
      </div>
    </div>
  )
}
export default WhyVergeAssure
