// src/components/gallery/ProjectGallery.tsx
'use client'

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type GalleryContextValue = {
  openImage: (index: number) => void
}

const GalleryContext = createContext<GalleryContextValue | undefined>(undefined)

export function useProjectGallery() {
  const ctx = useContext(GalleryContext)
  if (!ctx) {
    throw new Error('useProjectGallery must be used within ProjectGalleryProvider')
  }
  return ctx
}

type ProjectGalleryProviderProps = {
  images: MediaType[]
  children: ReactNode
}

export const ProjectGalleryProvider: React.FC<ProjectGalleryProviderProps> = ({
  images,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openImage = (index: number) => {
    setActiveIndex(index)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  return (
    <GalleryContext.Provider value={{ openImage }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 border border-white/50 bg-white px-3 py-1 text-[13px] uppercase  text-black hover:bg-white hover:text-black"
          >
            Close
          </button>

          {/* Carousel wrapper */}
          <div className="relative w-full max-w-5xl px-4">
            <Carousel
              opts={{
                startIndex: activeIndex,
                align: 'center',
                loop: images.length > 1,
              }}
              className="w-full"
            >
              <CarouselContent>
                {images.map((image, idx) => (
                  <CarouselItem key={image.id ?? idx} className="basis-full">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded">
                      <Media resource={image} fill imgClassName="object-contain" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                className="
                  hidden md:inline-flex
                  -left-[80px] top-1/2 -translate-y-1/2
                  rounded-none
                  bg-black text-white border-white/60
                  hover:bg-white hover:text-black hover:border-black
                "
              />
              <CarouselNext
                className="
                  hidden md:inline-flex
                  -right-[80px] top-1/2 -translate-y-1/2
                  rounded-none
                  bg-black text-white border-white/60
                  hover:bg-white hover:text-black hover:border-black
                "
              />
            </Carousel>
          </div>
        </div>
      )}
    </GalleryContext.Provider>
  )
}

type GalleryImageProps = {
  index: number
  media: MediaType
  wrapperClassName?: string
}

export const GalleryImage: React.FC<GalleryImageProps> = ({ index, media, wrapperClassName }) => {
  const { openImage } = useProjectGallery()

  return (
    <button
      type="button"
      onClick={() => openImage(index)}
      className={`group relative block overflow-hidden ${wrapperClassName ?? ''}`}
    >
      {/* Image in black & white by default */}
      <Media
        resource={media}
        fill
        imgClassName="object-cover grayscale transition duration-500 group-hover:grayscale-0"
      />

      {/* Gradient on bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/85 via-black/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* “View gallery” label */}
      <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span
          className="
            pointer-events-auto
            bg-white px-7 py-2 text-[12px] uppercase text-black
            transition-colors duration-300
            hover:bg-black hover:text-white
          "
        >
          View gallery
        </span>
      </div>
    </button>
  )
}
