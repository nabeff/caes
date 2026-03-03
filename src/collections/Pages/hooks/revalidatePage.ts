import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

const locales = ['en', 'fr'] as const

function revalidateAllLocales(slug: string, logger: { info: (msg: string) => void }) {
  if (slug === 'home') {
    for (const locale of locales) {
      logger.info(`Revalidating page at path: /${locale}`)
      revalidatePath(`/${locale}`)
    }
  } else {
    for (const locale of locales) {
      logger.info(`Revalidating page at path: /${locale}/${slug}`)
      revalidatePath(`/${locale}/${slug}`)
    }
  }
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      revalidateAllLocales(doc.slug, payload.logger)
      revalidateTag('pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidateAllLocales(previousDoc.slug, payload.logger)
      revalidateTag('pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    if (doc?.slug) {
      for (const locale of locales) {
        const path = doc.slug === 'home' ? `/${locale}` : `/${locale}/${doc.slug}`
        revalidatePath(path)
      }
    }
    revalidateTag('pages-sitemap')
  }

  return doc
}
