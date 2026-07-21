import { useEffect, useRef, useState } from 'react'
import './StatsSection.css'

const STATS = [
  {
    number: '94%',
    description: 'Client retention rate year-over-year across all insurer partnerships',
  },
  {
    number: '86%',
    description: 'Platform renewal rate after the initial 6-month deployment cycle',
  },
  {
    number: '3×',
    description: 'Average reduction in claims resolution time across live client portfolios',
  },
  {
    number: '<5%',
    description: 'Manual processing error rate achieved with Vision Intelligence Platform',
  },
]

export function StatsSection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      itemRefs.current.forEach((el) => {
        if (!el) return
        el.style.removeProperty('--progress')
        el.style.removeProperty('--progress-half')
      })
      return
    }

    function onScroll() {
      const vh = window.innerHeight
      itemRefs.current.forEach((el) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        // Starts animating when item enters bottom 85% of viewport, completes at 15%
        const raw = (vh * 0.85 - rect.top) / (vh * 0.7)
        const progress = Math.max(0, Math.min(1, raw))
        const progressHalf = Math.max(0, Math.min(1, raw * 2))
        el.style.setProperty('--progress', String(progress))
        el.style.setProperty('--progress-half', String(progressHalf))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  return (
    <section className="ss-wrapper">
      <div className="ss-left">
        <span className="ss-label">RESULTS</span>
        <h2 className="ss-heading">
          <span>The model</span>
          <span>works.</span>
        </h2>
        <p className="ss-subtext">Here's the proof.</p>
      </div>

      <div className="ss-right">
        {STATS.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el }}
            className="ss-item"
          >
            <span className="ss-number">{stat.number}</span>
            <p className="ss-description">{stat.description}</p>
            <div className="ss-underline" />
          </div>
        ))}
      </div>
    </section>
  )
}
