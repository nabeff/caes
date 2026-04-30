import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: {
    singular: 'Image Gallery',
    plural: 'Image Galleries',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      localized: true,
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns per row',
      defaultValue: '3',
      required: true,
      options: [
        { label: '3 per row', value: '3' },
        { label: '4 per row', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Images',
      required: true,
      minRows: 1,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          localized: true,
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          localized: true,
        },
      ],
    },
  ],
}

export default ImageGallery
