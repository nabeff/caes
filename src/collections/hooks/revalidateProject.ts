import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

const locales = ['en', 'fr'] as const

function revalidateProjectPaths(slug: string | undefined, logger?: { info: (msg: string) => void }) {
  for (const locale of locales) {
    // Revalidate the individual project page
    if (slug) {
      const path = `/${locale}/projects/${slug}`
      logger?.info(`Revalidating project at path: ${path}`)
      revalidatePath(path)
    }
    // Revalidate any page that lists projects (e.g. /en/projects, /fr/projects)
    logger?.info(`Revalidating projects listing at path: /${locale}/projects`)
    revalidatePath(`/${locale}/projects`)
  }
  // Also revalidate the home page since it may show projects
  for (const locale of locales) {
    revalidatePath(`/${locale}`)
  }
}

export const revalidateProject: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidateProjectPaths(doc.slug, payload.logger)
  }
  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateProjectPaths(doc?.slug)
  }
  return doc
}
