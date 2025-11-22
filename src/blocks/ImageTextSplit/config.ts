import type { Block } from 'payload'

export const ImageTextSplit: Block = {
  slug: 'imageTextSplit',
  interfaceName: 'ImageTextSplitBlock',
  labels: {
    singular: 'Image + Text (split)',
    plural: 'Image + Text (split)',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image (left)',
      required: true,
    },
  ],
}

export default ImageTextSplit
