// src/components/Preloader.tsx
'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl' // ⬅️ add this

function LogoLetters() {
  return (
    <div className="preloader-logo-letters">
      {/* main CAES word */}
      <div className="preloader-logo-main">
        <span className="preloader-letter preloader-letter--c">C</span>
        <span className="preloader-letter preloader-letter--a">A</span>

        {/* E with bar above it */}
        <span className="preloader-letter-wrapper preloader-letter-wrapper--e">
          <span className="preloader-letter preloader-letter--e">E</span>
          <span className="preloader-letter-bar" />
        </span>

        <span className="preloader-letter preloader-letter--s">S</span>
      </div>

      {/* ARCHITECTURE – letter by letter */}
      <div className="preloader-word-archi">
        <span className="archi-letter archi-letter--1">A</span>
        <span className="archi-letter archi-letter--2">R</span>
        <span className="archi-letter archi-letter--3">C</span>
        <span className="archi-letter archi-letter--4">H</span>
        <span className="archi-letter archi-letter--5">I</span>
        <span className="archi-letter archi-letter--6">T</span>
        <span className="archi-letter archi-letter--7">E</span>
        <span className="archi-letter archi-letter--8">C</span>
        <span className="archi-letter archi-letter--9">T</span>
        <span className="archi-letter archi-letter--10">U</span>
        <span className="archi-letter archi-letter--11">R</span>
        <span className="archi-letter archi-letter--12">E</span>
      </div>
    </div>
  )
}

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const touchStartYRef = useRef<number | null>(null)

  const t = useTranslations('Preloader') // ⬅️ use the Preloader namespace
  const scrollText = t('scrollToExplore')
  const words = scrollText.split(' ') // we’ll stack each word on its own line

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

  useEffect(() => {
    if (progress >= 1 && !isDone) {
      const timeout = setTimeout(() => setIsDone(true), 250)
      return () => clearTimeout(timeout)
    }
  }, [progress, isDone])

  if (isDone) return null

  const clamped = Math.min(Math.max(progress, 0), 1)
  const holeSize = 50 * clamped

  const shrinkEnd = 0.3
  const shrinkProgress = Math.min(clamped / shrinkEnd, 1)
  const logoScale = 1 - 0.4 * shrinkProgress

  const fadeStart = 0.3
  const fadeEnd = 0.5
  let fadeProgress = 0
  if (clamped > fadeStart) {
    fadeProgress = Math.min((clamped - fadeStart) / (fadeEnd - fadeStart), 1)
  }
  const logoOpacity = 1 - fadeProgress

  const iconFadeStart = 0.5
  const iconFadeEnd = 0.8
  let iconFadeProgress = 0
  if (clamped > iconFadeStart) {
    iconFadeProgress = Math.min((clamped - iconFadeStart) / (iconFadeEnd - iconFadeStart), 1)
  }
  const iconOpacity = 1 - iconFadeProgress

  const style = {
    '--hole-size': `${holeSize}%`,
  } as React.CSSProperties

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
          <LogoLetters />
        </div>

        {/* bottom-right bouncing scroll icon (fades after logo) */}
        <div className="preloader-scroll-icon" style={iconStyle} aria-hidden="true">
          <span className="preloader-scroll-label">
            {words.map((word, idx) => (
              <span key={idx}>{word}</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
