import { useEffect, useRef } from 'react'
import { GALLERY_ITEMS } from './galleryConfig'
import './ParallaxGallery.css'

export function ParallaxGallery() {
  const sectionRef  = useRef<HTMLElement>(null)
  const itemRefs    = useRef<(HTMLDivElement | null)[]>([])
  const headingRef  = useRef<HTMLDivElement>(null)
  const idleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
 
  useEffect(() => {
    const rawSection = sectionRef.current
    if (!rawSection) return
    const section = rawSection as HTMLElement

    const targetMouse = { x: 0, y: 0 }
    const currentMouse = { x: 0, y: 0 }
    let animationFrameId: number

    function update() {
      const s = sectionRef.current
      if (!s) return

      // Update animated mouse offset with a smooth lerp
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08

      // Perform updates only when section is visible in the viewport
      const rect = s.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) {
        animationFrameId = requestAnimationFrame(update)
        return
      }

      const scrolled      = window.scrollY - s.offsetTop
      const travelHeight  = s.offsetHeight - window.innerHeight
      const progress      = travelHeight > 0 ? scrolled / travelHeight : 0
      const mx = currentMouse.x
      const my = currentMouse.y

      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const { scrollSpeed, mouseSpeed, entryProgress, exitProgress } = GALLERY_ITEMS[i]

        // Bell-curve opacity: fade in over fadeRange, full, then fade out
        const fadeRange = 0.09
        const fadeIn  = Math.min(1, Math.max(0, (progress - entryProgress) / fadeRange))
        const fadeOut = Math.min(1, Math.max(0, (exitProgress - progress)  / fadeRange))
        const opacity = Math.min(fadeIn, fadeOut)

        // Parallax translate + scale grows as image fades in
        const ty    = -(scrolled * scrollSpeed) / 1000
        const scale = 0.90 + 0.10 * opacity
        el.style.opacity   = String(opacity)
        el.style.transform =
          `translate3d(${mx * mouseSpeed}px, ${ty + my * mouseSpeed}px, 0) scale(${scale})`
      })

      // Heading drifts upward at its own speed (slower = sense of depth)
      if (headingRef.current) {
        const hTy = -(scrolled * 30) / 1000
        headingRef.current.style.transform =
          `translateX(-50%) translate3d(${mx * 0.01}px, ${hTy + my * 0.01}px, 0)`
      }

      animationFrameId = requestAnimationFrame(update)
    }

    const markIdle = () => section.classList.add('is-idle')

    const markActive = () => {
      clearTimeout(idleRef.current)
      section.classList.remove('is-idle')
      idleRef.current = setTimeout(markIdle, 800)
    }

    // Start floating after 1.5 s if the user hasn't touched anything
    idleRef.current = setTimeout(markIdle, 1500)

    function onScroll() {
      markActive()
    }

    function onMouseMove(e: MouseEvent) {
      markActive()
      const rect = section.getBoundingClientRect()
      targetMouse.x = (e.clientX - rect.width  / 2) * -0.8
      targetMouse.y = (e.clientY - rect.height / 2) * -0.6
    }

    // Start loop
    animationFrameId = requestAnimationFrame(update)

    window.addEventListener('scroll', onScroll, { passive: true })
    section.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('scroll', onScroll)
      section.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
      clearTimeout(idleRef.current)
    }
  }, [])

  return (
    <section ref={sectionRef} className="parallax-section">

      {/* Heading drifts upward at its own parallax speed */}
      <div ref={headingRef} className="parallax-heading-wrap">
        <h2 className="parallax-heading">
          <span>COMPLEX CLAIMS.</span><br/>
          <span>CLEAR OUTCOMES.</span>
        </h2>
        <p className="parallax-subheading">Handled by certified loss assessors</p>
      </div>

      {/* Images scattered across the full 200vh canvas */}
      <div className="gallery-items">
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={item.id}
            ref={el => { itemRefs.current[i] = el }}
            className="gallery-item"
            style={{ left: item.left, top: item.top, width: item.width }}
          >
            <div
              className="gallery-item-inner"
              style={{ aspectRatio: String(item.aspectRatio) }}
            >
              <img src={item.src} alt={item.alt} draggable={false} />
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
