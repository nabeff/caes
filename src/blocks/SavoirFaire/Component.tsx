import React from 'react'
import type { SavoirFaireBlock as SavoirFaireBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const SavoirFaireBlock: React.FC<SavoirFaireBlockProps> = ({
  title,
  text,
  mainImage,
  teamImage,
}) => {
  const main = mainImage as MediaType | null
  const team = teamImage as MediaType | null

  return (
    <section className="bg-black text-white py-12 md:py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full">
          <div className="w-[50%]">
            <div className="relative w-full aspect-[645/740] overflow-hidden">
              {main && <Media resource={main} fill className="object-cover" />}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-[50%] justify-between">
            <SplitRevealText
              as="h2"
              variant="title"
              text={title}
              className="text-2xl md:text-3xl lg:text-6xl "
            />

            <div className="flex flex-col gap-6 ">
              <p className="whitespace-pre-line text-sm md:text-base leading-relaxed ">{text}</p>
              <div className="relative w-full aspect-[589/254] overflow-hidden">
                <Media resource={team} fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SavoirFaireBlock
