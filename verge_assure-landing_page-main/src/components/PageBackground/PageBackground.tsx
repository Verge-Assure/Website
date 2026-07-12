import { useEffect, useRef } from 'react'
import './PageBackground.css'
import { canvasTheme } from '../../themes'

export function PageBackground({ forceDark = false }: { forceDark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetMouseRef = useRef({ x: 0, y: 0 })
  const targetMouseActiveRef = useRef(false)
  const scrollYRef = useRef(0)
  const forceDarkRef = useRef(forceDark)

  useEffect(() => {
    forceDarkRef.current = forceDark
  }, [forceDark])

  useEffect(() => {
    function handleScroll() {
      scrollYRef.current = window.scrollY
    }
    function handleMouseMove(e: MouseEvent) {
      targetMouseRef.current = { x: e.clientX, y: e.clientY }
      targetMouseActiveRef.current = true
    }
    function handleMouseLeave() {
      targetMouseActiveRef.current = false
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    
    // Initialise scroll position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx = rawCtx as CanvasRenderingContext2D

    let animationFrameId: number
    let W = window.innerWidth
    let H = window.innerHeight

    // Mouse coordinates (interpolated)
    let mx = W / 2
    let my = H / 2
    let mouseActive = 0

    function resize() {
      if (!canvas || !ctx) return
      W = window.innerWidth
      H = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    function render() {
      // 1. Update mouse coordinates with lerp
      const tx = targetMouseRef.current.x
      const ty = targetMouseRef.current.y
      mx += (tx - mx) * 0.08
      my += (ty - my) * 0.08

      // Update mouse active factor
      const targetActive = targetMouseActiveRef.current ? 1 : 0
      mouseActive += (targetActive - mouseActive) * 0.05

      // 2. Calculate scroll transition progress `t`
      let t = 0
      if (forceDarkRef.current) {
        t = 1
      } else {
        const servicesEl = document.getElementById('services')
        if (servicesEl) {
          const rect = servicesEl.getBoundingClientRect()
          const start = window.innerHeight * 0.95
          const end = window.innerHeight * 0.20
          const progress = (start - rect.top) / (start - end)
          t = Math.max(0, Math.min(1, progress))
        } else {
          const vh = window.innerHeight
          const scrollY = scrollYRef.current
          const transStart = vh * 1.2
          const transEnd   = vh * 2.1
          t = (scrollY - transStart) / (transEnd - transStart)
          t = Math.max(0, Math.min(1, t))
        }
      }

      // 3. Draw background color (interpolated between light and dark)
      const [blR, blG, blB] = canvasTheme.bgLightRgb
      const [bdR, bdG, bdB] = canvasTheme.bgDarkRgb
      const bgR = Math.round(blR + (bdR - blR) * t)
      const bgG = Math.round(blG + (bdG - blG) * t)
      const bgB = Math.round(blB + (bdB - blB) * t)
      ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`
      ctx.fillRect(0, 0, W, H)

      // 4. Grid line colors & warp parameters
      const warpRadius = 320
      const warpStrength = 0.55 * mouseActive

      const [glR, glG, glB] = canvasTheme.gridLightRgb
      const [gdR, gdG, gdB] = canvasTheme.gridDarkRgb

      // Interpolate colors for the radial gradients
      // Major Grid center / edge
      const majCR = Math.round(glR + (gdR - glR) * t)
      const majCG = Math.round(glG + (gdG - glG) * t)
      const majCB = Math.round(glB + (gdB - glB) * t)
      const majCA = 0.28 + (0.15 - 0.28) * t
      const majER = majCR
      const majEG = majCG
      const majEB = majCB
      const majEA = 0.08 + (0.032 - 0.08) * t

      // Minor Grid center / edge
      const minCR = majCR
      const minCG = majCG
      const minCB = majCB
      const minCA = 0.12 + (0.08 - 0.12) * t
      const minER = majCR
      const minEG = majCG
      const minEB = majCB
      const minEA = 0.03 + (0.012 - 0.03) * t

      // Create radial gradients centered at (mx, my) for the grid lines
      const majGrad = ctx.createRadialGradient(mx, my, 0, mx, my, warpRadius)
      majGrad.addColorStop(0, `rgba(${majCR}, ${majCG}, ${majCB}, ${majCA.toFixed(3)})`)
      majGrad.addColorStop(1, `rgba(${majER}, ${majEG}, ${majEB}, ${majEA.toFixed(3)})`)

      const minGrad = ctx.createRadialGradient(mx, my, 0, mx, my, warpRadius)
      minGrad.addColorStop(0, `rgba(${minCR}, ${minCG}, ${minCB}, ${minCA.toFixed(3)})`)
      minGrad.addColorStop(1, `rgba(${minER}, ${minEG}, ${minEB}, ${minEA.toFixed(3)})`)

      // Helper function to warp a single point
      function warp(x: number, y: number) {
        const dx = x - mx
        const dy = y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist >= warpRadius || dist === 0 || warpStrength === 0) return [x, y]
        const nt = dist / warpRadius
        const displacement = warpStrength * dist * Math.pow(1 - nt, 2)
        return [x + (dx / dist) * displacement, y + (dy / dist) * displacement]
      }

      const step = 30 // segment length for warp lines

      // Drawing helper for vertical lines
      function drawVerticalLine(x: number) {
        let first = true
        for (let y = -step; y <= H + step; y += step) {
          const [wx, wy] = warp(x, y)
          if (first) {
            ctx.moveTo(wx, wy)
            first = false
          } else {
            ctx.lineTo(wx, wy)
          }
        }
      }

      // Drawing helper for horizontal lines
      function drawHorizontalLine(y: number) {
        let first = true
        for (let x = -step; x <= W + step; x += step) {
          const [wx, wy] = warp(x, y)
          if (first) {
            ctx.moveTo(wx, wy)
            first = false
          } else {
            ctx.lineTo(wx, wy)
          }
        }
      }

      const startX = (W % 88) / 2
      const startY = (H % 88) / 2

      // Draw Minor Grid
      ctx.beginPath()
      ctx.strokeStyle = minGrad
      ctx.lineWidth = 1

      // Minor vertical lines
      for (let x = startX - 88; x <= W + 88; x += 22) {
        if (Math.round(x - startX) % 88 !== 0) {
          drawVerticalLine(x)
        }
      }
      // Minor horizontal lines
      for (let y = startY - 88; y <= H + 88; y += 22) {
        if (Math.round(y - startY) % 88 !== 0) {
          drawHorizontalLine(y)
        }
      }
      ctx.stroke()

      // Draw Major Grid
      ctx.beginPath()
      ctx.strokeStyle = majGrad
      ctx.lineWidth = 1.2

      // Major vertical lines
      for (let x = startX - 88; x <= W + 88; x += 88) {
        drawVerticalLine(x)
      }
      // Major horizontal lines
      for (let y = startY - 88; y <= H + 88; y += 88) {
        drawHorizontalLine(y)
      }
      ctx.stroke()

      // Draw cursor shine or shadow overlay
      if (mouseActive > 0.005) {
        const [gwlR, gwlG, gwlB] = canvasTheme.glowLightRgb
        const [gwdR, gwdG, gwdB] = canvasTheme.glowDarkRgb
        const glowR = Math.round(gwlR + (gwdR - gwlR) * t)
        const glowG = Math.round(gwlG + (gwdG - gwlG) * t)
        const glowB = Math.round(gwlB + (gwdB - gwlB) * t)
        const glowA = (0.10 + (0.18 - 0.10) * t) * mouseActive

        const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 280)
        glowGrad.addColorStop(0, `rgba(${glowR}, ${glowG}, ${glowB}, ${glowA.toFixed(3)})`)
        glowGrad.addColorStop(0.5, `rgba(${glowR}, ${glowG}, ${glowB}, ${(glowA * 0.35).toFixed(3)})`)
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(mx, my, 280, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="page-bg">
      <canvas ref={canvasRef} className="page-bg-canvas" />
    </div>
  )
}
