import type { Block } from 'payload'
import { link } from '@/fields/link'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const TwoColumnCTA: Block = {
  slug: 'twoColumnCTA',
  interfaceName: 'TwoColumnCTABlock',
  labels: {
    singular: 'Two Column CTA',
    plural: 'Two Column CTAs',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
    },
    {
      name: 'paragraph',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Paragraph',
      admin: {
        description: 'Main paragraph displayed on the right side.',
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
    link({
      overrides: {
        name: 'button',
        label: 'Button',
        required: true, 
      },
      appearances: false,
    }),
  ],
}

export default TwoColumnCTA
