import React from 'react'
import type {
  ShiftSupportBlock as ShiftSupportBlockProps,
  Media as MediaType,
} from '@/payload-types'
import { Media } from '@/components/Media'

export const ShiftSupportBlock: React.FC<ShiftSupportBlockProps> = ({ title, image }) => {
  const bg = image as MediaType | undefined

  return (
    <section className="relative w-full aspect-[4/2] overflow-hidden">
      {bg && <Media resource={bg} fill imgClassName="object-cover grayscale" />}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-20 left-12 z-10 container mx-auto">
        <h2 className=" text-xl  text-white md:text-2xl lg:text-5xl">{title}</h2>
      </div>
    </section>
  )
}
