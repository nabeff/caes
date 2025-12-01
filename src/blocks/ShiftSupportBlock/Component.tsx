import React from 'react'
import type {
  ShiftSupportBlock as ShiftSupportBlockProps,
  Media as MediaType,
} from '@/payload-types'
import { Media } from '@/components/Media'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

export const ShiftSupportBlock: React.FC<ShiftSupportBlockProps> = ({ title, image }) => {
  const bg = image as MediaType | undefined

  return (
    <section className="relative w-full aspect-[5/2] overflow-hidden">
      {bg && <Media resource={bg} fill imgClassName="object-cover " />}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-20 left-12 z-10 container mx-auto">
        {/* <SplitRevealText
          as="h2"
          variant="title"
          text={title}
          className="text-2xl text-white md:text-3xl lg:text-6xl uppercase"
        /> */}
      </div>
    </section>
  )
}
