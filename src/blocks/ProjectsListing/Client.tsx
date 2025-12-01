// src/blocks/ProjectsListing/Client.tsx
'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import type { TypedLocale } from 'payload'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { SplitRevealText } from '@/components/animations/SplitRevealText'

type Category = {
  id: string
  label: string
}

type ProjectItem = {
  id: string
  slug: string
  title: string
  tinyText: string
  thumbnail: MediaType | null
  categories: { id: string }[]
}

type Quote = {
  id: string
  text: string
  align: 'left' | 'right'
}

type Props = {
  title: string
  description?: string
  locale: TypedLocale
  categories: Category[]
  projects: ProjectItem[]
  quotes: Quote[]
}

// 3D tilt + mask + blur
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
      delay: (index % 2) * 0.06,
    },
  }),
}

// Custom dropdown
type FilterDropdownProps = {
  value: string
  onChange: (value: string) => void
  categories: Category[]
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ value, onChange, categories }) => {
  const [open, setOpen] = useState(false)

  // Placeholder text in the trigger
  const selectedLabel =
    value === 'all'
      ? 'Category' // placeholder when "all" is selected
      : (categories.find((c) => c.id === value)?.label ?? 'Category')

  const handleSelect = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="relative inline-block min-w-[180px]">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-[#999] bg-transparent pb-1 text-left text-sm outline-none"
      >
        <span>{selectedLabel}</span>
        <span className="ml-2 text-xs text-[#666]">▾</span>
      </button>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 z-20 mt-2 w-full border border-black bg-white shadow-sm"
        >
          {/* "All" option at the top */}
          <li>
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={cn(
                'block w-full px-3 py-2 text-left text-sm',
                'bg-white text-black hover:bg-black hover:text-white transition-colors',
              )}
            >
              All
            </button>
          </li>

          {/* Actual categories */}
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => handleSelect(cat.id)}
                className={cn(
                  'block w-full px-3 py-2 text-left text-sm',
                  'bg-white text-black hover:bg-black hover:text-white transition-colors',
                )}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}

export const ProjectsListingClient: React.FC<Props> = ({
  title,
  description,
  locale,
  categories,
  projects,
  quotes,
}) => {
  const [activeCatId, setActiveCatId] = useState<string>('all')

  const filtered = useMemo(() => {
    if (activeCatId === 'all') return projects

    return projects.filter((p) => p.categories?.some((c) => c.id === activeCatId))
  }, [projects, activeCatId])

  // Build grid content with quotes after every 4 projects
  const gridChildren: React.ReactNode[] = []
  let quoteIndex = 0

  filtered.forEach((project, idx) => {
    const { thumbnail, slug, title, tinyText } = project

    gridChildren.push(
      <motion.article
        key={project.id}
        className="will-change-transform"
        variants={cardVariants}
        custom={idx}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <Link
          href={`/${locale}/projects/${slug}`}
          className="group flex flex-col border border-border"
        >
          <div className="relative h-80 w-full overflow-hidden">
            {thumbnail && (
              <Media
                resource={thumbnail}
                fill
                imgClassName="object-cover grayscale transition duration-500 group-hover:grayscale-0"
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-black/30 transition duration-500 group-hover:bg-black/0" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="text-base text-white md:text-lg">{title}</h3>
              {tinyText && (
                <p className="mt-1 line-clamp-3 text-xs text-white/80 md:text-sm">{tinyText}</p>
              )}
            </div>
          </div>
        </Link>
      </motion.article>,
    )

    if ((idx + 1) % 8 === 0 && quoteIndex < quotes.length) {
      const quote = quotes[quoteIndex++]

      gridChildren.push(
        <div key={`quote-${quote.id}`} className="my-0 flex items-center md:col-span-2">
          {/* <q
            className={cn(
              'mt-6 max-w-xl text-sm text-muted-foreground md:text-base',
              quote.align === 'right' ? 'ml-auto text-right' : 'text-left',
            )}
          >
            {quote.text}
          </q> */}
        </div>,
      )
    }
  })

  return (
    <div>
      {/* Header + filter */}
      <div className="mb-20 flex flex-col justify-end items-end">
        <SplitRevealText
          as="h1"
          text={title}
          variant="title"
          className="text-3xl md:text-4xl lg:text-8xl uppercase text-end mb-6"
        />

        {description && (
          <p className="mt-3 text-sm text-muted-foreground max-w-lg text-justify leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Filter by :</span>

          <FilterDropdown value={activeCatId} onChange={setActiveCatId} categories={categories} />
        </div>
      </div>

      {/* Grid + interleaved quotes */}
      <div className="grid gap-6 md:grid-cols-2">{gridChildren}</div>
    </div>
  )
}
