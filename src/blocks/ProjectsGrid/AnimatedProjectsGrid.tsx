'use client'

import React from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import type { TypedLocale } from 'payload'

type LiteProject = {
  id: number | string
  slug: string
  title: string
  tinyText: string
  thumbnail: MediaType | null
}

type Props = {
  locale: TypedLocale
  projects: LiteProject[]
}

// Card: 3D tilt + mask + blur → clean snap in
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    rotateX: 8,
    transformOrigin: 'top center',
    filter: 'blur(8px)',
    clipPath: 'inset(20% 0 35% 0)', // cropped vertically
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
      // tiny stagger per row so top card in row lands first
      delay: (index % 2) * 0.06,
    },
  }),
}

export const AnimatedProjectsGrid: React.FC<Props> = ({ locale, projects }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {projects.map((project, index) => (
        <motion.article
          key={project.id}
          className="will-change-transform"
          variants={cardVariants}
          custom={index}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }} // 🔥 triggers per-card as it scrolls into view
        >
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="group flex flex-col border border-border p-0 overflow-hidden"
          >
            <div className="relative h-60 md:h-80 w-full">
              {project.thumbnail && (
                <Media
                  resource={project.thumbnail}
                  fill
                  imgClassName="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-black/30 transition duration-500 group-hover:bg-black/0" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-base text-white md:text-2xl">{project.title}</h3>
                <p className="mt-1 line-clamp-3 text-xs text-white/80 md:text-lg">
                  {project.tinyText}
                </p>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}
