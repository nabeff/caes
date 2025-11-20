// src/blocks/StudioIntro/config.ts
import type { Block } from 'payload'

export const StudioIntro: Block = {
  slug: 'studioIntro',
  interfaceName: 'StudioIntroBlock',
  labels: {
    singular: 'Studio Intro',
    plural: 'Studio Intros',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
    },
  ],
}

export default StudioIntro
