import React from 'react'
import type { PhilosophyBlock as PhilosophyBlockProps, Media as MediaType } from '@/payload-types'
import { ParallaxMedia } from '@/components/ParallaxMedia'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const PhilosophyBlock: React.FC<PhilosophyBlockProps> = ({
  title,
  text,
  backgroundImage,
}) => {
  const bg = backgroundImage as MediaType | null

  return (
    <section className="bg-[#f4f4f4] py-10 md:py-12">
      <div className="container">
        <div className="relative h-auto py-12 w-full overflow-hidden">
          {/* Background image with parallax */}
          {bg && (
            <ParallaxMedia
              resource={bg}
              fill
              shift={50} // slightly stronger for hero feel
              wrapperClassName="absolute inset-0"
              imgClassName="object-cover grayscale"
            />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Content */}
          <div className="relative z-10 flex h-full items-center justify-center p-6 md:p-12 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="md:w-1/3">
                <SplitRevealText
                  as="h2"
                  variant="title"
                  text={title}
                  className="text-2xl md:text-3xl lg:text-4xl uppercase "
                />
              </div>

              <div className="whitespace-pre-line md:w-2/3 text-sm lg:text-base">{text}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhilosophyBlock
