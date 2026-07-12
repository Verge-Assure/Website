import { useEffect, useRef, useState } from 'react'
import HeroTitleHover from './HeroTitleHover'
import './HeroSection.css'
import { canvasTheme } from '../../themes'

const TITLE_HOVER_ENABLED = import.meta.env.VITE_HERO_TITLE_HOVER === 'true'

const WORDS_ZONES: Array<[string, [number, number, number, number]]> = [
  ['secure',       [0.60, 0.04, 0.80, 0.24]],
  ['trust',        [0.80, 0.05, 0.97, 0.28]],
  ['smart',        [0.04, 0.09, 0.28, 0.32]],
  ['clear',        [0.35, 0.04, 0.58, 0.20]],
  ['helpful',      [0.82, 0.34, 0.97, 0.56]],
  ['reliable',     [0.04, 0.20, 0.24, 0.46]],
  ['familiarity',  [0.04, 0.48, 0.24, 0.68]],
  ['fast',         [0.82, 0.54, 0.97, 0.74]],
  ['security',     [0.76, 0.65, 0.97, 0.84]],
  ['dependable',   [0.54, 0.74, 0.80, 0.90]],
  ['future ready', [0.04, 0.74, 0.26, 0.93]],
  ['expert',       [0.24, 0.80, 0.46, 0.95]],
  ['honest',       [0.04, 0.86, 0.22, 0.97]],
  ['innovative',   [0.36, 0.87, 0.64, 0.97]],
  ['simple',       [0.80, 0.14, 0.97, 0.36]],
]

const MAX_SPEED   = 0.9
const DRAG        = 0.980
const PROXIMITY   = 270
const REPEL_FORCE = 11
const STEER_FORCE = 0.09
const COLLISION_K = 0.55

interface Particle {
  text: string
  x: number; y: number
  vx: number; vy: number
  targetX: number; targetY: number
  zone: [number, number, number, number]
  hovering: boolean
  vibPhase: number
  el: HTMLElement | null
  targetTimer: number
  r: number
  w: number
  h: number
}

function lineExitRect(
  x1: number, y1: number,
  x2: number, y2: number,
  r: { left: number; right: number; top: number; bottom: number },
): [number, number] {
  if (x1 < r.left || x1 > r.right || y1 < r.top || y1 > r.bottom) return [x1, y1]
  const dx = x2 - x1, dy = y2 - y1
  const ts: number[] = []
  if (Math.abs(dx) > 0.001) {
    const tL = (r.left  - x1) / dx; if (tL > 0) ts.push(tL)
    const tR = (r.right - x1) / dx; if (tR > 0) ts.push(tR)
  }
  if (Math.abs(dy) > 0.001) {
    const tT = (r.top    - y1) / dy; if (tT > 0) ts.push(tT)
    const tB = (r.bottom - y1) / dy; if (tB > 0) ts.push(tB)
  }
  if (!ts.length) return [x1, y1]
  const t = Math.min(...ts)
  return [x1 + t * dx, y1 + t * dy]
}

function pickInZone(zone: [number, number, number, number], W: number, H: number): [number, number] {
  const [x1p, y1p, x2p, y2p] = zone
  return [
    x1p * W + Math.random() * (x2p - x1p) * W,
    y1p * H + Math.random() * (y2p - y1p) * H,
  ]
}

function applyPos(el: HTMLElement, x: number, y: number) {
  el.style.left = `${x}px`
  el.style.top  = `${y}px`
}

// Smooth S-curve easing — makes animated transitions feel physical
function smoothstep(t: number) { return t * t * (3 - 2 * t) }
function clamp01(t: number)    { return Math.max(0, Math.min(1, t)) }
function phase(total: number, start: number, end: number) {
  return smoothstep(clamp01((total - start) / (end - start)))
}

