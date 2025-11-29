import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type {
  ProjectsGridBlock as ProjectsGridProps,
  Project,
  Media as MediaType,
} from '@/payload-types'
import { TypedLocale } from 'payload'
import { CMSLink } from '@/components/Link'
import { AnimatedProjectsGrid } from './AnimatedProjectsGrid' // ⬅️ new import
import { SplitRevealText } from '@/components/animations/SplitRevealText'

// Helper to safely read localized strings / slugs
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

export const ProjectsGridBlock = async (props: ProjectsGridProps & { locale: TypedLocale }) => {
  const { title, title2, description, seeMoreLabel, locale } = props

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    limit: 6,
    sort: '-createdAt',
    locale,
  })

  const projects = docs as Project[]
  if (!projects.length) return null

  const headerTitle = getLocalizedText(title, locale)
  const headerTitle2 = getLocalizedText(title2, locale)
  const headerDescription = getLocalizedText(description, locale)
  const seeMoreText = getLocalizedText(seeMoreLabel, locale)

  // prepare only what the client needs (serializable)
  const liteProjects = projects.map((project) => ({
    id: project.id,
    slug: getLocalizedText(project.slug as unknown, locale) || String(project.id),
    title: getLocalizedText(project.title, locale),
    tinyText: getLocalizedText(project.tinyText, locale),
    thumbnail: project.thumbnail as MediaType | null,
  }))

  return (
    <section className="container py-6 md:py-12 lg:py-16 mt-[40px]">
      {/* Section header */}
      <div className="mb-12 flex flex-col gap-2">
        <SplitRevealText
          as="h2"
          variant="title"
          text={headerTitle}
          className="text-2xl md:text-3xl lg:text-6xl "
        />
        <SplitRevealText
          as="h2"
          variant="title"
          text={headerTitle2}
          className="text-2xl md:text-3xl lg:text-6xl "
        />
      </div>

      {/* Animated grid */}
      <AnimatedProjectsGrid locale={locale} projects={liteProjects} />

      {/* See more button (label comes from admin, localized) */}
      <div className="mt-10 flex justify-center">
        <CMSLink
          type="custom"
          url={`/${locale}/projects`}
          label={seeMoreText}
          appearance="blackMask"
        />
      </div>
    </section>
  )
}

export default ProjectsGridBlock
