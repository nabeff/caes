// src/blocks/HeroCarousel/Component.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type {
  HeroCarouselBlock as HeroCarouselBlockProps,
  Project,
  Media as MediaType,
} from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import arrowRight from '../../../public/arrowright.svg'

export const HeroCarouselBlock: React.FC<HeroCarouselBlockProps> = (props) => {
  const { slides, featuredProjectLabel, cta } = props
  const safeSlides = Array.isArray(slides) ? slides : []
  const [activeIndex, setActiveIndex] = useState(0)

  // we only use the label from CTA; URL comes from active project
  const ctaLabel: string | undefined = cta?.label as string | undefined

  const pathname = usePathname()
  const segments = (pathname || '/').split('/').filter(Boolean)
  const currentLocale = segments[0] ?? 'en'

  useEffect(() => {
    if (safeSlides.length < 2) return

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeSlides.length)
    }, 5000)

    return () => clearInterval(id)
  }, [safeSlides.length])

  if (!safeSlides.length) return null

  const activeSlide = safeSlides[activeIndex]
  const activeProject = (activeSlide?.project || null) as Project | null
  const activeTitle = (activeProject?.title || '') as string
  const activeSlug = activeProject?.slug as string | undefined
  const activeHref = activeSlug ? `/${currentLocale}/projects/${activeSlug}` : undefined

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      {/* Slides stacked → smooth crossfade */}
      <div className="absolute inset-0">
        {safeSlides.map((slide, idx) => {
          const isActive = idx === activeIndex
          const project = (slide?.project || null) as Project | null
          const heroImage = project?.heroImage as MediaType | null

          if (!heroImage) return null

          return (
            <div
              key={project?.id ?? idx}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-out',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Media resource={heroImage} fill imgClassName="object-cover " />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-12 z-10 w-full">
        <div className="container mx-auto flex flex-col items-start justify-start gap-8 md:flex-row md:items-end md:justify-between">
          {/* Left: indicators + featured text + slide title */}
          <div className="flex flex-col items-start gap-6 md:gap-8">
            {/* Progress bars */}
            <div className="pointer-events-auto flex items-center gap-3">
              {safeSlides.map((slide, idx) => {
                const isActive = idx === activeIndex

                return (
                  <div
                    key={(slide?.project as Project | null)?.id ?? idx}
                    className={cn(
                      'relative h-[4px] overflow-hidden bg-white/40 transition-all duration-300',
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

            {/* Featured label + project title */}
            <div className="text-white">
              {activeTitle && <p className="mt-1 text-sm md:text-xl">{activeTitle}</p>}
            </div>
          </div>

          {/* Right: CTA → link to active project */}
          {activeHref && ctaLabel && (
            <Link
              href={activeHref}
              className="pointer-events-auto inline-flex items-center gap-2 text-sm text-white link-underline-swipe"
            >
              <span>{ctaLabel}</span>
              <span className="relative h-3 w-3">
                <Image src={arrowRight} alt="Arrow right" fill className="object-contain" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroCarouselBlock
