import React from 'react'
import type { ImageGalleryBlock as ImageGalleryProps } from '@/payload-types'
import { TypedLocale } from 'payload'
import { SplitRevealText } from '@/components/animations/SplitRevealText'
import { AnimatedImageGallery } from './AnimatedImageGallery'

export const ImageGalleryBlock: React.FC<ImageGalleryProps & { locale: TypedLocale }> = (props) => {
  const { title, columns, items } = props

  if (!items?.length) return null

  return (
    <section className="container py-12 lg:py-16 my-[4rem]">
      {title && (
        <div className="mb-12 flex flex-col gap-2">
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="text-2xl md:text-3xl lg:text-6xl uppercase "
          />
        </div>
      )}

      <AnimatedImageGallery columns={columns} items={items} />
    </section>
  )
}

export default ImageGalleryBlock
