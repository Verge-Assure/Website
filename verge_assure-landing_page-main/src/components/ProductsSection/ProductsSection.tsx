import { useEffect, useRef } from 'react'
import './ProductsSection.css'

const PRODUCTS = [
  {
    id: '01',
    name: 'Vision Intelligence Platform',
    description: 'See what others miss. AI-powered insurance intelligence across portfolios.',
  },
  {
    id: '02',
    name: 'Custom Comparison Model',
    description: 'Compare, analyse, decide. Multi-carrier comparison with complexity scoring.',
  },
  {
    id: '03',
    name: 'Adjuster Workflow Platform',
    description: 'From claim to resolution, faster. AI-augmented claims assessment.',
  },
]

export function ProductsSection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    function onScroll() {
      const vh = window.innerHeight
      itemRefs.current.forEach((el) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        // translateX doesn't affect rect.top, so no feedback loop — simple formula works.
        // raw = 0 when card enters viewport bottom, 1 when settled at 55 % from top.
        const raw      = (vh - rect.top) / (vh * 0.45)
        const progress = Math.max(0, Math.min(1, raw))
        el.style.setProperty('--progress', String(progress))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="products" className="ps-wrapper">

      <div className="ps-left">
        <span className="ps-label">PLATFORMS</span>
        <h2 className="ps-heading">
          <span>Products</span>
          <span>in production</span>
        </h2>
        <p className="ps-subtext">
          Three platforms actively deployed across live insurer workflows.
        </p>
      </div>

      <div className="ps-right-clip">
        <div className="ps-right">
          {PRODUCTS.map((product, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el }}
              className="ps-item"
            >
              <div className="ps-card">
                <span className="ps-card-id">{product.id}</span>
                <div className="ps-card-body">
                  <h3 className="ps-card-name">{product.name}</h3>
                  <p className="ps-card-desc">{product.description}</p>
                  <a href="#" className="ps-card-link">
                    Explore <span className="ps-card-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
