import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

import type { Header as HeaderType } from '@/payload-types'
import type { TypedLocale } from 'payload'
import { HeaderClient } from './Component.client'

export async function Header({ locale }: { locale: TypedLocale }) {
  const payload = await getPayload({ config })

  const headerData = (await payload.findGlobal({
    slug: 'header',
    depth: 1,
    locale,
  })) as HeaderType

  return <HeaderClient data={headerData} locale={locale} />
}

export default Header
