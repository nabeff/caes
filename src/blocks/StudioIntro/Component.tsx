// src/blocks/StudioIntro/Component.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { StudioIntroBlock as StudioIntroProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const StudioIntroBlock: React.FC<StudioIntroProps> = ({ title, image }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0) // 0 = full color, 1 = full B&W

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return

      const rect = wrapperRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1

      // Start effect when block enters bottom of viewport,
      // finish when its top is around 25% of viewport height.
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

  // From 0 (color) -> 1 (full grayscale)
  const grayscale = progress

  return (
    <section className="bg-black py-16 md:py-20">
      <div className="container flex flex-col items-center gap-10">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl text-white">{title}</h2>

        <div
          ref={wrapperRef}
          className="relative w-full max-w-5xl aspect-[16/9] overflow-hidden mx-auto"
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

export default StudioIntroBlock
