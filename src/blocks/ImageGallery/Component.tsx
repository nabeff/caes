import React from 'react'
import type { ImageGalleryBlock as ImageGalleryProps, ProjectCategory } from '@/payload-types'
import { TypedLocale } from 'payload'
import { SplitRevealText } from '@/components/animations/SplitRevealText'
import { AnimatedImageGallery } from './AnimatedImageGallery'

function getLocalizedText(value: unknown, locale: string): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const byLocale = obj[locale]
    if (typeof byLocale === 'string' || typeof byLocale === 'number') return String(byLocale)
    const first = Object.values(obj).find((v) => typeof v === 'string' || typeof v === 'number')
    if (first !== undefined) return String(first)
  }

  return ''
}

export const ImageGalleryBlock: React.FC<ImageGalleryProps & { locale: TypedLocale }> = (props) => {
  const { title, columns, items, locale } = props

  if (!items?.length) return null

  type Category = { id: string; label: string }
  const categoriesMap = new Map<string, Category>()

  const normalizedItems = items.map((item) => {
    const rawCat = (item as { category?: unknown }).category
    let categoryId: string | null = null

    if (rawCat && typeof rawCat === 'object') {
      const cat = rawCat as Partial<ProjectCategory> & { id?: string | number }
      if (cat.id != null) {
        categoryId = String(cat.id)
        if (!categoriesMap.has(categoryId)) {
          const label =
            getLocalizedText((cat as Record<string, unknown>).title, locale) ||
            getLocalizedText((cat as Record<string, unknown>).name, locale) ||
            getLocalizedText((cat as Record<string, unknown>).label, locale)
          if (label) categoriesMap.set(categoryId, { id: categoryId, label })
        }
      }
    } else if (typeof rawCat === 'string' || typeof rawCat === 'number') {
      categoryId = String(rawCat)
    }

    return { ...item, categoryId }
  })

  const categories = Array.from(categoriesMap.values())

  return (
    <section className="container pt-0 pb-2 lg:pb-3 mb-12 lg:mb-16">
      {title && (
        <div className="mb-6 flex flex-col gap-2">
          <SplitRevealText
            as="h2"
            variant="title"
            text={title}
            className="text-2xl md:text-3xl lg:text-6xl uppercase "
          />
        </div>
      )}

      <AnimatedImageGallery columns={columns} items={normalizedItems} categories={categories} />
    </section>
  )
}

export default ImageGalleryBlock
