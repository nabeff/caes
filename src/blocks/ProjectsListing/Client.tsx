'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import type { TypedLocale } from 'payload'
import { useTranslations } from 'next-intl'

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

type Props = {
  title: string
  description?: string
  locale: TypedLocale
  categories: Category[]
  projects: ProjectItem[]
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
  placeholderLabel: string
  allLabel: string
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  categories,
  placeholderLabel,
  allLabel,
}) => {
  const [open, setOpen] = useState(false)

  const selectedLabel =
    value === 'all'
      ? placeholderLabel
      : (categories.find((c) => c.id === value)?.label ?? placeholderLabel)

  const handleSelect = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="relative inline-block min-w-[180px]">
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
          <li>
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-black hover:text-white"
            >
              {allLabel}
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => handleSelect(cat.id)}
                className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-black hover:text-white"
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
}) => {
  const [activeCatId, setActiveCatId] = useState<string>('all')
  const t = useTranslations('ProjectsListing')

  const filtered = useMemo(() => {
    if (activeCatId === 'all') return projects
    return projects.filter((p) => p.categories?.some((c) => c.id === activeCatId))
  }, [projects, activeCatId])

  return (
    <div>
      {/* Header + filter */}
      <div className="mb-20 flex flex-col items-end justify-end">
        <SplitRevealText
          as="h1"
          text={title}
          variant="title"
          className="mb-6 text-end text-3xl uppercase md:text-4xl lg:text-8xl"
        />

        {description && (
          <p className="mt-3 max-w-lg text-justify text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {t('filterBy')}
          </span>

          <FilterDropdown
            value={activeCatId}
            onChange={setActiveCatId}
            categories={categories}
            placeholderLabel={t('categoryPlaceholder')}
            allLabel={t('all')}
          />
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((project, idx) => {
          const { thumbnail, slug, title, tinyText } = project

          return (
            <motion.article
              key={project.id}
              className="will-change-transform"
              variants={cardVariants}
              custom={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
            >
              <Link href={`/${locale}/projects/${slug}`} className="group flex flex-col">
                <div className="relative h-60 w-full overflow-hidden md:h-80">
                  {thumbnail && (
                    <Media
                      resource={thumbnail}
                      fill
                      imgClassName="object-cover transition duration-500"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="text-base text-white md:text-lg">{title}</h3>
                    {tinyText && (
                      <p className="mt-1 line-clamp-3 text-xs text-white/80 md:text-sm">
                        {tinyText}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
