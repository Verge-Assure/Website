import { useEffect, useState } from 'react'
import './Navbar.css'
import { RENDER_GALLERY } from '../../config'

const NAV_ITEMS = [
  { label: 'VALUE PROPOSITION', id: 'services' },
  { label: 'PRODUCT',  id: 'products' },
  { label: 'ABOUT',    id: 'about' },
  { label: 'TEAM',     id: 'team' },
  // { label: 'INSIGHT',  id: 'insight' },
  { label: 'CONTACT',  id: 'contact' },
]

function VCALogo() {
  return (
    <svg 
      width="60" 
      height="20" 
      viewBox="208 410 606 203" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ marginRight: '2px' }}
    >
      <path d="M661 410h20l14 5 10 9 8 10 15 26 10 18 12 21 15 26 15 26 15 26 17 29 3 6v2h-54l-14-24-14-25-14-24-12-20-14-25-13-23-8-13-2-1-14 25-16 27-9 16-13 22-8 14-9 11-6 7-14 11-13 8-14 6-15 5-17 2h-16l-15-2-21-7-14-7-10-7-10-9-2-3 16-16 7-8 6-7 5-1 15 11 8 4 9 3h28l10-3 12-6 10-8 5-5 8-11 15-26 13-23 15-25 6-12 7-11 8-11 8-7 12-5ZM208 410h53l6 9 14 25 12 21 15 26 12 21 15 26 12 21 3 5v2h2l2-6 13-22 12-21 15-26 16-27 10-14 13-13 14-10 16-8 18-6 11-2h28l13 2 18 6 16 8 10 7 10 9-1 4-11 12-13 13-5 6-4-1-10-8-10-6-12-4h-23l-11 2-12 5-11 8-10 11-13 21-13 23-12 21-11 19-13 22-7 9-8 7-10 5-8 2h-16l-12-4-9-6-8-8-10-15-13-24-12-21-11-19-15-26-12-21-15-26-12-20-5-10Z" />
    </svg>
  )
}

export default function Navbar({ currentPath = '/' }: { currentPath?: string }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    function onScroll() {
      const vh = window.innerHeight
      const transStart = RENDER_GALLERY ? vh * 2.1 : vh * 1.2
      const transEnd   = RENDER_GALLERY ? vh * 3.6 : vh * 2.1

      let t = (window.scrollY - transStart) / (transEnd - transStart)
      t = Math.max(0, Math.min(1, t))
      setIsDark(t >= 0.5)
    }

    if (currentPath === '/') {
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    } else {
      setIsDark(true) // Always opaque/dark styling on subpages for maximum legibility
    }
  }, [currentPath, window.scrollY])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { label: string; id: string }) => {
    e.preventDefault()
    window.history.pushState(null, '', `/${item.id}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigateHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.history.pushState(null, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigateToDemo = () => {
    window.history.pushState(null, '', '/book-demo')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <nav className={`hero-nav${isDark ? ' nav--dark' : ''}`}>
      {/* Left: logo + brand name */}
      <a href="/" onClick={navigateHome} className="nav-brand" style={{ textDecoration: 'none' }}>
        <VCALogo />
        <span className="nav-brand-name">VERGE ASSURE TECHNOLOGY</span>
      </a>

      {/* Center: navigation links */}
      <div className="nav-pill">
        {NAV_ITEMS.map(item => {
          const isActive = currentPath === `/${item.id}`
          return (
            <a 
              key={item.label} 
              href={`/${item.id}`} 
              onClick={(e) => handleNavClick(e, item)}
              className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
            >
              {item.label}
            </a>
          )
        })}
      </div>

      {/* Right: CTA */}
      <button 
        className="nav-demo-btn" 
        onClick={navigateToDemo}
      >
        Book a Demo
      </button>
    </nav>
  )
}
