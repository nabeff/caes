import type { Block } from 'payload'

export const StoryBlock: Block = {
  slug: 'storyBlock',
  interfaceName: 'StoryBlock',
  labels: {
    singular: 'Story section',
    plural: 'Story sections',
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

export default StoryBlock
