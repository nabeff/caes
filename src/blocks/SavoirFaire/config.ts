import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const SavoirFaire: Block = {
  slug: 'savoirFaire',
  interfaceName: 'SavoirFaireBlock',
  labels: {
    singular: 'Savoir-faire',
    plural: 'Blocs Savoir-faire',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
      defaultValue: 'Un savoir-faire diversifié',
    },

    {
      name: 'text',
      type: 'richText',
      required: true,
      localized: true,
      label: 'text',
      admin: {
        description: 'Main text ',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main image (left)',
      required: true,
    },
    {
      name: 'teamImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Team image (bottom right)',
      required: false,
    },
  ],
}

export default SavoirFaire
