import React from 'react'
import type { HistoryBlock as HistoryBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const HistoryBlock: React.FC<HistoryBlockProps> = ({
  title,
  leftText,
  rightText,
  buildingImage,
  teamImage,
}) => {
  const building = buildingImage as MediaType | null
  const team = teamImage as MediaType | null

  return (
    <section className=" py-12 md:py-16 mt-[60px]">
      <div className="container">
        <div className="flex gap-12">
          {/* LEFT COLUMN: image + description */}
          <div className="flex flex-col gap-10 w-[50%] items-center">
            {building && (
              <div className="relative w-full overflow-hidden aspect-[477/495]">
                <Media resource={building} fill className="object-cover" />
              </div>
            )}

            <p className="text-sm md:text-base leading-relaxed whitespace-pre-line w-[80%] mx-auto text-left">
              {leftText}
            </p>
          </div>

          <div className="flex flex-col gap-6 w-[50%] items-center mt-24">
            <SplitRevealText
              as="h2"
              variant="title"
              text={title}
              className="text-2xl md:text-3xl lg:text-6xl uppercase "
            />

            <p className="text-sm md:text-base leading-relaxed whitespace-pre-line w-[90%] mx-auto mb-6">
              {rightText}
            </p>

            {team && (
              <div className="relative mt-2 w-full overflow-hidden aspect-[589/308]">
                <Media resource={team} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HistoryBlock