export function HeroSection() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLDivElement>(null)
  const wordsRef     = useRef<HTMLDivElement>(null)
  const particles    = useRef<Particle[]>([])
  const rafRef       = useRef<number | undefined>(undefined)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const activeWordsZones = WORDS_ZONES
  const currentProximity = isMobile ? 120 : PROXIMITY

  // Shared between scroll handler and RAF loop — drives line retraction
  const lineProgRef = useRef(1)

  // ── Scroll-driven exit animation ─────────────────────────────────
  useEffect(() => {
    const wordsEl = wordsRef.current
    const titleEl = titleRef.current
    const contEl  = containerRef.current

    function onScroll() {
      // total: 0 at section start, 1 after scrolling one full viewport
      const total = clamp01(window.scrollY / window.innerHeight)

      // Phase 1: floating words fade + drift up (0 → 0.42)
      const wordsFade = phase(total, 0, 0.42)
      if (wordsEl) {
        wordsEl.style.opacity   = String(1 - wordsFade)
        wordsEl.style.transform = `translateY(${-wordsFade * 20}px)`
      }

      // Scroll hint vanishes first (0 → 0.16)
      const hint = contEl?.querySelector('.hero-scroll') as HTMLElement | null
      if (hint) hint.style.opacity = String(1 - phase(total, 0, 0.16))

      // Phase 2: lines retract toward title centre (0.22 → 0.68)
      // lineProgRef is read inside the RAF loop each frame
      lineProgRef.current = 1 - phase(total, 0.22, 0.68)

      // Phase 3: title fades (0.58 → 0.95)
      const titleFade = phase(total, 0.58, 0.95)
      if (titleEl) {
        titleEl.style.opacity   = String(1 - titleFade)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Particle / canvas animation loop ─────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    const wordsEl   = wordsRef.current
    if (!container || !wordsEl) return

    let initialized = false

    function initParticles(wordsEl: HTMLElement, W: number, H: number) {
      particles.current = activeWordsZones.map(([text, zone], i) => {
        const [x, y]   = pickInZone(zone, W, H)
        const [tx, ty] = pickInZone(zone, W, H)
        const el = wordsEl.children[i] as HTMLElement ?? null
        if (el) applyPos(el, x, y)
        return {
          text, zone, x, y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          targetX: tx, targetY: ty,
          hovering: false,
          vibPhase: i * 0.9,
          el,
          targetTimer: 60 + Math.random() * 120,
          r: 52,
          w: 80,
          h: 20,
        }
      })

      setTimeout(() => {
        particles.current.forEach(p => {
          if (p.el) {
            p.w = p.el.offsetWidth
            p.h = p.el.offsetHeight
            p.r = p.w / 2 + 10
          }
        })
      }, 80)

      particles.current.forEach((p, i) => {
        if (!p.el) return
        p.el.addEventListener('mouseenter', () => { p.hovering = true })
        p.el.addEventListener('mouseleave', () => {
          p.hovering = false
          particles.current.forEach((other, j) => {
            if (j === i) return
            const dx = other.x - p.x, dy = other.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < currentProximity && dist > 0) {
              const f = REPEL_FORCE * (1 - dist / currentProximity)
              other.vx += (dx / dist) * f + (Math.random() - 0.5) * 0.6
              other.vy += (dy / dist) * f + (Math.random() - 0.5) * 0.6
            }
          })
        })
      })
    }

    let lastW = 0, lastH = 0

    function animate() {
      const canvas  = canvasRef.current
      const cont    = containerRef.current
      const titleEl = titleRef.current
      if (!canvas || !cont) { rafRef.current = requestAnimationFrame(animate); return }

      const W = cont.clientWidth, H = cont.clientHeight

      if (!initialized) {
        if (W === 0 || H === 0) { rafRef.current = requestAnimationFrame(animate); return }
        initialized = true
        initParticles(wordsEl!, W, H)
      }

      if (W !== lastW || H !== lastH) {
        canvas.width = W; canvas.height = H
        lastW = W; lastH = H
      }

      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2

      let titleR: { left: number; right: number; top: number; bottom: number } | null = null
      if (titleEl) {
        const tr = titleEl.getBoundingClientRect()
        const cr = cont.getBoundingClientRect()
        titleR = { left: tr.left - cr.left, right: tr.right - cr.left, top: tr.top - cr.top, bottom: tr.bottom - cr.top }
      }

      const ps     = particles.current
      const lineT  = lineProgRef.current   // 1 = full lines, 0 = retracted

      // ── Collision separation ──────────────────────────────────────
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
          const gap  = a.r + b.r + 12
          if (dist < gap) {
            const push = ((gap - dist) / gap) * COLLISION_K
            const nx = dx / dist, ny = dy / dist
            if (!a.hovering) { a.vx -= nx * push; a.vy -= ny * push }
            if (!b.hovering) { b.vx += nx * push; b.vy += ny * push }
          }
        }
      }

      // ── Per-particle update ───────────────────────────────────────
      ps.forEach((p, i) => {
        if (p.hovering) {
          p.vibPhase += 0.55
          const ox = Math.sin(p.vibPhase * 13) * 2.4
          const oy = Math.cos(p.vibPhase * 11) * 2.4
          if (p.el) applyPos(p.el, p.x + ox, p.y + oy)

          ps.forEach((other, j) => {
            if (j === i) return
            const dx = other.x - p.x, dy = other.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < currentProximity) {
              const alpha = (1 - dist / currentProximity) * 0.75 * lineT
              const [lr, lg, lb] = canvasTheme.heroLineRgb
              ctx.beginPath()
              ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha.toFixed(3)})`
              ctx.lineWidth = 1
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          })
          return
        }

        p.targetTimer -= 1
        if (p.targetTimer <= 0) {
          ;[p.targetX, p.targetY] = pickInZone(p.zone, W, H)
          p.targetTimer = 100 + Math.random() * 150
        }

        const dtx = p.targetX - p.x, dty = p.targetY - p.y
        const td  = Math.sqrt(dtx * dtx + dty * dty)
        if (td > 8) { p.vx += (dtx / td) * STEER_FORCE; p.vy += (dty / td) * STEER_FORCE }

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED }
        p.vx *= DRAG; p.vy *= DRAG

        p.x += p.vx; p.y += p.vy

        const PAD = 50, TOP = 88
        if (p.x < PAD)     { p.x = PAD;     p.vx =  Math.abs(p.vx) * 0.7 }
        if (p.x > W - PAD) { p.x = W - PAD; p.vx = -Math.abs(p.vx) * 0.7 }
        if (p.y < TOP)     { p.y = TOP;     p.vy =  Math.abs(p.vy) * 0.7 }
        if (p.y > H - PAD) { p.y = H - PAD; p.vy = -Math.abs(p.vy) * 0.7 }

        if (p.el) applyPos(p.el, p.x, p.y)

        // Draw line retracting from word toward title centre
        if (lineT > 0.004) {
          let [lx, ly] = [cx, cy]
          if (titleR) [lx, ly] = lineExitRect(cx, cy, p.x, p.y, titleR)

          // Calculate where the line would intersect the word's boundary box
          const padX = 8
          const padY = 6
          const w = p.w || 80
          const h = p.h || 20
          const wordRect = {
            left: p.x - w / 2 - padX,
            right: p.x + w / 2 + padX,
            top: p.y - h / 2 - padY,
            bottom: p.y + h / 2 + padY,
          }

          const [targetX, targetY] = lineExitRect(p.x, p.y, lx, ly, wordRect)

          // Find direction vector from connection start to word boundary
          const dirX = targetX - lx
          const dirY = targetY - ly
          const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 0.01

          // Offset the end point back so the square is fully before the word boundary
          const squareSize = 5
          const offsetDist = squareSize / 2 + 3 // 5.5px offset, ensuring the square sits outside
          
          const adjTargetX = targetX - (dirX / dirLen) * offsetDist
          const adjTargetY = targetY - (dirY / dirLen) * offsetDist

          // End point walks from adjusted boundary position back to title edge as lineT → 0
          const endX = lx + (adjTargetX - lx) * lineT
          const endY = ly + (adjTargetY - ly) * lineT

          // Draw the line
          const [lr, lg, lb] = canvasTheme.heroLineRgb
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${lr},${lg},${lb},${(0.17 * lineT).toFixed(3)})`
          ctx.lineWidth = 1.5
          ctx.moveTo(lx, ly)
          ctx.lineTo(endX, endY)
          ctx.stroke()

          // Draw the small square centered at the adjusted end point
          ctx.fillStyle = `rgba(${lr},${lg},${lb},${(0.25 * lineT).toFixed(3)})`
          ctx.fillRect(endX - squareSize / 2, endY - squareSize / 2, squareSize, squareSize)
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isMobile])

  return (
    <div ref={wrapperRef} className="hero-wrapper">
      <div ref={containerRef} className="hero-section">
        <canvas ref={canvasRef} className="hero-canvas" />

        <div ref={wordsRef} className="words-layer">
          {activeWordsZones.map(([word], i) => (
            <span key={`${word}-${i}`} className="floating-word">{word}</span>
          ))}
        </div>

        {TITLE_HOVER_ENABLED ? (
          <HeroTitleHover ref={titleRef} />
        ) : (
          <div ref={titleRef} className="hero-title">
            <div className="title-line">VERGE</div>
            <div className="title-line">ASSURE</div>
          </div>
        )}

        <div className="hero-scroll">
          <span className="scroll-label">SCROLL TO EXPLORE</span>
        </div>
      </div>
    </div>
  )
}
