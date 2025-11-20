// src/blocks/HeroCarousel/Component.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { HeroCarouselBlock as HeroCarouselBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import arrowRight from '../../../public/arrowright.svg'

export const HeroCarouselBlock: React.FC<HeroCarouselBlockProps> = (props) => {
  const { slides } = props
  const safeSlides = Array.isArray(slides) ? slides : []
  const [activeIndex, setActiveIndex] = useState(0)

  // CTA from shared `link` field
  const cta = (props as any).cta
  const ctaLabel: string | undefined = cta?.label
  const ctaUrl: string | undefined =
    typeof cta?.url === 'string' && cta.url.trim() ? cta.url.trim() : undefined

  useEffect(() => {
    if (safeSlides.length < 2) return

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeSlides.length)
    }, 5000)

    return () => clearInterval(id)
  }, [safeSlides.length])

  if (!safeSlides.length) return null

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      {/* Slides stacked → smooth crossfade, no white flash */}
      <div className="absolute inset-0">
        {safeSlides.map((slide, idx) => {
          const isActive = idx === activeIndex
          const image = slide?.image
          if (!image) return null

          return (
            <div
              key={idx}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-out',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Media
                resource={image}
                fill
                // 🔥 Black & white image, like you asked
                imgClassName="object-cover grayscale"
              />
              {/* dark overlay */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )
        })}
      </div>

      {/* Bottom controls + CTA */}
      <div className="pointer-events-none absolute inset-x-12 bottom-12 z-10 flex items-center justify-between">
        {/* Progress bars (left) */}
        <div className="pointer-events-auto flex items-center gap-3">
          {safeSlides.map((_, idx) => {
            const isActive = idx === activeIndex

            return (
              <div
                key={idx}
                className={cn(
                  'relative h-[4px] overflow-hidden rounded-full bg-white/40 transition-all duration-300',
                  isActive ? 'w-24' : 'w-10',
                )}
              >
                {isActive && (
                  <span
                    key={`${idx}-${activeIndex}`}
                    className="hero-slide-progress absolute inset-0 bg-white"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* CTA link + arrow (right) */}
        {ctaUrl && ctaLabel && (
          <Link
            href={ctaUrl}
            className="pointer-events-auto inline-flex items-center gap-2 text-sm   text-white hover:underline "
          >
            <span>{ctaLabel}</span>
            <span className="relative h-3 w-3">
              <Image src={arrowRight} alt="Arrow right" fill className="object-contain" />
            </span>
          </Link>
        )}

        <div></div>
      </div>
    </section>
  )
}

export default HeroCarouselBlock
