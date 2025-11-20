// src/blocks/ProjectsGrid/Component.tsx
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type {
  ProjectsGridBlock as ProjectsGridProps,
  Project,
  Media as MediaType,
} from '@/payload-types'
import { TypedLocale } from 'payload'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

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
  const { title, description, seeMoreLabel, locale } = props

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
  const headerDescription = getLocalizedText(description, locale)
  const seeMoreText = getLocalizedText(seeMoreLabel, locale)

  return (
    <section className="container py-16">
      {/* Section header */}
      <div className="mb-8 flex max-w-3xl flex-col gap-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl">{headerTitle}</h2>
        <p className="whitespace-pre-line text-sm text-muted-foreground md:text-base">
          {headerDescription}
        </p>
      </div>

      {/* Grid → 2 columns */}
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => {
          const thumb = project.thumbnail as MediaType | null
          const projectTitle = getLocalizedText(project.title, locale)
          const projectTinyText = getLocalizedText(project.tinyText, locale)
          const projectSlug =
            getLocalizedText(project.slug as unknown, locale) || String(project.id)

          return (
            <Link
              key={project.id}
              href={`/${locale}/projects/${projectSlug}`}
              className="group flex flex-col border border-border p-0"
            >
              <div className="relative h-80 w-full overflow-hidden">
                {thumb && (
                  <Media
                    resource={thumb}
                    fill
                    imgClassName="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-black/30 transition duration-500 group-hover:bg-black/0" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-base text-white md:text-lg">{projectTitle}</h3>
                  <p className="mt-1 line-clamp-3 text-xs text-white/80 md:text-sm">
                    {projectTinyText}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* See more button (label comes from admin, localized) */}
      <div className="mt-10 flex justify-center">
        <CMSLink
          type="custom"
          url={`/${locale}/projects`}
          label={seeMoreText}
          appearance="black"
          size="sm"
        />
      </div>
    </section>
  )
}

export default ProjectsGridBlock
