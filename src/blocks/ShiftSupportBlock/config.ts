// src/blocks/ShiftSupportBlock/config.ts
import type { Block } from 'payload'

export const ShiftSupportBlock: Block = {
  slug: 'shiftSupportBlock',
  interfaceName: 'ShiftSupportBlock',
  labels: {
    singular: 'Shift Support Banner',
    plural: 'Shift Support Banners',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Image',
    },
  ],
}
