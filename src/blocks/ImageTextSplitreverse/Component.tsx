import React from 'react'
import type { ImageTextSplitBlock as ImageTextSplitProps } from '@/payload-types'
import { ParallaxMedia } from '@/components/ParallaxMedia'
import type { Media as MediaType } from '@/payload-types'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const ImageTextSplitReverseBlock: React.FC<ImageTextSplitProps> = ({
  title,
  text,
  image,
}) => {
  const img = image as MediaType | null

  return (
    <section className=" py-16 md:py-24">
      <div className="container flex flex-col lg:flex-row items-center gap-8">
        <div className="w-full lg:w-[55%] flex flex-col gap-6">
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="text-2xl md:text-3xl lg:text-6xl uppercase  "
          />

          <p className="whitespace-pre-line text-sm leading-relaxed md:text-base w-[90%]">{text}</p>
        </div>
        <div className="relative w-full lg:w-[45%] aspect-[533/651] overflow-hidden">
          {img && <ParallaxMedia resource={img} fill shift={40} />}
        </div>
      </div>
    </section>
  )
}

export default ImageTextSplitReverseBlock
