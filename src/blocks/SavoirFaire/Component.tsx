// SavoirFaireBlock.tsx
import React from 'react'
import type { SavoirFaireBlock as SavoirFaireBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { SplitRevealText } from '@/components/animations/SplitRevealText'
import { RichText } from '@payloadcms/richtext-lexical/react' // ⬅️ add this

export const SavoirFaireBlock: React.FC<SavoirFaireBlockProps> = ({
  title,
  text,
  mainImage,
  teamImage,
}) => {
  const main = mainImage as MediaType | null

  return (
    <section className="bg-black text-white py-12 md:py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full">
          <div className="w-full lg:w-[55%]">
            <div className="relative w-full aspect-[897/908] overflow-hidden">
              {main && <Media resource={main} fill imgClassName="object-cover" />}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full lg:w-[45%] justify-center">
            <SplitRevealText
              as="h2"
              variant="title"
              text={title}
              className="text-2xl md:text-3xl lg:text-6xl uppercase "
            />

            <div className="flex flex-col gap-6">
              {text && (
                <RichText
                  data={text}
                  className="text-sm md:text-base w-full md:w-[90%] flex flex-col gap-4"
                />
              )}

    
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SavoirFaireBlock
