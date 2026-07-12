import { useEffect, useState } from 'react'
import { PageBackground } from './components/PageBackground/PageBackground'
import { ScrollSnap }     from './components/ScrollSnap/ScrollSnap'
import Navbar             from './components/Navbar/Navbar'
import { HeroSection }    from './components/HeroSection/HeroSection'
import { ParallaxGallery } from './components/ParallaxGallery/ParallaxGallery'
import { WhyVergeAssure } from './components/WhyVergeAssure/WhyVergeAssure'
import { ServicesSection } from './components/ServicesSection/ServicesSection'
import { ProductsSection } from './components/ProductsSection/ProductsSection'
import { TeamSection }     from './components/TeamSection/TeamSection'
import { InsightSection }  from './components/InsightSection/InsightSection'
import { BookDemoSection } from './components/BookDemoSection/BookDemoSection'
import { CtaSection }      from './components/CtaSection/CtaSection'
import { ThankYouSection } from './components/ThankYouSection/ThankYouSection'
import { RENDER_GALLERY }  from './config'

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    function handleLocationChange() {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  useEffect(() => {
    // Smooth scroll to sections if returning to home page with a hash
    if (currentPath === '/' && window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [currentPath])

  const isDarkPage = currentPath !== '/'

  return (
    <>
      <PageBackground forceDark={isDarkPage} />
      <ScrollSnap />
      <Navbar currentPath={currentPath} />

      {currentPath === '/' && (
        <>
          <HeroSection />
          {RENDER_GALLERY && <ParallaxGallery />}
          <ServicesSection />
          <WhyVergeAssure />
          <ProductsSection />
          <CtaSection />
        </>
      )}

      {currentPath === '/services' && <ServicesSection />}
      {currentPath === '/products' && <ProductsSection />}
      {currentPath === '/about' && <WhyVergeAssure />}
      {currentPath === '/team' && <TeamSection />}
      {currentPath === '/contact' && <CtaSection />}
      {currentPath === '/book-demo' && <BookDemoSection />}
      {currentPath === '/thank-you' && <ThankYouSection />}
      {currentPath === '/insight' && <InsightSection />}
    </>
  )
}

export default App
