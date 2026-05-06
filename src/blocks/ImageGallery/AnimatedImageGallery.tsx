'use client'

import React, { useMemo, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { ImageGalleryBlock, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

type Item = NonNullable<ImageGalleryBlock['items']>[number] & { categoryId?: string | null }
type Category = { id: string; label: string }

type Props = {
  columns: ImageGalleryBlock['columns']
  items: Item[]
  categories: Category[]
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

export const AnimatedImageGallery: React.FC<Props> = ({ columns, items, categories }) => {
  const t = useTranslations('ProjectsListing')
  const [activeCatId, setActiveCatId] = useState<string>('all')

  const gridCols =
    columns === '4'
      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-2 lg:grid-cols-3'

  const filtered = useMemo(() => {
    if (activeCatId === 'all') return items
    return items.filter((item) => item.categoryId === activeCatId)
  }, [items, activeCatId])

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
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
      )}

      <div className={`grid gap-2 md:gap-8 ${gridCols}`}>
        {filtered.map((item, index) => {
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
    </>
  )
}
