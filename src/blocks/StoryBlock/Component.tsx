// src/blocks/StoryBlock/Component.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { StoryBlock as StoryBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const StoryBlock: React.FC<StoryBlockProps> = ({ title, text, image }) => {
  const imgWrapperRef = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = imgWrapperRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-[#f4f4f4] py-16 md:py-24 mt-[60px]">
      <div className="container grid items-start gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,1.1fr)]">
        {/* Left: title */}
        <div>
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="text-2xl md:text-3xl lg:text-4xl uppercase "
          />
        </div>

        {/* Middle: paragraph */}
        <div className="text-sm leading-relaxed md:text-base whitespace-pre-line">{text}</div>

        {/* Right: image with left-to-right reveal mask */}
        <div
          ref={imgWrapperRef}
          className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden"
        >
          {image && (
            <>
              <Media resource={image} fill imgClassName="object-cover" />

              {/* Slower mask animation (2s) */}
              <div
                className={`pointer-events-none absolute inset-0 bg-[#f4f4f4] transform origin-left transition-transform duration-[2000ms] ease-out ${
                  revealed ? 'scale-x-0' : 'scale-x-100'
                }`}
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default StoryBlock
