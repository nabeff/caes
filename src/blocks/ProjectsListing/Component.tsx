// src/blocks/ProjectsListing/Component.tsx
import React from 'react'
import { getPayload } from 'payload'
import type { TypedLocale } from 'payload'

import config from '@/payload.config'
import type {
  ProjectsListingBlock as ProjectsListingProps,
  Project,
  Media as MediaType,
} from '@/payload-types'
import { ProjectsListingClient } from './Client'

// Helper → safely extract localized values (string or { fr, en, ... })
function getLocalizedText(value: unknown, locale: string): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>

    const byLocale = obj[locale]
    if (typeof byLocale === 'string' || typeof byLocale === 'number') {
      return String(byLocale)
    }

    const first = Object.values(obj).find((v) => typeof v === 'string' || typeof v === 'number')
    if (first !== undefined) return String(first)
  }

  return ''
}

export const ProjectsListingBlock = async (
  props: ProjectsListingProps & { locale: TypedLocale },
) => {
  const { title, description, locale } = props

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    limit: 100,
    sort: '-createdAt',
    depth: 1,
    locale,
  })

  const projects = docs as Project[]
  if (!projects.length) return null

  const headerTitle = getLocalizedText(title, locale)
  const headerDescription = getLocalizedText(description, locale)

  // Build category list from project.categories
  type Category = { id: string; label: string }

  const categoriesMap = new Map<string, Category>()

  projects.forEach((p) => {
    const cats = ((p as any).categories || []) as any[]

    cats.forEach((cat) => {
      const rawId = cat?.id ?? cat?.value ?? cat
      if (!rawId) return

      const id = String(rawId)
      if (categoriesMap.has(id)) return

      const label =
        getLocalizedText(cat?.title, locale) ||
        getLocalizedText(cat?.name, locale) ||
        getLocalizedText(cat?.label, locale)

      if (!label) return

      categoriesMap.set(id, { id, label })
    })
  })

  const categories = Array.from(categoriesMap.values())

  // Normalize projects for the client
  const projectItems = projects.map((p) => {
    const thumb = p.thumbnail as MediaType | null

    const slug = getLocalizedText(p.slug as unknown, locale) || String(p.id)

    const projectCats = (((p as any).categories || []) as any[]).map((cat) => {
      const rawId = cat?.id ?? cat?.value ?? cat
      return { id: String(rawId) }
    })

    return {
      id: String(p.id),
      slug,
      title: getLocalizedText(p.title, locale),
      tinyText: getLocalizedText(p.tinyText, locale),
      thumbnail: thumb,
      categories: projectCats,
    }
  })

  // ---- QUOTES FIX ----
  // quotes can be undefined or null in Payload types → normalize to []
  const rawQuotes = Array.isArray(props.quotes) ? props.quotes : []

  const quoteItems = rawQuotes.map((q) => {
    const text = getLocalizedText(q.text, locale)
    const align: 'left' | 'right' = q.align === 'right' ? 'right' : 'left' // force union, not generic string

    return {
      id: q.id ?? Math.random().toString(36).slice(2),
      text,
      align,
    }
  })

  return (
    <section className="bg-[#f4f4f4] py-16 md:py-24 mt-[80px]">
      <div className="container">
        <ProjectsListingClient
          title={headerTitle}
          description={headerDescription}
          locale={locale}
          categories={categories}
          projects={projectItems}
          quotes={quoteItems}
        />
      </div>
    </section>
  )
}

export default ProjectsListingBlock
