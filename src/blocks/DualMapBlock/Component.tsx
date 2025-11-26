import React from 'react'
import type { DualMapBlock as DualMapBlockProps } from '@/payload-types'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const DualMapBlock: React.FC<DualMapBlockProps> = ({ title, intro, mapLeft, mapRight }) => {
  const leftLinkHref = (mapLeft?.linkUrl || mapLeft?.embedUrl) as string | undefined
  const rightLinkHref = (mapRight?.linkUrl || mapRight?.embedUrl) as string | undefined

  return (
    <section className="container py-16">
      {/* Title + intro */}
      <header className="mb-10 max-w-3xl">
        {title && (
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="mb-4 text-2xl md:text-3xl lg:text-4xl"
          />
        )}
        {intro && (
          <SplitRevealText
            as="p"
            variant="text"
            text={intro}
            className="text-sm leading-relaxed md:text-base whitespace-pre-line"
          />
        )}
      </header>

      {/* Two maps */}
      <div className="grid gap-8 md:grid-cols-2 mt-2 border-t border-neutral-200 pt-6">
        {/* Left map */}
        {mapLeft && mapLeft.embedUrl && (
          <div className="flex flex-col gap-3">
            <div>
              <SplitRevealText
                as="h3"
                variant="title"
                text={mapLeft.mapTitle}
                className="mt-4 mb-2 text-2xl"
              />
              {leftLinkHref && (
                <a
                  href={leftLinkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  {mapLeft.linkLabel}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Right map */}
        {mapRight && mapRight.embedUrl && (
          <div className="flex flex-col gap-3">
            <div>
              <SplitRevealText
                as="h3"
                variant="title"
                text={mapRight.mapTitle}
                className="mt-4 mb-2 text-2xl"
              />
              {rightLinkHref && (
                <a
                  href={rightLinkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  {mapRight.linkLabel}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
