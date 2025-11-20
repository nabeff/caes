import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import { TypedLocale } from 'payload'

export async function Header({ locale }: { locale: TypedLocale }) {
  const headerData = (await getCachedGlobal('header', 1, locale)()) as HeaderType

  return <HeaderClient data={headerData} />
}
