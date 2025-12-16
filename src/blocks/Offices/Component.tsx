import React from 'react'
import type { OfficesBlock as OfficesBlockProps } from '@/payload-types'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const OfficesBlock: React.FC<OfficesBlockProps> = ({ title, rightText, offices }) => {
  return (
    <section className="bg-black text-white py-12 md:py-16">
      <div className="container flex flex-col gap-10">
        {/* Header row: title left, text right */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="text-2xl md:text-3xl lg:text-6xl uppercase  "
          />

          {rightText && <p className="text-sm md:text-base tracking-[0.12em] ">{rightText}</p>}
        </div>

        {/* Offices list */}
        <div className="flex flex-col gap-8">
          {offices?.map((office, index) => (
            <div key={index} className="w-full border-t border-white/30 pt-6 md:pt-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
                {/* 1) City title */}
                <div className="md:w-1/4  tracking-[0.16em]">
                  <h3 className="text-xl md:text-2xl uppercase">{office.city}</h3>
                </div>

                {/* 2) Address + phone + email */}
                <div className="md:w-2/4 text-sm md:text-base flex flex-col gap-3">
                  {office.address && <p>{office.address}</p>}

                  {office.phone && (
                    <p>
                      <a
                        href={`tel:${office.phone.replace(/\s+/g, '')}`}
                        className="link-underline-swipe w-fit"
                      >
                        {office.phone}
                      </a>
                    </p>
                  )}

                  {office.email && (
                    <p>
                      <a href={`mailto:${office.email}`} className="link-underline-swipe w-fit">
                        {office.email}
                      </a>
                    </p>
                  )}
                </div>

                {/* 3) Map link */}
                <div className="md:w-1/4 text-xs md:text-sm text-right uppercase tracking-[0.16em] flex justify-end">
                  {office.mapUrl ? (
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline-swipe w-fit"
                    >
                      {office.mapLabel || 'Map'}
                    </a>
                  ) : (
                    office.mapLabel || 'Map'
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OfficesBlock
