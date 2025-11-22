// src/blocks/Philosophy/config.ts
import type { Block } from 'payload'

export const Philosophy: Block = {
  slug: 'philosophy',
  interfaceName: 'PhilosophyBlock',
  labels: {
    singular: 'Philosophy',
    plural: 'Philosophy Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      // IMPORTANT: defaultValue must be a string, not an object
      defaultValue: 'Notre philosophie',
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
      required: true,
      localized: true,
      admin: {
        rows: 6,
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background image',
      required: true,
    },
  ],
}

export default Philosophy
