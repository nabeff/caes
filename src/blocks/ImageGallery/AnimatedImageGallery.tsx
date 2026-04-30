'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import type { ImageGalleryBlock, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

type Item = NonNullable<ImageGalleryBlock['items']>[number]

type Props = {
  columns: ImageGalleryBlock['columns']
  items: Item[]
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    rotateX: 8,
    transformOrigin: 'top center',
    filter: 'blur(8px)',
    clipPath: 'inset(20% 0 35% 0)',
  },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    clipPath: 'inset(0 0 0 0)',
    transition: {
      type: 'spring',
      stiffness: 130,
      damping: 20,
      mass: 0.9,
      delay: (index % 3) * 0.06,
    },
  }),
}

export const AnimatedImageGallery: React.FC<Props> = ({ columns, items }) => {
  const gridCols =
    columns === '4'
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid gap-8 ${gridCols}`}>
      {items.map((item, index) => {
        const image = item.image as MediaType | null
        return (
          <motion.article
            key={item.id ?? index}
            className="will-change-transform"
            variants={cardVariants}
            custom={index}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <div className="flex flex-col p-0 overflow-hidden">
              <div className="group relative h-60 md:h-80 w-full">
                {image && (
                  <Media
                    resource={image}
                    fill
                    imgClassName="object-cover transition duration-500 group-hover:grayscale-0"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-black/30 transition duration-500 group-hover:bg-black/0" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.title && (
                    <h3 className="text-sm text-white md:text-base">{item.title}</h3>
                  )}
                  {item.location && (
                    <p className="mt-1 line-clamp-3 text-xs text-white/80 md:text-sm">
                      {item.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        )
      })}
    </div>
  )
}
