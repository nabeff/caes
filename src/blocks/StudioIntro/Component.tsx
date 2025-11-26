'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { StudioIntroBlock as StudioIntroProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const StudioIntroBlock: React.FC<StudioIntroProps> = ({ title, image }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0) // 0 = start, 1 = end
  const [viewportWidth, setViewportWidth] = useState(0)

  // Track viewport width
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth || 1)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1

      const start = viewportHeight * 0.95
      const end = viewportHeight * 0.25
      const raw = (start - rect.top) / (start - end)

      const clamped = Math.min(1, Math.max(0, raw))
      setProgress(clamped)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDesktop = viewportWidth >= 1024 // lg breakpoint (tweak if you want)

  // Easing
  const easedProgress = 1 - Math.pow(1 - progress, 2) // easeOutQuad
  const grayscale = easedProgress

  /* ---------- image scale only on desktop ---------- */

  const minTargetWidth = 1100
  let minScale = 1

  if (isDesktop && viewportWidth > 0) {
    const ratio = minTargetWidth / viewportWidth
    if (ratio < 1) {
      minScale = Math.max(ratio, 0.5)
    } else {
      minScale = 1
    }
  } else {
    minScale = 1
  }

  const effectiveProgress = isDesktop ? easedProgress : 0
  const imageScale = 1 - (1 - minScale) * effectiveProgress

  // Title vertical movement (desktop only)
  const startOffsetVH = 10
  const endOffsetVH = -43
  const titleOffsetVH = startOffsetVH + (endOffsetVH - startOffsetVH) * effectiveProgress

  /* ---------- MOBILE / TABLET LAYOUT (title static above image) ---------- */
  if (!isDesktop) {
    return (
      <section ref={sectionRef} className="py-14">
        <div className="container mx-auto px-4 flex flex-col gap-8 items-center">
          <SplitRevealText
            as="h4"
            variant="title"
            text={title}
            className="29LT text-left text-2xl md:text-6xl !uppercase font-bolder"
          />

          <div
            className="relative w-full aspect-[16/9] overflow-hidden"
            style={{
              filter: `grayscale(${grayscale})`,
              transition: 'filter 0.25s ease-out',
            }}
          >
            {image && <Media resource={image} fill imgClassName="object-cover" />}
          </div>
        </div>
      </section>
    )
  }

  /* ---------- DESKTOP LAYOUT (overlay + animation) ---------- */

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <div className="relative h-screen w-full">
        {/* Image */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            filter: `grayscale(${grayscale})`,
            transition: 'filter 0.25s ease-out',
          }}
        >
          <div
            className="relative aspect-[16/9] overflow-hidden"
            style={{
              width: '100vw',
              transform: `scale(${imageScale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.05s linear',
              willChange: 'transform',
            }}
          >
            {image && <Media resource={image} fill imgClassName="object-cover" />}
          </div>
        </div>

        {/* Title overlay, animated */}
        <div
          className="absolute z-[1]"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translateY(${titleOffsetVH}vh)`,
            transition: 'transform 0.05s linear',
            willChange: 'transform',
          }}
        >
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="text-center text-3xl lg:text-4xl !uppercase font-bold"
          />
        </div>
      </div>
    </section>
  )
}

export default StudioIntroBlock
