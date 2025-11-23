'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

type SplitVariant = 'title' | 'text'

type SplitRevealTextProps = {
  text: string
  className?: string
  as?: React.ElementType
  extraDelay?: number
  variant?: SplitVariant
}

export const SplitRevealText: React.FC<SplitRevealTextProps> = ({
  text,
  className = '',
  as: Tag = 'div',
  extraDelay = 0,
  variant = 'title',
}) => {
  const textRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const [baseDelay, setBaseDelay] = useState(0)

  // decide base delay depending on navigation
  useEffect(() => {
    const previousPath = sessionStorage.getItem('previousPath')

    if (previousPath && previousPath !== pathname) {
      setBaseDelay(3)
    } else {
      setBaseDelay(0)
    }

    sessionStorage.setItem('previousPath', pathname)
  }, [pathname])

  useEffect(() => {
    if (!textRef.current) return

    const runAnimation = () => {
      if (!textRef.current) return

      gsap.set(textRef.current, { opacity: 1 })

      // 👇 IMPORTANT: only split words for titles
      const types = variant === 'title' ? 'lines,words' : 'lines'

      const split = new SplitType(textRef.current, {
        types,
        lineClass: 'line-mask',
      })

      const contentLength = textRef.current.innerText.length
      const isLong = contentLength > 140
      const isTitle = variant === 'title'

      const lineDuration = isTitle ? (isLong ? 0.5 : 0.6) : isLong ? 0.35 : 0.45

      const lineStagger = isTitle ? (isLong ? 0.12 : 0.16) : isLong ? 0.1 : 0.14

      const wordDuration = isTitle ? (isLong ? 0.24 : 0.3) : isLong ? 0.2 : 0.26

      const wordStagger = isTitle ? (isLong ? 0.04 : 0.06) : isLong ? 0.03 : 0.05

      const overlap = isTitle ? '-=0.25' : isLong ? '-=0.32' : '-=0.3'

      const tl = gsap.timeline({
        delay: baseDelay + extraDelay,
        paused: true,
      })

      ScrollTrigger.create({
        trigger: textRef.current,
        start: 'top 85%',
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        once: true,
      })

      // If element starts already visible → play instantly
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.85) {
          tl.play(0)
        }
      }

      tl.from(split.lines, {
        yPercent: 100,
        opacity: 0,
        duration: lineDuration,
        ease: 'expo.out',
        stagger: lineStagger,
      })

      if (isTitle && split.words) {
        tl.from(
          split.words,
          {
            yPercent: 80,
            opacity: 0,
            duration: wordDuration,
            ease: 'power3.out',
            stagger: wordStagger,
          },
          overlap,
        )
      }

      return () => {
        tl.kill()
        split.revert()
      }
    }

    const fonts = (document as any).fonts
    if (fonts?.ready) {
      fonts.ready.then(runAnimation).catch(runAnimation)
    } else {
      runAnimation()
    }
  }, [baseDelay, extraDelay, variant])

  return (
    <Tag ref={textRef as any} className={`split ${className}`} style={{ opacity: 0 }}>
      {text}
    </Tag>
  )
}
