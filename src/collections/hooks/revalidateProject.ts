import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

const locales = ['en', 'fr'] as const

export const revalidateProject: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    for (const locale of locales) {
      const path = `/${locale}/projects/${doc.slug}`
      payload.logger.info(`Revalidating project at path: ${path}`)
      revalidatePath(path)
    }
  }
  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    for (const locale of locales) {
      revalidatePath(`/${locale}/projects/${doc.slug}`)
    }
  }
  return doc
}
