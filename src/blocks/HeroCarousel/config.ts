// src/blocks/HeroCarousel/config.ts
import { link } from '@/fields/link'
import type { Block } from 'payload'

export const HeroCarousel: Block = {
  slug: 'heroCarousel',
  interfaceName: 'HeroCarouselBlock',
  labels: {
    singular: 'Hero Carousel',
    plural: 'Hero Carousels',
  },
  fields: [
    {
      name: 'featuredProjectLabel',
      type: 'text',
      label: 'Featured project label',
      localized: true,
      required: true,
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'project',
          type: 'relationship',
          relationTo: 'projects',
          required: true,
          label: 'Featured project',
        },
      ],
    },
    link({
      overrides: {
        name: 'cta',
        label: 'Bottom link label',
        admin: {
          description:
            'Label of the link on the right. URL is automatically taken from the active project.',
        },
      },
    }),
  ],
}

export default HeroCarousel
