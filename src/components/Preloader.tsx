// src/components/Preloader.tsx
'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'

export default function Preloader() {
  const [progress, setProgress] = useState(0) // 0 → 1
  const [isDone, setIsDone] = useState(false)
  const touchStartYRef = useRef<number | null>(null)

  // 🔒 LOCK PAGE SCROLL + use wheel/touch to animate
  useEffect(() => {
    if (isDone) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0 && !isDone) {
        setProgress((prev) => Math.min(prev + e.deltaY * 0.0015, 1))
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDone) return
      const currentY = e.touches[0]?.clientY ?? 0
      const startY = touchStartYRef.current ?? currentY
      const delta = startY - currentY
      if (delta > 0) {
        setProgress((prev) => Math.min(prev + delta * 0.02, 1))
      }
      touchStartYRef.current = currentY
      e.preventDefault()
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDone])

  // REMOVE PRELOADER
  useEffect(() => {
    if (progress >= 1 && !isDone) {
      const timeout = setTimeout(() => setIsDone(true), 250)
      return () => clearTimeout(timeout)
    }
  }, [progress, isDone])

  if (isDone) return null

  const clamped = Math.min(Math.max(progress, 0), 1)

  // CIRCLE always uses full progress
  const holeSize = 160 * clamped

  // 🔥 LOGO SHRINK from 0–30%
  const shrinkEnd = 0.3
  const shrinkProgress = Math.min(clamped / shrinkEnd, 1) // 0→1 over first 30%
  const logoScale = 1 - 0.4 * shrinkProgress // 1 → 0.6

  // 🔥 LOGO FADE from 30%–50%
  const fadeStart = 0.3
  const fadeEnd = 0.5
  let fadeProgress = 0
  if (clamped > fadeStart) {
    fadeProgress = Math.min((clamped - fadeStart) / (fadeEnd - fadeStart), 1)
  }
  const logoOpacity = 1 - fadeProgress // 1 → 0

  // ⭐ ICON FADE: starts AFTER logo is gone
  // icon visible until 0.5, then fades out between 0.5–0.8
  const iconFadeStart = 0.5
  const iconFadeEnd = 0.8
  let iconFadeProgress = 0
  if (clamped > iconFadeStart) {
    iconFadeProgress = Math.min((clamped - iconFadeStart) / (iconFadeEnd - iconFadeStart), 1)
  }
  const iconOpacity = 1 - iconFadeProgress // 1 → 0 after logo

  const style = {
    '--hole-size': `${holeSize}%`,
  } as any

  const logoStyle: CSSProperties = {
    transform: `scale(${logoScale})`,
    opacity: logoOpacity,
    transition: 'transform 0.25s ease-out, opacity 0.25s ease-out',
  }

  const iconStyle: CSSProperties = {
    opacity: iconOpacity,
    transition: 'opacity 0.25s ease-out',
  }

  return (
    <div className="preloader-overlay" style={style}>
      <div className="preloader-inner">
        <div className="preloader-logo" style={logoStyle}>
          <Image src="/preloaderlogo.svg" alt="Preloader logo" width={260} height={260} priority />
        </div>

        {/* bottom-left text – currently disabled */}
        {/* <p className="preloader-scroll-hint">scroll to explore</p> */}

        {/* bottom-right bouncing scroll icon (fades after logo) */}
        <div className="preloader-scroll-icon" style={iconStyle} aria-hidden="true">
          <Image src="/scroll-down.svg" alt="" width={32} height={32} priority />
        </div>
      </div>
    </div>
  )
}
