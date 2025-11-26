import React from 'react'
import type { ImageTextSplitBlock as ImageTextSplitProps } from '@/payload-types'
import { ParallaxMedia } from '@/components/ParallaxMedia'
import type { Media as MediaType } from '@/payload-types'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const ImageTextSplitBlock: React.FC<ImageTextSplitProps> = ({ title, text, image }) => {
  const img = image as MediaType | null

  return (
    <section className="bg-[#f4f4f4] py-16 md:py-24">
      <div className="container grid items-center gap-10 md:grid-cols-2">
        {/* Left: image with parallax */}
        <div className="relative w-full aspect-[4/3] md:aspect-[4/4] overflow-hidden">
          {img && <ParallaxMedia resource={img} fill shift={40} />}
        </div>

        {/* Right: text */}
        <div className="space-y-4">
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="text-2xl md:text-3xl lg:text-4xl"
          />

          <p className="whitespace-pre-line text-sm leading-relaxed md:text-base">{text}</p>
        </div>
      </div>
    </section>
  )
}

export default ImageTextSplitBlock
