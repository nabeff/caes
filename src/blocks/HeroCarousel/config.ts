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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Slide title',
          localized: true,
          required: false,
        },
      ],
    },

    link({
      overrides: {
        name: 'cta',
        label: 'Bottom link',
        admin: {
          description: 'Link shown next to the slider indicators at the bottom.',
        },
      },
    }),
  ],
}

export default HeroCarousel
