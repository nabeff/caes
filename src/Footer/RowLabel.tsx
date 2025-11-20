// src/Footer/RowLabel.tsx
'use client'

import type { Footer as FooterGlobal } from '@/payload-types'
import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<FooterGlobal['columns']>[number]>()

  const label = data?.data?.title
    ? `Column ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.title}`
    : 'Column'

  return <div>{label}</div>
}
