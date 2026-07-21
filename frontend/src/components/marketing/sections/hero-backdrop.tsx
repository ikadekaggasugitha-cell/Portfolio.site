'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTheme } from '../theme/theme-provider'

type Dot = { x: number; y: number; bx: number; by: number }

/**
 * The hero's single background system: a precision dot-grid that leans toward
 * the pointer and lights up nearby — an "engineered" motif. Pure canvas, one
 * rAF loop, transform-free. Disabled entirely for reduced-motion users.
 */
export function HeroBackdrop() {
  const reduce = useReducedMotion()
  const { resolved } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !parent || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const styles = getComputedStyle(canvas)
    const litRGB = styles.getPropertyValue('--mk-dot-lit').trim() || '79,70,229'
    const baseColor = styles.getPropertyValue('--mk-dot').trim() || 'rgba(11,15,26,0.10)'
    const GAP = 34
    const REACH = 130

    let width = 0
    let height = 0
    let dots: Dot[] = []
    let raf = 0
    let resizeTimer = 0
    const mouse = { x: -9999, y: -9999 }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let y = GAP; y < height; y += GAP) {
        for (let x = GAP; x < width; x += GAP) dots.push({ x, y, bx: x, by: y })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const d of dots) {
        const dx = d.bx - mouse.x
        const dy = d.by - mouse.y
        const dist = Math.hypot(dx, dy) || 0.0001
        if (dist < REACH) {
          const force = 1 - dist / REACH
          d.x += (d.bx + (dx / dist) * force * 26 - d.x) * 0.12
          d.y += (d.by + (dy / dist) * force * 26 - d.y) * 0.12
          ctx.fillStyle = `rgba(${litRGB},${0.25 + force * 0.6})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, 1.3 + force * 2.2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          d.x += (d.bx - d.x) * 0.12
          d.y += (d.by - d.y) * 0.12
          ctx.fillStyle = baseColor
          ctx.beginPath()
          ctx.arc(d.x, d.y, 1.3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 200)
    }

    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    build()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [reduce, resolved])

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
}
