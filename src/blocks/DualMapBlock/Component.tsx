import React from 'react'
import type { DualMapBlock as DualMapBlockProps } from '@/payload-types'

export const DualMapBlock: React.FC<DualMapBlockProps> = ({ title, intro, mapLeft, mapRight }) => {
  const leftLinkHref = (mapLeft?.linkUrl || mapLeft?.embedUrl) as string | undefined
  const rightLinkHref = (mapRight?.linkUrl || mapRight?.embedUrl) as string | undefined

  return (
    <section className="container py-16">
      {/* Title + intro */}
      <header className="mb-10 max-w-3xl">
        {title && <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl">{title}</h2>}
        {intro && (
          <p className="text-sm leading-relaxed md:text-base whitespace-pre-line">{intro}</p>
        )}
      </header>

      {/* Two maps */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left map */}
        {mapLeft && mapLeft.embedUrl && (
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
              <iframe
                src={mapLeft.embedUrl as string}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div>
              <h3 className="text-2xl mt-4 mb-2">{mapLeft.mapTitle}</h3>
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
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
              <iframe
                src={mapRight.embedUrl as string}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div>
              <h3 className="text-2xl mt-4 mb-2">{mapRight.mapTitle}</h3>
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
